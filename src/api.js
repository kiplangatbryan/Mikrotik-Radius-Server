const axios = require("axios");
const dotenv = require("dotenv");
const path = require("path");
const moment = require("moment");
const CronJob = require("cron").CronJob;

const User = require('./models/user')
const bundle_offer  = require('./data.js')

dotenv.config({ path: path.join(__dirname, "../config/config.env") });



exports.triggerWebPay = async (msisdn, amount) => {

  const params = new URLSearchParams()
  params.append('amount', amount)
  params.append('msisdn', msisdn)


  try {
    const res = await axios.post(
      process.env.BASE_URL,
      params,
      {
        headers: {
          "ApiKey": process.env.API_KEY,
          "Content-Type": "application/x-www-form-urlencoded",
          "Accept": "application/json"
        },
      }
    );
    return res.data
  } catch (err) {
    console.error(err.response.data);
  }
};

exports.WebPayCb =  async (req, res) => {



 const { stkCallback } = req.body.Body
  

  const user = await User.findOne({request_id: stkCallback.TinyPesaID})
  
  const offer = bundle_offer.filter(off => {
  	if (off.name == user.time_limit) {
		return true
	}
  	return false
  })
 
  if (stkCallback.ResultCode == 0) {
    // success
    user.status = 'paid'
    user.time_signed = customDate(offer[0].limit)
    user.leased = true
  }
  else{
    user.status = 'failed'
    user.mac_leased_to = ''
  }

  await user.save()

  
  let message = {
	  "ResponseCode": "00000000",
	  "ResponseDesc": "success"
  };
  
  res.status(200).json(message)

}


exports.DataReset = new CronJob(
  "* * */10 * * *", // Run every 10 hrs
  function () {
  //  should run every 16 hrs
      // check if session time has exceeded
      User.updateMany({ $and: {  leased: true, time_signed: $lt: { new Date(Date.now())  } }, { mac_leased_to: '',status: '0', time_signed: '0', leased: false, request_id: '' }, { multi: true }, (err, doc)=>{
        if (err) { console.log(err) }else{
        }

      })
  }
);


const customDate = function(hrs) {
    return new Date(Date.now() + (hrs * (60*60*1000)))
}

const  currentTime = function() {
  return new Date(Date.now())
}
