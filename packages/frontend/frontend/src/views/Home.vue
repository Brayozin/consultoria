<template>
  <div class="home bg-red-300 h-full">
    <h1>Welcome to the Home Page</h1>
    <el-button type="primary" @click="
    goToClientsPage">Go to Clients Page</el-button>
  </div>
</template>

<script>
export default {
  methods: {
    goToClientsPage() {
      this.$router.push('/clients');
    }
  }
}
</script>

<style scoped>
.home {
  text-align: center;
}
</style>
