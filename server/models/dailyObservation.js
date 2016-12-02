import mongoose from 'mongoose';

let dailyObservationSchema = new mongoose.Schema({
  date: Date,
  high: String,
  low: String,
  precip: String,
  snowfall: String,
  snowdepth: String,
  obstime: String,
  obstime1: String,
  obstime2: String,
  obstime3: String,
  obstime4: String,
  year: Number,
  month: Number,
  day: Number
},
{
  collection : 'observations'
});

// db.mspweather.find().forEach(function(el){
//     el.dateField = new Date(el.dateField);
//     db.collName.save(el)
// });

export default mongoose.model('DailyObservation', dailyObservationSchema);
