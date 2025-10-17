<template>
  <div>
    <h2>任务管理</h2>
    <a-table :dataSource="tasks" :columns="columns" bordered />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const tasks = ref([
  { key: 1, title: '开发登录模块', status: '进行中', owner: '张三' },
  { key: 2, title: '测试API接口', status: '待开始', owner: '李四' },
])

const columns = [
  { title: '任务标题', dataIndex: 'title' },
  { title: '状态', dataIndex: 'status' },
  { title: '负责人', dataIndex: 'owner' },
]
</script>
