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
