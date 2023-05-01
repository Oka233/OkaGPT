const state = {
  currentRoomId: null,
  openaiSettings: {
    apiKey: null,
    model: null,
    autoStart: null,
    stream: null,
    temperature: null,
    top_p: null,
    n: null,
    stop: null,
    presence_penalty: null,
    frequency_penalty: null,
    logit_bias: null,
    max_tokens: null
  },
  advancedTabCheckboxes: {
    temperature: false,
    top_p: false,
    n: false,
    presence_penalty: false,
    frequency_penalty: false,
    logit_bias: false,
    max_tokens: false
  },
}

const mutations = {
  SET_ROOM_ID: (state, roomId) => {
    state.currentRoomId = roomId
  },
  SET_OPENAI_SETTINGS: (state, settings) => {
    state.openaiSettings = settings
  },
  SET_ADVANCED_CHECKBOXES: (state, settings) => {
    state.advancedTabCheckboxes = settings
  },
}

const actions = {
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
