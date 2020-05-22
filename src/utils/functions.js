export function toMoney(val) {
  return val.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')
}
export function isAdmin(user) {
  const { roles } = user.app_metadata
  return roles?.indexOf('admin') > -1
}