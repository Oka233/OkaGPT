<template>
  <div class="wizard-container">
    <el-card class="box-card">
      <el-form>
        <el-form-item label="平台:">
          <el-select v-model="platformForm.platformType">
            <el-option value="openai" label="OpenAI" />
          </el-select>
        </el-form-item>
        <el-form-item label="API Key:">
          <el-input v-model="platformForm.apiKey" type="text" />
        </el-form-item>
        <el-form-item>
          <el-button :loading="apiKeyVerifying" @click="confirm">确定</el-button>
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
