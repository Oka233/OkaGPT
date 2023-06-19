const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  platformType: state => state.sys.platformType,
  chatModel: state => state.sys.chatModel,
  ready: state => state.sys.ready,
  loadedSave: state => state.sys.loadedSave,

  openaiSettings: state => state.openai.settings,
  openaiAdvancedTabCheckboxes: state => state.openai.advancedTabCheckboxes,

  chats: state => state.chat.chats,
  chatDisabled: state => state.chat.chatDisabled,
  currentRoomId: state => state.chat.currentRoomId
}
export default getters
