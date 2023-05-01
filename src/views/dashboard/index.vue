<template>
  <div class="dashboard-container">
<!--    <div class="dashboard-text">name: {{ name }}</div>-->
    <ChatContainer
      class="chat-left"
      @add-chat="addChat"
    />
    <div class="chat-right">
      <el-button type="primary" @click="addChat">Add New Chat</el-button>
      <ChatSettings/>
      <ChatStatus/>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ChatSettings from '@/components/ChatSettings/index.vue'
import ChatStatus from '@/components/ChatStatus/index.vue'
import storage from '@/utils/storage'
import GPTUtils from '@/utils/Chat/Chat'
import ChatContainer from '@/components/ChatContainer/index.vue'

export default {
  name: 'Dashboard',
  components: { ChatContainer, ChatStatus, ChatSettings },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  data() {
    return {
    }
  },
  mounted() {
  },
  methods: {
    addChat() {
      if (!storage.get('openaiSettings.apiKey')) {
        if (!storage.get('openaiSettings.autoStart')) {
          this.$message({
            message: 'Please set your OpenAI API key first',
            type: 'warning'
          })
        }
        return
      }
      this.$store.commit('chat/ADD_CHAT', GPTUtils.getChat({
      }))
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 12px;
    display: flex;
    gap: 8px;
    .chat-left {
      flex: 1;
    }
    .chat-right {
      flex-basis: 300px;
      display: flex;
      flex-flow: column;
      gap: 8px;
    }
  }
  //&-text {
  //  font-size: 30px;
  //  line-height: 46px;
  //}
}
</style>
