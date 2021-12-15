import lottie from 'lottie-miniapp';

export default (canvasContext, option: {
  animationPath?: String;
  animationData?: any;
  loop?: Boolean;
  autoplay?: Boolean;
  canvas?: any;
}) => {
  const loop: boolean = option.loop = true
  const autoplay: boolean = option.autoplay = true;
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
