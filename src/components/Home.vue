<template>
  <el-row>
    <ProjectList/>
  </el-row>
</template>

<script>
import ProjectList from '@/components/ProjectList'

export default {
  name: 'Home',
  components: { ProjectList },
  data () {
    return {
    }
  }
}
</script>

<style scoped>
</style>
