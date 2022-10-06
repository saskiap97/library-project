const session = require('express-session');
//store sessions
const MongoStore = require('connect-mongo');
//store them in database so when we restart server we keep the session open
const mongoose = require('mongoose');

// since we are going to USE this middleware in the app.js,
// let's export it and have it receive a parameter
module.exports = app => {
  // <== app is just a placeholder here
  // but will become a real "app" in the app.js
  // when this file gets imported/required there

  // required for the app when deployed to Heroku (in production)
  app.set('trust proxy', 1);
  
  //configuration for package 
  app.use(
    session({
        //define from env file
      secret: process.env.SESS_SECRET,
      resave: true,
      saveUninitialized: false,
      cookie: {
        //2 lines below define if we are in production or not
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 // 24h
      },
      //this is configuration for storing in db
      store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI || 'mongodb://localhost/library-project',
        ttl: 60 * 60 * 24 // 60sec * 60min * 24h => 1 day
      })
    })
  );
};