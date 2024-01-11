<template>
 <el-header
    class="relative border-b border-solid border-b-gray-200 p-0  bg-secondary w-full "
  >
    <div class="flex justify-between items-center p-4">
        <el-text class="sr-only">Element Plus</el-text>
        <img
        @click="menuStore.toggleMenu()"
          src="https://element-plus.org/images/element-plus-logo.svg"
          alt="Element Plus"
          class="block max-w-none"
          width="120"
          height="28"
        />

      <nav>
        <ul class="hidden items-center space-x-6 lg:flex">
          <li>
            <el-link
              href="https://element-plus.org/en-US/guide/design.html"
              target="_blank"
            >
              Guide
            </el-link>
          </li>
          <li>
            <el-link
              href="https://element-plus.org/en-US/component/button.html"
              target="_blank"
            >
              Component
            </el-link>
          </li>
          <li>
            <el-link
              href="https://element-plus.org/en-US/resource/index.html"
              target="_blank"
            >
              Resource
            </el-link>
          </li>
        </ul>
      </nav>

      <div class="hidden lg:block">
        <el-button>Log in</el-button>
      </div>

      <span
        class="lg:hidden w-5 h-5 bg-white cursor-pointer dark:bg-[#242424]"
        @click="toggle()"
      >
        <a v-if="value">
          <el-icon size="20">
            <Close />
          </el-icon>
        </a>
        <a class="block relative h-full" v-else>
          <el-icon
            class="absolute -top-[6px] left-1/2 transform -translate-x-1/2"
            size="20"
          >
            <Minus />
          </el-icon>
          <el-icon
            class="absolute -top-[0] left-1/2 transform -translate-x-1/2"
            size="20"
          >
            <Minus />
          </el-icon>
          <el-icon
            class="absolute top-[6px] left-1/2 transform -translate-x-1/2"
            size="20"
          >
            <Minus />
          </el-icon>
        </a>
      </span>
    </div>

   
  </el-header>

</template>

<script lang="ts" setup>
import { useMenuStore } from '../stores/menu.js'

const menuStore = useMenuStore()


</script>

<style scoped>
.header {
  background-color: #f5f7fa;
}

.logo {
  font-size: 24px;
  font-weight: bold;
}

.menu {
  margin-left: 20px;
}
</style>
