# Core Wellness Solutions website

A static site with no build step. Upload the `site/` folder to any host (Netlify, Vercel, Cloudflare Pages, GoDaddy, etc.).

Preview locally: `cd site && python3 -m http.server 8765`, then open http://localhost:8765

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

## Slideshow photos (placeholders)
`assets/img/slides/slide-1/2/3.jpg` (plus `-sm` versions for phones) are free Unsplash photos by Centre for Ageing Better (Unsplash License, commercial use allowed):
- slide-1: https://unsplash.com/photos/XDH1y3RTYyI
- slide-2: https://unsplash.com/photos/kB4FXX1KXhQ
- slide-3: https://unsplash.com/photos/oFQHh4jBREc (mirrored in CSS with `.flip-x`)

Replace them with real photos of Tavia's sessions when available: same filenames, landscape, about 1800px wide for the large file and 900px for `-sm`. Update the `alt` text in `index.html`, and remove `flip-x` from slide 3.

## Client forms (`assets/forms/`)
Live now: Client Intake & Assessment, Services One-Sheet, Senior Living Proposal (its pricing also appears in the Communities section).

Not published yet (they carry a "DRAFT · FOR ATTORNEY REVIEW" stamp): Liability Waiver, Client Service Agreement, Media Release. They show as "Coming soon" on the forms page, and their PDFs are deliberately **not** in the site folder. To publish one:
1. Save the attorney-approved PDF as `assets/forms/cws-liability-waiver.pdf` (or `cws-client-service-agreement.pdf` / `cws-media-release.pdf`).
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
