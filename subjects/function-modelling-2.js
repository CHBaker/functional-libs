const { Either } = require("../libs/TYPES");
const { List } = require("immutable-ext");

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

// Endomorphism
const Endo = (run) => ({
  run,
  concat: (other) => Endo((x) => run(other.run(x))),
});
Endo.empty = () => Endo((x) => x);

const res = List([toUpper, exclaim]).foldMap(Endo, Endo.empty("")).run("hello");
console.log(res);

const Reducer = (run) => ({
  run,
  contramap: (f) => Reducer((acc, x) => run(acc, f(x))),
});

// contramap can access and modify args before they are executed in the function
// combines functions to call run() one time
// Reducer(login.contramap((pay) => pay.user))
//   .concat(Reducer(changePage).contramap((pay) => pay.currentPage))
//   .run(state, { user: {}, currentPage: {} });
