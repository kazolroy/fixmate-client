export const CATEGORIES = [
  { name: 'Smartphone', emoji: '📱', blurb: 'Screens, batteries, charging ports' },
  { name: 'Laptop & PC', emoji: '💻', blurb: 'Servicing, upgrades, data recovery' },
  { name: 'AC', emoji: '❄️', blurb: 'Gas refill, cleaning, installation' },
  { name: 'Refrigerator', emoji: '🧊', blurb: 'Cooling faults, compressors' },
  { name: 'TV', emoji: '📺', blurb: 'Panels, backlight, mainboards' },
  { name: 'Washing Machine', emoji: '🧺', blurb: 'Drums, motors, drainage' },
  { name: 'Electrical', emoji: '⚡', blurb: 'Wiring, switchboards, fittings' },
] as const;

export const CATEGORY_NAMES = CATEGORIES.map((c) => c.name) as string[];
export const MODES = ['Home Visit', 'Shop Drop-off'] as const;

/** One palette for every badge on every dashboard. */
export const STATUS_STYLE: Record<string, string> = {
  requested: 'bg-blue-50 text-blue-700 ring-blue-200',
  accepted: 'bg-indigo-50 text-indigo-700 ring-indigo-200',
  'in-progress': 'bg-amber-50 text-amber-700 ring-amber-200',
  completed: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  rejected: 'bg-red-50 text-red-700 ring-red-200',
  cancelled: 'bg-slate-100 text-slate-600 ring-slate-200',
  paid: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  unpaid: 'bg-orange-50 text-orange-700 ring-orange-200',
  pending: 'bg-amber-50 text-amber-700 ring-amber-200',
  approved: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  available: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  hidden: 'bg-slate-100 text-slate-600 ring-slate-200',
  customer: 'bg-blue-50 text-blue-700 ring-blue-200',
  technician: 'bg-teal-50 text-teal-700 ring-teal-200',
  admin: 'bg-purple-50 text-purple-700 ring-purple-200',
};

export const STATUS_HEX: Record<string, string> = {
  requested: '#3b82f6',
  accepted: '#6366f1',
  'in-progress': '#f59e0b',
  completed: '#10b981',
  rejected: '#ef4444',
  cancelled: '#94a3b8',
  customer: '#3b82f6',
  technician: '#0f6a7e',
  admin: '#a855f7',
};

export const STATUS_LABEL: Record<string, string> = {
  'in-progress': 'In Progress',
};
