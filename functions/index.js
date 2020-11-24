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
const { getAllImpendingDoom, 
    postSomeDoom, 
    getDoom, 
    commentOnDoom, 
    encourageDoom, 
    discourageDoom,
    deleteDoom 
} = require('./handlers/impendingdoom');

const { signup, 
    login, 
    uploadImage, 
    addUserDetails, 
    getAutenticatedUser 
} = require('./handlers/users');

//const fbauth = require('./util/fbauth');

/**
 * ImpendingDoom Routes *
 */
// Get all doom posts 
app.get('/impendingdooms', getAllImpendingDoom);
// Post a new doom post 
app.post('/newdoom', FBAuth, postSomeDoom);
// Route to get doom with comments 
app.get('/impendingdooms/:doomId', getDoom);
//TO DO delete impending doom
app.delete('/impendingdooms/:doomId', FBAuth, deleteDoom);
// Encourage a doom post 
app.get('/impendingdooms/:doomId/encourage', FBAuth, encourageDoom);
// Discourage a doom post (unlike)
app.get('/impendingdooms/:doomId/discourage', FBAuth, discourageDoom);
// Comment on a scream
app.post('/impendingdooms/:doomId/comment', FBAuth, commentOnDoom);

/**
 * User Routes * 
 */ 
// Signup Route
app.post('/signup', signup);
// Login route
app.post('/login', login);
// Image Upload route 
app.post('/user/image', FBAuth, uploadImage); // Have to add middleware so only authorized users can login
// Update User Bio Route 
app.post('/user/', FBAuth, addUserDetails);
// Get user info Route
app.get('/user', FBAuth, getAutenticatedUser); 


// Good practice for an API to be the following:
// https://baseurl.com/api or https://api.baseurl.com
// below code gives that format
 exports.api = functions.https.onRequest(app); 