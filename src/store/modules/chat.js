const state = {
  // currentRoomId: null,
  // openaiSettings: {
  //
  // },
  // advancedSettings: {
  //
  // },
  chats: [],
  chatDisabled: false,
  currentRoomId: null
}

const mutations = {
  SET_ROOM_ID: (state, roomId) => {
    state.currentRoomId = roomId
  },
  // SET_OPENAI_SETTINGS: (state, settings) => {
  //   state.openaiSettings = settings
  // },
  // SET_ADVANCED_SETTINGS: (state, settings) => {
  //   state.advancedSettings = settings
  // },
  REMOVE_ALL_CHATS: (state) => {
    state.chats = []
  },
  REMOVE_CHAT: (state, chatId) => {
    state.chats = state.chats.filter(chat => chat.chatId !== chatId)
  },
  ADD_CHAT: (state, chat) => {
    state.chats.push(chat)
  },
  DISABLE_CHAT: (state) => {
    state.chatDisabled = true
  },
  ENABLE_CHAT: (state) => {
    state.chatDisabled = false
  }
}

const actions = {
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
