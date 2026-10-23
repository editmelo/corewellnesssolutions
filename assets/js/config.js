/*
  Core Wellness Solutions: site settings.
  Every integration (Square, Google, forms) is wired from this one file.
  Leave a value as "" until the account exists; the site hides or softens
  anything that isn't connected yet instead of showing a broken link.
*/
window.CWS_CONFIG = {
  business: {
    name: "Core Wellness Solutions",
    owner: "Tavia",
    founder: "Quatavia \"Tavia\" Love",
    phone: "(317) 665-3554",
    email: "tavia.corewellnesssolutions@gmail.com",   // TODO: swap for the new Square business email (also hard-coded in the HTML footers and JSON-LD)
    instagram: "https://www.instagram.com/corewellness.llc/",
    city: "Avon",
    state: "IN",
    serviceArea: ["Avon", "Plainfield", "Brownsburg", "Danville", "Speedway", "West Indianapolis"]
  },

  // Square Appointments + Square payment links
  square: {
    // The public booking page from Square Appointments > Online Booking > Booking site
    bookingUrl: "",
    // Optional: per-service booking links (fall back to bookingUrl)
    services: {
      consult: "",        // Free 15-minute consult
      assessment: "",     // Priority Training Assessment (free, 30 min)
      pass: "",           // Priority Stretch Pass (free, 20 min)
      training: "",       // Personal Training Session
      stretch: "",        // Assisted Stretch Session
      corrective: "",     // Corrective Exercise Session
      youth: "",          // Youth or Adaptive Session
      community: ""       // Organization walkthrough
    },
    // Square Online Checkout payment links for packages / invoices
    payments: {
      packages: "",       // e.g. 4-session package
      invoice: ""         // Square invoice portal for community partners
    }
  },

  // Non-health form endpoints (Formspree, Basin, Square Online forms, etc.)
  forms: {
    proposal: "",         // Community / workplace proposal requests
    seat: ""              // Event "save a seat" requests
  },

  // Health intake + waiver. These collect protected health information.
  // Use ONLY a provider that will sign a Business Associate Agreement (BAA),
  // e.g. IntakeQ, Jotform HIPAA, Hushmail Forms, or SimplePractice.
  intake: {
    embedUrl: "",                     // Preferred: provider's embeddable form URL (shown in an iframe)
    endpoint: "",                     // Or: a BAA-covered POST endpoint for the built-in form
    endpointIsHipaaCompliant: false   // Must be true or the built-in form will not send
  },

  google: {
    mapsQuery: "Avon, Indiana",       // Replace with the exact Google Business Profile name + city
    profileUrl: "",                   // Link to the Google Business Profile
    writeReviewUrl: "",               // "Get more reviews" link from the profile dashboard
    rating: null,                     // e.g. 5.0
    reviewCount: null,                // e.g. 12
    // Paste real Google reviews here (with the reviewer's permission), or swap
    // this section for a reviews widget such as Elfsight or Trustindex.
    reviews: []
    // { name: "First L.", rating: 5, text: "...", when: "March 2026" }
  },

  // Downloadable PDFs (/forms + Communities section).
  // ready: false shows the form as "coming soon" and does not link it.
  // To publish a draft: put the final PDF in assets/forms/ (same file name), add a
  // page-1 thumbnail in assets/forms/thumbs/, then set ready: true.
  documents: [
    { id: "intake", group: "first-visit", step: 1, ready: true,
      title: "Client Intake & Assessment", file: "assets/forms/cws-client-intake-assessment.pdf", thumb: "assets/forms/thumbs/cws-client-intake-assessment.jpg", pages: 3,
      who: "Every new client", desc: "Contact and emergency details, a health screening, your goals and how you like to train. Your answers shape a safe plan around you.",
      online: "/intake" },
    { id: "waiver", group: "first-visit", step: 2, ready: false,
      title: "Liability Waiver, Release & Assumption of Risk", file: "assets/forms/cws-liability-waiver.pdf", thumb: "assets/forms/thumbs/cws-liability-waiver.jpg", pages: 2,
      who: "Every client", desc: "Required before any training or assisted stretch session, wherever it happens." },
    { id: "agreement", group: "first-visit", step: 3, ready: false,
      title: "Client Service Agreement", file: "assets/forms/cws-client-service-agreement.pdf", thumb: "assets/forms/thumbs/cws-client-service-agreement.jpg", pages: 2,
      who: "Private studio packages", desc: "Your package, price, scheduling and the 24-hour cancellation policy." },
    { id: "minor-waiver", group: "minors", step: 1, ready: false,
      title: "Minor Waiver", file: "assets/forms/cws-minor-waiver.pdf", thumb: "assets/forms/thumbs/cws-minor-waiver.jpg", pages: 2,
      who: "Clients under 18", desc: "Signed by a parent or legal guardian before a youth or adaptive session." },
    { id: "parent-consent", group: "minors", step: 2, ready: false,
      title: "Parent Consent Form", file: "assets/forms/cws-parent-consent.pdf", thumb: "assets/forms/thumbs/cws-parent-consent.jpg", pages: 1,
      who: "Clients under 18", desc: "Permission for hands-on assisted stretch, plus emergency contacts and anything we should know about your child." },
    { id: "media", group: "optional", ready: false,
      title: "Photo, Video & Testimonial Release", file: "assets/forms/cws-media-release.pdf", thumb: "assets/forms/thumbs/cws-media-release.jpg", pages: 2,
      who: "Optional", desc: "Choose exactly what Core Wellness may share, from photos to testimonials. Change your mind any time." },
    { id: "one-sheet", group: "partners", ready: true,
      title: "Services One-Sheet", file: "assets/forms/cws-services-one-sheet.pdf", thumb: "assets/forms/thumbs/cws-services-one-sheet.jpg", pages: 1,
      who: "Anyone", desc: "Who Core Wellness works with, what a session looks like, and how to get started." },
    { id: "proposal", group: "partners", ready: true,
      title: "Senior Living Partnership Proposal", file: "assets/forms/cws-senior-living-proposal.pdf", thumb: "assets/forms/thumbs/cws-senior-living-proposal.jpg", pages: 1,
      who: "Directors & administrators", desc: "Services, the pilot program and monthly program pricing for senior living communities." }
  ],

  // Event board (index teaser + clipboard page). Remove `sample: true` on real events.
  events: [
    { id: "ev1", sample: true, date: "2026-11-06T10:00", title: "Chair mobility class", place: "Community room, Avon", seats: 14, note: "Seated, all levels. Water bottle recommended." },
    { id: "ev2", sample: true, date: "2026-11-12T13:30", title: "Fall prevention screening day", place: "Senior living partner, Plainfield", seats: 10, note: "Ten-minute individual balance screens." },
    { id: "ev3", sample: true, date: "2026-11-18T09:00", title: "Corporate Stretch Pop-Up", place: "On-site, Hendricks County", seats: 25, note: "Ten-minute express stretches, done in work clothes." },
    { id: "ev4", sample: true, date: "2026-12-05T10:00", title: "Adaptive stretch open session", place: "Avon", seats: 8, note: "For kids and young adults with disabilities. Caregivers welcome." }
  ]
};
