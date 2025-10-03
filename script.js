/* =========================
   Monads: Maybe & Result (Either)
   ========================= */
export class Maybe {
  constructor(value) { this._ = value; }
  static of(v) { return new Maybe(v); }
  isNothing() { return this._ === null || this._ === undefined; }
  map(fn) { return this.isNothing() ? this : Maybe.of(fn(this._)); }
  chain(fn) { return this.isNothing() ? this : fn(this._); }
  getOr(defaultValue) { return this.isNothing() ? defaultValue : this._; }
  orElse(fn) { return this.isNothing() ? fn() : this._; }
}

export class Result {
  constructor(ok, value) { this.ok = ok; this.value = value; }
  static Ok(v) { return new Result(true, v); }
  static Err(e) { return new Result(false, e); }
  map(fn) { return this.ok ? Result.Ok(fn(this.value)) : this; }
  mapErr(fn) { return this.ok ? this : Result.Err(fn(this.value)); }
  unwrapOr(defaultVal) { return this.ok ? this.value : defaultVal; }
}
