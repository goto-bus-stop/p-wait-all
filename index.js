module.exports = function waitAll (promises) {
  if (!Array.isArray(promises)) {
    // kinda just want to throw here, but Promise.all also rejects
    // if the type is incorrect so I'll just follow along
    return Promise.reject(new TypeError('p-wait-all: promises must be array'))
  }

  return new Promise(function (resolve, reject) {
    var ready = 0
    var err = null
    var results = []

    checkDone() // if we got an empty array

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
