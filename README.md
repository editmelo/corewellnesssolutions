# Core Wellness Solutions website

A static site with no build step, deployed on Vercel from this repo.

Preview locally: `npx serve .` from this folder, then open the address it prints. Use `serve` rather than `python3 -m http.server`, because only `serve` handles clean URLs.

**Clean URLs:** pages are served without `.html` (`/forms`, `/clipboard`, `/intake`, `/privacy`), set by `cleanUrls` in `vercel.json`. Old `.html` links redirect automatically. Always link pages as `/name` (and `/#section` for the home page).

## Pages
- `index.html`: Rx-pad path chooser (communities vs. individuals), community programs and proposal form, private sessions, Rx card gallery, clipboard teaser, Square booking, Google reviews and map, FAQ
- `clipboard.html`: Digital clipboard. Event board, "save a seat," day-of sign-in (first names only, stays on the device, CSV export), and live session mode (big-print cards, timer, full screen for TV, keyboard controls)
- `intake.html`: online version of Tavia's Client Intake & Assessment, matching the paper form (noindex)
- `forms.html`: printable client forms and partner handouts, built from `documents` in `config.js`
- `privacy.html`: privacy and HIPAA notice (draft)

## Go-live checklist (everything lives in `assets/js/config.js`)
1. **Contact**: `business.phone`, `business.email`
2. **Square**: `square.bookingUrl` (Square Appointments > Online booking > booking site URL), plus optional per-service links and payment links. On desktop the scheduler is embedded; on phones it opens in a new tab.
3. **Forms**: `forms.proposal` and `forms.seat` take any POST endpoint (e.g. Formspree). These are non-health forms only.
4. **Intake (HIPAA)**: use a provider that signs a BAA (IntakeQ, Jotform HIPAA, Hushmail, SimplePractice). Either paste its embed URL into `intake.embedUrl` (recommended), or set `intake.endpoint` and `endpointIsHipaaCompliant: true`. Until then the built-in form refuses to send.
5. **Google**: `google.mapsQuery` (the exact Business Profile name), `profileUrl`, `writeReviewUrl`, rating/count, and real reviews (or swap in a widget such as Elfsight or Trustindex).
6. **Events**: replace the sample events and delete `sample: true`.
7. **Domain**: replace `www.corewellnesssolutions.com` in the canonical tags, JSON-LD, `robots.txt` and `sitemap.xml`.
8. **Content review for Tavia**: Rx cards ST-01, ST-03, ST-04, BR-02, BA-01, BA-02, SR-01, SR-02, AF-02 and AF-03 are drafts (`assets/js/rx-data.js`). The waiver and privacy text need attorney review.

## Local SEO in place
LocalBusiness JSON-LD (areaServed for Hendricks County cities), geo meta tags, descriptive titles and meta descriptions, a sitemap, and the service-area list. After launch: claim and verify the Google Business Profile, keep NAP (name, address, phone) identical everywhere, and add the site URL to the profile.

## Photos (stock placeholders until Tavia's content day)
Free Unsplash photos (Unsplash License, commercial use allowed), chosen to show a range of ages, races, body types and abilities:
- `slides/slide-welcome`: https://unsplash.com/photos/Ri9fa7m6wc8 (Eric Oliveira), also used in `og-image.jpg`
- `slides/slide-organizations`, `cards/senior-living`: https://unsplash.com/photos/kB4FXX1KXhQ (Centre for Ageing Better)
- `slides/slide-training`, `cards/gym`: https://unsplash.com/photos/R0y_bEUjiOM (Jonathan Borba)
- `slides/slide-youth`, `cards/adaptive`: https://unsplash.com/photos/h-1ODGL1DXs (nader saremi)
- `cards/corporate`: https://unsplash.com/photos/J1L6AEZbZBE (Olek Buzunov)
- `cards/responders`: https://unsplash.com/photos/q40XEHz-MLs (Matt C)
- `cards/youth`: https://unsplash.com/photos/jM0sC7ttmRE (April Walker)
- `cards/in-home`: https://unsplash.com/photos/AQOwYlKAGrg (Marc Pell)
- `cards/virtual`: https://unsplash.com/photos/02_PUCjs7pw (Vitaly Gariev)

To swap in real photos, keep the same file names and sizes (slides about 1800px wide plus 900px `-sm` copies; cards 800x600) and update the `alt` text in `index.html`. Tavia's portrait goes in the Meet Tavia section: replace the `.photo-slot` block with an `<img>` (portrait, about 900x1125).

## Client forms (`assets/forms/`)
Live now: Client Intake & Assessment, Services One-Sheet, Senior Living Proposal (its pricing also appears in the Communities section).

Not published yet: Liability Waiver, Client Service Agreement and Media Release (they carry a "DRAFT · FOR ATTORNEY REVIEW" stamp), plus the Minor Waiver and Parent Consent Form (no PDFs yet). They show as "Coming soon" on the forms page, and their PDFs are deliberately **not** in the site folder. To publish one:
1. Save the attorney-approved PDF under the file name set in `config.js` (e.g. `assets/forms/cws-liability-waiver.pdf`, `cws-minor-waiver.pdf`, `cws-parent-consent.pdf`).
2. Add a page-1 thumbnail at `assets/forms/thumbs/<same name>.jpg` (about 420px wide).
3. Set `ready: true` for that document in `config.js`.

Kept off the site on purpose: Mutual NDA, Service Trade Agreement, Brand Guide, Pitch Deck.

## Brand Guide compliance (CWS Brand Guide v1.0)
- **Colors:** set as tokens at the top of `assets/css/styles.css`. Charcoal for text, Deep Teal for headings, buttons and dark bands, Green for markers and label bars, Lime for highlights only, Teal as an accent, and white/Mist backgrounds. The signature gradient (Lime → Green → Teal) runs on the top bar, the Rx section edge and the slideshow progress.
- **Type:** Lora for titles, Poppins Light for body text, and Poppins Semibold spaced caps for section labels.
- **Logo:** full color on white, top-left with the gradient bar, never under 120px wide.
- **Copy:** uses the primary tagline, the audience lines (Senior Living, 1:1), the standard contact details, "Core Wellness Solutions LLC" in footers, and the guide's service names.
- **Two intentional exceptions:**
  1. Body links and small labels use Deep Teal instead of Teal or Green, because #4A9BB0 and #5FA36F are too light to read as text on white (they fail WCAG AA contrast). Green and Teal are still used for bars, dots and icons.
  2. The Rx cards keep the colors of Tavia's printed Rx cards (gold, slate, clay), so they match what clients hold in their hands.

## Connecting Tavia's domain (bought through Square)
The site stays on Vercel; the domain stays registered at Square. Don't change nameservers, because that would take her Square business email offline.
1. In Vercel: Project > Settings > Domains > add `yourdomain.com` and `www.yourdomain.com`. Vercel shows the exact DNS values to use.
2. In Square (Tavia's account, or a team login with domain access): Channels > Domains > Manage > Manage domain > DNS Records. Point the root `@` **A** record and the `www` **CNAME** to the values Vercel shows. Leave the MX and TXT records alone, because those run her email.
3. Wait for DNS (Square says 24 to 48 hours), then confirm both show "Valid" in Vercel.
4. Find and replace `corewellnesssolutions.revieweditmelo.com` with the new domain across the repo (canonical tags, `og:` tags, JSON-LD, `sitemap.xml`, `robots.txt`), then push.
5. The `X-Robots-Tag: noindex` header in `vercel.json` only applies to the `*.revieweditmelo.com` review address, so the real domain will be indexed normally.

## Draft 2 still waiting on Tavia
- New business email: swap it into `config.js`, the footer `mailto:` links, the booking panel and the JSON-LD.
- The domain name, then the steps above.
- Her fuller bio from the notes doc. The Meet Tavia section uses a draft built from her one-sheet and brand guide.
- Private session and package pricing; real photos and her portrait; client testimonials (`google.reviews` in `config.js`); her first 10 Rx cards (`assets/js/rx-data.js`).
- Minor Waiver and Parent Consent PDFs (attorney-reviewed).
