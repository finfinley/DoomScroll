/**
 * Author: Alex Finley
 * Date: 11/11/2020
 * 1:48:29 in video
 * Used for server side (backend) scripting within DoomScroll's database
 */
const functions = require('firebase-functions');

// Express allows our functions to be able to more easily check for errors from the backend 
const express = require('express');
const app = express();
// Importing middleware
const FBAuth = require('./util/fbauth');
// Importing routes 
const { getAllImpendingDoom, postSomeDoom } = require('./handlers/impendingdoom');
const { signup, login, uploadImage } = require('./handlers/users');

// Impending Doom routes
// Get all doom posts 
app.get('/impendingdooms', getAllImpendingDoom);
// Post a new doom post 
// Also allows us to get a user handle. FBAuth is middleware and runs before route goes through
app.post('/newdoom', FBAuth, postSomeDoom);

// User routes 
// Signup Route
app.post('/signup', signup);
// Login route
app.post('/login', login);
app.post('/user/image', uploadImage);


// Good practice for an API to be the following:
// https://baseurl.com/api or https://api.baseurl.com
// below code gives that format
 exports.api = functions.https.onRequest(app); 