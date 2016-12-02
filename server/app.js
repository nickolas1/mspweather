import express from 'express';
import logger from 'morgan';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import path from 'path';

import mainController from './controllers/main';
import dailyObservationController from './controllers/dailyObservation';

// mongo connection
mongoose.connect('mongodb://localhost:27017/mspweather');
mongoose.connection.on('error', () => {
  console.log('MongoDB Connection Error. Ensure that MongoDB is running.');
  process.exit(1);
});

// app config
let app = express();
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, '..', 'views'));
app.set('view engine', 'jade');
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(logger('dev'));
app.use(bodyParser.json());

// route config
app.get('/', mainController.getIndex);
app.get('/templates/:template', mainController.getTemplate);
app.get('/observation/:year/:month/:day', dailyObservationController.getObservationByDate);
app.get('/observations/:month/:day', dailyObservationController.getObservationsByDayAndMonth);

// start app
app.listen(app.get('port'), () => {
  console.log(`App listening on port ${app.get('port')}`);
});
