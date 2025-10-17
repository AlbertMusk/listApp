<!-- src/views/Login.vue -->
<template>
  <div class="login-container">
    <a-card class="login-card" hoverable>
      <template #title>
        <h2>欢迎登录</h2>
      </template>
      <LoginForm />
    </a-card>
  </div>
</template>

<script setup>
  import LoginForm from '../components/LoginForm.vue'
</script>

<style scoped>
.login-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #ece9e6, #ffffff);
}

.login-card {
  width: 100%;
  max-width: 400px;
  padding: 30px 20px;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}
</style>
