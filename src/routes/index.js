const router = require('express').Router()

const User = require('../models/user')

const assert = require('assert')

const fs = require('fs')

const  bundle_offer  = require("../data.js")()

const { triggerWebPay, WebPayCb } = require('../api')

router.get('/accounts/:bundle_type',async  (req, res) =>{
	
	const { bundle_type}  = req.params
	const users = await User.find({leased: false, time_limit: bundle_type})

	return res.status(200).json({users})
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
		if (user.status == 'failed') {
				user.status = "0"
				await user.save()
				
				return res.status(200).json({ status: 'failed'})
			}

		 return res.status(200).json({ status: 'pending'})
	
		
	}
	catch(err) {
		console.error(err)
	}

})

router.get('/StalePayment/:mac_addr',async (req, res) =>{

	const {mac_addr} = req.params

	const user = await User.findOne({ mac_leased_to: mac_addr})

	if (!user) {
		return res.json({status: 'failed'})
	}
	user.leased = true
	await user.save()

	return res.json({status: 'validated', user: { username: user.userName, passwd: user.passwd}})

})

router.post('/triggerStkPush', async (req, res) =>{

	// validate

	// get the data
	// format: bundle_type, msisdn

		const { bundle_type, user_id ,msisdn, mac } = req.body
	
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
		user.mac_leased_to = mac
		user.status = '0'

		await user.save()

		return res.status(200).json({msg: "waiting", status: "success", request_id: res_data.request_id})

	}

	catch(err) {
		console.log(err)
	}
	// trugger

	

})

// handle transaction from tinypesa
router.post('/stkCallback', WebPayCb)


const customDate = function(hrs) {
    return new Date(Date.now() + (hrs * (60*60*1000)))
}

module.exports = router
