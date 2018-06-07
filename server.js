const express = require('express');
const app = express();
const mongoose = require('mongoose');
const session = require("express-session");
const passport = require('passport');
const bodyParser = require('body-parser');
const requirelogin = require('./requireLogin');

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
app.post('/login',passport.authenticate('local',{successRedirect:"/success",success:"/failure"}));

app.post('/comment',async(req,res)=>{
  if(!req.isAuthenticated()){
    res.redirect('/login')
  }
  else{
    try{
      let comment = new Comment({body:req.body.body,user:req.user.id,author:req.user.username})
      await comment.save()
      let user = await User.findById(req.user.id)
      user.comments.push(comment)
      await user.save()
      res.send(comment)
    }catch(err){
      res.send(err)
    }
  }
})


app.listen(PORT,()=>{
  console.log("App running on " + PORT)
})
