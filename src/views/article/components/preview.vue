<template>
  <div>
    <h2 style="text-align: center;width: 50%;margin-left: 20px;">预览</h2>
    <div class="blog-content" v-html="this.$route.query.content" />
    <p class="tip">本平台所发布信息的内容和准确性有提供消息的原单位或组织独立承担完全责任！</p>
  </div>
</template>
<script>
export default {
  created() {
    console.log(this.$route)
  }
}
</script>
<style scoped>
.blog-content{
    width: 50%;
    margin: 50px auto;
    box-shadow: 0 1px 3px #aaa;
    border: 1px solid #ddd;
    padding:20px
}
.tip{
    text-align: center;
    color: red;
}

</style>
<style>
.blog-content img{
    max-width: 100%
}
</style>
