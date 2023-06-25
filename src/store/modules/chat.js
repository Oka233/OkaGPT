const state = {
  chats: [],
  currentChatId: null
}

const mutations = {
  setCurrentChatId: (state, chatId) => {
    state.currentChatId = chatId
  },
  // SET_OPENAI_SETTINGS: (state, settings) => {
  //   state.openaiSettings = settings
  // },
  // SET_ADVANCED_SETTINGS: (state, settings) => {
  //   state.advancedSettings = settings
  // },
  removeAllChats: (state) => {
    state.chats = []
  },
  removeChatById: (state, chatId) => {
    state.chats = state.chats.filter(chat => chat.chatId !== chatId)
  },
  addChat: (state, chat) => {
    state.chats.push(chat)
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
