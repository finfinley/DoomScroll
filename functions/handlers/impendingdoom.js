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
                createdAt: doc.data().createdAt
            });
        });
        return res.json(impendingdDoom);
    })
    .catch((err) => console.error(err));
 };

 // How to make a new post 
 // Should be a protected route, nobody logged in should be able to post an impending doom
 exports.postSomeDoom = (req, res) => { // By using the app.post function instead of creating a new function, it makes it easier to check for errors
    const newDoom = {
        body: req.body.body,
        userHandle: req.user.handle,
        createdAt: new Date().toISOString()
    };

    db
       .collection('impendingdooms')
       .add(newDoom)
       .then(doc => {
           res.json({ message: `document ${doc.id} created successfully`});
       })
       .catch((err) => {
           res.status(500).json({error: 'something is spiraling out of control' });
           console.error(err);
       });
};