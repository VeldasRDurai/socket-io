const express = require('express');
const router = express.Router();

module.exports = () => {

    // router.post( '/' , ( req , res , next ) => {
    //     res.render('search', { username : req.body.username } );
    // });

    router.get('/:name' , ( req , res , next ) => {
        console.log(req.params);
        const username = req.cookies['username'];
        res.render('chat-now', { username : username , chatWith : req.params.name });
        
        io.on('connection' , async ( socket ) => {
            console.log("User connected : " + socket.id );
            await users.updateOne({ username : req.cookies['username'] }, {socketId:socket.id});

            socket.on('create', function(data) {
                const room = req.cookies['username'] + "CHATS" + data.chatWith;
                console.log("create room")
                socket.join(room);
                const withSocket = await users.findOne({ username : data.chatWith });
                // let withSocket = getSocketByUserId(data.withUserId);
                socket.broadcast.to(withSocket.id).emit( "invite", { room:room } );
            });

            socket.on('joinRoom', function(data) {
                socket.join( data.room );
            });

            
            socket.on('message', function(data) {
                socket.broadcast.to(data.room).emit('message', data);
            })

        });

    });

    return router;
}
