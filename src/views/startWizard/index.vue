<template>
  <div class="wizard-container">
    <el-card style="width:300px;">
      <div slot="header">
        <span>开始</span>
      </div>
      <el-form>
        <el-form-item label="平台:">
          <el-select v-model="platformForm.platformType" style="width: 258px;">
            <el-option value="openai" label="OpenAI" />
          </el-select>
        </el-form-item>
        <el-form-item label="API Key:">
          <el-input v-model="platformForm.apiKey" type="text" style="width: 258px;" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="apiKeyVerifying" @click="confirm">确定</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { IChatModel } from '@/utils/Models/IChatModel'
import router from '@/router'
import storage from '@/utils/storage'
import store from '@/store'
import { mapGetters } from 'vuex'

export default {
  name: 'StartWizard',
  data() {
    return {
      apiKeyVerifying: false,
      dialogVisible: true,
      platformForm: {
        platformType: 'openai',
        apiKey: 'sk-'
      }
    }
  },
  computed: {
    ...mapGetters([
      'platformType',
      'openaiSettings'
    ])
  },
  created() {
    this.platformForm.platformType = this.platformType || this.platformForm.platformType
    this.platformForm.apiKey = this.openaiSettings.apiKey || this.platformForm.apiKey
  },
  methods: {
    async confirm() {
      this.apiKeyVerifying = true
      try {
        const chatModel = new IChatModel(this.platformForm.platformType)
        const message = await chatModel.verifyKey(this.platformForm.apiKey)
        this.$message.success(message)
        this.$store.commit('sys/setPlatformType', this.platformForm.platformType)
        this.$store.commit('sys/setChatModel', this.platformForm.platformType)
        this.$store.commit('openai/setApiKey', this.platformForm.apiKey)
        this.$store.commit('sys/ready', true)
        store.getters.chatModel.loadSettings()
        store.getters.chatModel.init()
        // 存储设置
        storage.save()

        router.push({ path: `/chat` })
      } catch (e) {
        this.$message.error(e.message)
      }
      this.apiKeyVerifying = false
    }
  }
}
</script>

<style scoped lang="scss">
.wizard-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 20vh;
}
</style>
