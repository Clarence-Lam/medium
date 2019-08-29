<template>
  <div style="display: inline-block;margin: 5px 8px;">
    <el-tag
      :hit="true"
      closable
      effect="dark"
      type="success"
      @close="handleClose(item)"
    >{{ item.name }}{{ item.num !== 1?'×'+ item.num:'' }}
    </el-tag>
  </div>
</template>
<script>
export default {
  props: {
    item: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  methods: {
    handleClose(tag) {
      this.$parent.delSelection(tag)
    }
  }
}
</script>
