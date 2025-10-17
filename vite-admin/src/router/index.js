// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'

// 导入你的页面组件
import Home from '../views/index.vue'
import Login from '../views/login.vue'
import todo from '../views/todo.vue'
import task from '../views/task.vue'
import user from '../views/user.vue'
import product from '../views/product.vue'
import Layout from '../components/Layout.vue'
import { message } from 'ant-design-vue'

const routes = [
  { path: '/login', component: Login },

  {
    path: '/',
    component: Layout, // Layout 作为主框架
    redirect: '/home',
    children: [
      { path: '/home', name: '首页', component: Home },
      { path: '/users', name: '用户管理', component: user },
      { path: '/tasks', name: '任务管理', component: task },
      { path: '/todos', name: '待办清单', component: todo },
      { path: '/products', name: '货号管理', component: product },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(), // 使用 HTML5 History 模式（无#）
  routes,
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  if (to.path !== '/login' && !token) {
    message.error('请先登录')
    next('/login')
  } else {
    next()
  }
})


export default router
