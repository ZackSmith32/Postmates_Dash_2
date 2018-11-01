import express from 'express';
import path from 'path';
import favicon from 'serve-favicon';
import logger from 'morgan'; // logs get requests and shit in terminal
import cookieParser from 'cookie-parser';
import fs from 'fs';

// bodyParser is middleware that lets you parse a request ".body."
import bodyParser from 'body-parser';

import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
const secret_key = process.env.SECRET_KEY;
const mongo_connection = process.env.MONGO_LOGIN;

const app = express();

// connect to database
mongoose.connect(mongo_connection, err => {
  if(err) {
    console.log('connection error', err);
  } else {
    console.log('connection successful');
  }
});

// these variables contain the path for each route
import index from './routes/index';

import addData from './routes/addData';
import dashboard from './routes/dashboard';
import jobList from './routes/jobList';
import Oauth from './routes/Oauth';

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// modules for jwt authorization
import passport from "passport";

import passportJwt from "passport-jwt";
const ExtractJwt = passportJwt.ExtractJwt;
const JwtStrategy = passportJwt.Strategy;
import Users from "./models/users.js";

// require the strategy that will process the jwt's
require('./config/passport_jwt2')(passport);
require('./config/fb_strategy')(passport);

// var facebook = require('./config/fb_strategy');
// passport.use(facebook);
app.use(passport.initialize());

// designate which routes file to use for different reqs
app.use('/', index);
app.use('/addData', addData);
app.use('/dashboard', dashboard);
app.use('/jobList', jobList);
app.use('/auth', Oauth);


// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

export default app;


