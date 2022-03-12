const axios = require("axios");
const dotenv = require("dotenv");
const path = require("path");
const moment = require("moment");
const CronJob = require("cron").CronJob;

const User = require('./models/user')

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
    console.log(res.data);
    return res.data
  } catch (err) {
    console.error(err.response.data);
  }
};

exports.WebPayCb =  async (req, res) => {



 const { stkCallback } = req.body.Body
  
 console.table(stkCallback)


  // const user = await User.findOne({request_id: stkCallback.TinyPesaID})

 
  // if (stkCallback.ResultCode == 0) {
  //   // success
  //   user.status = 'paid'
  // }
  // else{
  //   user.status = 'failed'
  // }

  // await user.save()

  
  let message = {
	  "ResponseCode": "00000000",
	  "ResponseDesc": "success"
  };
  
  res.status(200).json(message)

}


exports.DataReset = new CronJob(
  "*/1 * * * * *", // Run every 10 secs
  async function () {
  //  should run every 5 minutes
  

  }
);