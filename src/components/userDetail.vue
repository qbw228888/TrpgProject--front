<template>
  <div>
    <el-page-header @back="goBack">
    </el-page-header>
    <el-row class="tac">
      <el-col class="col" :span="12">
        <el-menu
          default-active="1"
          class="el-menu-vertical-demo"
          @open="handleOpen"
          @close="handleClose"
          router="true"
        >
          <el-menu-item index="1" @click="goTo('/user')">
            <i class="el-icon-menu"></i>
            <span slot="title">用户信息</span>
          </el-menu-item>
          <el-menu-item index="2" @click="goTo('/myRoom')">
            <i class="el-icon-setting"></i>
            <span slot="title">我的房间</span>
          </el-menu-item>
          <el-menu-item index="3" @click="goTo('/systemMessage')">
            <i class="el-icon-message"></i>
            <span slot="title">系统消息</span>
          </el-menu-item>
        </el-menu>
      </el-col>
      <br/>
      <br/>
      <router-view></router-view>
    </el-row>
  </div>
</template>

<script>

export default {
  name: "userDetail",
  data() {
    return {
    }
  },
  created() {
  },
  methods: {
    goBack(){
      this.$router.push("/main")
    },
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    goTo(path) {
      this.$router.replace(path);
    }
  }
}
</script>

<style scoped>
.col {
  max-width: 200px;
}
</style>
