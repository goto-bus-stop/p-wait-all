# p-wait-all

`Promise.all`, but it waits for all promises to settle even if one of them rejected.

## Installation

With npm:

```bash
npm install --save p-wait-all
```

## Usage

```js
var waitAll = require('p-wait-all')

var settled = false
var result = waitAll([
  Promise.reject(new Error('operation failed')),
  delay(200).then(function () { settled = true })
])

result.catch(function (err) {
  // rejected after 200ms;
  // settled === true
})
```

Compare doing this with `Promise.all`:

```js
var settled = false
var result = Promise.all([
  Promise.reject(new Error('operation failed')),
  delay(200).then(function () { settled = true })
])

result.catch(function (err) {
  // rejected immediately;
  // settled === false
})
```

This behaviour is useful if you are doing two async operations that may fail individually, so that both operations need to be rolled back.

For example, saving two related mongoose models, where one may fail (eg. from duplicate key errors):

```js
waitAll([
  model1.save(),
  relatedModel.save()
]).catch(function (err) {
  var p = []
  if (!model1.isNew) p.push(model1.remove())
  if (!relatedModel.isNew) p.push(relatedModel.remove())
  return Promise.all(p)
})
```

You cannot remove a model if it is still in the process of being saved, so you have to wait for all the `save()` promises to resolve before attempting to roll them back.

## API

### result = require('p-wait-all')(promises)

Wait for `promises` to settle. If any of them errored, reject the `result` promise with the error. If all of them resolved, resolve `result` with an array of resolution values, in order.

## License

[MIT](./LICENSE)
