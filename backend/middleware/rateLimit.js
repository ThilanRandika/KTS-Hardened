const rateLimit = require("express-rate-limit");
const { ipKeyGenerator } = require("express-rate-limit");

// Env-tunable values
const WINDOW_MS = Number(process.env.RATE_WINDOW_MS || 15 * 60 * 1000); // 15m
const DEFAULT_MAX = Number(process.env.RATE_DEFAULT_MAX || 100);        // 100 req/IP/window
const SENSITIVE_MAX = Number(process.env.RATE_SENSITIVE_MAX || 20);     // 20 req/IP/window
const AUTHED_MAX = Number(process.env.RATE_AUTHED_MAX || 300);          // 300 req/user/window after auth
const CREATE_MAX = Number(process.env.RATE_CREATE_MAX || 20);           // 20 creates/window

// Generic per-IP limiter for normal routes
const defaultLimiter = rateLimit({
  windowMs: WINDOW_MS,
  max: DEFAULT_MAX,
  standardHeaders: true,   // adds RateLimit-* headers
  legacyHeaders: false,
  message: { error: "Too many requests. Try again later." },
});

// Stricter limiter for abuse-prone endpoints
const sensitiveLimiter = rateLimit({
  windowMs: WINDOW_MS,
  max: SENSITIVE_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many attempts. Try again later." },
});


// Key by user when available (e.g., after `protect`), else fall back to IP.
const keyByUserOrIp = (req) =>
  req.user?.id ? `u:${req.user.id}` : `ip:${ipKeyGenerator(req.ip)}`;

// Stricter limiter for creation endpoints
const createAccountLimiter = rateLimit({
  windowMs: WINDOW_MS,
  max: CREATE_MAX,
  keyGenerator: keyByUserOrIp,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many create requests. Please try again later." },
});


module.exports = {
  defaultLimiter,
  sensitiveLimiter,
  createAccountLimiter,
};
