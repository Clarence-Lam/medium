<template>
  <div class="app-container">
    <h3 class="app-container-title">问答推广/类目配置</h3>
    <hr class="app-container-hr">
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
