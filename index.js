var Rand = require('randgen')
var Hash = require('hashish');

var defaults = {
  weekday_start_hour : [9,0.3], // normal 9am mean sigma 0.3
  weekday_end_hour : [18,0.3], // normal 6pm mean sigma 0.3
  weekend_start_hour : [10,0.4], // normal 10am mean sigma 0.4
  weekend_end_hour : [21,0.4], // normal 9pm mean sigma 0.4
  weekend_sessions : 8, // poisson lambda 8
  searches_in_session : 4, // bernoulli p=0.25 => mean tosses 1/p => 4
  search_interval : [30,5] // normal 30secs mean sigma 5 secs
}


//  @total approximate rate of searches per day
//  @when  Date object which date should be used - null means today
//  @tz_offset  if human at east coast GMT-5 and server at west coast GMT-8 then tzoffset=3
//  @opts overrides defaults hash above
module.exports = function(total,when,tz_offset,opts) {
  if (!tz_offset) tz_offset = 0
  if (!opts) opts = {}
  if (!when) when = new Date()
  var is_weekday = when.getDay() > 0 && when.getDay() < 6
  var type = is_weekday ? 'day' : 'end'

  var config = Hash(defaults).map(function(value,key) { 
      return key.match('hour$') ? [value[0] - tz_offset,value[1]] : value
    }).merge(opts).items
 
  function to_hours(el) { return Math.round(el*3600) }
  var start =  to_hours(Rand.rnorm.apply([],config['week'+type+'_start_hour'] ))
  var end =  to_hours(Rand.rnorm.apply([],config['week'+type+'_end_hour'] ))
  var num_of_sessions = 
    is_weekday ? Math.max(1,Rand.rpoisson(total/config.searches_in_session))
               : Math.max(1,Rand.rpoisson(config.weekend_sessions))
   
  var sessions = Rand.rvunif(num_of_sessions,start,end)
    .sort(function(a,b){ return a - b} )
    .map(function(el,i,arr) {
      var timer = Math.round(el)
      var session = []
      while (true) {
        session.push(timer)
        timer += Math.round(Rand.rnorm.apply([], config.search_interval))
        if (Rand.rbernoulli(1/config.searches_in_session) || // we found what we were searching for
            timer > end || // enough work... need to go home
            (i+1 < arr.length && timer > arr[i+1]-60 ) // oops another task.. lets drop this one
          ) break
      }
      return session
    })
  return [].concat.apply([],sessions)
}

// ff = require('./human')
// ff(500).map(function(el){ return [Math.floor(el/3600), Math.floor((el%3600)/60), (el%3600)%60] })

