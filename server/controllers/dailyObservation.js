import DailyObservation from '../models/dailyObservation';

const TRACE_SNOW = 0.01;
const TRACE_PRECIP = 0.001;

let controller = {
  getObservationByDate: (req, res) => {
    let y = req.params.year;
    let m = req.params.month - 1; // month is 0 based for date construction:/
    let d = req.params.day;
    DailyObservation.find({
      date: new Date(Date.UTC(y, m, d))
    },
    '-_id date high low precip snowfall snowdepth',
    (err, observation) => {
      if (err) {
        return res.send(err);
      }
      return res.json(observation[0]);
    });
  },

  getObservationsByDayAndMonth: (req, res) => {
    let m = req.params.month; // month stored in DB is 1 based
    let d = req.params.day;
    DailyObservation.find({
      month: m,
      day: d
    },
    '-_id date high low precip snowfall snowdepth',
    (err, observations) => {
      if (err) {
        return res.send(err);
      }
      let response = {
        isWinter: false,
        isSnowfall: false,
        isSnowdepth: false,
        highs: [],
        lows: [],
        precip: [],
        snowfall: [],
        snowdepth: [],
        observations: observations
      };
      observations.forEach(o => {
        if (o.high !== 'M') response.highs.push(+o.high);
        if (o.low !== 'M') response.lows.push(+o.low);
        if (o.precip !== 'M') response.precip.push(o.precip === 'T' ? TRACE_PRECIP : +o.precip);
        if (o.snowfall !== 'M') response.snowfall.push(o.snowfall === 'T' ? TRACE_SNOW : +o.snowfall);
        if (o.snowdepth !== 'M') response.snowdepth.push(o.snowdepth === 'T' ? TRACE_SNOW : +o.snowdepth);
      });
      let snowfallSum = response.snowfall.reduce( (a,b) => a+b, 0);
      let snowdepthSum = response.snowdepth.reduce( (a,b) => a+b, 0);
      // show winter distributions if 5 days have had a trace of snow
      response.isSnowfall = snowfallSum > 5 * TRACE_SNOW;
      response.isSnowdepth = snowdepthSum > 5 * TRACE_SNOW;
      response.isWinter = response.isSnowfall || response.isSnowdepth;
      console.log(snowfallSum, snowdepthSum, response.isWinter)
      return res.json(response)
    });
  }
}

export default controller;
