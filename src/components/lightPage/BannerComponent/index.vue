<template>
  <div class="banner" @click="handleClick">
    <img :src="options.imageUrl" alt="Banner Image" class="banner-image" />
    <h1 class="banner-title">{{ options.title }}</h1>
  </div>
</template>

<script>
import panel from './panel';

// 获取面板中初始化的值
function panelInit(arr = []) {
  if (!arr.length) return {};
  const obj = {};
  arr.forEach((item) => {
    if (item.componentValue) {
      obj[item.componentKey] = item.componentValue;
    }
  });
  return obj;
}

export default {
  name: 'BannerComponent',
  props: {
    options: {
      type: Object,
      default() {
        return panelInit(panel);
      },
    },
  },
  methods: {
    handleClick() {
      if (this.options.link) {
        window.location.href = this.options.link;
      } else {
        console.warn('链接未被定义');
      }
    },
  },
};
</script>
