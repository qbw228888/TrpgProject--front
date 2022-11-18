<template>
  <div>
    <div style="align-items: center; font-size: larger">
      {{roomName}}
    </div>
    <br>
    <br>
    <el-row>
      <el-col :span="2">
      </el-col>
      <el-col :span="13">
        <el-image :src="bigPicSrc" fit="contain" style="width: 600px; height: 600px"></el-image>
      </el-col>
      <el-col :span="9">
        <div style="display: flex; flex-direction: row">
          本团昵称：
          <el-input v-model="nickname"></el-input>
          <el-button type="primary" size="mini" @click="setNickname">更改</el-button>
        </div>
        <JwChat :taleList="list" @enter="bindEnter" @clickTalk="talkEvent" v-model="inputMsg"
                :toolConfig="tool">
          <template slot="tools">
            <div style="width:20rem;text-align:right;" @click="diceEvent">
              <b slot="tools">掷骰</b>
            </div>
          </template>
        </JwChat>
      </el-col>
    </el-row>
    <el-dialog
        title="提示"
        :visible.sync="dialogVisible"
        width="30%">
      <el-tabs type="border-card" v-model="diceInput.inputType">
        <el-tab-pane label="属性检定" name="attribute">
          <div style="display: flex; flex-direction: row;">
            属性名称：
            <el-input v-model="diceInput.attributeTest.name" placeholder="请输入内容"></el-input>
          </div>
          <div style="display: flex; flex-direction: row;">
            属性数值：
            <el-input v-model="diceInput.attributeTest.num" type="number" placeholder="请输入0-100的数字"></el-input>
          </div>
        </el-tab-pane>
        <el-tab-pane label="单纯掷骰" name="single">
          <div style="display: flex; flex-direction: row;">
            <el-input v-model="diceInput.singleDice.d" type="number"></el-input>
            &emsp;&emsp;&emsp;d&emsp;&emsp;&emsp;
            <el-input v-model="diceInput.singleDice.num" type="number"></el-input>
          </div>
        </el-tab-pane>
        <el-tab-pane label="SC检定" name="sc">
          <div style="display: flex; flex-direction: row;">
            剩余san值：
            <el-input v-model="diceInput.sc.scNum" type="number" placeholder="请输入0-100的数字"></el-input>
          </div>
          san值减少：
          <div style="display: flex; flex-direction: row;">
            成功：
            <el-input v-model="diceInput.sc.success.d" type="number"></el-input>
            &emsp;&emsp;&emsp;d&emsp;&emsp;&emsp;
            <el-input v-model="diceInput.sc.success.num" type="number"></el-input>
          </div>
          <div style="display: flex; flex-direction: row;">
            失败：
            <el-input v-model="diceInput.sc.fail.d" type="number"></el-input>
            &emsp;&emsp;&emsp;d&emsp;&emsp;&emsp;
            <el-input v-model="diceInput.sc.fail.num" type="number"></el-input>
          </div>
        </el-tab-pane>
      </el-tabs>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="diceConfirm">确 定</el-button>
      </span>
    </el-dialog>
    <div id="aplayer"></div>
  </div>
</template>

<script>

import {useWebSocket} from "@/api/websocket";
import {getAvatar} from "@/api/user";
import {getMessage} from "@/api/message";
import {getMusics, getNickname, setNickname} from "@/api/room";
import 'aplayer/dist/APlayer.min.css';
import APlayer from 'aplayer';

export default {
  name: 'room',
  data() {
    return {
      ap: null,
      roomName: this.$route.params.roomName,
      bigPicSrc: null,
      rid: 0,
      ws:'',
      inputMsg: '',
      list: [],
      tool: {
        callback: this.toolEvent
      },
      avatarUrl: null,
      dialogVisible: false,
      diceInput: {
        inputType: 'attribute',
        attributeTest: {
          name: null,
          num: 0
        },
        singleDice: {
          d: 0,
          num: 0
        },
        sc: {
          scNum: 0,
          success:{
            d: 0,
            num: 0
          },
          fail: {
            d: 0,
            num: 0
          }
        }
      },
      nickname: null,
      audios: [],
      info: {
        fixed: true, // 不开启吸底模式
        listFolded: true, // 折叠歌曲列表
        autoplay: false, // 开启自动播放
        preload: "auto", // 自动预加载歌曲
        loop: "all", // 播放循环模式、all全部循环 one单曲循环 none只播放一次
        order: "list", //  播放模式，list列表播放, random随机播放
      },
    }
  },
  created() {
    this.init();
    this.getList();
    this.getNickname();
  },
  mounted() {
    this.initAudio();
  },
  methods: {
    init(){
      this.rid = this.$route.params.rid
      this.ws = useWebSocket(this.handleMessage, window.sessionStorage.getItem("uid"), this.rid);
    },
    handleMessage(evt) {
      if (evt.data) {
        console.log("获取到的数据为:"+evt.data)
      }
      let msgObj = JSON.parse(evt.data)
      if (msgObj.type == "message") {
        getAvatar(msgObj.fromUserId)
            .then(response => {
              const msg = {
                "date": msgObj.createTime,
                "text": {"text": msgObj.message},
                "mine": false,
                "name": msgObj.username,
                "img": response.data
              }
              console.log(msgObj)
              this.list.push(msg)
            })
      }
      else if (msgObj.type == "changePic"){
        this.bigPicSrc = msgObj.src;
      }
      else if (msgObj.type == "addMusic"){
        this.ap.list.add(msgObj.audio)
      }
      else if (msgObj.dice != null){
        getAvatar('dice')
            .then(response => {
              const msg = {
                "date": msgObj.createTime,
                "text": { "text": msgObj.message },
                "mine": false,
                "name": msgObj.username,
                "img": response.data
              }
              console.log(msg.img)
              this.list.push(msg)
            })
        return
      }
    },
    sendMsg(msg){
      this.ws.send(msg)
    },
    close(){
      this.ws.close();
    },
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
      getAvatar(window.sessionStorage.getItem("uid"))
          .then(response => {
            const msgObj = {
              "date": this.getCurrentTime(),
              "text": { "text": msg },
              "mine": true,
              "name": window.sessionStorage.getItem("username"),
              "img": response.data
            }
            console.log(msgObj.img)
            this.list.push(msgObj)
            let message = {
              type: "message",
              username: window.sessionStorage.getItem("username"),
              createTime: msgObj.date,
              message: msg
            }
            let messageStr = JSON.stringify(message)
            this.sendMsg(messageStr)
          })
    },
    diceEvent()  {
      console.log('dice')
      this.dialogVisible = true
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
    getList(){
      getMessage(this.rid)
          .then(async response => {
            let rList = response.data
            for (let i = 0; i < rList.length; i++) {
              let item = rList[i];
              await getAvatar(item.uid).then(avatarResp => {
                let message = {
                  date: item.createTime,
                  mine: false,
                  name: item.username,
                  img: avatarResp.data,
                  text: {text: item.message}
                };
                if (item.uid != window.sessionStorage.getItem("uid")) {
                  message.mine = false
                } else {
                  message.mine = true
                }
                console.log(item)
                console.log(message.text)
                this.list.push(message);
              })
            }
          })
    },
    sleep (time) {
      return new Promise(resolve => {
        setTimeout(resolve, time);
      });
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
    },
    diceConfirm () {
      this.dialogVisible = false;
      let msg = null;
      console.log(this.diceInput.inputType)
      if (this.diceInput.inputType == 'attribute') {
        let random = Math.floor(Math.random() * 100 + 1);
        let name = this.diceInput.attributeTest.name;
        let num = this.diceInput.attributeTest.num;
        let msgM = '进行' + name + '检测，属性值为'+ num +'。rd100=' + random;
        if (random <= 5) {
          msg = msgM + '，大成功';
        } else if (random <= Math.floor(num / 5)) {
          msg = msgM + '，极难成功';
        } else if (random <= Math.floor(num / 2)) {
          msg = msgM + '，困难成功';
        } else if (random <= num) {
          msg = msgM + '，成功';
        } else if (random <= 95) {
          msg = msgM + '，失败';
        } else {
          msg = msgM + '，大失败';
        }
      }
      else if (this.diceInput.inputType == 'single') {
        let d = this.diceInput.singleDice.d;
        let num = this.diceInput.singleDice.num;
        let result = 0;
        msg = d+'d'+num+'=';
        for (let i = 0; i < d; i++){
          let random = Math.floor(Math.random() * num + 1);
          result += random;
          msg += random+'+';
        }
        msg = msg.substring(0, msg.length-1)
        msg += '='+result
        console.log(msg)
      }
      else if (this.diceInput.inputType == 'sc') {
        let random = Math.floor(Math.random() * 100 + 1);
        let scNum = this.diceInput.sc.scNum;
        let successD = this.diceInput.sc.success.d;
        let successNum = this.diceInput.sc.success.num;
        let failD = this.diceInput.sc.fail.d;
        let failNum = this.diceInput.sc.fail.num;
        let msgM = '进行SC检定，剩余san值为'+ scNum +'。rd100=' + random;
        if (random <= 5) {
          msg = msgM + '，大成功。损失san值'+successD+'点';
        } else if (random <= scNum) {
          msg = msgM + '，成功。';
          let result = 0;
          for (let i = 0; i < successD; i++){
            result += Math.floor(Math.random() * successNum + 1);
          }
          msg += '损失san值'+result+'点';
        } else if (random <= 95) {
          msg = msgM + '，失败。';
          let result = 0;
          for (let i = 0; i < failD; i++){
            result += Math.floor(Math.random() * failNum + 1);
          }
          msg += '损失san值'+result+'点';
        } else {
          msg = msgM + '，大失败。';
          let result = failD * failNum;
          msg += '损失san值'+result+'点';
        }
      }
      getAvatar('dice')
          .then(response => {
            const msgObj = {
              "date": this.getCurrentTime(),
              "text": { "text": msg },
              "mine": false,
              "name": '骰娘',
              "img": response.data
            }
            console.log(msgObj.img)
            this.list.push(msgObj)
            let message = {
              dice: true,
              username: '骰娘',
              createTime: msgObj.date,
              message: msg
            }
            let messageStr = JSON.stringify(message)
            this.sendMsg(messageStr)
          })
    },
    getNickname(){
      getNickname(this.rid, window.sessionStorage.getItem("uid"))
          .then(response =>{
            if (response.data == null){
              this.nickname = window.sessionStorage.getItem("username")
            } else {
              this.nickname = response.data.nickname
            }
            console.log(this.nickname)
          })
    },
    setNickname() {
      setNickname(this.rid, window.sessionStorage.getItem("uid"), this.nickname)
          .then(response => {
            this.$message({
              message: "设置成功",
              type: "success",
            })
          })
    },
    initAudio() {
      // 创建一个音乐播放器实例，并挂载到DOM上，同时进行相关配置
      this.ap = new APlayer({
        container: document.getElementById("aplayer"),
        audio: this.audios, // 音乐信息
        ...this.info, // 其他配置信息
      });
      getMusics(this.rid)
          .then(response => {
            this.ap.list.add(response.data)
          })
    },
  },


}
</script>

<style scoped>

</style>
