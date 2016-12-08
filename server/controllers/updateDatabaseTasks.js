import moment from 'moment';
import request from 'request';
import DailyObservation from '../models/dailyObservation';


let cronJobs = {
  getMissingDailyObservations: function() {
    // query ACIS for latest data
    const sid = 'mspthr'; // station we're querying
    // determine the last day we want to have an observation for
    const edate = moment().tz('America/Chicago').startOf('day').subtract(1, 'day');
    const elems = [
      {'name':'maxt','interval':'dly','duration':'dly'},
      {'name':'mint','interval':'dly','duration':'dly'},
      {'name':'pcpn','interval':'dly','duration':'dly'},
      {'name':'snow','interval':'dly','duration':'dly'},
      {'name':'snwd','interval':'dly','duration':'dly'}
    ];
    const meta = 'name';
    const url = 'http://data.rcc-acis.org/StnData';
    // determine last observation that we have
    DailyObservation.find().sort({date:-1}).limit(1).exec((err, docs) => {
      if (err) console.log('error from Mongo: ', err);
      const sdate = moment.utc(docs[0].date).add(1, 'day');

      if (sdate.isSameOrBefore(edate)) {
        // get data from ACIS
        const params = {
          sid: sid,
          sdate: sdate.format('YYYY-MM-DD'),
          edate: edate.format('YYYY-MM-DD'),
          elems: elems,
          meta: meta
        };
        const opts = {
          url: url,
          method: 'POST',
          json: params
        }
        request(opts, (err, resp, body) => {
          if (err) console.log('request error: ', err);
          // insert data into mongo
          body.data.forEach(d => {
            let date = moment.utc(d[0]);
            let query = { date: date };
            let options = { upsert: true };
            let year = date.year();
            let month = date.month() + 1;
            let day = date.date();
            let update = {
              date: date,
              high: d[1],
              low: d[2],
              precip: d[3],
              snowfall: d[4],
              snowdepth: d[5],
              year: year,
              month: month,
              day: day
            };
            DailyObservation.update(query, update, options, (err, raw) => {
              if (err) console.log('mongo update error: ', err);
              console.log('mongo raw resopnse to update: ', raw);
            });
          });
        });
      }
    });
  }
}

export default cronJobs;
