const mongoose = require('mongoose')

const Schema = mongoose.Schema

const userSchema = new Schema(
   {
      userName: {
         required: true,
         type: String,
      },
      passwd: {
         required: true,
         type: String,
      },
      request_id: {
         required: true,
         type: String
      },
      time_limit: {
         required: true,
         type: String,
      },
      status: {
         required: true,
         type: String,
      },
      leased: {
      	required: true,
      	type: Boolean
      }
   }
)


module.exports = mongoose.model("User", userSchema)
