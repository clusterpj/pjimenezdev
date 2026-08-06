import { test } from "node:test";
import assert from "node:assert/strict";
import { md } from "./markdown.ts";

// The output of md() is injected with dangerouslySetInnerHTML, so these are the
// tests that matter: nothing an author writes may become markup we didn't mean.

test("HTML in the source is escaped, not rendered", () => {
  const out = md('<script>alert(1)</script> and <img src=x onerror=alert(1)>');
  assert.ok(!out.includes("<script"), "raw <script> survived");
  assert.ok(!out.includes("<img"), "raw <img> survived");
  assert.ok(out.includes("&lt;script&gt;"));
});

test("only http(s) and root-relative links become anchors", () => {
  const ok = md("[case study](/work/melow) and [site](https://pedrojimenez.dev/x)");
  assert.ok(ok.includes('href="/work/melow"'));
  assert.ok(ok.includes('href="https://pedrojimenez.dev/x"'));

  for (const bad of ["javascript:alert(1)", "data:text/html,<b>x", "vbscript:x"]) {
    const out = md(`[click](${bad})`);
    assert.ok(!out.includes("<a "), `${bad} became a link`);
    assert.ok(!out.includes("href="), `${bad} produced an href`);
  }
});

test("a quote in an href can't close the attribute", () => {
  // No whitespace, so the URL pattern happily swallows the quote — the escape
  // pass is what stops it becoming a real attribute.
  const out = md('[x](/a"onmouseover=alert(1))');
  assert.ok(!/href="[^"]*"\s*onmouseover/.test(out), "attribute injection through the href");
  assert.ok(out.includes("&quot;"), "the quote should survive as an entity");
});

test("headings, lists, bold, code and paragraphs render", () => {
  const out = md("## Heading\n\n- one\n- two\n\nSome **bold** and `code` text.");
  assert.match(out, /<h2[^>]*>Heading<\/h2>/);
  assert.equal((out.match(/<li/g) ?? []).length, 2);
  assert.ok(out.includes("<strong"));
  assert.ok(out.includes("<code"));
  assert.match(out, /<p[^>]*>Some /);
});

test("empty input produces empty output", () => {
  assert.equal(md(""), "");
  assert.equal(md("\n\n  \n\n"), "");
});
