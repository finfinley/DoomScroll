const { db } = require('../util/admin')
// How to retrieve all posts    
exports.getAllImpendingDoom = (req, res) => {
    db
    .collection('impendingdooms')
    .orderBy('createdAt', 'desc')
    .get()
    .then((data) => {
        let impendingdDoom = [];
        data.forEach((doc) => {
            impendingdDoom.push({
                doomId: doc.id,
                body: doc.data().body,
                userHandle: doc.data().userHandle,
                createdAt: doc.data().createdAt,
                commentCount: doc.data().commentCount,
                encouragementCount: doc.data().encouragementCount,
                userImage: doc.data().userImage
            });
        });
        return res.json(impendingdDoom);
    })
    .catch((err) => console.error(err));
 };

 // How to make a new post 
 // Should be a protected route, nobody logged in should be able to post an impending doom
 exports.postSomeDoom = (req, res) => { // By using the app.post function instead of creating a new function, it makes it easier to check for errors
    if(req.body.body.trim() === '') {
        return res.status(400).json({ body: 'Must not be empty'});
    }

    const newDoom = {
        body: req.body.body,
        userHandle: req.user.handle,
        userImage: req.user.imageUrl,
        createdAt: new Date().toISOString(),
        encouragementCount: 0,
        commentCount: 0
    };

    db
       .collection('impendingdooms')
       .add(newDoom)
       .then(doc => {
           const resDoom = newDoom;
           resDoom.doomId = doc.id;
           res.json({resDoom});
       })
       .catch((err) => {
           res.status(500).json({error: 'something is spiraling out of control' });
           console.error(err);
       });
};

// Fetch one doom comment
exports.getDoom = (req, res) => {
    let doomData = {};
    db.doc(`/impendingdooms/${req.params.doomId}`)
        .get()
        .then((doc) => {
            if(!doc.exists) {
                return res.status(404).json({ error: 'Doom not found :('})
            }
            doomData = doc.data();
            doomData.doomId = doc.id;
            return db
                .collection('comments')
                .orderBy('createdAt', 'desc')
                .where('doomId', '==', req.params.doomId)
                .get();
        })
        .then((data) => {
            doomData.comments = [];
            data.forEach((doc) => {
                doomData.comments.push(doc.data());
            });
            return res.json(doomData);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({ error: err.code });
        });
};

//  Comment on Doom
exports.commentOnDoom = (req, res) => {
    if(req.body.body.trim() == '') return res.status(400).json({ comment: 'Must not be empty'});

    const newComment = {
        body: req.body.body,
        createdAt: new Date().toISOString(),
        doomId: req.params.doomId,
        userHandle: req.user.handle,
        userImage: req.user.imageUrl
    };

    db.doc(`/impendingdooms/${req.params.doomId}`).get()
        .then(doc => {
            if(!doc.exists){
                return res.status(404).json({ error: 'Doom not found'})
            }
            return doc.ref.update({ commentCount: doc.data().commentCount + 1})
        })
        .then(() => {
            return db.collection('comments').add(newComment);
        })
        .then(() => {
            res.json(newComment);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: 'something is spiraling out of control' });
        })
};

// Encourage a doom post
exports.encourageDoom = (req, res) => {
    const encourageDocument = db.collection('encouragements').where('userHandle', '==', req.user.handle)
        .where('doomId', '==', req.params.doomId).limit(1);

    const doomDocument = db.doc(`/impendingdooms/${req.params.doomId}`);

    let doomData = {};

    doomDocument.get()
        .then(doc => {
            if(doc.exists){
                doomData = doc.data();
                doomData.doomId = doc.id;
                return encourageDocument.get();
            } else {
                return res.status(404).json({ error: 'Doom not found :('});
            }
        })
        .then(data => {
            if(data.empty){
                return db.collection('encouragements').add({
                    doomId: req.params.doomId,
                    userHandle: req.user.handle
                })
                .then(() => {
                    doomData.encouragementCount++
                    return doomDocument.update({ encouragementCount: doomData.encouragementCount })
                })
                .then(() => {
                    return res.json(doomData);
                })
            } else {
                return res.status(400).json({ error: 'Doom already encouraged' })
            }
        })
        .catch(err => {
            console.error(err)
            res.status(500).json({ error: err.code });
        });
};

//Discourage doom
exports.discourageDoom = (req, res) => {
    const encourageDocument = db.collection('encouragements').where('userHandle', '==', req.user.handle)
        .where('doomId', '==', req.params.doomId).limit(1);

    const doomDocument = db.doc(`/impendingdooms/${req.params.doomId}`);

    let doomData = {};

    doomDocument.get()
        .then(doc => {
            if(doc.exists){
                doomData = doc.data();
                doomData.doomId = doc.id;
                return encourageDocument.get();
            } else {
                return res.status(404).json({ error: 'Doom not found :('});
            }
        })
        .then(data => {
            if(data.empty){
                return res.status(400).json({ error: 'Doom was never encouraged' });
            } else {
                return db.doc(`/encouragements/${data.docs[0].id}`).delete()
                    .then(() => {
                        doomData.encouragementCount--;
                        return doomDocument.update({ encouragementCount: doomData.encouragementCount})
                    })
                    .then(() => {
                        res.json({doomData})
                    })
            }
        })
        .catch(err => {
            console.error(err)
            res.status(500).json({ error: err.code });
        });
};

// Delete a doom post
exports.deleteDoom = (req, res) => {
    const document = db.doc(`/impendingdooms/${req.params.doomId}`);
    document.get()
        .then(doc => {
            if(!doc.exists){
                return res.status(404).json({ error: 'Doom not found' })
            }
            if(doc.data().userHandle !== req.user.handle){
                return res.status(403).json({ error: 'Unauthorized action'});
            } else {
                return document.delete();
            }
        })
        .then(() => {
            res.json({ message: 'Doom deleted successfully '})
        })
        .catch(err => {
            console.error(err);
            return res.status(500).json({ error: err.code });
        });
};