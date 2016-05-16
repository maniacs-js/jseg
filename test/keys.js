let assert = require('assert');
let jseg = require('../src');
let {TestGraph} = require('./util');

let [b, t] = jseg.newSchema();

b.entity('Thing');

b.finalize({

  attributes: {
    Thing: {
      key: t.Key,
    },
  },

  relationships: [],

});

let tg = new TestGraph(t);

tg.g.put({
  type: t.Thing,
  lid: 'p',
  key: 'one',
});

tg.g.put({
  type: t.Thing,
  lid: 'q',
  key: 'two',
});

tg.expectMessage('expected non-empty string', () => {
  tg.g.put({
    type: t.Thing,
    lid: 'r',
    key: 3,
  });
});
tg.showLookup(t.Thing, 'key', '3');
tg.checkLookup(t.Thing, 'key', '3', null);

tg.checkLookup(t.Thing, 'key', 'one', {
  type: t.Thing,
  lid: 'p',
  key: 'one',
});

tg.checkLookup('Thing', 'key', 'two', {
  type: t.Thing,
  lid: 'q',
  key: 'two',
});

tg.g.put({lid: 'p', key: null});
tg.g.put({lid: 'q'});

tg.checkLookup(t.Thing, 'key', 'one', null);

tg.checkLookup(t.Thing, 'key', 'two', {
  type: t.Thing,
  lid: 'q',
  key: 'two',
});

tg.g.put({lid: 'q', key: 'four'});

tg.checkLookup(t.Thing, 'key', 'two', null);

tg.checkLookup(t.Thing, 'key', 'four', {
  type: t.Thing,
  lid: 'q',
  key: 'four',
});

//XXX check destroy