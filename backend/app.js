
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const app = express();
//Initialise CORS
const cors = require('cors');

//Import routes
const productsRoute = require('./routes/products');
const usersRoute = require('./routes/orders');
const ordersRoute = require('./routes/orders');

//Use routes
app.use(express.json);
app.use('/api/products', productsRoute);
app.use('/api/users', usersRoute);
app.use('/api/orders', ordersRoute);


app.use(cors({
    origin: "*",
    methods: ['GET', 'POST', 'DELETE', 'PUT'],
    allowHeaders: 'Content-Type, Authorization, Origin, X-Requested-With, Accept'
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
