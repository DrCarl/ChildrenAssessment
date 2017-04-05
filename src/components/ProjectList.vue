<template>
  <div id='home'>
    <el-row >
      <el-col :span="18" :offset="3">
        <el-button id="new-btn" type="primary" @click="dialogFormVisible = true">新建项目</el-button>
      </el-col>
    </el-row>
    <el-row  id="projects">
      <el-col :span="18" :offset="3">
        <el-table :data="list" stripe style="width: 100%">
          <el-table-column prop="title" label="项目名称" align="left"></el-table-column>
          <el-table-column prop="timeCreate" :formatter="timeFormatter" label="创建时间" width="180" align="center" sortable></el-table-column>
          <el-table-column prop="schoolCount" label="学校数" width="100" align="center"></el-table-column>
          <el-table-column prop="studentCount" label="人数" width="100" align="center"></el-table-column>
          <el-table-column prop="state" :formatter="stateFormatter" label="状态" width="100" align="center" sortable></el-table-column>
          <el-table-column label="操作" width="100" align="center">
              <template scope="scope">
                  <el-button v-if="!!scope.row.title"  @click.native.prevent="showProject(scope.row)" type="text" size="small">查看</el-button>
              </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <el-row class='table-bottom'>
      <el-col :span="18" :offset="3">
        <el-pagination id="projects-pagination" @current-change="handleCurrentChange" :current-page="page.index" :page-size="page.pageSize" layout="total, prev, pager, next" :total="page.rowCount">
        </el-pagination>
      </el-col>
    </el-row>
    <el-dialog title="新建项目" v-model="dialogFormVisible">
      <el-form :model="newProjectData" :rules="rules" ref="newProjectForm">
        <el-form-item prop="title" label="项目名称">
          <el-input v-model="newProjectData.title" auto-complete="off" placeholder="请输入项目名称"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="createProject">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {serverAddress} from '@/config.json'
  import Moment from 'moment'
  export default {
    created () {
      this.getProjects()
    },
    methods: {
      timeFormatter (row) {
        return Moment(row.timeCreate).format('YYYY-MM-DD')
      },
      stateFormatter (row) {
        return row.state === 1 ? '已上传' : '未上传'
      },
      parseProjectData (project) {
        // project.stateStr = project.state === 1 ? '已上传' : '未上传'
        // project.timeStr = Moment(project.timeCreate).format('YYYY-MM-DD')
        return project
      },
      getProjects () {
        this.$http.post(`${serverAddress}/project/list`, this.page)
        .then((res) => {
          if (res.body.success) {
            this.page = res.body.page
            this.list = res.body.list
          } else {
            this.$notify.error({
              title: '获取数据失败',
              message: res.body.message
            })
          }
        }, res => {
          this.$notify.error({
            title: '请求失败',
            message: '网络调用失败'
          })
        })
      },
      showProject (project) {
        this.$router.push(`project/${project.proId}`)
      },
      handleCurrentChange (pageIndex) {
        this.page.index = pageIndex
        this.getProjects()
      },
      createProject () {
        this.$refs.newProjectForm.validate((valid) => {
          const data = {
            title: this.newProjectData.title,
            timeCreate: Date.now()
          }
          if (valid) {
            this.$http.post(`${serverAddress}/project/add`, data)
            .then((res) => {
              if (res.body.success) {
                this.dialogFormVisible = false
                this.getProjects()
              } else {
                this.$notify.error({
                  title: '创建失败',
                  message: res.body.message
                })
              }
            }, res => {
              this.$notify.error({
                title: '请求失败',
                message: '网络调用失败'
              })
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      }
    },
    data () {
      return {
        page: {
          pageSize: 10,
          index: 1
        },
        dialogFormVisible: false,
        newProjectData: {
          title: ''
        },
        rules: {
          title: [
            { required: true, message: '请输入项目名称', trigger: 'blur' }
          ]
        },
        list: []
      }
    }
  }
</script>

<style>
#home {
  margin-top: 20px;
}
#projects {
  margin-top: 20px;
}
#projects-pagination {
  float: left;
}
#new-btn {
  float: left;
}
.table-bottom {
  margin-top: 10px;
}
</style>
