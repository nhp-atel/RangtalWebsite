// Server-side source of truth for class session dates.
// The July 2026 batch meets on these Tuesdays.
export const JULY_TUESDAYS = ['2026-07-07', '2026-07-14', '2026-07-21', '2026-07-28']

export const isValidSessionDate = (d) =>
  typeof d === 'string' && JULY_TUESDAYS.includes(d)
