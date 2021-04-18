const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const http = require('http');
const socketio = require('socket.io');
const mongoose     = require("mongoose");

const app = express();

const server = http.createServer(app);
const io = socketio( server , {cors:{ origin:'*' }});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

mongoose.connect( "mongodb://localhost:27017/" + "chatting-app-2" ,  
    { useNewUrlParser:true , useUnifiedTopology: true} );
const historySchema = new mongoose.Schema({
  username: { type : String ,  required: [ true , " No name specified...!"  ] },
});
const userSchema = new mongoose.Schema({
  username: { type : String ,  required: [ true , " No name specified...!"  ] },
  socketId: { type : String },
  history : { type : [historySchema] } ,
});
const users = mongoose.model( "Users" , userSchema );

const indexRouter = require('./routes/index');
const searchRouter = require('./routes/search');
const chatNowRouter = require('./routes/chat-now');

app.use( express.static(path.join( __dirname,'public' )) );
app.use( '/search' , express.static(path.join( __dirname,'public' )) );
app.use( '/chat-now' , express.static(path.join( __dirname,'public' )) );

app.use( '/' , indexRouter({ users : users }) );
app.use( '/search' , searchRouter({ users : users }) );
app.use( '/chat-now' , chatNowRouter() );


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = { app:app , server:server };
