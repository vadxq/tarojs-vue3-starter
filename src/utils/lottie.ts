import lottie from 'lottie-miniapp';
import lottieMini from 'lottie-miniprogram'


export default (canvasContext, option: {
  animationPath?: String;
  animationData?: any;
  loop?: Boolean;
  autoplay?: Boolean;
  canvas?: any;
}) => {
  const loop: boolean = option.loop = true
  const autoplay: boolean = option.autoplay = true;
  if (process.env.TARO_ENV === 'weapp') {
    lottieMini.setup(option.canvas)
    return lottieMini.loadAnimation({
      loop: true,
      autoplay: false,
      animationData: option.animationData,
      path: option.animationPath as string,
      //本地动画
      rendererSettings: {
        context: canvasContext,
      },
    })
  }
  return lottie.loadAnimation({
    renderer: 'canvas', // 只支持canvas
    loop,
    autoplay,
    animationData: option.animationData,
    path: option.animationPath,
    rendererSettings: {
      // canvas: option.canvas,
      context: canvasContext,
      clearCanvas: true,
    },
  });
}
