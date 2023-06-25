<template>
  <div class="navbar">
    <div class="okg-title">
      <span>
        OkaGPT
      </span>
    </div>
    <div class="github-link" >
      <el-link type="primary" href="https://github.com/Oka233/OkaGPT" target="_blank">GitHub</el-link>
    </div>
  </div>
</template>

<script>

export default {
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #000000;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);
  .okg-title {
    height: 100%;
    display: flex;
    justify-content: left;
    padding-left: 20px;
    color: #fff;
    span {
      line-height: 50px;
      font-size: 24px;
    }
  }
  .github-link {
    position: absolute;
    right: 20px;
    top: 0;
    padding: 16px 0;
    height: 100%;
  }
}
</style>
