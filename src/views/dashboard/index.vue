<template>
  <div class="dashboard-container">
<!--    <div class="dashboard-text">name: {{ name }}</div>-->
    <ChatManager
      ref="chatManager"
      class="chat-left"
      :get-setting="getSetting"
    />
    <div class="chat-right">
      <el-button @click="$refs.chatManager.addChat()">Add New Chat</el-button>
      <ChatSettings
        ref="chatSettings"
        @ready="startChat"
        @freeze="freezeChat"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ChatManager from '@/components/ChatManager/index.vue'
import ChatSettings from '@/components/ChatSettings/index.vue'

export default {
  name: 'Dashboard',
  components: { ChatSettings, ChatManager },
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
    startChat() {
      // 没有保证在chatManager mounted之后调用，出错了再检查这里
      this.$refs.chatManager.allowChat()
    },
    freezeChat() {
      this.$refs.chatManager.freezeChat()
    },
    getSetting(key) {
      return this.$refs.chatSettings.getSetting(key)
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
