const router = require('express').Router()

const { triggerWebPay } = require('../api')
 
router.get('/app', (req, res)=>{
	console.log(req.query)
	return res.render('index')
})

router.get('/test', async (req, res) =>{
	// return res.send('hello')
	return await triggerWebPay(254746613059, 5)
})


module.exports = router