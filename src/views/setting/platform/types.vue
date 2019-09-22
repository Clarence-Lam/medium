<template>
  <div class="app-container">
    <h3 style="padding-left: 20px;">平台推广配置</h3>
    <TypeName :types-name="typesName" :dept="'platform'" />
  </div>
</template>
<script>
import TypeName from '../components/TypeName'
import { getTypesName } from '@/api/setting'
export default {
  name: 'PlatformTypes',
  components: { TypeName },
  data() {
    return {
      typesName: [],
      expectedTime: []
    }
  },
  created() {
    this.getTypesName()
  },
  methods: {
    getTypesName() {
      this.listLoading = true
      getTypesName({ dept: 'platform' }).then(res => {
        typeof (res.data)
        this.typesName = res.data
      })
    }
  }
}
</script>
