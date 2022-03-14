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

	try {
		const users = await User.find({leased: false, status: '0'})
		return res.render('index', { users, user_data: JSON.stringify(req.query)})
	}
	catch(err){
		next(err)
	}
})


router.get('/accounts',async  (req, res) =>{
	const users = await User.find({leased: false, status: '0'})

	return res.status(200).json({users})
})

router.get('/verify',  (req, res) =>{
	const { request_id } = req.query

	console.table(req.query)

	if (request_id) {
		return res.render('verify', req.query)
	}
	return res.redirect('/')	
})

router.get('/verifyTransac/:request_id',async (req, res) =>{
	const { request_id } = req.params

	console.log("sth is verifying")

	try{
		const user = await User.findOne({request_id: request_id })

		// check for status: 'paid'

		if (user.status == 'paid'){

			const user = await User.findOne({request_id: request_id })

			user.leased = true
			await user.save()


			return res.status(200).json({ status: 'confirmed', user: { username: user.userName, passwd: user.passwd }})
		}
		 return res.status(200).json({ status: 'pending'})
	}
	catch(err) {
		console.error(err)
	}

})

router.post('/triggerStkPush', async (req, res) =>{

	// validate

	// get the data
	// format: bundle_type, msisdn

		const { bundle_type, user_id ,msisdn } = req.body
	
	// check for waiting state


	console.table(req.body)

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
		user.request_id = res_data.request_id

		await user.save()

		return res.status(200).json({msg: "waiting", status: "success", request_id: res_data.request_id})

	}

	catch(err) {
		console.log(err)
	}

	

})

// handle transaction from tinypesa
router.post('/stkCallback', WebPayCb)



module.exports = router