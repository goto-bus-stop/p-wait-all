module.exports = function waitAll (promises) {
  return new Promise(function (resolve, reject) {
    var ready = 0
    var err = null
    var results = []

    for (var i = 0; i < promises.length; i++) (function (p, i) {
      p.then(function (result) {
        results[i] = result
        ready++
        checkDone()
      }, function (_err) {
        if (!err) err = _err
        ready++
        checkDone()
      })
    }(promises[i], i))

    function checkDone () {
      if (ready === promises.length) {
        if (err) reject(err)
        else resolve(results)
      }
    }
  })
}
