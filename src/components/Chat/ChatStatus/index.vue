<template>
  <div v-if="showStatus" class="finish-reason-container">
    <el-tag
      v-for="(item, index) in statusTags"
      :key="index"
      :type="item.type"
    >
      {{ item.text }}
    </el-tag>
  </div>
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
      'currentChat'
    ]),
    showStatus() {
      return this.currentChat !== null
    },
    statusTags() {
      if (!this.currentChat) return []
      const finishStatus = []
      // this.currentChat.finishStatus中有empty，转换为undefined
      for (let i = 0; i < this.currentChat.finishStatus.length; i++) {
        finishStatus.push(this.currentChat.finishStatus[i])
      }
      return finishStatus.map(r => {
        switch (r) {
          case 'stop': {
            return {
              type: 'success',
              text: '已完成'
            }
          }
          case 'length': {
            return {
              type: 'warning',
              text: '对话过长'
            }
          }
          case 'content_filter': {
            return {
              type: 'warning',
              text: '触发内容检测'
            }
          }
          case null: {
            return {
              type: '',
              text: '传输中'
            }
          }
          case 'waiting' : {
            return {
              type: 'info',
              text: '等待中'
            }
          }
        }
        return {
          type: '',
          text: '传输中'
        }
      })
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
