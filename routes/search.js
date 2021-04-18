const express = require('express');
const router = express.Router();

module.exports = ({ users }) => {

    router.post('/', async (req,res,next) => {
        const userList = await users.find( { 'username' : new RegExp(req.body.search,"i") } 
        , [ "username" ] , {limit:25} );
        res.status(201).json( { 'userList' : userList } );
    });

    router.get('/' , ( req , res , next ) => {
        const username = req.cookies['username'];
        res.render('search' , { username:username } );
    });
    return router;
}
