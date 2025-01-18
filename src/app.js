const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const session = require('express-session');
const MongoStore = require('connect-mongo');
require('dotenv').config({ path: path.resolve(__dirname, 'keys.env') });
//require('dotenv').config({ path: './keys.env' });
if (!process.env.SESSION_SECRET || !process.env.MONGO_URI || !process.env.JWT_SECRET || !process.env.COOKIE_SECRET) {
  throw new Error('Missing critical environment variables!');
}
const postRoutes = require('./routes/posts');
require('dotenv').config({ path: path.resolve(__dirname, 'keys.env') });
//require('dotenv').config({ path: './keys.env' });
if (!process.env.SESSION_SECRET || !process.env.MONGO_URI || !process.env.JWT_SECRET || !process.env.COOKIE_SECRET) {
  throw new Error('Missing critical environment variables!');
}
const app = express(); 
const PORT = process.env.PORT ;
const MONGO_URI = process.env.MONGO_URI ;
const JWT_SECRET = process.env.JWT_SECRET
const COOKIE_SECRET = process.env.COOKIE_SECRET
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');
const searchRoutes = require('./routes/search');

const contestRoutes = require('./routes/contest');
const helmet = require('helmet');
const errorHandler = require('./middleware/errorHandler');



app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(cookieParser());
app.use(cookieParser());
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use('/search', searchRoutes);
app.use(helmet());

app.use('/search', searchRoutes);
app.use(helmet());



// Middleware
app.use(express.json());
app.use(errorHandler);
app.use('/posts', postRoutes);
module.exports = app;


app.use(session({
  secret: JWT_SECRET ,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: MONGO_URI }),
  cookie: { secure: false, httpOnly: true } 
}));

// app.use(session({
//   secret: process.env.SESSION_SECRET, // Use the session secret from keys.env
//   resave: false,
//   saveUninitialized: false, 
//   store: MongoStore.create({ 
//     mongoUrl: process.env.MONGO_URI
//   }),
//   cookie: {
//     maxAge: 3600000, //seconds: 1 hour
//     httpOnly: true // Prevents client-side JavaScript from accessing the cookie
//   }
// }));
// app.use(session({
//   secret: process.env.SESSION_SECRET, // Use the session secret from keys.env
//   resave: false,
//   saveUninitialized: false, 
//   store: MongoStore.create({ 
//     mongoUrl: process.env.MONGO_URI
//   }),
//   cookie: {
//     maxAge: 3600000, //seconds: 1 hour
//     httpOnly: true // Prevents client-side JavaScript from accessing the cookie
//   }
// }));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


// Routes
const authentication = require('./middleware/authenticationWare');
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
app.use((req, res, next) => {
  res.locals.currentPath = req.path;
  next();
});

app.use('/', indexRoute);
app.use('/dreamList', dreamsRoute);
app.use('/auth/signup',signUpRoute); 
app.use('/auth/signin',signInRoute);
app.use('/signout',signOutRoute);
app.use('/create_post',postDreamRoute);
app.use('/profile',profileRoute);
app.use('/profile_settings',profileSettingsRoute);
app.use('/about',aboutRoute);
app.use('/contest', contestRoutes);
app.use('/search', searchRoutes);
app.use('/posts', postRoutes);
mongoose.connect(MONGO_URI)// warnigns from node to remove unified topology and urlparser
  .then(() => {
    const now = new Date();
    const currentTime = `${now.getHours()}:${now.getMinutes()}`;
    app.listen(PORT, () => console.log(`Server running on port ${PORT} at ${currentTime}`));
  })
  .catch(err => console.error('MongoDB connection error:', err));

// mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
// .then(() => console.log('MongoDB connected'))
// .catch((err) => {
//   console.error('MongoDB connection error:', err);
//   process.exit(1); // Exit process on failure
// });

// mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
// .then(() => console.log('MongoDB connected'))
// .catch((err) => {
//   console.error('MongoDB connection error:', err);
//   process.exit(1); // Exit process on failure
// });
