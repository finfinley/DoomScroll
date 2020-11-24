const { admin, db } = require('./admin');

// Middleware for Firebase Authentication (user is logged in)
module.exports = (req, res, next) => {
    let idToken;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer ')){
       idToken = req.headers.authorization.split('Bearer ')[1]; // gives us an array of two strings, 2nd item in array is token
    } else {
        console.error('No token found :(')
        return res.status(403).json({ error: "You are unauthorized."});
    }
    admin.auth().verifyIdToken(idToken)
    .then(decodedToken => {
        req.user = decodedToken;
        return db.collection('users')
           .where('userId', '==', req.user.uid)
           .limit(1)
           .get();
    })
    .then((data) => {
        req.user.handle = data.docs[0].data().handle;
        req.user.imageUrl = data.docs[0].data().imageUrl;
        return next(); // allows the request to proceed since its authorized 
    })
    .catch((err) => {
        console.error('Error while verifying token :(', err);
        return res.status(403).json(err);
    })
}