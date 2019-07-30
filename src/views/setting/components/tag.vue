<template>
  <div class="tag-inline">
    <el-tag
      v-for="tag in dynamicTags"
      :key="tag.id"
      closable
      :disable-transitions="false"
      @close="handleClose(tag.id)"
    >
      {{ tag.name }}
    </el-tag>
    <el-input
      v-if="inputVisible"
      ref="saveTagInput"
      v-model="inputValue"
      class="input-new-tag"
      size="small"
      @keyup.enter.native="handleInputConfirm"
      @blur="handleInputConfirm"
    />
    <el-button v-else class="button-new-tag" size="small" @click="showInput">+ 新标签</el-button>
  </div>
</template>
<script>
import { getTypesContent, delTag, addTypesContent } from '@/api/setting'
export default {
  props: {
    id: {
      type: String,
      default: ''
    },
    typeName: {
      type: String,
      default: ''
    },
    deptName: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      dynamicTags: [],
      inputVisible: false,
      inputValue: ''
    }
  },
  created() {
    this.getList()
  },
  methods: {
    handleClose(id) {
    //   this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1)
      delTag(id).then(result => {
        this.$message({
          message: result.msg,
          type: 'success'
        })
        this.getList()
      })
    },

    showInput() {
      this.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },

    handleInputConfirm() {
      const inputValue = this.inputValue
      if (inputValue) {
        // this.dynamicTags.push(inputValue)
        addTypesContent({ id: this.id, name: inputValue, type_name: this.typeName, dept: this.deptName }).then(result => {
          this.$message({
            message: result.msg,
            type: 'success'
          })
          this.getList()
        })
      }
      this.inputVisible = false
      this.inputValue = ''
    },
    getList() {
      getTypesContent({ id: this.id }).then(result => {
        this.dynamicTags = result.data
      })
    }
  }
}
</script>
<style>
    .tag-inline{
        display: inline;
    }
    .el-tag + .el-tag {
        margin-left: 10px;
    }
    .button-new-tag {
        margin-left: 10px;
        height: 32px;
        line-height: 30px;
        padding-top: 0;
        padding-bottom: 0;
    }
    .input-new-tag {
        width: 90px;
        margin-left: 10px;
        vertical-align: bottom;
    }
</style>
