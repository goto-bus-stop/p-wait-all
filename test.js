var test = require('tape')
var delay = require('delay')
var waitAll = require('./')

test('checks argument type', function (t) {
  t.plan(3)
  waitAll(null).catch(function (err) {
    t.ok(err)
  })
  waitAll('abc').catch(function (err) {
    t.ok(err)
  })
  waitAll({ whatever: 'lol' }).catch(function (err) {
    t.ok(err)
  })
})

test('collects resolution values like Promise.all', function (t) {
  waitAll([
    Promise.resolve(1),
    Promise.resolve(2),
    Promise.resolve(3)
  ]).then(function (values) {
    t.equal(values.shift(), 1)
    t.equal(values.shift(), 2)
    t.equal(values.shift(), 3)
    t.end()
  })
})

test('rejects if any promises reject', function (t) {
  waitAll([
    Promise.resolve(1),
    Promise.reject(2),
    Promise.resolve(3)
  ]).then(function (values) {
    t.fail()
  }, function (err) {
    t.equal(err, 2)
    t.end()
  })
})

test('waits for promises to settle before rejecting', function (t) {
  var didSettle = false
  waitAll([
    Promise.resolve(1),
    Promise.reject(2),
    delay(50).then(function () { didSettle = true })
  ]).then(function (values) {
    t.fail()
  }, function (err) {
    t.equal(err, 2)
    t.ok(didSettle)
    t.end()
  })
})

test('resolves if there are no promises', function (t) {
  waitAll([]).then(function () {
    t.pass('should resolve if there are no promises')
    t.end()
  })
})
