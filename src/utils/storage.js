function set(path, val) {
  path = path.split('.')
  let obj = JSON.parse(localStorage.getItem(path[0])) || {}
  const head = obj
  for (let i = 1; i < path.length - 1; i++) {
    if (obj[path[i]] === undefined) {
      obj[path[i]] = {}
    }
    obj = obj[path[i]]
  }
  obj[path[path.length - 1]] = val
  localStorage.setItem(path[0], JSON.stringify(head))
}

function get(path) {
  path = path.split('.')
  let obj = JSON.parse(localStorage.getItem(path[0]))
  for (let i = 1; i < path.length; i++) {
    if (obj === null) {
      return null
    }
    obj = obj[path[i]] === undefined ? null : obj[path[i]]
  }
  return obj
}

export default {
  set,
  get
}
