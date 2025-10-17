<!-- src/components/LoginForm.vue -->
<template>
  <a-form
    :model="form"
    :rules="rules"
    ref="formRef"
    layout="vertical"
    @submit.prevent="handleSubmit"
  >
    <a-form-item name="username" label="用户名">
      <a-input
        v-model:value="form.username"
        placeholder="请输入用户名"
        :prefix="h(UserOutlined)"
      />
    </a-form-item>

    <a-form-item name="password" label="密码">
      <a-input-password
        v-model:value="form.password"
        placeholder="请输入密码"
        :prefix="h(LockOutlined)"
      />
    </a-form-item>

    <a-form-item>
      <a-button type="primary" html-type="submit" block :loading="loading">
        登录
      </a-button>
    </a-form-item>
  </a-form>
</template>

<script setup>
  import { reactive, ref, h } from 'vue'
  import { message } from 'ant-design-vue'
  import { UserOutlined, LockOutlined } from '@ant-design/icons-vue'
  import { login } from '../utils/user' // 导入登录函数

  const formRef = ref(null)

  const form = reactive({
    username: '',
    password: '',
  })

  const rules = {
    username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
    password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  }

  const loading = ref(false)

  const handleSubmit = () => {
    if (!form.password || !form.username) {
      message.error('请填写用户名和密码')
      return
    }
    try {
      loading.value = true
      login(form.username, form.password).then(data => {
          localStorage.setItem('user', JSON.stringify(data))
          try{
            const token = data.token;
            if (token) {
              localStorage.setItem('token', token);
            }
          }catch(e){
            console.error('存储 token 失败', e);
          }
          message.success('登录成功')
          window.location.href = '/' // 重定向到首页
      })
      // 假设返回的数据结构为 { token: '...' }
    } catch (error) {
      message.error(error.response?.data?.message || '登录失败，请重试')
    } finally {
      loading.value = false
    }
  }
</script>

<style scoped>
a-button {
  margin-top: 10px;
}
</style>
