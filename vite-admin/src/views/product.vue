<template>
  <div>
    <h2>货号管理</h2>
    <a-table :dataSource="products" :columns="columns" bordered />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const products = ref([
  { key: 1, code: 'A1001', name: '蓝牙耳机', stock: 120 },
  { key: 2, code: 'A1002', name: '智能手表', stock: 56 },
  { key: 3, code: 'A1003', name: '键盘鼠标套装', stock: 200 },
])

const columns = [
  { title: '货号', dataIndex: 'code' },
  { title: '商品名称', dataIndex: 'name' },
  { title: '库存', dataIndex: 'stock' },
]
</script>
