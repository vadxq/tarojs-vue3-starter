<script setup lang="ts">
import Taro from '@tarojs/taro';
import { ref } from 'vue';

const msg = ref('Hello Taro');

const show = ref(false);
function click() {
  show.value = true;
}
</script>

<template>
  <nut-cell title="打开弹窗" desc="描述文字1" @click="click" />
  <nut-popup v-model:visible="show" closeable position="bottom" style="height: 50%"> 这里是 popup 的内容 </nut-popup>
  <div class="bg-slate-500 text-[100px] text-[#acc855]">
    <span>{{ msg }}</span>
    <div class="text-3xl">1</div>
  </div>
  <div>
    <!-- TODO: 按钮丢失 -->
    <nut-button type="primary"> Primary </nut-button>
    <nut-button type="info"> Info </nut-button>
  </div>
  <nut-divider dashed> 跳转 </nut-divider>
</template>
