require('dotenv').config();

const express = require('express');
const path = require('path');
const bodyParser=require('body-parser')
const mongoose=require('mongoose')

const pageRoute = require('./routers/pageRoute');

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));


app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));

app.use( pageRoute);

app.use((error, req, res, next) => {
  console.log(error);
  res.status(500).render('error', {
    pageTitle: 'Error',
    path: '/error',
    message: 'Something went wrong!'
  });
});

app.use((req, res, next) => {
  res.status(404).render('error', {
    pageTitle: 'Page Not Found',
    path: '/404',
    message: 'Page not found!'
  });
});

const PORT=process.env.PORT||3022;

mongoose
.connect(process.env.MONGO_URI)
.then(()=>{
  console.log("Connected")
  app.listen(PORT);

}).catch(err=>{
  console.log(err)
})


