<template>
  <div>

    <el-row>
      <el-col :span="9" :offset="3"><span class="project-name">项目名称：{{title}}</span></el-col><el-col :span="9"><span class="create-time">创建时间：{{timeCreate | timeFilter}}</span></el-col>
		</el-row>
    <el-row id="operations">
      <el-col :span="18" :offset="3">
        <el-button class="btns" type="primary" @click="uploadVisible = true">报名表上传</el-button>
        <el-button class="btns" type="primary" @click="ercodeVisible = true">下载app</el-button>
        <el-button class="btns" type="primary" @click="download">下载邀请码</el-button>
      </el-col>
    </el-row>
    <el-row id="area-filter">
      <el-col :span="18" :offset="3">
        <el-select class="area-nav short-select" v-model="currentProvince" @change="changeProvince" placeholder="省">
          <el-option v-for="p in currentProvinceList" :label="p" :value="p"></el-option>
        </el-select>
        <el-select class="area-nav short-select" v-model="currentCity" @change="changeCity" placeholder="市">
          <el-option v-for="p in currentCityList" :label="p" :value="p"></el-option>
        </el-select>
        <el-select class="area-nav" v-model="currentArea" @change="changeArea" placeholder="区">
          <el-option v-for="p in currentAreaList" :label="p" :value="p"></el-option>
        </el-select>
        <el-select class="area-nav" v-model="currentSchool" @change="changeSchool" placeholder="校">
          <el-option v-for="p in currentSchoolList" :label="p" :value="p"></el-option>
        </el-select>
        <el-button @click="areaFilter" id="filter-btn" v-if="areaFilterBtnVisible">筛选</el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="18" :offset="3">
        <el-table :data="list" stripe style="width: 100%">
          <el-table-column prop="province" label="省" align="left" width="90"></el-table-column>
          <el-table-column prop="city" label="市" align="left" width="90"></el-table-column>
          <el-table-column prop="area" label="区" align="left" width="90"></el-table-column>
          <el-table-column prop="school" label="学校" align="left"></el-table-column>
          <el-table-column prop="grade" label="年级" align="left" width="120"></el-table-column>
          <el-table-column prop="admission" label="入学年" align="left" width="80"></el-table-column>
          <el-table-column prop="classCount" label="班级数" align="center" width="80"></el-table-column>
          <el-table-column prop="studentCount" label="人数" width="80" align="center"></el-table-column>
          <el-table-column prop="state" :formatter="stateFormatter" label="状态" width="100" align="center"></el-table-column>
          <el-table-column label="操作" width="80" align="center">
              <template scope="scope">
                  <el-button v-if="!!scope.row.province"  @click.native.prevent="getSchool(scope.row)" type="text" size="small">查看</el-button>
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
    <el-dialog title="上传报名表" v-model="uploadVisible">
      <div>
        <el-button class="btns" type="primary" @click="downloadTemplate">下载报名表模版</el-button>
        <el-upload id="upload-btn" :action='uploadUrl' name='execl' :on-success="preview" :on-preview="handlePreview" :on-remove="handleRemove" :file-list="fileList">
          <el-button type="primary" @click="upload">上传报名表</el-button>
        </el-upload>
      </div>
      <div class="clear-float"></div>
      <div v-if="previewTableVisible" id= "preview-table">
        <el-table :data="previewList" stripe style="width: 100%">
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
      <div slot="footer" class="dialog-footer"  v-if="previewTableVisible">
        <el-button @click="cancelUpload">取 消</el-button>
        <el-button type="primary" @click="confirmUpload">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="安卓平板，扫码下载" v-model="ercodeVisible">
      <img id="ercode" :src="ercode">
    </el-dialog>
  </div>
</template>

<script>
  import {serverAddress} from '@/config.json'
  import Moment from 'moment'
  export default {
    created () {
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
      this.getIterms()
    },
    filters: {
      timeFilter (time) {
        return Moment(time).format('YYYY-MM-DD')
      }
    },
    methods: {
      cancelUpload () {
        this.previewTableVisible = false
        this.uploadVisible = false
      },
      confirmUpload () {
        let data = {
          action: 1,
          proId: this.$route.params.projectId,
          province: '',
          city: '',
          area: '',
          school: '',
          list: this.previewList
        }
        console.log(JSON.stringify(data))
        this.$http.post(`${serverAddress}/apply/upload/save`, data).then(res => {
          if (res.body.success) {
            this.previewTableVisible = false
            this.uploadVisible = false
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
      preview (res) {
        console.log(res)
        if (res.success) {
          this.previewList = res.list
          this.previewTableVisible = true
        } else {
          this.$notify.error({
            title: '上传失败',
            message: res.body.message
          })
        }
      },
      handleRemove (file, fileList) {
        console.log(file, fileList)
      },
      handlePreview (file) {
        console.log(file)
      },
      getIterms () {
        let data = {
          proId: this.$route.params.projectId,
          page: this.page
        }
        if (this.currentSchool !== '') {
          data.province = this.currentProvince
          data.city = this.currentCity
          data.area = this.currentArea
          data.school = this.currentSchool
        }
        this.$http.post(`${serverAddress}/project/info`, data).then((res) => {
          if (res.body.success) {
            console.log(res.body)
            this.title = res.body.title
            this.timeCreate = res.body.timeCreate
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
        this.areaFilterBtnVisible = this.currentSchool !== ''
      },

      areaFilter () {
        this.page = {
          index: 1,
          pageSize: 10
        }
        this.getIterms()
      },
      getSchool (school) {
        this.$router.push(`/school/${this.$route.params.projectId}/${school.province}/${school.city}/${school.area}/${school.school}`)
      },
      upload () {

      },
      download () {

      },
      downloadTemplate () {
        // window.location.href = `${serverAddress}/apply/download/template`
        window.location.href = `${serverAddress}/报名表模板.xlsx`
      },
      handleCurrentChange (pageIndex) {
        this.page.index = pageIndex
        this.getIterms()
      },
      stateFormatter (row) {
        let state = ''
        switch (row.state) {
          case 1:
            state = '未测试'
            break
          case 2:
            state = '测试中'
            break
          case 3:
            state = '测试完毕'
            break
        }
        return state
      }
    },
    data () {
      return {
        uploadUrl: `${serverAddress}/apply/upload`,
        previewTableVisible: false,
        fileList: [],
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
        ercode: require('@/assets/ercode.png'),
        uploadVisible: false,
        ercodeVisible: false,
        province: '',
        city: '',
        area: '',
        school: '',
        title: '',
        timeCreate: '',
        page: {
          pageSize: 10,
          index: 1
        },
        list: [],
        previewList: []
      }
    }
  }
</script>

<style>
#operations {
  margin: 20px 0;
}
.btns {
  margin-right: 20px;
  float: left;
}
#upload-btn {
  float: left;
}
#upload-btns:after {
  clear: both;
  display: block;
  content: 1234
}
#ercode {
  width: 200px;
}

#area-filter {
  margin: 10px 0;
}
.area-nav {
  margin-right: 10px;
  float: left;
}
#filter-btn {
  float: left;
}
.project-name {
  float: left;
}
.el-upload-list {
  float: right;
}
#preview-table {
  clear: both;
  padding-top: 10px;
}
.clear-float {
  clear: both;
}
</style>
