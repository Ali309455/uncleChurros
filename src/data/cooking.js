export const COOKING_GUIDES = [
  {
    category: 'churros',
    label: 'Churros',
    headline: 'Golden, crispy, and best served hot.',
    subtitle:
      'Your churros arrive frozen at peak freshness. Deep-fry, air-fry, or oven-bake them straight from the freezer for that just-cooked park crunch.',
    color: 'gold',
    serving:
      'Serve warm, straight from the fryer basket, dusted with cinnamon sugar. Each churro is approximately 15 inches of golden, pillowy goodness — enjoy within minutes of cooking.',
    storage:
      'Keep frozen until you are ready to cook — up to 12 months. Remove only the pieces you plan to prepare and return the rest to the freezer.',
    proTip:
      'No need to thaw — cook straight from frozen. Tap a churro gently: a hollow sound means it is crisp all the way through.',
    bestMethod: 'deepfryer',
    methods: [
      {
        label: 'Deep Fryer',
        method: 'deepfryer',
        temp: '350°F',
        time: '3–4 min',
        tip: 'Recommended. Fry from frozen in small batches until deep golden, then drain and toss in cinnamon sugar.',
      },
      {
        label: 'Air Fryer',
        method: 'airfryer',
        temp: '380°F',
        time: '4–5 min',
        tip: 'Arrange in a single layer and shake the basket halfway for an evenly crisp exterior.',
      },
      {
        label: 'Conventional Oven',
        method: 'oven',
        temp: '400°F',
        time: '6–8 min',
        tip: 'Bake on a lined tray, flipping once, until hot and crisp all around.',
      },
    ],
  },
  {
    category: 'beignets',
    label: 'Beignets',
    headline: 'Pillowy, cloud-light, snowed in sugar.',
    subtitle:
      'Revive the airy crumb and powdered-sugar finish of your beignets straight from the freezer, without weighing them down.',
    color: 'blue',
    serving:
      'Serve warm and generously dusted with powdered sugar, with a pot of dipping sauce on the side.',
    storage:
      'Keep frozen until ready to cook — up to 6 months. Do not thaw; cold dough fries up softer and lighter.',
    proTip:
      'Re-dust with powdered sugar immediately after cooking so it melts into the warm dough just right.',
    bestMethod: 'deepfryer',
    methods: [
      {
        label: 'Deep Fryer',
        method: 'deepfryer',
        temp: '360°F',
        time: '2–3 min',
        tip: 'Recommended. Fry from frozen until puffed and golden — the outside crisps while the middle stays cloud-soft.',
      },
      {
        label: 'Conventional Oven',
        method: 'oven',
        temp: '375°F',
        time: '6–8 min',
        tip: 'Bake on a lined tray until puffed and warmed through. Add a small dish of water to the tray to keep them moist.',
      },
    ],
  },
  {
    category: 'chimichangas',
    label: 'Chimichangas',
    headline: 'Crispy shell, molten center.',
    subtitle:
      'Cook until the tortilla crackles and the filling is bubbling hot, all the way through — straight from the freezer.',
    color: 'orange',
    serving:
      'Serve hot with sour cream, salsa, or guacamole. Rest for 2 minutes before cutting so the fillings hold together.',
    storage:
      'Keep frozen until ready to cook — up to 6 months. Cook straight from frozen; no thawing needed.',
    proTip:
      'Slice through the middle to confirm it is piping hot before serving — the filling absorbs heat slower than the shell.',
    bestMethod: 'deepfryer',
    methods: [
      {
        label: 'Deep Fryer',
        method: 'deepfryer',
        temp: '350°F',
        time: '5–6 min',
        tip: 'Recommended. Fry from frozen until the shell turns golden and crackles and the filling is bubbling.',
      },
      {
        label: 'Conventional Oven',
        method: 'oven',
        temp: '400°F',
        time: '12–15 min',
        tip: 'Turn halfway and cover loosely with foil if the shell browns too fast.',
      },
      {
        label: 'Air Fryer',
        method: 'airfryer',
        temp: '375°F',
        time: '8–10 min',
        tip: 'Outstanding crisp with an even crunch — flip once for a golden shell all around.',
      },
    ],
  },
]

export function getGuide(category) {
  return COOKING_GUIDES.find((guide) => guide.category === category) ?? null
}