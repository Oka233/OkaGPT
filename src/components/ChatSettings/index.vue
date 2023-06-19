<template>
  <el-tabs v-model="activeName" type="border-card">
    <el-tab-pane label="基本设置" name="first">
      <div class="first-tab-container">
        <el-input v-model="dummyApiKey" placeholder="输入API Key" class="apikey-input" />
        <el-select v-model="openaiSettings.model" placeholder="选择对话模型">
          <el-option
            v-for="item in modelOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <div class="switch-container">
          <span>
            流式传输
          </span>
          <el-switch
            v-model="openaiSettings.stream"
          />
        </div>
        <div class="switch-container">
          <span>
            问候语
          </span>
          <el-switch
            v-model="openaiSettings.hello"
          />
        </div>
      </div>
    </el-tab-pane>
    <el-tab-pane label="高级设置" name="second">
      <el-alert
        title="高级设置仅对流式传输生效"
        :closable="false"
        type="warning"
      />
      <ModelOption v-model="openaiAdvancedTabCheckboxes.temperature" :name="`temperature: ${openaiSettings.temperature}`">
        <el-slider v-model="openaiSettings.temperature" :min="0" :max="2" :step="0.025" class="slot-slider" show-input :show-input-controls="false" :show-tooltip="false" />
      </ModelOption>
      <ModelOption v-model="openaiAdvancedTabCheckboxes.top_p" :name="`top_p: ${openaiSettings.top_p}`">
        <el-slider v-model="openaiSettings.top_p" :min="0" :max="1" :step="0.025" class="slot-slider" show-input :show-input-controls="false" :show-tooltip="false" />
      </ModelOption>
      <ModelOption v-model="openaiAdvancedTabCheckboxes.n" :name="`n: ${openaiSettings.n}`">
        <el-slider v-model="openaiSettings.n" :min="1" :max="5" :step="1" class="slot-slider" show-input :show-input-controls="false" :show-tooltip="false" />
      </ModelOption>
      <ModelOption v-model="openaiAdvancedTabCheckboxes.presence_penalty" :name="`presence_penalty: ${openaiSettings.presence_penalty}`">
        <el-slider v-model="openaiSettings.presence_penalty" :min="-2" :max="2" :step="0.025" class="slot-slider" show-input :show-input-controls="false" :show-tooltip="false" />
      </ModelOption>
      <ModelOption v-model="openaiAdvancedTabCheckboxes.frequency_penalty" :name="`frequency_penalty: ${openaiSettings.frequency_penalty}`">
        <el-slider v-model="openaiSettings.frequency_penalty" :min="-2" :max="2" :step="0.025" class="slot-slider" show-input :show-input-controls="false" :show-tooltip="false" />
      </ModelOption>
      <ModelOption v-model="openaiAdvancedTabCheckboxes.max_tokens" :name="`max_tokens: ${openaiSettings.max_tokens}`">
        <el-slider v-model="openaiSettings.max_tokens" :min="0" :max="4096" :step="1" class="slot-slider" show-input :show-input-controls="false" :show-tooltip="false" />
      </ModelOption>
      <el-button @click="resetAdvancedSettings">Reset</el-button>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import storage from '@/utils/storage.js'
import ModelOption from '@/components/ChatSettings/ModelOption.vue'
import { mapGetters } from 'vuex'
export default {
  name: 'ChatSettings',
  components: { ModelOption },
  data() {
    return {
      activeName: 'first',
      dummyApiKey: '',
      // 用来触发watch
      apiKey: '',
      modelOptions: []
    }
  },
  computed: {
    ...mapGetters([
      'openaiSettings',
      'openaiAdvancedTabCheckboxes',
      'chatModel'
    ])
  },
  watch: {
    apiKey: {
      handler: function(newVal, oldVal) {
        if (newVal !== oldVal) {
          this.modelOptions = []
          this.getModelOptions()
          this.$store.commit('openai/setApiKey', newVal)
          storage.save()
        }
      }
    },
    openaiSettings: {
      handler: function(newVal, oldVal) {
        this.chatModel.loadSettings()
        storage.save()
      },
      deep: true
    },
    openaiAdvancedTabCheckboxes: {
      handler: function(newVal, oldVal) {
        storage.save()
      },
      deep: true
    }
  },
  created() {
    console.log(this.openaiSettings.apiKey)
    this.dummyApiKey = this.openaiSettings.apiKey
    this.apiKey = this.openaiSettings.apiKey
  },
  methods: {
    getModelOptions() {
      this.chatModel.getModels().then(res => {
        console.log(res)
        this.modelOptions = res.map(modelName => {
          return {
            label: modelName,
            value: modelName
          }
        })
      }).catch(e => {
        this.$message.error(e.message)
      })
    },
    resetAdvancedSettings() {
      this.$store.commit('openai/resetAdvancedSettings')
      this.chatModel.loadSettings()
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
