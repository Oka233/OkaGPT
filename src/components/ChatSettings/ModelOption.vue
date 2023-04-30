<template>
  <div class="model-option-container" :class="{'model-option-container-inline': inline}">
    <el-checkbox v-model="localChecked" @change="$emit('change')">{{name}}</el-checkbox>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'ModelOption',
  model: {
    prop: 'checked',
    event: 'checkChange'
  },
  watch: {
    localChecked(val) {
      this.$emit('checkChange', val)
    },
    checked(val) {
      this.localChecked = val
    }
  },
  props: {
    checked: {
      Type: Boolean
    },
    name: {
      type: String,
      default: ''
    },
    inline: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      localChecked: this.checked
    }
  }
}
</script>

<style lang="scss" scoped>
.model-option-container {
  display: flex;
  flex-flow: column;
}
.model-option-container-inline {
  flex-flow: row;
}
</style>
