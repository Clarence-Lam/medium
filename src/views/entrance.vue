<template>
  <div>
    引导页
  </div>
</template>
<script>
export default {
  beforeCreate() {
    // console.log(this.$store.state.user.roles)
    // console.log(this.$store.state.user.roles.indexOf('customer'))
    if (this.$store.state.user.roles && this.$store.state.user.roles.indexOf('customer') > -1) {
      this.$router.push(
        {
          name: 'home'
        }
      )
    } else {
      this.$router.push(
        {
          name: 'controller'
        }
      )
    }
  }
}
</script>
