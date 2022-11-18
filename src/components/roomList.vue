<template>
  <div>
    <el-input style="max-width: 400px; align-self: end;" v-model="queryForm.roomDetail"
              placeholder="搜索房间" @change="getPage"></el-input>
    <br/>
    <br/>
    <el-table
      :data="roomList"
      border class="table"
      style="margin-left: 300px; width: auto">
      <el-table-column
        fixed
        prop="roomName"
        label="房间名称"
        width="150">
      </el-table-column>
      <el-table-column
        prop="ownerUserName"
        label="房主"
        width="120">
      </el-table-column>
      <el-table-column
        prop="roomType"
        label="房间类型"
        width="120">
      </el-table-column>
      <el-table-column
        prop="description"
        label="简介"
        width="500">
      </el-table-column>
      <el-table-column
        prop="size"
        label="大小"
        width="120">
      </el-table-column>
      <el-table-column
        prop="remain"
        label="剩余人数"
        width="120">
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="100">
        <template #default="scope">
          <el-button v-if="scope.row.ifAdded == true" disabled type="text" size="small">加入</el-button>
          <el-button v-if="scope.row.ifAdded == false" @click="join(scope.row.rid)" type="text" size="small">加入</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="current"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="limit"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </div>
</template>

<script>
import {getPage, join} from "../api/room";

export default {
  name: "roomList",
  data() {
    return{
      queryForm: {
        roomDetail: null,
      },
      current: 1,
      limit: 10,
      total: 0,
      roomList: []
    }
  },
  created() {
    this.getPage();
  },
  methods: {
    join(rid){
      join(rid,window.sessionStorage.getItem("uid"))
        .then(response => {
          this.$message({
            type: 'success',
            message: response.message
          })
        })
    },
    getPage(){
      const uid = window.sessionStorage.getItem('uid');
      console.log(uid)
      getPage(this.current, this.limit, uid, this.queryForm)
        .then(response => {
          this.roomList = response.page.records;
          this.total = response.page.total;
        })
    },
    handleSizeChange(){
      this.getPage();
    },
    handleCurrentChange(){
      this.getPage();
    }
  }
}
</script>

<style scoped>
.table {
  max-width: 1300px;
  align-self: end;
}
</style>
