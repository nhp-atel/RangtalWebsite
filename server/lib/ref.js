// Human-friendly reservation code, e.g. "RT-48213".
export function generateRef() {
  return 'RT-' + Math.floor(10000 + Math.random() * 90000)
}
