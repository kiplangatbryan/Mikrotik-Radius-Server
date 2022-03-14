const express  = require('express')
const path = require('path')
const cors = require('cors')
const mongoose = require("mongoose");


const my_routes = require('./routes')
const { db } = require('./db')
const { DataReset } = require('./api')


const PORT = process.env.PORT || 3000 
const app = express()



// common settings
app.set("view engine", "ejs");
app.set("views", "src/pages");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use('/static', express.static(path.join(__dirname, '..', 'static')))
app.use(cors())

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
    return res.status(404).render('404')
})

app.use((err, req, res, next) => {
    console.error(err)
    next()
});

app.listen(PORT, () => {
    db()

    DataReset.start()
     console.log(`drive\'s are fired! on port ${PORT}`)
});

