const express  = require('express')
const path = require('path')
const cors = require('cors')
const mongoose = require("mongoose");

const my_routes = require('./routes')

const PORT = process.env.PORT || 3000 
const app = express()


// offers 

const bundle_offer = [
    {   
        name: 'okoa_bundle', 
        value: 5, 
        limit: 1
    }, 
    { 
        name: 'simple_bundle', 
        value: 10, 
        limit: 3
    }, 
    { 
        name: 'jenga_bundle', 
        value: 20, 
        limit: 5
    }, 
    { 
        name: 'fire_bundle', 
        value: 30, 
        limit: 8
    }, 
    { 
        name: 'dedicated', 
        value: 40, 
        limit: 24
    } 
] 


// common settings
app.set("view engine", "ejs");
app.set("views", "src/pages");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use('/static', express.static(path.join(__dirname, '..', 'static')))
app.use(cors())

const { WebPayCb } = require('./api.js')


app.get('/', async (req, res)=>{
    const access_token =await getAccessToken()
    await lipaOnline(access_token)
    // await customerToBs(access_token)
    // await simulateC2B(access_token)

    return res.json({
        msg: 'something happened!'
    })

})


app.post('/callback', WebPayCb)

app.use(my_routes)

app.use('', (req, res, next) =>{
  // if (!req.session.user) {
  //   return next();
  // }
  // try {
  //   const user = await User.findById(req.session.user._id);
  //   req.user = user;
  //   next();
  // } catch (err) {
  //   const error = new Error(err);
  //   error.statusCode = 500;
  //   next(error);
  // }
})

app.use('*', (req, res)=>{
    return res.status(404).send('page not found')
})

app.use((err, req, res) => {
  throw err;
});

app.listen(PORT, ()=>{
    console.log(`drive\'s are fired! on port ${PORT}`)
})



// mongoose
//   .connect(local_uri, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => {
//     app.listen(app.get("port"), () => {
//       console.log(`Appp is started ... on ${app.get("port")}`);
//     });
//   })
//   .catch((err) => console.log(err));
