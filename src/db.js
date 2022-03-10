const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require('path')

dotenv.config({ path: path.join(__dirname, "../config/config.env") });

exports.db = async ()=> {
	let url;

	if (process.env.NODE_ENV == "development"){
		url = process.env.TEST_DB;
	}else{
		url = process.env.TEST_DB;
	}
	
	mongoose.connect(url,{
		useNewUrlParser: true,
		useUnifiedTopology: true,
	}).then(() =>{
		console.log(`db has connected ${mongoose.connection.name} successfully `);
	}).catch(err =>{
		console.error(`could not connect due to ${err}`);
		process.exit(1);
	});

    
	const dbConnection = mongoose.connection;

	dbConnection.on("error",(err) =>{
		console.log(`${err} occurred while starting db`);
	});

	dbConnection.once("open",(err) =>{
		if (err){
			console.log("error in connecting to the Database");
		}
	});

};