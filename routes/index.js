const express = require('express');
const router = express.Router();

module.exports = ({ users }) => {

  router.post( '/' , async ( req , res , next ) => {
    await users({ username : req.body.username }).save();
    console.log(req.body.username);
    res.cookie( "username" , req.body.username );
    res.status(200).send();
  });

  router.get('/' , ( req , res , next ) => {
    res.render('index');
  });
  return router;
}
