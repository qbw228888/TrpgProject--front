<template>
  <div>
    <div style="width: 200px; margin-left:800px;" @click="dialogVisible=true">
      <el-avatar :size="80" icon="el-icon-user-solid" class="avatar"
                 :src="userForm.avatarUrl"></el-avatar>
    </div>
    <br/>
    <br/>
    <el-form :model="userForm" status-icon :rules="rules" label-width="100px" style="width: auto; margin-left: 300px">
      <el-form-item label="用户昵称" prop="username">
        <el-input v-model="userForm.username" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="绑定手机号" prop="phone">
        <el-input v-model="userForm.phone" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input type="password" v-model="userForm.password" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
    <el-dialog :visible="dialogVisible">
      <el-upload
        drag="true"
        with-credentials="true"
        class="avatar-uploader"
        :http-request="upload"
        :show-file-list="false"
        :on-success="handleAvatarSuccess"
        :before-upload="beforeAvatarUpload">
        <img v-if="imageUrl" :src="imageUrl" class="avatar">
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
    </el-dialog>
  </div>
</template>

<script>
import {getUser, saveUser, uploadAvatar} from "../api/user";

export default {
  name: "user",
  data() {
    return {
      header:{
        Authorization: window.sessionStorage.getItem("token")
      },
      dialogVisible: false,
      userForm:{
        uid: null,
        username: null,
        phone: null,
        password: null,
        avatarUrl: null
      },
      rules: {
        username: [
          {required: true, message:'昵称不能为空'}
        ],
        phone: [
          {required: true, min:11, max:11, message:'请填入11位手机号'}
        ],
        password: [
          {required: true, min:8, max:20, message:'请填入8-20位密码'}
        ],
      },
      imageUrl: ''
    }
  },
  created() {
    this.initForm();
    console.log(this.userForm.avatarUrl)
  },
  methods: {
    initForm(){
      getUser(window.sessionStorage.getItem("uid"))
        .then(response => {
          let user = response.data;
          console.log(user)
          this.userForm.username = user.username;
          this.userForm.password = user.password;
          this.userForm.phone = user.phone;
          this.userForm.avatarUrl = user.avatarUrl;
        })
    },
    // getAvatar(){
    //   const ftp = require('ftp');//连接FTP
    //   const client = new ftp();
    //   client.on('ready',()=>{
    //     console.log('ftp client is ready');
    //   });
    //   client.connect({
    //     host : '43.138.44.237',
    //     port : '21',
    //     user : 'halden',
    //     password : '228888',
    //     keepalive : 1000
    //   });
    // },
    submitForm(){
      this.userForm.uid = window.sessionStorage.getItem("uid")
      saveUser(this.userForm)
        .then(response => {
          this.$message({
            message: "修改成功",
            type: "success",
          })
          this.initForm();
        })
    },
    resetForm(){
      this.userForm.phone = null;
      this.userForm.username = null;
      this.userForm.password = null;
    },
    upload(param) {
      const formData = new FormData()
      formData.append('file', param.file)
      uploadAvatar(formData)
        .then(response => {
          this.$message({
            message: "上传成功",
            type: "success",
          })
          this.dialogVisible = false;
        })
    },
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
      console.log(this.imageUrl)
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
    }
  }
}
</script>

<style scoped>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
