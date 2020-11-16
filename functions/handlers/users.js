const { admin, db } = require('../util/admin');

const config = require('../util/config');


const firebase = require('firebase');
firebase.initializeApp(config);

const { validateSignupData, validateLoginData } = require('../util/validators');

// How to sign up 
exports.signup = (req, res) => {
    const newUser = {
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        handle: req.body.handle,
    };

    const { valid, errors } = validateSignupData(newUser);

    if(!valid) return res.status(400).json(errors);

    if(Object.keys(errors).length > 0) return res.status(400).json(errors);

    // Ensuring that the user handle is unique
    let token, userId; 
    db.doc(`/users/${newUser.handle}`).get()
       .then(doc => {
           if(doc.exists){
               return res.status(400).json({ handle: 'Dang. Somebody already took this handle.'});
           } else {
               return firebase.auth().createUserWithEmailAndPassword(newUser.email, newUser.password)
           }
       })
       .then(data => {
           userId = data.user.uid;
           return data.user.getIdToken();
       })
       .then((idToken) => {
           token = idToken;
           const userCredentials = {
               handle: newUser.handle,
               email: newUser.email,
               createdAt: new Date().toISOString(),
               userId
           };
           return db.doc(`/users/${newUser.handle}`).set(userCredentials);
       })
       .then(() => {
           return res.status(201).json({ token });
       })
       .catch(err => {
           console.error(err);
           if(err.code === 'auth/email-already-in-use') {
               return res.status(400).json({ email: 'Try again. We already have that e-mail.'})
           } else {
               return res.status(500).json({ error: err.code});
           }
       });
};

// How to login
exports.login = (req, res) => {
    const user = {
        email: req.body.email,
        password: req.body.password
    };

    
    const { valid, errors } = validateLoginData(user);

    if(!valid) return res.status(400).json(errors);

    firebase.auth().signInWithEmailAndPassword(user.email, user.password)
       .then(data => {
           return data.user.getIdToken();
       })
       .then(token => {
           return res.json({token});
       })
       .catch(err => {
           console.error(err);
           if(err.code === 'auth/wrong-password'){
               return res
               .status(403)
               .json({ general: 'Imposter! Wrong credentials. Try again. '});
           } else return res.status(500).json({error: err.code});
       })

};
// Uses busboy to help handle uploading photes
/**exports.uploadImage(req, res) => {
    const BusBoy = require('busboy');
    const path = require('path');
    const os = require('os');
    const fs = require('fs'); // stands for file system

    const busboy = new BusBoy({ headers: req.headers });

    let imageFileName;
    let imageToBeUploaded = {};

    busboy.on('file', (fieldname, file, filename, encoding, mimetype)  => {
        console.log(fieldname);
        console.log(filename);
        console.log(mimetype);
        // image.png - need to get the file extenstion (png)
        const imageExtension = filename.split('.')[filename.split('.').length - 1] // gives us the index of the last item
        const imageFileName = `${Math.round(Math.random()*10000000000)}.${imageExtension}`;
        const filepath = path.join(os.tmpdir(), imageFileName);
        imageToBeUploaded = { filepath, mimetype };
        file.pipe(fs.createWriteStream(filepath));
    });
    busboy.on('finish', () => {
        admin.storage().bucket().upload(imageToBeUploaded.filepath, {
            resumable: false,
            metadata: {
                metadata: {
                    contentType: imageToBeUploaded.mimetype
                }
            }
        })
        .then(() => {
            const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}`
        })
    }) 
}
*/