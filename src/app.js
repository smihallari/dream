const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const session = require('express-session');
const MongoStore = require('connect-mongo');
require('dotenv').config({ path: './keys.env' });
const app = express(); 
const PORT = process.env.PORT ;
const MONGO_URI = process.env.MONGO_URI ;
const JWT_SECRET = process.env.JWT_SECRET
const COOKIE_SECRET = process.env.COOKIE_SECRET;
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, '..', 'public')));
// Middleware
app.use(express.json());
app.use(cookieParser(COOKIE_SECRET));

app.use(session({
  secret: JWT_SECRET ,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: MONGO_URI }),
  cookie: { secure: false, httpOnly: true } 
}));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


// Routes
const authentication = require('./middleware/authenticationWare');
const errorHandler = require('./middleware/errorHandler');
app.use(authentication);

const indexRoute = require('./routes/index');
const dreamsRoute = require('./routes/dreamList');
const signOutRoute = require('./routes/signout');
const postDreamRoute = require('./routes/postdream');
const profileRoute = require('./routes/profile');
const profileSettingsRoute = require('./routes/profile_settings');
const signUpRoute = require('./routes/signup');
const signInRoute= require('./routes/signin');
const aboutRoute = require('./routes/about');
const seePostRoute = require('./routes/oneDream');
const postCommentRoute = require('./routes/comments');
const contestRoutes = require('./routes/contest');
const searchRoutes = require('./routes/search');
const postRoutes = require('./routes/posts');
app.use((req, res, next) => {
  res.locals.currentPath = req.path;
  next();
});

app.use('/', indexRoute);
app.use('/dreamList', dreamsRoute);
app.use('/signup',signUpRoute); 
app.use('/signin',signInRoute);
app.use('/signout',signOutRoute);
app.use('/create_post',postDreamRoute);
app.use('/profile',profileRoute);
app.use('/profile_settings',profileSettingsRoute);
app.use('/about',aboutRoute);
app.use('/post',seePostRoute);
app.use('/comments',postCommentRoute);
app.use('/contest', contestRoutes);
app.use('/search', searchRoutes);
app.use('/posts', postRoutes);
app.use(errorHandler);
mongoose.connect(MONGO_URI)// warnigns from node to remove unified topology and urlparser
  .then(() => {
    const now = new Date();
    const currentTime = `${now.getHours()}:${now.getMinutes()}`;
    app.listen(PORT, () => console.log(`Server running on port ${PORT} at ${currentTime}`));
  })
  .catch(err => console.error('MongoDB connection error:', err));