<template>
  <div class="app-container">
    <h3 style="padding-left: 20px;">问答推广配置</h3>
    <TypeName :types-name="typesName" :dept="'question'" />
  </div>
</template>
<script>
import TypeName from '../components/TypeName'
import { getTypesName } from '@/api/setting'
export default {
  name: 'QuestionTypes',
  components: { TypeName },
  data() {
    return {
      typesName: []
    }
  },
  created() {
    this.getTypesName()
  },
  methods: {
    getTypesName() {
      this.listLoading = true
      getTypesName({ dept: 'question' }).then(res => {
        typeof (res.data)
        this.typesName = res.data
      })
    }
  }
}
</script>
