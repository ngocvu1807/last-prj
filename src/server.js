const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const path = require('path');
const connectDB = require('./config/db');

// Load config
dotenv.config({ path: 'src/config/config.env' });

connectDB();

const app = express();

//Logger
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// app.use(cookie-parser);

// Routes
app.use('/', require('./routes/index'));

// Handlebars engine
app.engine('.hbs', exphbs({ defaultLayout: 'layout', extname: '.hbs' }));
app.set('view engine', '.hbs');

// Static folder
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', './src/views');

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`server is running on ${port}`);
});
