<template>
  <div class="main flex h-full w-full">
    <el-button @click="sayHello">Click me</el-button>
    <p>{{ message }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      message: ""
    };
  },
  methods: {
    sayHello() {
      this.message = "Hello, World!";
    }
  }
};
</script>

<style>

.main {
  background-color: blueviolet;
}

/* Add your custom styles here */
</style>
