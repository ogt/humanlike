Emulates human to generate random timeseries of web session activity
==
[![Build Status](https://travis-ci.org/ogt/humanlike.png)](https://travis-ci.org/ogt/humanlike)

## Synopsis
Produces a sequence of numbers [0 - 86399] (nth second within the day) that represent the timings of all the google 
searches comimg from a regular google user.

## Usage

```
  > var human = require('humanlike');
  > var today = (new Date((new Date()).getFullYear(), (new Date()).getMonth(), (new Date()).getDate()))
  > human(10).forEach(function(t) { console.log(new Date(today.now()+ t*1000).toString().split(" ")[4]) });
  08:55:35
  10:56:37
  12:14:12
  12:14:42
  12:15:11
  12:15:37
  12:16:08
  12:16:38
  12:17:08
  12:26:00
  12:26:26
  12:26:55
  12:27:28
  12:28:10
  12:28:41
  12:29:08

 > human(100).forEach(function(t) {
     var millisecs = today.now()+t*1000 - Date.now()
     if (millisecs > 0 ) setTimeout(do_something,milisecs)
   })
```

## Description

The sequence of seconds genarated by the function is randomized so as it is different every time.
The first parameter controls (approximately) the length of the resulting array.

The function could be used by someone that wants to emulate a user that accesses any site - not just searching.
It uses a simple model to approximate the human activity : 
 - a user has regular online activity patterns that repeat approximately every day
 - the activity follows a typical "9-5" working day 
 - weekdays differ from weekends both in term of the intensity of activity (weekends sporadic) as well as in terms of when online access starts/ends
 - during the course of the time the user occassionally needs to find sth at which point he performs a sequence of consecutive searches until they find what they are looking for or give up
 - during the course of a day the number of such sessions can be approximated with a poisson distribution based on the mean # of searches per day
 - search sessions can be assumed to be uniformely spread throughout the course of the person's online activity
 - online activity start/end follows a normal distribution of the habitual times.
 - interval between subsequent searches are also normal distribution of the time it takes to assess the result
 - given that every search can bring the desired result to the user - a bernouli distribution/coin-toss can be used to   determine if a user finds or not the result (if not search again). The fairness p of the coin toss can be derived by the mean # of searches in a session - which can be a configurable parameter (how search-smart the user is).

Given the model above the function's primary parameter (# of searches per day) can be used together with the poisson derived # of session to determine the # of sessions in the day. Due to time potential overlap a session is not guaranteed to finish - the user may "jump" to sth else.

The function allows for timezone offset, as well as a parameter that can be used to determine the day of the week (e.g. weekday vs weekend behavior variation)

Model defaults
```
var defaults = {
  weekday_start_hour : [9,0.3], // normal 9am mean sigma 0.3
  weekday_end_hour : [18,0.3], // normal 6pm mean sigma 0.3
  weekend_start_hour : [10,0.4], // normal 10am mean sigma 0.4
  weekend_end_hour : [21,0.4], // normal 9pm mean sigma 0.4
  weekend_sessions : 8, // poisson lambda 8
  searches_in_session : 4, // bernoulli p=0.25 => mean tosses 1/p => 4
  search_interval : [30,5] // normal 30secs mean sigma 5 secs
}

```

Parameters:
```
/*
 *  @total approximate rate of searches per day
 *  @when  timestamp for which date should be used - leave null for now 
 *  @tz_offset  if human at east coast GMT-5 and server at west coast GMT-8 then tzoffset=3
 *  @opts overrides defaults hash above
 */
module.exports = function(total,when,tz_offset,opts) {
```

## Installation 

Installing the module

    npm install humanlike

