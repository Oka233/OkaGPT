function getTimestamp() {
  return new Date().toString().substring(16, 21)
}
function getDate() {
  return new Date().toDateString()
}

export default {
  getTimestamp,
  getDate
}
