-- D1 schema for the growth engine (leads + content pipeline).
-- Apply: npx wrangler d1 execute pjimenezdev --remote --file=schema.sql
-- Local:  npx wrangler d1 execute pjimenezdev --local  --file=schema.sql

CREATE TABLE IF NOT EXISTS leads (
  id            TEXT PRIMARY KEY,
  email         TEXT NOT NULL,
  name          TEXT,
  lang          TEXT NOT NULL DEFAULT 'en',
  source        TEXT NOT NULL DEFAULT 'concierge',
  headline      TEXT,
  summary       TEXT,                              -- JSON from the scoping LLM
  transcript    TEXT NOT NULL,                     -- raw conversation, survives an LLM outage
  status        TEXT NOT NULL DEFAULT 'new',       -- new | nudged | replied | cold
  followups     INTEGER NOT NULL DEFAULT 0,
  created_at    TEXT NOT NULL,
  last_touch_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS leads_by_status ON leads(status, last_touch_at);

CREATE TABLE IF NOT EXISTS posts (
  id           TEXT PRIMARY KEY,
  slug         TEXT UNIQUE,
  title        TEXT NOT NULL,
  body         TEXT NOT NULL,                      -- markdown, rendered at /notes/{slug}
  social       TEXT NOT NULL,                      -- JSON: { platform: "post text" }
  link         TEXT NOT NULL,                      -- URL the social posts point at
  status       TEXT NOT NULL DEFAULT 'draft',      -- draft | approved | published | rejected
  created_at   TEXT NOT NULL,
  published_at TEXT
);
CREATE INDEX IF NOT EXISTS posts_by_status ON posts(status);
