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
      <canvas ref="lottieRef" class="testCanvas" id="testCanvas" canvas-id="testCanvas" type="2d" />
    </view>
  </view>
</template>

<script lang="ts">
import { onMounted, reactive, ref, toRefs } from 'vue';
import Lottie from '@/utils/lottie';
import Taro, { createSelectorQuery, pxTransform } from '@tarojs/taro'
import lottie from 'lottie-miniapp';
// import lottie from 'lottie-miniprogram'

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
      let ctxCanvas: any;
      if (process.env.TARO_ENV === 'weapp') {
        ctxCanvas= createSelectorQuery().select("#testCanvas")
          .fields({ node: true, size: true })
          .exec((res) => {
            const canvas = res[0].node;
            const ctx = canvas.getContext("2d");

            const dpr = Taro.getSystemInfoSync().pixelRatio;
            canvas.width = res[0].width * dpr;
            canvas.height = res[0].height * dpr;
            ctx.scale(dpr, dpr);

            const dadd = lottie(ctx, {
              animationPath: 'https://assets1.lottiefiles.com/datafiles/AembVTvov5PkTSJ/data.json',
              animationData: require('../../assets/aaa.json'),
              canvas: canvas
            })

            dadd.play()
          });
      } else {
        const canvasContext: any = Taro.createCanvasContext("testCanvas");
        console.log(canvasContext);

        // 指定canvas大小
        canvasContext.canvas = {
          width: pxTransform(50),
          height: pxTransform(50),
        };

        ctxCanvas = Lottie(canvasContext, {
          animationPath: 'https://assets1.lottiefiles.com/datafiles/AembVTvov5PkTSJ/data.json',
          animationData: require('../../assets/aaa.json'),
        })
      }
      console.log(ctxCanvas);
    };

    onMounted(() => {
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
