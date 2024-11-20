<template>
  <div class="profile-card">
    <img :src="options.imageUrl" alt="Profile Image" class="profile-image" />
    <h3>{{ options.name }}</h3>
    <p class="title">{{ options.title }}</p>
    <p class="description">{{ options.description }}</p>
    <!-- Add links or additional content as needed -->
  </div>
</template>

<script>
// 获取面板中的初始值
function panelInit (arr = []) {
  if (!arr.length) return {}
  const obj = {}

  arr.forEach((item) => {
    if (item.componentValue) {
      obj[item.componentKey] = item.componentValue
    }
  })
  return obj
}

import panel from './panel'

export default {
  name: 'ProfileCard',
  props: {
    options: {
      type: Object,
      default () {
        return panelInit(panel)
      }
    }
  }
}
</script>

<style lang="scss" scoped src="./index.scss"></style>
