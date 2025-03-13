<script setup lang="ts">
import { ref } from 'vue';
import { getUserInfo } from '~/apis/index';

const msg = ref('Hello Taro');

const show = ref(false);

const click = () => {
  show.value = true;
};

const getInfoData = async () => {
  const res = await getUserInfo();
  console.log('获取信息', res);
};
</script>

<template>
  <layout-page>
    <nut-cell title="打开弹窗" desc="描述文字1" @click="click" />
    <nut-popup v-model:visible="show" closeable position="bottom" style="height: 50%"> 这里是 popup 的内容 </nut-popup>
    <div class="bg-slate-500 text-[100px] text-[#acc855]">
      <span>{{ msg }}</span>
      <div class="text-3xl">1</div>
    </div>
    <div>
      <!-- 演示nutui 部分组件丢失, 但是开启skyline居然有效 -->
      <nut-button type="primary"> Primary </nut-button>
      <nut-button type="info"> Info </nut-button>
    </div>
    <nut-divider dashed> 跳转 </nut-divider>
    <button @click="getInfoData">获取</button>
  </layout-page>
</template>
