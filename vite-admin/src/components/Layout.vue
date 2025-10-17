<template>
  <a-layout style="min-height: 100vh">
    <!-- 左侧菜单 -->
    <a-layout-sider collapsible v-model:collapsed="collapsed" theme="dark">
      <div class="logo">
        <span v-if="!collapsed">后台管理系统</span>
      </div>
      <a-menu theme="dark" mode="inline" :selectedKeys="[selectedKey]" @click="onMenuClick">
        <a-menu-item v-if="user.role=='super' || user.role=='admin'" key="/users">用户管理</a-menu-item>
        <a-menu-item key="/tasks">任务管理</a-menu-item>
        <a-menu-item key="/todos">待办清单</a-menu-item>
        <a-menu-item key="/products">货号管理</a-menu-item>
      </a-menu>
    </a-layout-sider>

    <!-- 主体 -->
    <a-layout>
      <a-layout-header class="header">
        <div class="header-left">后台管理系统</div>
        <div class="header-right">
          <a-avatar src="https://api.dicebear.com/7.x/identicon/svg?seed=Admin" />
          <span class="username">{{ user.username }}</span>
          <a-button type="link" @click="logout">退出登录</a-button>
        </div>
      </a-layout-header>

      <a-layout-content class="content">
        <router-view />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script setup>
import { message } from 'ant-design-vue'
import { onBeforeMount, onMounted, ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const collapsed = ref(false)
const router = useRouter()
const route = useRoute()
const selectedKey = ref(route.path)
let user = {}

onBeforeMount(() => {
  const raw = localStorage.getItem('user')
  if (raw) {
    try {
      user = JSON.parse(raw)
    } catch (e) {
      console.error('解析 localStorage.user 失败', e)
    }
  } else {
    router.push('/login')
  }
})

watch(() => route.path, (p) => selectedKey.value = p)

const onMenuClick = (e) => router.push(e.key)
const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  message.success('已退出登录')
  router.push('/login')
}
</script>

<style scoped>
.logo {
  height: 48px;
  margin: 16px;
  font-size: 16px;
  font-weight: bold;
  color: #fff;
  text-align: center;
}
.header {
  background: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
}
.header-left {
  font-size: 18px;
  font-weight: bold;
}
.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}
.username {
  margin-left: 8px;
  font-weight: 500;
}
.content {
  margin: 16px;
  padding: 24px;
  background: #fff;
  min-height: 360px;
  border-radius: 8px;
}
</style>
