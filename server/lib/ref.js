// Human-friendly reservation code, e.g. "RT-48213".
// 90,000-value space (RT-10000..RT-99999). Collisions are handled by a retry
// loop at the insert site; this is sized for community-scale use (hundreds),
// not tens of thousands of registrations.
export function generateRef() {
  return 'RT-' + Math.floor(10000 + Math.random() * 90000)
}
