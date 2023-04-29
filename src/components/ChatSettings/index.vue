<template>
  <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
    <el-tab-pane label="Connection" name="first">
      <el-input v-model="dummyApiKey" @change="saveKey" placeholder="API Key" class="apikey-input"></el-input>
      <el-select v-model="model" placeholder="选择模型" @change="saveModel">
        <el-option
          v-for="item in modelOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </el-tab-pane>
    <el-tab-pane label="Advanced" name="second">配置管理</el-tab-pane>
  </el-tabs>
</template>

<script>
import storage from '@/utils/storage.js'
import { OpenAI } from '@/utils/Models/OpenAI'
import { showErrorMessage } from '@/utils/Models/openaiErrorMessage'
export default {
  name: 'ChatSettings',
  data() {
    return {
      activeName: 'first',
      apiKey: null,
      dummyApiKey: null,
      model: null,
      defaultSettings: {
        apiKey: '',
        model: ''
      },
      modelOptions: []
    }
  },
  watch: {
    apiKey(newVal) {
      if (newVal) {
        this.initModelSelection()
      }
    }
  },
  mounted() {
    this.apiKey = storage.get('settings.openaiKey') || this.defaultSettings.apiKey
    this.dummyApiKey = this.apiKey
  },
  methods: {
    handleClick(tab, event) {
      // console.log(tab, event)
    },
    initModelSelection() {
      const filter = (m) => {
        return m.id.includes('gpt')
      }
      new OpenAI().listEngines()
        .then(res => {
          console.log(res)
          this.modelOptions = res.data.data.filter(filter).map((item) => {
            return {
              label: item.id,
              value: item.id
            }
          })
          const model = storage.get('settings.model') || this.defaultSettings.model
          if (this.modelOptions.find(m => m.value === model)) {
            this.model = model
          } else {
            this.model = ''
          }
          this.$message({
            message: 'api key verified',
            type: 'success'
          })
          this.$emit('ready')
        })
        .catch(e => {
          this.$emit('freeze')
          showErrorMessage(e)
        })
    },
    saveKey() {
      this.apiKey = this.dummyApiKey
      storage.set('settings.openaiKey', this.apiKey)
    },
    saveModel() {
      storage.set('settings.model', this.model)
    }
  }
}
</script>

<style scoped>
.apikey-input {
  padding-bottom: 8px;
}
</style>
