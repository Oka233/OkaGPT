<template>
  <div class="dashboard-container">
<!--    <div class="dashboard-text">name: {{ name }}</div>-->
    <ChatManager
      ref="chatManager"
      class="chat-left"
    />
    <div class="chat-right">
      <el-button @click="$refs.chatManager.addChat()">add chat</el-button>
      <ChatSettings
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
      this.$refs.chatManager.startChat()
    },
    freezeChat() {
      this.$refs.chatManager.freezeChat()
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
