/**
 * SETU — single source of demo truth.
 * Everything in this prototype is hardcoded. No network, no storage, no clock.
 */

export const customer = {
  name: 'Aarav',
  initials: 'A',
  home: {
    label: 'HOME',
    title: 'Kandivali West',
    detail: 'near station',
    full: 'Kandivali West · near station',
  },
  office: {
    label: 'OFFICE',
    title: 'Kamala Mills',
    detail: 'Lower Parel',
    full: 'Kamala Mills · Lower Parel',
  },
};

export const carrier = {
  name: 'Santosh',
  initials: 'S',
  group: 'Kandivali group',
  line: 'Western Line',
  code: 'K4-07',
  pickup: '09:00',
  delivery: '12:30',
  years: 11,
  dabbas: 42,
  note: 'Santosh has been carrying dabbas on this line for eleven years.',
};

export const route = {
  line: 'Western Line',
  from: 'Kandivali Group',
  to: 'Lower Parel',
  headline: 'Kandivali → Lower Parel',
  etaLive: '12:20',
  desks: 1,
  stops: [
    { id: 'kandivali', code: 'KANDIVALI', time: '09:45', state: 'current' },
    { id: 'bandra', code: 'BANDRA', time: '10:31', state: 'upcoming' },
    { id: 'parel', code: 'PAREL', time: '11:13', state: 'upcoming' },
    { id: 'lower-parel', code: 'LOWER PAREL', time: '11:40', state: 'upcoming' },
  ],
};

/** The five moments of one dabba, in order. */
export const journeyStops = [
  {
    id: 'home',
    code: 'HOME',
    label: 'Collected from home',
    time: '09:12',
    note: 'Scanned by Santosh',
    state: 'done',
  },
  {
    id: 'kandivali',
    code: 'KANDIVALI',
    label: 'Sorted at Kandivali',
    time: '09:51',
    note: 'Crate K4-07',
    state: 'done',
  },
  {
    id: 'local',
    code: 'ON THE 10:14 LOCAL',
    label: 'On the 10:14 local',
    time: '10:14',
    note: 'Inferred from crate scan',
    state: 'current',
    inferred: true,
  },
  {
    id: 'lower-parel',
    code: 'LOWER PAREL',
    label: 'Arrived Lower Parel',
    time: '~11:40',
    note: 'Expected',
    state: 'upcoming',
  },
  {
    id: 'desk',
    code: 'KAMALA MILLS',
    label: 'Delivered to desk',
    time: 'By 12:30',
    note: '4th floor · reception',
    state: 'upcoming',
  },
]

/**
 * The three moments the demo can be sitting at. `stopIndex` points at the
 * entry in `journeyStops` that is happening right now; everything before
 * it is green, everything after it is still to come.
 */
export const journeyStages = [
  {
    id: 'local',
    label: 'On the train',
    stopIndex: 2,
    eyebrow: 'TUE · 24 SEP · 10:14 LOCAL',
    headline: 'Your dabba is on the train',
    status: 'On the train',
    statusTone: 'active',
    eta: '12:20',
    etaLabel: 'Desk by',
    note: 'Crate K4-07 was scanned onto the 10:14 local.',
  },
  {
    id: 'parel',
    label: 'At Lower Parel',
    stopIndex: 3,
    eyebrow: 'TUE · 24 SEP · 11:41',
    headline: 'Your dabba is off the train',
    status: 'At Lower Parel',
    statusTone: 'active',
    eta: '12:20',
    etaLabel: 'Desk by',
    note: 'Crate K4-07 was scanned off at Lower Parel at 11:41.',
  },
  {
    id: 'desk',
    label: 'Delivered',
    stopIndex: 4,
    eyebrow: 'TUE · 24 SEP · 12:18',
    headline: 'Lunch has arrived',
    status: 'Delivered',
    statusTone: 'covered',
    eta: '12:18',
    etaLabel: 'Delivered',
    note: 'Handed over at 4th floor reception and signed for.',
  },
]

/** States for every stop, given the stop that is happening now. */
export const journeyStates = (stage) => {
  const active = journeyStages[stage]?.stopIndex ?? 2
  const done = journeyStages[stage]?.id === 'desk'
  return journeyStops.map((stop, index) => ({
    ...stop,
    state: index < active ? 'done' : index > active ? 'upcoming' : done ? 'done' : 'current',
  }))
};

/** The seven stages of the carrier's morning — used on the match screen. */
export const carrierRun = [
  { id: 'home', code: 'HOME', time: '09:00', note: 'Pickup', state: 'done' },
  { id: 'kandivali', code: 'KANDIVALI', time: '09:45', note: 'Sorted', state: 'done' },
  { id: 'local', code: 'LOCAL', time: '10:14', note: 'Departs', state: 'done' },
  { id: 'lower-parel', code: 'LOWER PAREL', time: '11:40', note: 'Arrives', state: 'done' },
  { id: 'desk', code: 'DESK', time: '12:30', note: 'Handed over', state: 'done' },
];

export const pricing = {
  dabbawala: 1800,
  plus: 149,
  total: 1949,
  note: 'Your dabbawala receives his full ₹1,800 fee.',
};

export const planFeatures = [
  { title: 'Route matching', note: 'We find the group already going your way.' },
  { title: 'Flexible office days', note: 'Only the days you are actually in.' },
  { title: 'QR journey updates', note: 'Four scans, no GPS, no device.' },
  { title: 'Pause anytime', note: 'One tap, told to Santosh before 7 am.' },
];

export const weekdays = [
  { id: 'mon', short: 'MON', long: 'Monday', date: '23' },
  { id: 'tue', short: 'TUE', long: 'Tuesday', date: '24' },
  { id: 'wed', short: 'WED', long: 'Wednesday', date: '25' },
  { id: 'thu', short: 'THU', long: 'Thursday', date: '26' },
  { id: 'fri', short: 'FRI', long: 'Friday', date: '27' },
];

export const defaultDays = ['tue', 'wed', 'thu'];

export const upiOptions = [
  { id: 'upi', label: 'UPI app', note: 'Any UPI app on this phone' },
  { id: 'bank', label: 'Bank app', note: 'Autopay mandate from your bank' },
  { id: 'wallet', label: 'Wallet', note: 'Linked wallet balance' },
];

export const locationSuggestions = {
  home: [
    { title: 'Kandivali West', detail: 'near station', meta: 'Pincode 400067' },
    { title: 'Kandivali East', detail: 'Thakur Village', meta: 'Pincode 400101' },
    { title: 'Malad West', detail: 'near station', meta: 'Pincode 400064' },
    { title: 'Borivali West', detail: 'near station', meta: 'Pincode 400092' },
  ],
  office: [
    { title: 'Kamala Mills', detail: 'Lower Parel', meta: 'Pincode 400013' },
    { title: 'Peninsula Business Park', detail: 'Lower Parel', meta: 'Pincode 400013' },
    { title: 'One World Center', detail: 'Lower Parel', meta: 'Pincode 400013' },
    { title: 'Parinee Crescenzo', detail: 'Bandra Kurla Complex', meta: 'Pincode 400051' },
  ],
};

export const trackingStages = [
  {
    n: '01',
    title: 'Picked up',
    deva: 'उचलला',
    note: 'Santosh scans the dabba at your door. This is the first QR touchpoint.',
  },
  {
    n: '02',
    title: 'At station',
    deva: 'स्थानकावर',
    note: 'Your dabba joins a crate. The crate code is scanned as it is loaded.',
  },
  {
    n: '03',
    title: 'Reached office station',
    deva: 'कार्यालय स्थानक',
    note: 'The crate is scanned off the train at Lower Parel.',
  },
  {
    n: '04',
    title: 'Delivered',
    deva: 'पोहोचला',
    note: 'Handed over at your desk and marked complete for the day.',
  },
];

export const dabbawalaQueue = [
  { id: 'q1', code: '3-BO-12', hub: 'LP', address: 'Flat 402, Shanti Kunj', status: 'ready' },
  { id: 'q2', code: '3-BO-14', hub: 'LP', address: 'B-11, Gokul Dham', status: 'ready' },
  { id: 'q3', code: 'K4-07', hub: 'CG', address: 'Crate · 28 dabbas', status: 'ready', crate: true },
  { id: 'q4', code: '3-BO-15', hub: 'LP', address: 'Flat 1103, Sunview', status: 'paused' },
  { id: 'q5', code: '3-BO-19', hub: 'LP', address: 'C-7, Vasant Sagar', status: 'pending' },
];

export const statusCopy = {
  ready: { en: 'ready', mr: 'तयार', tone: 'green' },
  paused: { en: 'Paused today', mr: 'थांबवले', tone: 'quiet' },
  pending: { en: 'Not yet scanned', mr: 'स्कॅन बाकी', tone: 'faint' },
};

export const brand = {
  tagline: "Mumbai's dabba connection",
  line: 'The network already exists. We are building the bridge to it.',
  short: "Mumbai's dabba network, now easier to use.",
};
