import Vue from 'vue'
import Router from 'vue-router'
import SignIn from '@/components/SignIn'
import Home from '@/components/Home'
import ProjectDetail from '@/components/ProjectDetail'
import SchoolDetail from '@/components/SchoolDetail'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'SignIn',
      component: SignIn
    }, {
      path: '/home',
      name: 'Home',
      component: Home
    }, {
      path: '/project/:projectId',
      name: 'ProjectDetail',
      component: ProjectDetail
    }, {
      path: '/school/:projectId/:province/:city/:area/:school',
      name: 'SchoolDetail',
      component: SchoolDetail
    }
  ]
})
