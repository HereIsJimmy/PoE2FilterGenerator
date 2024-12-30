
export function getLS (key): any {
  const value: any = localStorage.getItem(key)
  return value ? JSON.parse(value) : null
}
export function setLS (key, value): void {
  localStorage.setItem(key, JSON.stringify(value, null, 4))
}

export function capitalize(str) {
  const [first, ...rest] = str
  return `${first.toUpperCase()}${rest.join('')}`
}

export function colorHexToPoE(color) {
  const [r1,r2,g1,g2,b1,b2,a1,a2] = color.replace('#', '').split('')
  const red = Number(`0x${r1}${r2}`)
  const green = Number(`0x${g1}${g2}`)
  const blue = Number(`0x${b1}${b2}`)
  const alpha = Number(`0x${a1}${a2}`)
  return `${red} ${green} ${blue} ${alpha}`
}