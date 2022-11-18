<template>
  <div>
    <el-form :model="roomForm" status-icon :rules="rules" label-width="100px"
      style="width: auto; margin-left: 300px">
      <el-form-item label="房间名称" prop="roomName">
        <el-input v-model="roomForm.roomName" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="房间描述" prop="description">
        <el-input v-model="roomForm.description" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="房间类型" prop="roomType">
        <el-input v-model.number="roomForm.roomType"></el-input>
      </el-form-item>
      <el-form-item label="房间大小" prop="size">
        <el-input v-model.number="roomForm.size"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm()">提交</el-button>
        <el-button @click="resetForm()">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {saveRoom} from "../api/room";

export default {
  name: "createRoom",
  data() {
    return {
      roomForm: {
        roomName: null,
        description: null,
        roomType: null,
        size: null,
      },
      ownerUid: null,
      rules: {
        roomName: [
          {required: true, message:'房间名称不能为空'}
        ],
        description:[
          {required: true, message:'房间描述不能为空'}
        ],
        roomType: [
          {required: true, message:'房间类型不能为空'}
        ],
        size: [
          {required: true, message:'房间大小不能为空'},
          {type: 'number', max: 10, message: '房间大小需要是非负数字'}
        ]
      }
    }
  },
  created() {
    this.ownerUid = window.sessionStorage.getItem("uid");
  },
  methods: {
    resetForm(){
      this.roomForm.roomName = null;
      this.roomForm.description = null;
      this.roomForm.roomType = null;
      this.roomForm.size = null;
    },
    submitForm(){
      saveRoom(this.roomForm,this.ownerUid)
        .then(response => {
          this.$message({
            type: 'success',
            message: '添加成功，请到个人页面中查看!'
          });
          this.resetForm();
        })
    }
  }
}
</script>

<style scoped>

</style>
