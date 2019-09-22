<template>
  <div class="app-container">
    <h3 style="padding-left: 20px;">媒体推广配置</h3>
    <TypeName :types-name="typesName" :dept="'medium'" />
  </div>
</template>
<script>
import TypeName from '../components/TypeName'
import { getTypesName } from '@/api/setting'
export default {
  name: 'MediumTypes',
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
      getTypesName({ dept: 'medium' }).then(res => {
        typeof (res.data)
        this.typesName = res.data
      })
    }
  }
}
</script>
