var mongoose = require('mongoose');
var passport = require('passport');
var settings = require('../config/settings');
require('../services/passport')(passport);
var express = require('express');
var jwt = require('jsonwebtoken');
var router = express.Router();
var User = require("../models/user");

module.exports = app => {
  //API call to submit a request to Register a new user
    app.post('/api/auth/register', function(req, res) {
        if (!req.body.username || !req.body.password) {
            res.json({success: false, msg: 'Please pass username and password.'});
        } else {
            var newUser = new User({
                username: req.body.username,
                password: req.body.password
            });
            // save the user
            newUser.save(function(err) {
                if (err) {
                    return res.json({success: false, msg: 'Username already exists.'});
                }
                res.json({success: true, msg: 'Successful created new user.'});
            });
        }
    });
//API call to submit a request to login using credentials
    app.post('/api/auth/login', function(req, res) {
      console.log('loggingin')
        User.findOne({
          username: req.body.username
        }, function(err, user) {
          if (err) throw err;
      
          if (!user) {
            res.status(401).send({success: false, msg: 'Authentication failed. User not found.'});
          } else {
            // check if password matches
            user.comparePassword(req.body.password, function (err, isMatch) {
              if (isMatch && !err) {
                // if user is found and password is right create a token
                var token = jwt.sign(user.toJSON(), settings.secret);
                // return the information including token as JSON
                res.json({success: true, token: 'JWT ' + token});
              } else {
                res.status(401).send({success: false, msg: 'Authentication failed. Wrong password.'});
              }
            });
          }
        });
      });



}