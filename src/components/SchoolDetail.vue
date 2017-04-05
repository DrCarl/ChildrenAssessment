<template>
  <div>
    <el-row id="operations">
      <el-col :span="18" :offset="3">
        <el-button class="btns" type="primary" @click="downloadInviteCode">下载邀请码</el-button>
        <el-button class="btns" type="primary" @click="reuploadVisible = true">重新上传</el-button>
        <el-button class="btns" type="primary" @click="appendUploadVisible = true">追加上传</el-button>
        <el-button class="btns" type="primary" @click="updateVisible = true">在线更新</el-button>
      </el-col>
    </el-row>
    <el-row id="area-filter">
      <el-col :span="18" :offset="3">
        <el-select class="area-nav short-select" v-model="currentProvince" @change="changeProvince" placeholder="省" v-if="provinceSelectVisible">
          <el-option v-for="p in currentProvinceList" :label="p" :value="p"></el-option>
        </el-select>
        <el-select class="area-nav short-select" v-model="currentCity" @change="changeCity" placeholder="市" v-if="citySelectVisible">
          <el-option v-for="p in currentCityList" :label="p" :value="p"></el-option>
        </el-select>
        <el-select class="area-nav" v-model="currentArea" @change="changeArea" placeholder="区" v-if="areaSelectVisible">
          <el-option v-for="p in currentAreaList" :label="p" :value="p"></el-option>
        </el-select>
        <el-select class="area-nav" v-model="currentSchool" @change="changeSchool" placeholder="校" v-if="schoolSelectVisible">
          <el-option v-for="p in currentSchoolList" :label="p" :value="p"></el-option>
        </el-select>
        <el-select class="area-nav short-select" v-model="state" @change="changeState" placeholder="测试状态" v-if="schoolSelectVisible">
          <el-option v-for="s in stateList"  :label="s.label" :value="s.value"></el-option>
        </el-select>
        <el-button @click="areaFilter" id="filter-btn" v-if="areaFilterBtnVisible">筛选</el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="18" :offset="3">
        <el-table :data="list" stripe style="width: 100%">
          <el-table-column prop="province" label="省" width="80" align="left"></el-table-column>
          <el-table-column prop="city" label="市" width="80" align="left"></el-table-column>
          <el-table-column prop="area" label="区" width="80" align="left"></el-table-column>
          <el-table-column prop="school" label="学校" align="left"></el-table-column>
          <el-table-column prop="grade" label="年级" width="120" align="center"></el-table-column>
          <el-table-column prop="admission" label="入学年" width="80" align="center"></el-table-column>
          <el-table-column prop="studentName" label="姓名" width="100" align="center"></el-table-column>
          <el-table-column prop="studentGender" label="性别" width="80" align="center"></el-table-column>
          <el-table-column prop="studentNo" label="唯一编号" width="100" align="center"></el-table-column>
          <el-table-column prop="state" :formatter="stateFormatter" label="测试状态" width="100" align="center"></el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <el-row class='table-bottom'>
      <el-col :span="18" :offset="3">
        <el-pagination id="students-pagination" @current-change="handleCurrentChange" :current-page="page.index" :page-size="page.pageSize" layout="total, prev, pager, next" :total="page.rowCount">
        </el-pagination>
      </el-col>
    </el-row>
    <el-dialog title="重新上传" v-model="reuploadVisible">
      <div>
        <el-upload id="upload-btn" :action='uploadUrl' name='execl' :on-success="previewReupload" :on-preview="handlePreview" :on-remove="handleRemove" :file-list="fileList">
          <el-button type="primary" @click="upload">上传报名表</el-button>
        </el-upload>
      </div>
      <div class="clear-float"></div>
      <div v-if="reuploadPreviewTableVisible" id= "preview-table">
        <el-table :data="reuploadPreviewList" stripe style="width: 100%">
          <el-table-column prop="province" label="省" width="70" align="left"></el-table-column>
          <el-table-column prop="city" label="市" width="70" align="left"></el-table-column>
          <el-table-column prop="area" label="区" width="80" align="left"></el-table-column>
          <el-table-column prop="school" label="学校" align="left"></el-table-column>
          <el-table-column prop="grade" label="年级" width="80" align="center"></el-table-column>
          <el-table-column prop="admission" label="入学年" width="80" align="center"></el-table-column>
          <el-table-column prop="studentName" label="姓名" width="80" align="center"></el-table-column>
          <el-table-column prop="studentGender" label="性别" width="70" align="center"></el-table-column>
        </el-table>
      </div>
      <div slot="footer" class="dialog-footer" v-if="reuploadPreviewTableVisible">
        <el-button @click="cancelReupload">取 消</el-button>
        <el-button type="primary" @click="confirmReupload">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="追加上传" v-model="appendUploadVisible">
      <div>
        <el-upload id="upload-btn" :action='uploadUrl' name='execl' :on-success="previewAppend" :on-preview="handlePreview" :on-remove="handleRemove" :file-list="fileList">
          <el-button type="primary" @click="upload">上传报名表</el-button>
        </el-upload>
      </div>
      <div class="clear-float"></div>
      <div v-if="appendPreviewTableVisible" id= "preview-table">
        <el-table :data="appendPreviewList" stripe style="width: 100%">
          <el-table-column prop="province" label="省" width="70" align="left"></el-table-column>
          <el-table-column prop="city" label="市" width="70" align="left"></el-table-column>
          <el-table-column prop="area" label="区" width="80" align="left"></el-table-column>
          <el-table-column prop="school" label="学校" align="left"></el-table-column>
          <el-table-column prop="grade" label="年级" width="80" align="center"></el-table-column>
          <el-table-column prop="admission" label="入学年" width="80" align="center"></el-table-column>
          <el-table-column prop="studentName" label="姓名" width="80" align="center"></el-table-column>
          <el-table-column prop="studentGender" label="性别" width="70" align="center"></el-table-column>
        </el-table>
      </div>
      <div slot="footer" class="dialog-footer" v-if="appendPreviewTableVisible">
        <el-button @click="cancelAppend">取 消</el-button>
        <el-button type="primary" @click="confirmAppend">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="在线新增" v-model="updateVisible">
      <el-form :model="newStudentData" :rules="newStudentRules" ref="newStudentForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="省" prop="province">
          <el-input v-model="newStudentData.province"></el-input>
        </el-form-item>
        <el-form-item label="市" prop="city">
          <el-input v-model="newStudentData.city"></el-input>
        </el-form-item>
        <el-form-item label="区" prop="area">
          <el-input v-model="newStudentData.area"></el-input>
        </el-form-item>
        <el-form-item label="学校" prop="school">
          <el-input v-model="newStudentData.school"></el-input>
        </el-form-item>
        <el-form-item label="入学年" prop="admission">
          <el-input v-model="newStudentData.admission"></el-input>
        </el-form-item>
        <el-form-item label="年级" prop="grade">
          <el-input v-model="newStudentData.grade"></el-input>
        </el-form-item>
        <el-form-item label="班级" prop="classRoom">
          <el-input v-model="newStudentData.classRoom"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="studentName">
          <el-input v-model="newStudentData.studentName"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="resource">
          <el-radio-group v-model="newStudentData.studentGender">
            <el-radio label="男"></el-radio>
            <el-radio label="女"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitNewStudent()">新增</el-button>
          <el-button @click="updateVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  import {serverAddress} from '@/config.json'
  export default {
    created () {
      this.projectId = this.$route.params.projectId
      this.province = this.$route.params.province
      this.city = this.$route.params.city
      this.area = this.$route.params.area
      this.school = this.$route.params.school
      this.currentProvince = this.province
      this.currentCity = this.city
      this.currentArea = this.area
      this.currentSchool = this.school
      this.$http.post(`${serverAddress}/data/filter/area`)
      .then((res) => {
        if (res.body.success) {
          console.log(res.body)
          this.areaTree = res.body.areaTree
          this.currentProvinceList = this.areaTree.map((province) => {
            if (province.title === this.province) {
              this.currentCityList = province.child.map((city) => {
                if (city.title === this.city) {
                  this.currentAreaList = city.child.map((area) => {
                    if (area.title === this.area) {
                      this.currentSchoolList = area.child.map((school) => school.title)
                    }
                    return area.title
                  })
                }
                return city.title
              })
            }
            return province.title
          })
          console.log(this.currentProvinceList)
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
      this.getItems()
    },
    methods: {
      cancelAppend () {
        this.appendPreviewList = []
        this.appendPreviewTableVisible = false
        this.appendUploadVisible = false
      },
      confirmAppend () {
        let data = {
          action: 3,
          proId: this.$route.params.projectId,
          province: '',
          city: '',
          area: '',
          school: '',
          list: this.appendPreviewList
        }
        console.log(JSON.stringify(data))
        this.$http.post(`${serverAddress}/apply/upload/save`, data).then(res => {
          if (res.body.success) {
            this.appendPreviewList = []
            this.appendPreviewTableVisible = false
            this.appendUploadVisible = false
            this.$notify.success({
              message: '上传成功'
            })
          } else {
            this.$notify.error({
              title: '上传失败',
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
      previewAppend (res) {
        console.log(res)
        if (res.success) {
          this.appendPreviewList = res.list
          this.appendPreviewTableVisible = true
        } else {
          this.$notify.error({
            title: '上传失败',
            message: res.body.message
          })
        }
      },
      cancelReupload () {
        this.reuploadPreviewList = []
        this.reuploadPreviewTableVisible = false
        this.reuploadVisible = false
      },
      confirmReupload () {
        let data = {
          action: 2,
          proId: this.$route.params.projectId,
          province: '',
          city: '',
          area: '',
          school: '',
          list: this.reuploadPreviewList
        }
        console.log(JSON.stringify(data))
        this.$http.post(`${serverAddress}/apply/upload/save`, data).then(res => {
          if (res.body.success) {
            this.reuploadPreviewList = []
            this.reuploadPreviewTableVisible = false
            this.reuploadVisible = false
            this.$notify.success({
              message: '上传成功'
            })
          } else {
            this.$notify.error({
              title: '上传失败',
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
      previewReupload (res) {
        console.log(res)
        if (res.success) {
          this.reuploadPreviewList = res.list
          this.reuploadPreviewTableVisible = true
        } else {
          this.$notify.error({
            title: '上传失败',
            message: res.body.message
          })
        }
      },
      submitNewStudent () {
        this.$refs.newStudentForm.validate((valid) => {
          if (valid) {
            this.$http.post(`${serverAddress}/apply/add`, this.newStudentData)
            .then((res) => {
              if (res.body.success) {
                this.updateVisible = false
                this.getItems()
                this.$notify({
                  title: '更新成功',
                  message: res.body.message,
                  type: 'success'
                })
              } else {
                this.$notify.error({
                  title: '更新失败',
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
      },
      changeProvince (provinceStr) {
        this.currentCity = ''
        if (provinceStr !== '') {
          this.currentCityList = this.areaTree.filter((province) => province.title === provinceStr)[0].child.map((city) => city.title)
        }
        this.currentAreaList = []
      },
      changeCity (cityStr) {
        this.currentArea = ''
        if (cityStr !== '') {
          this.currentAreaList = this.areaTree.filter((province) => province.title === this.currentProvince)[0].child.filter((city) => city.title === cityStr)[0].child.map((area) => area.title)
        }
        this.currentSchoolList = []
      },
      changeArea (areaStr) {
        this.currentSchool = ''
        if (areaStr !== '') {
          this.currentSchoolList = this.areaTree.filter((province) => province.title === this.currentProvince)[0].child.filter((city) => city.title === this.currentCity)[0].child.filter((area) => area.title === areaStr)[0].child.map((school) => school.title)
        }
      },
      changeSchool (school) {
        this.state = 0
        this.areaFilterBtnVisible = this.currentSchool !== ''
      },
      changeState () {
        this.areaFilterBtnVisible = this.currentSchool !== ''
      },
      areaFilter () {
        this.$router.push(`/school/${this.$route.params.projectId}/${this.currentProvince}/${this.currentCity}/${this.currentArea}/${this.currentSchool}`)
        this.page = {
          index: 1,
          pageSize: 10
        }
        this.getItems()
      },
      getItems () {
        this.$http.post(`${serverAddress}/school/info`, {
          proId: this.projectId,
          province: this.currentProvince,
          city: this.currentCity,
          area: this.currentArea,
          school: this.currentSchool,
          page: this.page,
          state: this.state
        }).then((res) => {
          if (res.body.success) {
            console.log(res.body)
            this.page = res.body.page
            this.list = res.body.list
            this.areaFilterBtnVisible = false
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
      stateFormatter (row) {
        let state = ''
        switch (row.state) {
          case 1:
            state = '尚未测试'
            break
          case 2:
            state = '测试启动'
            break
          case 3:
            state = '测试完毕'
            break
        }
        return state
      },
      handleCurrentChange (pageIndex) {
        this.page.index = pageIndex
        this.getItems()
      },
      downloadInviteCode () {
        console.log('download invite code')
      }
    },
    data () {
      return {
        uploadUrl: `${serverAddress}/apply/upload`,
        reuploadPreviewTableVisible: false,
        appendPreviewTableVisible: false,
        appendUploadVisible: false,
        reuploadVisible: false,
        updateVisible: false,
        areaFilterBtnVisible: true,
        currentProvince: '',
        currentCity: '',
        currentArea: '',
        currentSchool: '',
        currentState: '',
        provinceSelectVisible: true,
        citySelectVisible: true,
        areaSelectVisible: true,
        schoolSelectVisible: true,
        currentProvinceList: [],
        currentCityList: [],
        currentAreaList: [],
        currentSchoolList: [],
        state: 0,
        stateList: [{
          label: '全部',
          value: 0
        }, {
          label: '尚未测试',
          value: 1
        }, {
          label: '测试启动',
          value: 2
        }, {
          label: '测试完毕',
          value: 3
        }],
        page: {
          pageSize: 10,
          index: 1
        },
        list: [],
        reuploadPreviewList: [],
        appendPreviewList: [],
        newStudentData: {
          proId: this.$route.params.projectId,
          province: '',
          city: '',
          area: '',
          school: '',
          grade: '',
          admission: '',
          classRoom: '',
          studentName: '',
          studentGender: 1

        },
        newStudentRules: {
          province: { required: true, message: '请输入省', trigger: 'blur' },
          city: { required: true, message: '请输入市', trigger: 'blur' },
          area: { required: true, message: '请输入区', trigger: 'blur' },
          school: { required: true, message: '请输入学校', trigger: 'blur' },
          grade: { required: true, message: '请输入年级', trigger: 'blur' },
          admission: { required: true, message: '请输入入学年', trigger: 'blur' },
          classRoom: { required: true, message: '请输入班级', trigger: 'blur' },
          studentName: { required: true, message: '请输入学生姓名', trigger: 'blur' },
          studentGender: { required: true, message: '选择性别', trigger: 'blur' }
        }
      }
    }
  }
</script>

<style>
#area-filter {
  margin: 10px 0;
}
.area-nav {
  margin-right: 10px;
  float: left;
}
.short-select {
  width: 120px;
}
#filter-btn {
  float: left;
}
#students-pagination {
  float: left;
}
.clear-float {
  clear: both;
}
</style>
