<template>
  <div>
    <div class="div" @click="showUserDetail">
      <el-avatar icon="el-icon-user-solid" class="avatar" :src="avatarUrl"></el-avatar>
      <br>
      欢迎，{{username}}
    </div>
    <el-row class="tac">
      <el-col class="col" :span="12">
        <el-menu
          default-active="2"
          class="el-menu-vertical-demo"
          @open="handleOpen"
          @close="handleClose"
          router="true"
        >
          <el-menu-item index="/roomList" @click="goTo('/roomList')">
            <i class="el-icon-menu"></i>
            <span slot="title">房间列表</span>
          </el-menu-item>
          <el-menu-item index="/create" @click="goTo('/create')">
            <i class="el-icon-setting"></i>
            <span slot="title">创建房间</span>
          </el-menu-item>
        </el-menu>
      </el-col>
      <br/>
      <br>
      <router-view></router-view>
    </el-row>
  </div>
</template>
<script>

import {getAvatar} from "../api/user";

export default {
  name: "main",
  data() {
    return {
      username: null,
      avatarUrl: null
    };
  },
  created() {
    this.username = window.sessionStorage.getItem("username")
    this.getAvatar();
  },
  methods: {
    getAvatar(){
      getAvatar(window.sessionStorage.getItem("uid"))
        .then(response => {
          this.avatarUrl = response.data;
        })
    },
    showUserDetail(){
      this.$router.push('/userDetail')
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
};
</script>

<style scoped>
.col {
  max-width: 200px;
}
.avatar {
  width: 40px;
  margin-left: auto;
  margin-right: auto;
}
.div {
  width: 100px;
  margin-left: 1300px;
}
.button{
  width: 100px;
  float: right;
}

</style>
