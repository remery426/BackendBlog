const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const commentSchema = new Schema({
  body: {type:String, required:true},
  user: {type:String, required:true},
  author: {type: String, required:true},
  createdAt:{type:String, default: new Date()},
  upDatedAt: {type:String, default: new Date()}
})
mongoose.model('Comment',commentSchema)
