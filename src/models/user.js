const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    name: 
        { type: String, required: true },
    surname:
        { type: String, required: true },
    username: 
        { type: String, required: true, unique: true },
    email: 
        { type: String, required: true, unique: true },
    bio: 
        { type: String, default: 'This user has not set a bio yet.' },
    facebook:{
        type: String,
        default: 'https://www.facebook.com/'
    },
    twitter:{
        type: String,
        default: 'https://twitter.com/'
    },
    instagram:{
        type: String,
        default: 'https://www.instagram.com/'
    },
    password: 
        { type: String, required: true },
    role: 
        { type: String, default: 'user' },
    profilePic: 
        { type: Buffer, default:''}

}, { timestamps: true });

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const User = mongoose.model('User', UserSchema);
module.exports = User;
