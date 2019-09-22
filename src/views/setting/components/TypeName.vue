<template>
  <div>
    <template v-for="item in typesName">
      <div :key="item.id" class="type-box">
        <p class="tag-inline">{{ item.name }}：</p>
        <Tag
          :id="item.id"
          :type-name="item.name"
          :dept-name="item.dept"
        />
        <el-tooltip
          v-if="item.name === '包补时间'"
          style="margin-left:10px"
          effect="dark"
          content="格式必须为数字+天数，例如‘3天’或‘7天以上’；‘XX天以上‘，需要手动更改状态为完成"
          placement="top"
        >
          <i class="el-icon-question" />
        </el-tooltip>
      </div>

    </template>
    <div class="type-box">
      <p class="tag-inline">预计完成时间：</p>
      <el-tag
        v-for="tag in expectedTime"
        :key="tag.id"
        closable
        :disable-transitions="false"
        @close="delExpectedTime(tag.id)"
      >
        {{ tag.name }}
      </el-tag>
      <el-input
        v-if="inputVisible"
        ref="saveTagInput"
        v-model="inputValue"
        class="input-new-tag"
        size="small"
        @keyup.enter.native="addExpectedTime"
        @blur="addExpectedTime"
      />
      <el-button v-else class="button-new-tag" size="small" @click="showInput">+ 时间</el-button>
      <el-tooltip
        style="margin-left:10px"
        effect="dark"
        content="格式必须为数字+天，例如‘3天’"
        placement="top"
      >
        <i class="el-icon-question" />
      </el-tooltip>
      <p class="tag-inline sec-inline">默认选中时间：</p>
      <el-select v-model="defaultValue" placeholder="请选择" @change="changeDefault">
        <el-option
          v-for="item in expectedTime"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
    </div>
  </div>
</template>
<script>
import Tag from '../components/tag'
import { getExpectedTime, addExpectedTime, delExpectedTime, changeDefault } from '@/api/setting'

export default {
  name: 'TypeName',
  components: { Tag },
  props: {
    typesName: {
      type: Array,
      default() {
        return []
      }
    },
    dept: {
      type: String,
      default() {
        return ''
      }
    }
  },
  data() {
    return {
      expectedTime: [],
      inputVisible: false,
      inputValue: '',
      defaultValue: ''
    }
  },
  computed: {
    currentTypesName: {
      get() {
        return this.typesName
      },
      set(val) {
        this.$emit('update:typesName', val)
      }
    }
  },
  created() {
    this.getExpectedTime()
  },
  updated() {
    this.show()
  },
  methods: {
    show() {
    //   console.log(this.currentTypesName)
    },
    getExpectedTime() {
      getExpectedTime({ dept: this.dept }).then(res => {
        typeof (res.data)
        this.expectedTime = res.data
        for (const item of this.expectedTime) {
          if (item.is_default === '1') {
            this.defaultValue = item.name
          }
        }
      })
    },
    addExpectedTime() {
      const inputValue = this.inputValue
      if (inputValue) {
        addExpectedTime({ name: inputValue, dept: this.dept }).then(result => {
          this.$message({
            message: result.msg,
            type: 'success'
          })
          this.getExpectedTime()
        })
      }
      this.inputVisible = false
      this.inputValue = ''
    },
    delExpectedTime(id) {
      delExpectedTime(id).then(result => {
        this.$message({
          message: result.msg,
          type: 'success'
        })
        this.getExpectedTime()
      })
    },
    showInput() {
      this.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    changeDefault(val) {
      changeDefault({ id: val, dept: this.dept }).then(result => {
        this.$message({
          message: result.msg,
          type: 'success'
        })
      })
    }
  }
}
</script>
<style scoped>
.tag-inline{
    display: inline;
}
.type-box{
    padding: 20px;
    margin: 20px;
    border: 1px solid #ebebeb;
    border-radius: 4px
}
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
.sec-inline{
    margin-left: 20px;
}
</style>
