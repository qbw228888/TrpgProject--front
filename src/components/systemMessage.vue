<template>
  <div>
    <JwChat :taleList="list" @enter="bindEnter" @clickTalk="talkEvent" v-model="inputMsg"
            :toolConfig="tool">
      <template slot="tools">
        <div style="width:20rem;text-align:right;" @click="toolEvent('自定义')">
          <b slot="tools">插槽</b>
          <JwChat-icon type="icon-lishi" title="自定义"/>
        </div>
      </template>
    </JwChat>
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="30%">
      <span>{{dialogMessage}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="danger" @click="reject">拒 绝</el-button>
        <el-button type="primary" @click="pass">通 过</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>


import {getList, sendMessage} from "../api/systemMessage";
import {getAvatar} from "../api/user";
import {backForJoin} from "../api/room";

export default {
  name: "systemMessage",
  data() {
    return {
      timeOut: null,
      applyRid: null,
      applierUid: null,
      dialogVisible: false,
      dialogMessage: null,
      dialogTitle: null,
      SYSTEM_NAME : "系统",
      SYSTEM_IMG : "http://localhost:9001/file/avatar/system.jpg",
      username : window.sessionStorage.getItem("username"),
      uid: window.sessionStorage.getItem("uid"),
      avatarUrl: null,
      inputMsg: '',
      list: [],
      tool: {
        callback: this.toolEvent
      }
    }
  },
  created() {
    this.getList();
    this.getAvatar();
    this.testTimeOut();
  },
  methods: {
    testTimeOut(){
      this.timeOut = setTimeout(() => {
        console.log("reloading")
        this.getList();
        clearTimeout(this.timeOut);
        this.testTimeOut();
      },10000)
    },
    bindEnter (e) {
      console.log(e)
      const msg = this.inputMsg
      if (!msg) return;
      const msgObj = {
        "date": this.getCurrentTime(),
        "text": { "text": msg },
        "mine": true,
        "name": window.sessionStorage.getItem("username"),
        "img": this.avatarUrl
      }
      this.list.push(msgObj)
      let message = {
        uid: this.uid,
        createTime: msgObj.date,
        message: msg
      }
      sendMessage(message);
    },
    getList(){
      getList(this.uid)
        .then(response => {
          let rList = response.list
          if (rList.length > this.list.length) {
            for (let i = this.list.length; i < rList.length; i++) {
              let item = rList[i];
              let message = null;
              if (item.mine == false) {
                message = {
                  date: item.date,
                  mine: false,
                  name: this.SYSTEM_NAME,
                  img: this.SYSTEM_IMG,
                  text: {
                    system: {
                      title: item.title,
                      content: [
                        {
                          rid: null,
                          applierUid: null,
                          isAdd: false,
                          text: item.message
                        }
                      ]
                    }
                  }
                };
                //是请求加入的消息
                if (item.messageType != '0') {
                  message.text.system.content[0].isAdd = true;
                  message.text.system.content[0].applierUid = item.messageType;
                  message.text.system.content[0].rid = item.rid;
                }
              } else {
                message = {
                  date: item.date,
                  mine: true,
                  name: this.username,
                  img: this.avatarUrl,
                  text: {text: item.message},
                }
              }
              this.list.push(message);
            }
          }
        })
    },
    toolEvent (type, obj) {
      console.log('tools', type, obj)
    },
    talkEvent (play) {
      console.log(play)
      if (play.data.isAdd == true){
        this.applierUid = play.data.applierUid;
        this.applyRid = play.data.rid;
        this.dialogVisible = true;
        this.dialogTitle = "申请加入";
        this.dialogMessage = play.data.text;
      }
    },
    pass(){
      this.dialogVisible = false;
      backForJoin(this.applyRid,this.applierUid,true)
        .then(response => {
          this.$message({
            type: 'success',
            message: '操作成功'
          })
        })
    },
    reject(){
      this.dialogVisible = false;
      backForJoin(this.applyRid,this.applierUid,false)
        .then(response => {
          this.$message({
            type: 'success',
            message: '操作成功'
          })
        })
    },
    getAvatar(){
      console.log("ddd");
      getAvatar(this.uid)
        .then(response => {
          this.avatarUrl = response.data;
        })
    },
    getCurrentTime() {
      //获取当前时间并打印
      let _this = this;
      let yy = new Date().getFullYear();
      let mm = new Date().getMonth()+1;
      let dd = new Date().getDate();
      let hh = new Date().getHours();
      let mf = new Date().getMinutes()<10 ? '0'+new Date().getMinutes() : new Date().getMinutes();
      let ss = new Date().getSeconds()<10 ? '0'+new Date().getSeconds() : new Date().getSeconds();
      _this.gettime = yy+'-'+mm+'-'+dd+' '+hh+':'+mf+':'+ss;
      return(_this.gettime)
    }
  }
}
</script>

<style scoped>
</style>
