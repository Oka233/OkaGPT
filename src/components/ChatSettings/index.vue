<template>
  <el-tabs v-model="activeName" type="border-card">
    <el-tab-pane label="Connection" name="first">
      <div class="first-tab-container">
        <el-input v-model="dummyApiKey" @change="saveKey" placeholder="Enter API Key" class="apikey-input"></el-input>
        <el-select v-model="openaiSettings.model" placeholder="Choose Model" @change="saveModel">
          <el-option
            v-for="item in modelOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <div class="switch-container">
          <span>
            Autostart
          </span>
          <el-switch
            v-model="openaiSettings.autoStart"
            @change="saveAutoStart"
          ></el-switch>
        </div>
        <div class="switch-container">
          <span>
            Stream answers
          </span>
          <el-switch
            v-model="openaiSettings.stream"
            @change="saveStream"
          ></el-switch>
        </div>
      </div>
    </el-tab-pane>
    <el-tab-pane label="Advanced" name="second">
      <el-alert
        title="These options are exclusive to stream mode"
        :closable="false"
        type="warning"
      >
      </el-alert>
      <ModelOption v-model="advancedTabCheckboxes.temperature" :name="`temperature: ${openaiSettings.temperature}`" @change="saveCheckboxes">
        <el-slider @input="savePath('openaiSettings.temperature', $event)" v-model="openaiSettings.temperature" :min="0" :max="2" :step="0.025" class="slot-slider" show-input :show-input-controls="false" :show-tooltip="false"></el-slider>
      </ModelOption>
      <ModelOption v-model="advancedTabCheckboxes.top_p" :name="`top_p: ${openaiSettings.top_p}`" @change="saveCheckboxes">
        <el-slider @input="savePath('openaiSettings.top_p', $event)" v-model="openaiSettings.top_p" :min="0" :max="1" :step="0.025" class="slot-slider" show-input :show-input-controls="false" :show-tooltip="false"></el-slider>
      </ModelOption>
      <ModelOption v-model="advancedTabCheckboxes.n" :name="`n: ${openaiSettings.n}`" @change="saveCheckboxes">
        <el-slider @input="savePath('openaiSettings.n', $event)" v-model="openaiSettings.n" :min="1" :max="5" :step="1" class="slot-slider" show-input :show-input-controls="false" :show-tooltip="false"></el-slider>
      </ModelOption>
      <ModelOption v-model="advancedTabCheckboxes.presence_penalty" :name="`presence_penalty: ${openaiSettings.presence_penalty}`" @change="saveCheckboxes">
        <el-slider @input="savePath('openaiSettings.presence_penalty', $event)" v-model="openaiSettings.presence_penalty" :min="-2" :max="2" :step="0.025" class="slot-slider" show-input :show-input-controls="false" :show-tooltip="false"></el-slider>
      </ModelOption>
      <ModelOption v-model="advancedTabCheckboxes.frequency_penalty" :name="`frequency_penalty: ${openaiSettings.frequency_penalty}`" @change="saveCheckboxes">
        <el-slider @input="savePath('openaiSettings.frequency_penalty', $event)" v-model="openaiSettings.frequency_penalty" :min="-2" :max="2" :step="0.025" class="slot-slider" show-input :show-input-controls="false" :show-tooltip="false"></el-slider>
      </ModelOption>
      <ModelOption v-model="advancedTabCheckboxes.max_tokens" :name="`max_tokens: ${openaiSettings.max_tokens}`" @change="saveCheckboxes">
        <el-slider @input="savePath('openaiSettings.max_tokens', $event)" v-model="openaiSettings.max_tokens" :min="0" :max="4096" :step="1" class="slot-slider" show-input :show-input-controls="false" :show-tooltip="false"></el-slider>
      </ModelOption>
      <el-button @click="resetAdvancedSettings">Reset</el-button>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import storage from '@/utils/storage.js'
import { OpenAI } from '@/utils/Models/OpenAI'
import { showErrorMessage } from '@/utils/Models/openaiErrorMessage'
import ModelOption from '@/components/ChatSettings/ModelOption.vue'
import { mapGetters } from 'vuex'
export default {
  name: 'ChatSettings',
  components: { ModelOption },
  computed: {
    ...mapGetters([
      'openaiSettings',
      'advancedTabCheckboxes'
    ])
  },
  data() {
    return {
      activeName: 'first',
      dummyApiKey: null,
      // 用来触发watch
      apiKey: null,
      modelOptions: null
    }
  },
  watch: {
    apiKey: {
      handler: function(newVal, oldVal) {
        if (newVal !== oldVal) {
          this.initModelSelection()
        }
      }
    }
  },
  created() {
    console.log('____________initializing settings____________')
    this.$store.commit('chatSettings/SET_OPENAI_SETTINGS', this.setDefault(OpenAI.getDefaultSettings().detail))
    // this.openaiSettings = this.setDefault(OpenAI.getDefaultSettings().detail)
    this.dummyApiKey = this.openaiSettings.apiKey
    this.apiKey = this.openaiSettings.apiKey
    // console.log(storage.get('advancedTabCheckboxes'))
    Object.assign(this.advancedTabCheckboxes, storage.get('advancedTabCheckboxes'))
    // this.$store.commit('chatSettings/SET_ADVANCED_CHECKBOXES', advancedTabCheckboxes)
    console.log('____________initialization complete____________')
  },
  methods: {
    getSetting(key) {
      if (key in this.advancedTabCheckboxes) {
        if (this.advancedTabCheckboxes[key]) {
          return this.openaiSettings[key]
        } else {
          return undefined
        }
      } else {
        return this.openaiSettings[key]
      }
    },
    savePath(path, val) {
      storage.set(path, val)
    },
    setDefault(settings) {
      const openaiSettings = {}
      for (const key in settings) {
        const val = settings[key]
        const path = `openaiSettings.${key}`
        if (storage.get(path) === null) {
          storage.set(path, val)
        }
        openaiSettings[key] = storage.get(path)
        console.log(`${key} (${openaiSettings[key]})`)
      }
      return openaiSettings
    },
    initModelSelection() {
      const filter = (m) => {
        return m.id.includes('gpt')
      }
      new OpenAI({}).listEngines()
        .then(res => {
          console.log(res)
          this.modelOptions = res.data.data.filter(filter).map((item) => {
            return {
              label: item.id,
              value: item.id
            }
          })
          const model = storage.get('openaiSettings.model')
          if (this.modelOptions.find(m => m.value === model)) {
            this.openaiSettings.model = model
          } else {
            this.openaiSettings.model = ''
          }
          this.$message({
            message: 'OpenAI API key verified',
            type: 'success'
          })
          this.$store.commit('chat/ENABLE_CHAT')
          this.$emit('ready')
        })
        .catch(e => {
          // this.modelOptions = []
          // this.openaiSettings.model = ''
          this.$store.commit('chat/DISABLE_CHAT')
          showErrorMessage(e)
        })
    },
    saveAutoStart() {
      storage.set('openaiSettings.autoStart', this.openaiSettings.autoStart)
    },
    saveStream() {
      storage.set('openaiSettings.stream', this.openaiSettings.stream)
    },
    saveKey() {
      this.apiKey = this.dummyApiKey
      this.openaiSettings.apiKey = this.dummyApiKey
      storage.set('openaiSettings.apiKey', this.openaiSettings.apiKey)
    },
    saveModel() {
      storage.set('openaiSettings.model', this.openaiSettings.model)
    },
    saveCheckboxes() {
      this.$nextTick(_ => {
        storage.set('advancedTabCheckboxes', this.advancedTabCheckboxes)
      })
    },
    resetAdvancedSettings() {
      const defaultSettings = OpenAI.getDefaultSettings().detail
      Object.keys(this.advancedTabCheckboxes).forEach(key => {
        this.openaiSettings[key] = defaultSettings[key]
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.first-tab-container {
  flex-flow: column;
  display: flex;
  gap: 8px;
  .switch-container {
    padding: 0 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
.slot-slider {
  padding-left: 36px;
  $input_width: 64px;
  ::v-deep.el-slider__input {
    width: $input_width;
  }
  ::v-deep.el-slider__runway.show-input {
    margin-right: $input_width + 12px;
  }
}
</style>
