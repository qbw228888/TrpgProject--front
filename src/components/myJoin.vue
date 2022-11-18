<template>
  <div>
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
          <el-button type="text" size="small" @click="check(scope.row.rid, scope.row.size, scope.row.roomName)">查看</el-button>
          <el-button type="text" size="small" @click="quit(scope.row.rid)">退出</el-button>
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
import {getJoinedPage, getPage, quit} from "../api/room";

export default {
  name: "myJoin",
  data() {
    return{
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
    check(rid,size,roomName){
      console.log(rid)
      this.$router.push({name:'room',params:{rid:rid,size:size,roomName:roomName}})
    },
    getPage(){
      const uid = window.sessionStorage.getItem('uid');
      console.log(uid)
      getJoinedPage(this.current, this.limit, uid)
        .then(response => {
          this.roomList = response.page.records;
          this.total = response.page.total;
        })
    },
    quit(rid){
      console.log(rid);
      quit(rid,window.sessionStorage.getItem("uid"))
        .then(response => {
          this.$message({
            type: 'success',
            message: '退出成功'
          })
          this.getPage();
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
