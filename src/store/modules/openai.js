const state = {
  settings: {
    apiKey: '',
    model: '',
    temperature: 1,
    top_p: 1,
    n: 1,
    stop: null,
    presence_penalty: 0,
    frequency_penalty: 0,
    logit_bias: null,
    max_tokens: 2048
  },
  advancedTabCheckboxes: {
    temperature: true,
    top_p: false,
    n: false,
    presence_penalty: false,
    frequency_penalty: false,
    logit_bias: false,
    max_tokens: false
  }
}

const mutations = {
  setApiKey: (state, apiKey) => {
    state.settings.apiKey = apiKey
  },
  saveSettings: (state, settings) => {
    state.settings = settings
  },
  resetAdvancedSettings: (state) => {
    const settings = {
      temperature: 1,
      top_p: 1,
      n: 1,
      stop: null,
      presence_penalty: 0,
      frequency_penalty: 0,
      logit_bias: null,
      max_tokens: 2048
    }
    Object.assign(state.settings, settings)
  },
  load: (state, save) => {
    console.log(save)
    if (save) {
      for (const key in save) {
        if (key in state) {
          state[key] = save[key]
        }
      }
    }
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
