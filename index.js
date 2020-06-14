require('dotenv').config()

const express = require('express');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const passport = require('passport');
const keys = require('./config/keys');
const morgan = require('morgan')

require('./models/User');
require('./models/Blog');
require('./services/passport');
require('./services/cache');

mongoose.Promise = global.Promise;
mongoose.connect(keys.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

const app = express();

app.use(express.json());
// Turn cookie data and signature from request's headers
// into JS Object and assign to [req.session]
app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [keys.cookieKey]
  })
);

// Initiliaze passport
app.use(passport.initialize());
// Checks req.session for [req.session.passport.user] and
// if an id is stored in the user object, pass it to passport.deserializeUser
// to look for a user with the same id and assign the user object to [req.user]
app.use(passport.session());
app.use(morgan('dev'))

require('./routes/authRoutes')(app);
require('./routes/blogRoutes')(app);

if (['production', 'ci'].includes(process.env.NODE_ENV)) {
  app.use(express.static('client/build'));

  const path = require('path');
  app.get('*', (_, res) => {
    res.sendFile(path.resolve('client', 'build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is listening on port`, PORT);
});
