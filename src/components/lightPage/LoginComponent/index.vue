<template>
  <div class="login-component">
    <h2>用户登录</h2>
    <div>
      <label>{{ options.usernameLabel }}</label>
      <input v-model="username" type="text" placeholder="请输入用户名" />
    </div>
    <div>
      <label>{{ options.passwordLabel }}</label>
      <input v-model="password" type="password" placeholder="请输入密码" />
    </div>
    <button @click="handleLogin">{{ options.loginButton }}</button>
    <div v-if="errorMessage" class="error">{{ errorMessage }}</div>
  </div>
</template>

<script>
// Get initial values from Panel.js
function panelInit(arr = []) {
  if (!arr.length) return {}
  const obj = {}

  arr.forEach(item => {
    obj[item.componentKey] = item.componentValue || ''
  });

  return obj
}

import panel from './panel'

export default {
  name: 'LoginComponent',
  props: {
    options: {
      type: Object,
      default() {
        return panelInit(panel)
      }
    }
  },
  data() {
    return {
      username: '',
      password: '',
      errorMessage: ''
    }
  },
  methods: {
    handleLogin() {
      if (!this.username || !this.password) {
        this.errorMessage = '用户名和密码不能为空';
      } else {
        this.errorMessage = '';
        // Handle login logic here, such as making API calls
        console.log('Logging in with:', this.username, this.password);
      }
    }
  }
}
</script>

<style lang="scss" scoped src="./index.scss"></style>
