<template>
      <el-form :model="signInData" :rules="rules" ref="signInForm" id="sign-in-form">
        <el-form-item prop="username">
          <el-input v-model="signInData.username" placeholder="请输入用户名" size="large"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="signInData.password" placeholder="请输入密码" size="large"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button id="sign-in-btn" type="primary" @click="signIn" size="large">登录</el-button>
        </el-form-item>
      </el-form>
</template>

<script>

import {serverAddress} from '@/config.json'
export default {
  name: 'hello',
  methods: {
    signIn () {
      this.$refs.signInForm.validate((valid) => {
        if (valid) {
          this.$http.post(`${serverAddress}/admin/login`, this.signInData)
          .then((res) => {
            if (res.body.success) {
              this.$router.push('home')
            } else {
              alert(res.message)
            }
          }, (res) => {
            console.log('error')
            alert('网络调用失败')
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
      signInData: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

#sign-in-form {
  position: absolute;
  width: 400px;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
  border: 1px solid #eaeefb;
  border-radius: 4px;
  transition: .2s;
  padding: 20px 20px 0;
}
#sign-in-btn {
  width: 100%;
}
</style>
