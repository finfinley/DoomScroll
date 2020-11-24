/**
 * Author: Alex Finley
 * Date: 11/11/2020
 * Filename: dbschema.js
 * 
 * This file simply shows how our data should be constructed for our API. File is not used within code
 */
let db = {
    users: {
        userId: '',
        email: 'user@email.com',
        createdAt: '2020-11-11T23:09:29.179Z',
        imageUrl: 'image/dsadsadasdfds/sadsads',
        bio: 'Hello, I welcome doom with open arms.',
        website: 'https://user.com',
        Location: 'Stairway to Heaven'
    },

    impendingDoom: [
        {
            userHandle: 'user',
            body: 'this is the doom body',
            createdAt: '2020-11-11T23:09:29.179Z',
            encouragement: 5, // Likes 
            comments: 2 // comments
        }
    ],
    comments: [
        {
            userHandle: 'user',
            doomId: 'djashdkasdjasddasad',
            body: 'Way to spread the doom!',
            createdAt: '2020-11-11T23:09:29.179Z'
        }
    ]
};

const userDetails = {
    // Redux data 
    credentials: {
        userId: 'L5jqIRbBQaVABayS5Pix1LX8qmr1',
        email: 'user@email.com',
        handle: 'user',
        createdAt: '2020-11-11T23:09:29.179Z',
        imageUrl: 'image/dsadsadasdfds/sadsads',
        bio: 'Hello, I am user. I embrace doom',
        website: 'https://user.com',
        location: 'Stairway to Heaven'
    },
    likes: [
        {
            userHandle: 'user',
            doomId: 'eWjxozCZJSJ2fjBlANPt'
        },
        {
            userHandle: 'user',
            doomId: '5i6gGJcHrARJefyYj2EB'
        }
    ]
}