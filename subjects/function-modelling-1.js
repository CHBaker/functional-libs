const { Either } = require("../libs/TYPES");

const toUpper = (x) => x.toUpperCase();
const exclaim = (x) => x.concat("!");

const Fn = (run) => ({
  run,
  chain: (f) => Fn((x) => f(run(x)).run(x)),
  map: (f) => Fn((x) => f(run(x))),
  concat: (other) => Fn((x) => run(x).concat(other.run(x))),
});

Fn.ask = Fn((x) => x);

Fn.of = (x) => Fn(() => x);

const res = Fn.of("hello")
  .map(toUpper)
  .chain((upper) => Fn.ask.map((config) => [upper, config]));

// a reader monoid that handles dependency injection
console.log(
  res.run({ port: 3000, db: { conncted: true }, strategy: {}, state: {} })
);
