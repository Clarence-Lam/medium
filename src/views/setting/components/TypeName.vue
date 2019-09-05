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
  </div>
</template>
<script>
import Tag from '../components/tag'
export default {
  name: 'TypeName',
  components: { Tag },
  props: {
    typesName: {
      type: Array,
      default() {
        return []
      }
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
  updated() {
    this.show()
  },
  methods: {
    show() {
      console.log(this.currentTypesName)
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
</style>
