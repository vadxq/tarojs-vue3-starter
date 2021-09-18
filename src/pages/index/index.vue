<template>
  <view class="index">
    <view>
      <img src="" alt="">
    </view>
    {{ msg }}
    <view class="btn">
      <nut-button type="primary" @click="handleClick('text', msg2, true)">点我</nut-button>
    </view>
    <nut-toast :msg="msg" v-model:visible="show" :type="type" :cover="cover" />
    <view id="lottie">
      <canvas id="test-canvas" canvas-id="test-canvas" type="2d"/>
    </view>
  </view>
</template>

<script lang="ts">
import { onMounted, reactive, ref, toRefs } from 'vue';
import Lottie from '@/utils/lottie';
import Taro, { pxTransform } from '@tarojs/taro'

export default {
  name: 'Index',
  components: {
    
  },
  setup(){
    const lottieRef = ref();
    const state = reactive({
      msg: '欢迎使用 NutUI3.0 开发小程序',
      msg2: '你成功了～',
      type: 'text',
      show: false,
      cover: false
    });

    const handleClick = (type: string, msg: string, cover: boolean = false) => {
      state.show = true;
      state.msg2 = msg;
      state.type = type;
      state.cover = cover;
    };

    onMounted(() => {

      const canvasContext: any = Taro.createCanvasContext("test-canvas");
      //   //  请求到的lottie json数据
      //   const animationData = require('../../assets/aaa.json')
      //   // 请求lottie的路径。注意开启downloadFile域名并且返回格式是json
      //   const animationPath = "https://assets1.lottiefiles.com/datafiles/AembVTvov5PkTSJ/data.json";

      //   // 指定canvas大小
        canvasContext.canvas = {
          width: pxTransform(50),
          height: pxTransform(50),
        };

      //   // 如果同时指定 animationData 和 path， 优先取 animationData
      //   lottie.loadAnimation({
      //     renderer: "canvas", // 只支持canvas
      //     loop: true,
      //     autoplay: true,
      //     animationData: animationData,
      //     path: animationPath,
      //     rendererSettings: {
      //       context: canvasContext,
      //       clearCanvas: true,
      //     },
      //   });

      Lottie(canvasContext, {
        animationPath: 'https://assets1.lottiefiles.com/datafiles/AembVTvov5PkTSJ/data.json',
        animationData: require('../../assets/aaa.json'),
      })
    })

    return {
      lottieRef,
      ...toRefs(state),
      handleClick
    }
  }
}
</script>

<style lang="scss">
@import './index.scss';
</style>
