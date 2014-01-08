var human = require('../')
var test = require('tape');

function Today() { return new Date((new Date()).getFullYear(), (new Date()).getMonth(), (new Date()).getDate()) }

test('test that we get the right # of searches', function (t) {

  var n=1000
  var result

  // test weekday
  var searches = 50 // need small number - > 100 at least 10% loss due to overlaps
  for (i=0, result = 0 ;i<n;i++) result += (human(searches,new Date(2014,0,1))).length
  result /= n
  t.ok(result > 0.9* searches && result < 1.1 * searches, 'test weekday')

  // test weekend
  var searches = 50
  var weekend_expected = 8*4
  for (i=0, result = 0 ;i<n;i++) result += (human(searches,new Date(2014,0,4))).length
  result /= n
  t.ok(result > 0.9* weekend_expected && result < 1.1 * weekend_expected,'test weekend')

  // test start time
  searches = 500 // need high number to push the first towards the start
  for (i=0, result = 0 ;i<n;i++) result += human(searches,new Date(2014,0,1),0)[0]
  result /= n
  var start = 9 * 3600
  t.ok(result > 0.9* start && result < 1.1 * start, 'test start time')

  //test timezone
  searches = 500 // need high number to push the first towards the start
  for (i=0, result = 0 ;i<n;i++) result += human(searches,new Date(2014,0,1),3)[0]
  result /= n
  var start = 6 * 3600
  t.ok(result > 0.9* start && result < 1.1 * start, 'test timezone')

  t.end()
});

