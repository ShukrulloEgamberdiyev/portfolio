# FAZO Digital — Website Strategy

## 1. Positioning analysis
- **The problem to solve:** In Tashkent, "SMM agency" is a crowded, price-driven category. A $2,500+ engagement is impossible to justify inside that category, so the site must move FAZO into a different one: *growth system operator* — accountable for the chain from attention to revenue, not for posts or ad spend.
- **The proof of difference:** FAZO works *past* the lead (sales scripts, CRM, analytics). Almost no local competitor does. That becomes the spine of the site: a nine-stage system that ends in SALES → CRM → ANALYTICS → SCALE.
- **Tone:** calm, specific, unhyped. No guarantees, no invented numbers. The only hard figure used in a case is one that is verified (Fazilat Estate: 1–3 days average sale time).
- **Price framing:** the price appears three times, each time framed as a threshold, never a promotion — hero qualifier, Engagement block (with "who it's for / not for"), and budget question in the application (no option below $2,500).
- **Signature line:** "NATIJAGA ISHLAYMIZ. SIZ O‘SASIZ." is kept as the brand signature (always in Uzbek) rather than the hero concept.

## 2. Information architecture — changes to the brief
1. **"Home" removed from the nav** — the logo is home; five items + CTA reads more premium.
2. **"About" anchors to Why FAZO** on the homepage (philosophy) until a full About page exists.
3. **Insights teaser added** (3 articles) — the nav promised Insights; thought leadership also justifies price. Article titles are topics to be written.
4. **Application before Final CTA.** The final section serves people who won't fill a form: direct Telegram / phone, not a second form.
5. **Expertise modules cross-reference the system** ("In the system: STRATEGY · OFFER") so services never read as a menu.

## 3. Sitemap
```
/                      Home (UZ, default)
/ru/  /en/             Language roots (hreflang)
/expertise             Overview + 4 capability pages
  /expertise/growth-strategy · /creative-content · /performance-marketing · /sales-system
/work                  All projects (filter by industry)
  /work/[slug]         Case study: challenge → system → result → media
/process               5 phases in depth + what the first 90 days look like
/about                 Team, philosophy, how FAZO works
/insights              Articles
  /insights/[slug]
/apply                 Standalone application (for ads / DMs)
/privacy               Privacy policy
```

## 4. Homepage hierarchy
1. Hero — thesis + CTA + price qualifier
2. Authority strip — 200+ / 50+ / 19+ / Full-funnel
3. Client marquee
4. Problem — the six gaps
5. FAZO Growth System — 9-stage scroll pipeline (signature)
6. Expertise — 4 capabilities mapped to the system
7. Selected Work — 6 cases, challenge → system → result
8. Why FAZO — fragmented vs. integrated model
9. Process — 5 phases
10. Insights — 3 articles
11. Engagement — from $2,500/month, fit / not fit
12. Application — 5-step qualification
13. Final CTA — "Growth is not an accident. It's a system." + direct contacts
14. Footer

## 5. Hero headline directions
| # | Direction | UZ | EN |
|---|-----------|----|----|
| A ✅ | **The System** | E’TIBORNI / DAROMADGA / AYLANTIRUVCHI / TIZIM. | THE SYSTEM / THAT TURNS / ATTENTION / INTO REVENUE. |
| B | **The Measure** | REKLAMA — BOSHLANISH. / SOTUV — O‘LCHOV. | ADS ARE THE START. / REVENUE IS THE MEASURE. |
| C | **The Refusal** | BIZ REKLAMA SOTMAYMIZ. / O‘SISH QURAMIZ. | WE DON’T SELL ADS. / WE ENGINEER GROWTH. |

**Selected: A.** It names the category shift ("system", not "service") and the outcome ("revenue") in the first viewport. B is the sharpest line but assumes the visitor already knows what FAZO does. C defines FAZO by negation, which reads defensive at a premium price. B's idea closes the page instead: "O‘sish — tasodif emas. Bu tizim."

## 6. Visual design system
- **Colour:** Ink #050505 · Surface #0B0B0D / #111114 · Bone #F5F5F5 · Mist #A1A1AA · Ash #6B6B74 · hairlines at 9% / 18% bone. Accent violet #7A6BFF + cobalt #2F45FF used **only as light** (blurred glows, a 1px progress line, full stops, active markers).
- **Type:** Onest (neo-grotesk with full Latin + Cyrillic, so UZ/RU/EN share one voice) for display and body; JetBrains Mono for labels, numbers and system vocabulary. Display is set uppercase, 700, tracking −0.05em, line-height 0.9. Outline lines (1.2–1.6px stroke) carry the setup and solid lines carry the payoff. Every key headline ends with a violet full stop.
- **Shape:** square corners everywhere — no rounded cards. Surfaces are separated by hairline rules and grids, not shadows.
- **Layout:** 12-column editorial grid, sticky left headlines with a scrolling right column, generous vertical rhythm (96px mobile / 160px desktop).
- **Imagery:** case media slots accept a muted loop video or poster (greyscale → colour on hover). Until the media is ready, a typographic placeholder is shown.

## 7. Motion system
- **Easing:** cubic-bezier(.22,1,.36,1) for reveals; (.76,0,.24,1) for curtains.
- **Load:** a 1.1s wordmark curtain, then hero lines rise from masks in a staggered sequence (90ms).
- **Scroll:** Lenis smooth scroll; masked headline reveals; the 9-stage horizontal pipeline is pinned and driven by scroll (desktop) or a vertical line fill (mobile); Process numbers go from outline to solid when active; Why FAZO fragments drift apart while the pillars converge.
- **Micro-interactions:** magnetic CTAs, arrow swap, fill-wipe hover, pointer-tracked light on Expertise modules, marquee pauses on hover, case stories cycle challenge → system → result (on hover for desktop, in view for touch).
- **Ambient:** two blurred light sources drift over 22–28s cycles, with scroll parallax and film grain at 5%.
- **Restraint:** transforms and opacity only (GPU-composited). `prefers-reduced-motion` disables smooth scroll, the loader, parallax and cycling.
