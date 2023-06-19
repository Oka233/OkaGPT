import { IChatModel } from '@/utils/Models/IChatModel'

const state = {
  platformType: null,
  chatModel: null,
  ready: false,
  loadedSave: false
}

const mutations = {
  setPlatformType: (state, platformType) => {
    state.platformType = platformType
  },
  setChatModel: (state, platformType) => {
    state.chatModel = new IChatModel(platformType)
  },
  ready: (state, ready) => {
    state.ready = ready
  },
  load: (state, save) => {
    if (save) {
      for (const key in save) {
        if (key in state) {
          state[key] = save[key]
        }
      }
    }
    if (state.platformType) {
      state.chatModel = new IChatModel(state.platformType)
      state.chatModel.loadSettings()
    }
    state.ready = false
    state.loadedSave = true
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
