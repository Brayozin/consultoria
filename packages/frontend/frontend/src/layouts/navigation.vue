<template>
  <div class="">
    <Header class="" />
    <el-container class="bg-primary h-full w-full ">
      <el-container class=" w-full h-full">
        <router-view
          class="w-full max-h-full max-w-full h-full overflow-y-auto" />
      </el-container>
    </el-container>
    <Footer />
  </div>
</template>

<script>
import Header from "./Header.vue";
import Menu from "./Menu.vue";
import Footer from "./Footer.vue";

export default {
  name: "Navigation",
  components: {
    Header,
    Menu,
    Footer,
  },
};
</script>

<style>
.app-navigation {
}

.app-navigation__content {

}

/* Add your own styles for the header, menu, and footer components */
</style>
