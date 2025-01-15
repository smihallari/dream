const express = require('express');
const mongoose = require('mongoose');
const path= require('path');
const session = require('express-session');
const MongoStore = require('connect-mongo');
require('dotenv').config({ path: './keys.env' });
const app = express(); 
const PORT = process.env.PORT ;
const MONGODB_URI = process.env.MONGODB_URI ;
const JWT_SECRET = process.env.JWT_SECRET
const cookieParser = require('cookie-parser');
// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(session({
  secret: JWT_SECRET ,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: MONGODB_URI }),
  cookie: { secure: false, httpOnly: true } 
}));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
// Routes
const authentication = require('./middleware/authenticationWare');
app.use(authentication);

const signupRoute = require('./routes/signup');


const indexRoute = require('./routes/index');
const dreamsRoute = require('./routes/dreamList');
const postsRoute = require('./routes/posts');
const commentRoute = require('./routes/comments');
const logoutRoute = require('./routes/logout');
app.use((req, res, next) => {
  res.locals.currentPath = req.path;
  next();
});
app.use('/', indexRoute);
app.use('/dreamList', dreamsRoute);
app.use('/signup',signupRoute); 
app.use('/logout',logoutRoute);

//  
// Connect to MongoDB and start server
mongoose.connect(MONGODB_URI)// warnigns from node to remove unified topology and urlparser
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error('MongoDB connection error:', err));
