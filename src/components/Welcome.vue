<template>
  <div>
    <img src="../../static/pic/cover-logo.png" style="width: 300px; height: 300px">
    <h1 style="text-align: center; size: auto; color: darkgreen">
      {{ welcome }}
    </h1>
    <br/>
    <el-button type="primary" round style="height: 40px; width: 100px;"
               @click="logInFormVisible=true">登 录
    </el-button>
    <br/>
    <br/>
    <el-button type="success" round style="height: 40px; width: 100px;"
               @click="registerFormVisible=true">注 册
    </el-button>

    <el-dialog id="logInDialog" title="登录" :visible.sync="logInFormVisible" @click="logInFormVisible=true">
      <el-radio-group size="small" style="align-self: center"
                      v-model="logInDomain[0].label" @change="handleChange">
        <el-radio-button label="密码">密码登录</el-radio-button>
        <el-radio-button label="验证码" disabled>手机验证码登录</el-radio-button>
      </el-radio-group>
      <br/>
      <br/>
      <el-form :model="logInForm" :rules="rules">
        <el-form-item label="手机号" :label-width="formLabelWidth" prop="phone">
          <el-input v-model="logInForm.phone" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item
          v-for="(domain) in logInDomain"
          :label="domain.label" :label-width="formLabelWidth"
          :prop="domain.prop">
          <el-input v-if="domain.prop === 'password'" v-model="logInForm.password" autocomplete="off" show-password></el-input>
          <el-input v-if="domain.prop === 'code'" v-model="logInForm.code" autocomplete="off" disabled></el-input>
        </el-form-item>
        <el-button v-if="this.logInDomain[0].prop === 'code'" type="text">获取验证码</el-button>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="logInFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="logInConfirm">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="注册" :visible.sync="registerFormVisible">
      <el-form :model="registerForm" :rules="rules">
        <el-form-item label="用户昵称" :label-width="formLabelWidth" prop="username">
          <el-input v-model="registerForm.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机号" :label-width="formLabelWidth" prop="phone">
          <el-input v-model="registerForm.phone" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" :label-width="formLabelWidth" prop="password">
          <el-input v-model="registerForm.password" autocomplete="off" show-password></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="registerFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="registerConfirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {logIn, register} from "../api/user";
import Vue from "vue";

export default {
  name: 'Welcome',
  data() {
    return {
      logInFormVisible: false,
      registerFormVisible: false,
      welcome: '欢迎进入"H·C"TRPG，享受线上跑团',
      logInDomain: [{
        label: '密码',
        prop: 'password',
      }],
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
        code: [
          {required: true, min:4, max:4, message:'请填入4位验证码'}
        ]
      },
      logInForm: {
        phone: null,
        password: null,
        code: null
      },
      registerForm: {
        phone: null,
        username: null,
        password: null,
      },
      formLabelWidth: '120px'
    }
  },
  created() {
    this.logInDomain[0].rule = this.rules[0];
  },
  methods: {
    handleChange(value){
      if (value === '验证码'){
        this.logInDomain[0].prop = 'code';
        this.logInForm.password = null;
      } else {
        this.logInDomain[0].prop='password';
        this.logInForm.code = null;
      }
    },
    setSession(uid,username,token){
      window.sessionStorage.setItem("uid",uid);
      window.sessionStorage.setItem("username",username);
      window.sessionStorage.setItem("token",token);
    },
    logInConfirm() {
      this.logInFormVisible = false;
      logIn(this.logInForm)
        .then(response =>{
          //向cookie中设置信息
          console.log(response.data.uid)
          console.log(response.data.username)
          this.setSession(response.data.uid,response.data.username,response.data.token)
          this.$message({
            type: 'success',
            message: '登录成功!'
          });
          this.$router.push("/main");
        })
      this.logInForm.phone = null;
      this.logInForm.password = null;
      this.logInForm.code = null;
    },
    registerConfirm() {
      this.registerFormVisible = false;
      register(this.registerForm)
        .then(response =>{
          //向session中设置信息
          this.setSession(response.data.uid,response.data.username,response.data.token);
          this.$message({
            type: 'success',
            message: '注册成功!'
          });
          this.$router.push("/main");
        })
      this.registerForm.username = null;
      this.registerForm.password = null;
      this.registerForm.phone = null;
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
