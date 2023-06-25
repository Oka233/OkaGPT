import store from '@/store'
import { Chat } from '@/utils/Chat/Chat'

function set(path, val) {
  path = path.split('.')
  if (path.length === 1) {
    // console.log(JSON.stringify(val))
    localStorage.setItem(path[0], JSON.stringify(val))
  } else {
    let obj = JSON.parse(localStorage.getItem(path[0])) || {}
    const head = obj
    for (let i = 1; i < path.length; i++) {
      if (i === path.length - 1) {
        obj[path[i]] = val
        break
      }
      if (obj[path[i]] === undefined) {
        obj[path[i]] = {}
      }
      obj = obj[path[i]]
    }
    localStorage.setItem(path[0], JSON.stringify(head))
  }
}

function get(path) {
  path = path.split('.')
  // console.log(path)
  // console.log(JSON.parse(localStorage.getItem(path[0])))
  let obj = JSON.parse(localStorage.getItem(path[0]))
  for (let i = 1; i < path.length; i++) {
    if (obj === null) {
      return null
    }
    obj = obj[path[i]] === undefined ? null : obj[path[i]]
  }
  return obj
}

function save() {
  const sys = {}
  for (const key in store.state.sys) {
    if (key !== 'chatModel') {
      sys[key] = store.state.sys[key]
    }
  }
  set('sys', sys)
  set('openai', store.state.openai)
}

function load() {
  // 加载设置
  store.commit('openai/load', get('openai'))
  store.commit('sys/load', get('sys'))
  // 加载保存的对话
  const savedChats = get('savedChats')
  if (savedChats) {
    store.commit('chat/REMOVE_ALL_CHATS')
    JSON.parse(savedChats).forEach(chat => {
      store.commit('chat/ADD_CHAT', new Chat(chat))
    })
  }
}

export default {
  set,
  get,
  save,
  load
}
