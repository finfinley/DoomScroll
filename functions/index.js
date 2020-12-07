/**
 * Author: Alex Finley
 * Date: 11/24/2020
 * 3:25:44 in video
 * Used for server side (backend) scripting within DoomScroll's database
 */
const functions = require("firebase-functions");

// Express allows our functions to be able to more easily check for errors from the backend
const express = require("express");
const app = express();
// Importing middleware
const FBAuth = require("./util/fbauth");
// Importing db
const { db } = require("./util/admin");
// Importing routes
const {
  getAllImpendingDoom,
  postSomeDoom,
  getDoom,
  commentOnDoom,
  encourageDoom,
  discourageDoom,
  deleteDoom,
} = require("./handlers/impendingdoom");

const {
  signup,
  login,
  uploadImage,
  addUserDetails,
  getAutenticatedUser,
  getUserDetails,
  markDoomtickRead,
} = require("./handlers/users");
const { Change } = require("firebase-functions");

//const fbauth = require('./util/fbauth');

/**
 * ImpendingDoom Routes *
 */
// Get all doom posts
app.get("/impendingdooms", getAllImpendingDoom);
// Post a new doom post
app.post("/newdoom", FBAuth, postSomeDoom);
// Route to get doom with comments
app.get("/impendingdooms/:doomId", getDoom);
// Delete impending doom
app.delete("/impendingdooms/:doomId", FBAuth, deleteDoom);
// Encourage a doom post
app.get("/impendingdooms/:doomId/encourage", FBAuth, encourageDoom);
// Discourage a doom post (unlike)
app.get("/impendingdooms/:doomId/discourage", FBAuth, discourageDoom);
// Comment on a scream
app.post("/impendingdooms/:doomId/comment", FBAuth, commentOnDoom);

/**
 * User Routes *
 */
// Signup Route
app.post("/signup", signup);
// Login route
app.post("/login", login);
// Image Upload route
app.post("/user/image", FBAuth, uploadImage); // Have to add middleware so only authorized users can login
// Update User Bio Route
app.post("/user/", FBAuth, addUserDetails);
// Get user info Route
app.get("/user", FBAuth, getAutenticatedUser);
// Get users detail
app.get("/user/:handle", getUserDetails);
// Marking doomticks as read
app.post("/doomticks", FBAuth, markDoomtickRead);

// Good practice for an API to be the following:
// https://baseurl.com/api or https://api.baseurl.com
// below code gives that format
exports.api = functions.https.onRequest(app);

exports.createDoomtickOnEncouragement = functions.firestore
  .document("/encouragements/{id}")
  .onCreate((snapshot) => {
    return db
      .doc(`/impendingdooms/${snapshot.data().doomId}`)
      .get()
      .then((doc) => {
        if (
          doc.exists &&
          doc.data().userHandle !== snapshot.data().userHandle
        ) {
          return db.doc(`/doomtick/${snapshot.id}`).set({
            createdAt: new Date().toISOString(),
            recipient: doc.data().userHandle,
            sender: snapshot.data().userHandle,
            type: "enouragement",
            read: false,
            doomId: doc.id,
          });
        }
      })
      .catch((err) => {
        console.error(err);
      });
  });

// Deletes notification if somebody disencourages a post
exports.deleteDoomtickOnDiscouragment = functions.firestore
  .document("/encouragements/{id}")
  .onDelete((snapshot) => {
    return db
      .doc(`/doomtick/${snapshot.id}`)
      .delete()
      .catch((err) => {
        console.error(err);
        return;
      });
  });

exports.createDoomtickOnComment = functions.firestore
  .document("/comments/{id}")
  .onCreate((snapshot) => {
    return db
      .doc(`/impendingdooms/${snapshot.data().doomId}`)
      .get()
      .then((doc) => {
        if (
          doc.exists &&
          doc.data().userHandle !== snapshot.data().userHandle
        ) {
          return db.doc(`/doomtick/${snapshot.id}`).set({
            createdAt: new Date().toISOString(),
            recipient: doc.data().userHandle,
            sender: snapshot.data().userHandle,
            type: "comment",
            read: false,
            doomId: doc.id,
          });
        }
      })
      .catch((err) => {
        console.error(err);
        return;
      });
  });

exports.onUserImageChange = functions.firestore
  .document("/users/{userId}")
  .onUpdate((change) => {
    console.log(change.before.data());
    console.log(change.after.data());
    if (change.before.data().imageUrl !== change.after.data().imageUrl) {
      console.log("image has changed");
      let batch = db.batch();
      return db
        .collection("impendingdooms")
        .where("userHandle", "==", change.before.data().handle)
        .get()
        .then((data) => {
          data.forEach((doc) => {
            const doom = db.doc(`/impendingdooms/${doc.id}`);
            batch.update(doom, { userImage: change.after.data().imageUrl });
          });
          return batch.commit();
        });
    } else return true;
  });

exports.onDoomDelete = functions.firestore
  .document("/impendingdooms/{doomId}")
  .onDelete((snapshot, context) => {
    const doomId = context.params.doomId;
    const batch = db.batch();
    return db
      .collection("comments")
      .where("doomId", "==", doomId)
      .get()
      .then((data) => {
        data.forEach((doc) => {
          batch.delete(db.doc(`/comments/${doc.id}`));
        });
        return db
          .collection("encouragements")
          .where("doomId", "==", doomId)
          .get();
      })
      .then((data) => {
        data.forEach((doc) => {
          batch.delete(db.doc(`/encouragements/${doc.id}`));
        });
        return db.collection("doomticks").where("doomId", "==", doomId).get();
      })
      .then((data) => {
        data.forEach((doc) => {
          batch.delete(db.doc(`/doomticks/${doc.id}`));
        });
        return batch.commit();
      })
      .catch((err) => console.error(err));
  });
