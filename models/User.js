const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {type: String, required:true},
  password : {type: String, required: true},
  comments: {type:Array, default: []}
})
mongoose.model('User',userSchema)
