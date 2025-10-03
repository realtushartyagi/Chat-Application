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


/* =========================
   Async Utilities
   - cancellable task using AbortController
   - withTimeout
   - retry with jitter
   ========================= */

export const withTimeout = (promise, ms, msg = 'Operation timed out') => {
  const t = new Promise((_, rej) => setTimeout(() => rej(new AppError(msg, { code: 'TIMEOUT' })), ms));
  return Promise.race([promise, t]);
};

export const cancellable = (fn) => {
  // fn must accept an AbortSignal as first param, like (signal, ...args) => Promise
  const controller = new AbortController();
  const p = fn(controller.signal);
  return { promise: p, cancel: (reason) => controller.abort(reason) };
};

export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export async function retry(fn, { attempts = 3, delay = 200, backoff = 2, jitter = true } = {}) {
  let attempt = 0;
  let d = delay;
  while (true) {
    try { return await fn(); }
    catch (err) {
      attempt++;
      if (attempt >= attempts) throw err;
      const jitterMs = jitter ? Math.floor(Math.random() * d * 0.25) : 0;
      const wait = d + jitterMs;
      logger.debug(`retry attempt ${attempt} failed. waiting ${wait}ms before next try`);
      await sleep(wait);
      d *= backoff;
    }
  }
}
