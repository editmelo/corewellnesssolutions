/*
  Rx card library, modeled on Tavia's printed cards.
  ST-02, BR-01 and AF-01 are verbatim from her cards; the rest are drafts for her review.
  secs = timer length used by the Digital Clipboard's live session mode.
*/
window.RX_TYPES = {
  stretch:     { label: "Stretch Rx",     code: "ST" },
  breath:      { label: "Breath Rx",      code: "BR" },
  balance:     { label: "Balance Rx",     code: "BA" },
  strength:    { label: "Strength Rx",    code: "SR" },
  affirmation: { label: "Affirmation Rx", code: "AF" }
};

window.RX_CARDS = [
  {
    id: "ST-01", type: "stretch", chair: true, secs: 40,
    title: "Neck Release Rx", for: "Stiff Neck · Screen Time", dose: "20 sec / side",
    indication: "Long hours looking down shorten the side of the neck. A slow release gives the shoulders permission to drop.",
    steps: ["Sit tall, feet flat, hands resting on thighs.", "Let your right ear drift toward your right shoulder.", "Breathe slowly. Hold 20 seconds, then switch sides."],
    caution: "Stay in a pain-free range. No bouncing."
  },
  {
    id: "ST-02", type: "stretch", chair: false, secs: 60,
    title: "Hip Flexor Release Rx", for: "Tight Hips From Sitting", dose: "30 sec / side",
    indication: "Sitting keeps the front of the hip short. Short hip flexors pull the low back into strain.",
    steps: ["Stand beside a counter and hold on with one hand.", "Step one foot back and tuck your tailbone slightly.", "Feel the stretch in the front of the back hip. Hold 30 seconds, switch."],
    caution: "Keep the front knee over the ankle."
  },
  {
    id: "ST-03", type: "stretch", chair: true, secs: 60,
    title: "Seated Hamstring Rx", for: "Tight Back of Legs", dose: "30 sec / leg",
    indication: "Tight hamstrings make bending, reaching and putting on shoes harder than they should be.",
    steps: ["Sit near the front edge of a sturdy chair.", "Straighten one leg, heel on the floor, toes up.", "Hinge forward from the hips with a long back. Hold, then switch."],
    caution: "Use a chair without wheels."
  },
  {
    id: "ST-04", type: "stretch", chair: false, secs: 30,
    title: "Doorway Chest Opener Rx", for: "Rounded Shoulders", dose: "30 sec",
    indication: "Reaching forward all day closes the chest. Opening it makes breathing and standing tall easier.",
    steps: ["Stand in a doorway, forearms on the frame at shoulder height.", "Step one foot through until you feel the chest open.", "Keep the ribs down and breathe. Hold 30 seconds."],
    caution: "Ease off if you feel tingling in the hands."
  },
  {
    id: "BR-01", type: "breath", chair: true, secs: 64,
    title: "Box Breath Rx", for: "Pressure · Racing Mind", dose: "4 rounds",
    indication: "For the moment before a hard conversation, a big lift, or a decision you don't feel ready for.",
    steps: ["Breathe in through the nose for 4 counts.", "Hold for 4.", "Breathe out for 4. Hold for 4. Repeat 4 rounds."],
    caution: "If holding feels uncomfortable, skip the holds."
  },
  {
    id: "BR-02", type: "breath", chair: true, secs: 60,
    title: "Long Exhale Rx", for: "Trouble Winding Down", dose: "6 breaths",
    indication: "A longer exhale than inhale tells the body it's safe to slow down.",
    steps: ["Sit or lie comfortably, one hand on your belly.", "Breathe in for 4 counts.", "Breathe out slowly for 6 to 8 counts. Repeat 6 times."],
    caution: "Keep it gentle. No forcing."
  },
  {
    id: "BA-01", type: "balance", chair: false, secs: 60,
    title: "Heel-to-Toe Walk Rx", for: "Unsteady Walking", dose: "10 steps × 2",
    indication: "Walking on a narrow line trains the small corrections that keep you upright on uneven ground.",
    steps: ["Stand next to a counter or wall for support.", "Place one heel directly in front of the other toes.", "Take 10 slow steps, eyes forward. Turn and repeat."],
    caution: "Always have something steady within reach."
  },
  {
    id: "BA-02", type: "balance", chair: false, secs: 40,
    title: "Single-Leg Stand Rx", for: "Fall Prevention", dose: "10–20 sec / side",
    indication: "Every step is a moment on one leg. Practicing it on purpose makes it automatic.",
    steps: ["Stand behind a sturdy chair, both hands on the back.", "Lift one foot slightly off the floor.", "Hold up to 20 seconds. Use fewer fingers as you improve."],
    caution: "Keep a hand on the chair until you feel steady."
  },
  {
    id: "SR-01", type: "strength", chair: true, secs: 60,
    title: "Sit-to-Stand Rx", for: "Getting Up From Chairs", dose: "8 reps × 2",
    indication: "The single best exercise for staying independent. It builds the strength for toilets, cars and couches.",
    steps: ["Sit at the front of a sturdy chair, feet hip-width apart.", "Lean forward, nose over toes, and stand up.", "Sit back down slowly. Use your hands if you need them."],
    caution: "Place the chair against a wall so it can't slide."
  },
  {
    id: "SR-02", type: "strength", chair: false, secs: 45,
    title: "Wall Push-Up Rx", for: "Pushing & Carrying", dose: "10 reps",
    indication: "Upper-body strength for opening heavy doors, carrying groceries and catching yourself.",
    steps: ["Stand an arm's length from a wall, hands at shoulder height.", "Bend the elbows and bring your chest toward the wall.", "Push back to start. Keep the body in one line."],
    caution: "Wear shoes with grip so your feet don't slide."
  },
  {
    id: "AF-01", type: "affirmation", chair: true, secs: 20,
    title: "Daily Dose: Strength", take: "Before You Move", dose: "Unlimited",
    quote: "I am building a body that can carry me through the life I actually want.",
    steps: ["Read it once out loud.", "Take one slow breath.", "Then start moving."]
  },
  {
    id: "AF-02", type: "affirmation", chair: true, secs: 20,
    title: "Daily Dose: Patience", take: "When Progress Feels Slow", dose: "Unlimited",
    quote: "Progress I can't see yet is still progress.",
    steps: ["Name one thing that's easier than last month.", "Say the affirmation.", "Do one rep anyway."]
  },
  {
    id: "AF-03", type: "affirmation", chair: true, secs: 20,
    title: "Daily Dose: Steady", take: "Before You Stand", dose: "Unlimited",
    quote: "I move with care, and care keeps me moving.",
    steps: ["Plant both feet.", "Say it before you rise.", "Stand tall and go."]
  }
];

// Ready-made sequences for live sessions on the Digital Clipboard
window.RX_ROUTINES = [
  { id: "seated", name: "Seated mobility", minutes: 15, cards: ["AF-01", "BR-02", "ST-01", "ST-03", "SR-01", "BR-01"] },
  { id: "balance", name: "Balance basics", minutes: 12, cards: ["AF-03", "BA-02", "BA-01", "SR-01", "ST-02"] },
  { id: "desk", name: "Workplace stretch break", minutes: 8, cards: ["BR-01", "ST-01", "ST-04", "SR-02", "AF-02"] }
];
