const express = require('express');
const app = express();
const mongoose = require('mongoose');
const session = require("express-session");
const passport = require('passport');
const bodyParser = require('body-parser');
const requirelogin = require('./requireLogin');
var cors =require("cors")
cors({credentials: true, origin: "*"});
app.use(cors());
require('./models/User');
require('./models/Comment');
const Comment = mongoose.model('Comment');
const User = mongoose.model("User");

mongoose.connect(process.env.mongoURI);
app.use(bodyParser.json());
app.use(session({
    secret: process.env.sessionSecret,
    resave: true,
    saveUninitialized: true,
    cookie: {secure: false}
}));
require('./passport');
app.use(passport.initialize());
app.use(passport.session());

PORT = process.env.PORT || 5000

app.get('/',(req,res)=>{
  res.send("hello friends")
});

app.get("/user",(req,res)=>{
  res.send(req.user)
})
app.post('/login',function(req, res, next){
  passport.authenticate('local',function(err, user, info) {
    if (err) {
      return res.send(err);
    }
    if (!user) {
      return res.send(err)
    }
    req.login(user, function(err) {
      if (err) {
        return res.send(err);
      } else {
        return res.send(user);
      }
    });
  })(req, res, next);
});

app.post('/comment',async(req,res)=>{
    try{
      let comment = new Comment({body:req.body.body})
      comment.save()
      /*let user = await User.findById(req.user.id)
      user.comments.push(comment)
      await user.save()*/
      res.send(comment)
    }catch(err){
      res.send(err)
    }
});
app.get('/comments',async (req,res)=>{
  let comments = await Comment.find();
  res.send(comments)
})

app.listen(PORT,()=>{
  console.log("App running on " + PORT)
})
