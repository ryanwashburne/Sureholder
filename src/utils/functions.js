export function toMoney(val) {
  return val.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')
}