<template>
  <div>
    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect"
    style="margin-left: 300px" router="true">
      <el-menu-item index="myJoin" @click="goTo('/myJoin')">我加入的</el-menu-item>
      <el-menu-item index="myCreate" @click="goTo('/myCreate')">我创建的</el-menu-item>
    </el-menu>
    <br/>
    <br/>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "myRoom",
  data() {
    return {
      activeIndex: 'myJoin',
    }
  },
  methods: {
    goTo(path) {
      this.$router.replace(path);
    }
  }
}
</script>

<style scoped>

</style>
