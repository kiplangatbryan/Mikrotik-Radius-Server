const axios = require("axios");
const dotenv = require("dotenv");
const path = require("path");
const moment = require("moment");
const prettyjson = require('prettyjson');

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

exports.WebPayCb =  (req, res) => {
  console.log('-----------Received M-Pesa webhook-----------');
 
  console.log(prettyjson.render(req.body));
  console.log('-----------------------');

  let message = {
	  "ResponseCode": "00000000",
	  "ResponseDesc": "success"
  };
  
  res.status(200).json(message)

}
