const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  chats: state => state.chat.chats,
  chatDisabled: state => state.chat.chatDisabled,
  currentRoomId: state => state.chatSettings.currentRoomId,
  openaiSettings: state => state.chatSettings.openaiSettings,
  advancedTabCheckboxes: state => state.chatSettings.advancedTabCheckboxes
}
export default getters
