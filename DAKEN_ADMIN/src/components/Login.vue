<script setup>
import { ref } from 'vue'
import { useUserStore } from '@/stores/userstorage'

const userStore = useUserStore()
const username = ref('')
const password = ref('')

const handleLogin = () => {
  userStore.login(username.value, password.value)
}
</script>

<template>
  <div class="overlay">
    <div class="form-container">
      <form class="form-signin" @submit="handleLogin">
        <h2 class="form-signin-heading text-xl pt-4">请登录</h2>
        <div class="flex flex-col gap-3">
          <t-input v-model="username" type="text" name="username" placeholder="Email Address" class="small-input" required autofocus />
          <view style="height: 5pt;"></view>
          <t-input v-model="password" type="password" name="password" placeholder="Password" class="small-input" required />
          <view style="height: 5pt;"></view>
        </div>
        <div class="flex flex-row items-center justify-center mt-4">
          <div><label class="checkbox"></label></div>
          <view style="display: flex;">
            <t-button class="small-btn btn btn-primary btn-block" type="submit" @click.prevent ="handleLogin" >登录</t-button>
          </view>
        </div>
      </form>
    </div>
  </div>
</template>

<style lang="scss">
body {
  background: #eee !important;
}

.overlay {
  background: rgba(160, 156, 156, 0.5);
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.form-container {
  max-width: 380px;
  padding: 15px 35px 45px;
  background-color: #fff;
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.form-signin-heading,
.checkbox {
  margin-bottom: 30px;
}

.checkbox {
  font-weight: normal;
}

.small-input {
  font-size: 8px;
  height: auto;
  padding: 8px;
}

.small-input:focus {
  z-index: 2;
}

.flex {
  display: flex;
}

.flex-col {
  flex-direction: column;
}

.justify-center {
  justify-content: center;
}

.items-center {
  align-items: center;
}

.small-btn {
  font-size: 12px;
  padding: 8px 16px;
}
</style>
