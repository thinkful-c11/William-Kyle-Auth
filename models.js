'use strict';
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const blogPostSchema = mongoose.Schema({
  author: {
    firstName: String,
    lastName: String
  },
  title: {type: String, required: true},
  content: {type: String},
  created: {type: Date, default: Date.now}
});


blogPostSchema.virtual('authorName').get(function() {
  return `${this.author.firstName} ${this.author.lastName}`.trim();
});

blogPostSchema.methods.apiRepr = function() {
  return {
    id: this._id,
    author: this.authorName,
    content: this.content,
    title: this.title,
    created: this.created
  };
}

const BlogPost = mongoose.model('BlogPost', blogPostSchema);

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////              USER SCHEMA                  ////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////

const userSchema =mongoose.Schema({
  username: {type:String, required:true, unique:true},
  password: {type:String, required:true},
  firstName: String,
  lastName: String
}); 

userSchema.virtual('fullName').get(()=>{
  return `${this.firstName} ${this.lastName}`.trim();
})
.set(()=>{
  const [first, last] = this.fullName.split(' ');
  this.firstName = first;
  this.lastName = last;
});

userSchema.methods.apiRepr = function(){
  return {
    username: this.username,
    fullName: this.fullName
  };
};

userSchema.methods.hashPassword = function(password){
  return bcrypt.hash(password,10);
};

userSchema.methods.validatePassword = function(password){
  return bcrypt.compare(password, this.password);
};
const User = mongoose.model('User',userSchema);
module.exports = {BlogPost,User};
