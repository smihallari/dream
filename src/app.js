const express = require('express');
const mongoose = require('mongoose');
const path= require('path');
require('dotenv').config({ path: './keys.env' });
const app = express();
const PORT = process.env.PORT ;
const MONGODB_URI = process.env.MONGODB_URI ;
// Middleware
app.use(express.json());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
// Routes


const signuploginRoutes = require('./routes/auth');
const authentication = require('./middleware/authenticationWare');

const indexRoutes = require('./routes/index');
const dreamsRoutes = require('./routes/dreamList');
const postsRoutes = require('./routes/posts');
const commentRoutes = require('./routes/comments');


app.use('/', indexRoutes);
app.use('/dreamList', dreamsRoutes);
app.use('/', postsRoutes);
app.use('/dreamList', postsRoutes);
app.use('/post', commentRoutes);

// Connect to MongoDB and start server
mongoose.connect(MONGODB_URI)// warnigns from node to remove unified topology and urlparser
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error('MongoDB connection error:', err));
