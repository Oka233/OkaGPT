<template>
<!--  <el-card>-->
<!--    <div slot="header">-->
<!--      <span>传输状态</span>-->
<!--    </div>-->
<!--    {{currentChat && currentChat.messageHistory.usage}}-->
<!--    {{currentChat && currentChat.finishStatus}}-->
    <div v-if="currentChat" class="finish-reason-container">
      <el-tag v-for="(item, index) in currentChat.finishStatus" :key="index" :type="mapFinishReason(item)[0]">{{ mapFinishReason(item)[1] }}</el-tag>
    </div>
<!--    <el-progress v-for="(item, index) in progressList" :key="index" :percentage="item.percentage" :format="item.format"></el-progress>-->
<!--  </el-card>-->
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'ChatStatus',
  props: {
    usage: {
      type: Object
    },
    maxTokens: {
      type: Object
    }
  },
  computed: {
    ...mapGetters([
      'chats',
      'currentRoomId'
    ]),
    currentChat() {
      return this.chats.find(c => c.chatId === this.currentRoomId)
    },
    // progressList() {
    //   return [
    //     {
    //       percentage: this.usage.prompt_tokens,
    //       format: () => {
    //         return `${this.usage.prompt_tokens} / ${this.maxTokens.prompt_tokens}`
    //       }
    //     },
    //     {
    //       percentage: this.usage.completion_tokens,
    //       format: () => {
    //         return `${this.usage.completion_tokens} / ${this.maxTokens.completion_tokens}`
    //       }
    //     },
    //     {
    //       percentage: this.usage.total_tokens,
    //       format: () => {
    //         return `${this.usage.total_tokens} / ${this.maxTokens.total_tokens}`
    //       }
    //     }
    //   ]
    // }
  },
  data() {
    return {
    }
  },
  methods: {
    mapFinishReason(f) {
      switch (f) {
        case 'stop': {
          return ['success', '已完成']
        }
        case 'length': {
          return ['warning', '对话过长']
        }
        case 'content_filter': {
          return ['warning', '触发内容检测']
        }
        case null: {
          return ['', '传输中']
        }
        case 'waiting' : {
          // empty
          return ['info', '等待中']
        }
        default : {
          // empty
          return ['', '传输中']
        }
      }
    }
  }
}
</script>

<style scoped>
.finish-reason-container {
  display: flex;
  gap: 8px;
  padding-bottom: 8px;
}
</style>
