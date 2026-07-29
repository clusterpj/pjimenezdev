// Data-integrity checks for the single source of truth in content.ts.
// Run: npm test   (node:test + type stripping — no test framework installed)
//
// These cover the failure class that actually shipped to production: content.ts
// drifting out of sync with the filesystem and the UI. A missing image renders a
// broken card silently, and a filter key nothing is tagged with renders an empty
// grid that looks like a bug.
import test from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { projects, langs, dict } from "./content.ts";

const FILTER_KEYS = ["AI", "Web", "Mobile", "SaaS", "Automation"];

test("every referenced image exists on disk", () => {
  for (const lang of langs) {
    for (const p of projects[lang]) {
      for (const src of [p.image, ...(p.gallery ?? [])]) {
        if (!src) continue;
        assert.ok(existsSync(`public${src}`), `${lang}/${p.id}: missing ${src}`);
      }
    }
  }
});

test("EN and ES expose the same projects in the same order", () => {
  assert.deepEqual(
    projects.en.map((p) => p.id),
    projects.es.map((p) => p.id),
    "a project exists in one language but not the other — /es/work/<slug> would 404",
  );
});

test("every project has a card image", () => {
  // A project without one renders a text-only card next to image cards.
  for (const p of projects.en) {
    assert.ok(p.image, `${p.id} has no image — its card and case-study hero render bare`);
  }
});

test("every filter key matches at least one project", () => {
  // WorkGrid derives its buttons from this, so a dead key no longer renders an
  // empty grid — but a key nothing uses still means a service with no proof.
  for (const key of FILTER_KEYS) {
    assert.ok(
      projects.en.some((p) => p.cats.includes(key)),
      `filter "${key}" matches no project — no proof of work for that service`,
    );
  }
});

test("every filter key has a label in both languages", () => {
  for (const lang of langs) {
    for (const key of FILTER_KEYS) {
      assert.ok(
        dict[lang].work.filters[key as keyof typeof dict.en.work.filters],
        `${lang} is missing the "${key}" filter label`,
      );
    }
  }
});
