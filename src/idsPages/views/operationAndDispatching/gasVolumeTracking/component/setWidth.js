import watchBox from "element-resize-detector";

function setWidth(main, content, scaling, w) {
  let erd = watchBox();
  erd.listenTo(document.getElementById(main), () => {
    let boxTop = document.getElementById(content);
    let width = boxTop.clientWidth;
    let scaleX = width / w; // svg代码绘画背景图片
    let scaleFunc = "scale(" + scaleX + "," + scaleX + ") translateZ(0)";
    let dom = document.getElementById(scaling);
    dom.style.transform = scaleFunc;
    dom.style.transformOrigin = "left top";
    boxTop.style.height = 1093 * scaleX + 50 + "px";
  });
}

export default setWidth;
