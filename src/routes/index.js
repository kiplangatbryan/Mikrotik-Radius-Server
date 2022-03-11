const router = require('express').Router()

const User = require('../models/user')

const assert = require('assert')

const fs = require('fs')

const bundle_offer = [
    {   
        name: 'okoa_bundle', 
        value: 5, 
        limit: 1
    }, 
    { 
        name: 'simple_bundle', 
        value: 10, 
        limit: 2
    }, 
    { 
        name: 'jenga_bundle', 
        value: 20, 
        limit: 4
    }, 
    { 
        name: 'fire_bundle', 
        value: 30, 
        limit: 6
    }, 
    { 
        name: 'blaze_bundle', 
        value: 40, 
        limit: 12
    },
    { 
        name: 'dedicated', 
        value: 50, 
        limit: 24
    }  
] 

const { triggerWebPay, WebPayCb } = require('../api')
 
router.get('/', async (req, res, next)=>{
	console.log(req.query)

	try {
		const users = await User.find({leased: false})
		return res.render('index', { users })
	}
	catch(err){
		next(err)
	}
})

router.post('/triggerStkPush', async (req, res) =>{

	// validate

	// get the data
	// format: bundle_type, msisdn

		const { bundle_type, user_id ,msisdn } = req.body
	
	// check for waiting state
	try {
		const user = await User.findOne({ _id: user_id})

		if (user.status == 'waiting') {
			return res.status(304).json( {msg: 'waiting'})
		}
		console.log('user not found')
	}

	catch(err){
		console.log('db failure/error')
	}


	const chosen_bundle = bundle_offer.filter((offer) =>{
			if (offer.name == bundle_type){
				return true
			}
			return false
		})


		assert(chosen_bundle.length == 1, 'something is wrong!')


	// change state to ['waiting']

	const res_data = await triggerWebPay(msisdn, chosen_bundle[0].value)

	try {
		const user = await User.findOne({_id: user_id})
		user.status = 'waiting'
		user.request_id = res_data.request_id

		await user.save()

		return res.status(200).json({msg: "waiting", status: "success"})

	}

	catch(err) {
		console.log(err)
	}

	

})

// handle transaction from tinypesa
router.post('/callback', WebPayCb)



module.exports = router