<template>
  <div class="dashboard-container">
<!--    <div class="dashboard-text">name: {{ name }}</div>-->
    <div>
      <ChatManager
      />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ChatContainer from '@/components/ChatContainer/index.vue'
import GPTUtils from '@/utils/Chat/Chat.js'
import ChatManager from '@/components/ChatManager/index.vue'

export default {
  name: 'Dashboard',
  components: { ChatManager, ChatContainer },
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

  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
