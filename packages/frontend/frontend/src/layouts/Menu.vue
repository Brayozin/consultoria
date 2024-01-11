<template>
  <el-menu
     :collapse="menuStore.menu"
    class="el-menu-vertical-demo fixed w-1/5  z-10  h-screen transform  flex-col border-r-2 border-r-white bg-cyan-700 shadow transition-all duration-300" >
    <el-button
      class="bg-cyan-700 text-white"
      type="primary"
    >
    </el-button>

    <el-icon color="red" size="30" 
    class="m-1"
      @click="menuStore.toggleMenu()"

    ><House
     /></el-icon>
    <el-menu
      class="bg-cyan-700 text-white"
      default-active="1"
      :default-openeds="['1']"
      unique-opened
      router
    >
      <el-submenu index="1">
         
        <el-menu-item index="clients">Option 1</el-menu-item>
        <el-menu-item index="1-2">Option 2</el-menu-item>
        <el-menu-item index="1-3">Option 3</el-menu-item>
      </el-submenu>
      <el-submenu index="2">
        <template slot="title">
          <i class="el-icon-menu"></i>
          <span>Menu</span>
        </template>
        <el-menu-item index="2-1">Option 1</el-menu-item>
        <el-menu-item index="2-2">Option 2</el-menu-item>
        <el-menu-item index="2-3">Option 3</el-menu-item>
      </el-submenu>
      <el-submenu index="3">
        <template slot="title">
          <i class="el-icon-setting"></i>
          <span>Settings</span>
        </template>
        <el-menu-item index="3-1">Option 1</el-menu-item>
        <el-menu-item index="3-2">Option 2</el-menu-item>
        <el-menu-item index="3-3">Option 3</el-menu-item>
      </el-submenu>
    </el-menu>


  </el-menu>
</template>

<script lang="ts" setup>
name: 'Menu'
import { useMenuStore } from '../stores/menu.js'

const menuStore = useMenuStore()


</script>

<style scoped lang="scss">
.slide-leave-active {
  transition: transform 0.2s ease;
}
.slide-enter-active {
  transition: transform 0.2s ease;
}
.slide-enter-from {
  transform: translateX(-100%);
  transition: all 150ms ease-in 0s;
}
.slide-enter-to {
  transform: translateX(0%);
  transition: all 150ms ease-in 0s;
}
.slide-leave-to {
  transform: translateX(-100%);
  transition: all 150ms ease-in 0s;
}
</style>
