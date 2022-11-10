const { Either } = require("../libs/TYPES");
const { Endo } = require("./function-modelling-2");

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

const Reducer = (run) => ({
  run,
  contramap: (f) => Reducer((acc, x) => run(acc, f(x))),
  concat: (other) => Reducer((acc, x) => other.run(run(acc, x), x)),
});

const checkCreds = (email, pass) => email === "admin" && pass === 123;

const login = (payload) =>
  Endo((state) =>
    payload.email
      ? Object.assign({}, state, {
          loggedIn: checkCreds(payload.email, payload.pass),
        })
      : state
  );

const setPrefs = (payload) =>
  Endo((state) =>
    payload.prefs ? Object.assign({}, state, { prefs: payload.prefs }) : state
  );

const reducer = Fn(login).concat(Fn(setPrefs));

const state = { loggedIn: false, prefs: {} };
const payload = { email: "admin", pass: 123, prefs: { bgColor: "#000" } };
console.log(reducer.run(payload).run(state));
