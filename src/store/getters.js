const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  platformType: state => state.sys.platformType,
  chatModel: state => state.sys.chatModel,
  ready: state => state.sys.ready,
  preview: state => state.sys.preview,
  loadedSave: state => state.sys.loadedSave,

  openaiSettings: state => state.openai.settings,
  openaiAdvancedTabCheckboxes: state => state.openai.advancedTabCheckboxes,

  chats: state => state.chat.chats,
  currentChatId: state => state.chat.currentChatId,
  currentChat: state => state.chat.chats.find(chat => chat.chatId === state.chat.currentChatId)
}
export default getters
