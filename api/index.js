// /api/index.js — Vercel Serverless Function entry point
// Vercel auto-discovers files in /api/ and deploys them as serverless functions.
// This file re-exports the Express app from server/src/server.js.

module.exports = require('../server/src/server.js');
