var that = this;
this.setData({
  width: app.width,
  height: app.height,
  trueheight: app.trueHeight,
});
var ctx = wx.createCanvasContext("share", this);
var str = "徐若海";
var width = this.data.width;
var height = this.data.trueheight;
var w = width / 375;
var h = height / 667;
var pi = app.pixelRatio;
console.log(pi);
// 生成背景图
// ctx.drawImage("/images/bg_canvas.png", 0, 0, width, height * 0.8)
// ctx.draw();
// 写文字
ctx.save()
ctx.setFontSize(20 * h);
ctx.setFillStyle("white");
ctx.setTextAlign("center");
ctx.fillText(str + "发布了一条", width * 0.5 * w, height * 0.08 * w);
ctx.setFontSize(25 * h);
ctx.fillText("#当地美食#", width * 0.5 * w, height * 0.13 * w);
ctx.restore()
ctx.save()
ctx.beginPath();
ctx.arc(width * 0.17 * w, width * 0.34 * h, 25 * w, 0, 2 * Math.PI);
ctx.clip();

ctx.drawImage("/images/content4.png", width * 0.17 * w - 25 * w, width * 0.34 * h - 25 * h, 50 * w, 50 * h);
ctx.setTransform(0.11 * w, 0, 0, 0.11 * h, 0, 0);

ctx.restore()
ctx.setFontSize(16 * w);
ctx.setFillStyle("black");
ctx.fillText(str, width * 0.26 * w, width * 0.33 * h);
ctx.setFillStyle("#ccc");
ctx.fillText("3分钟之前", width * 0.23 * w, width * 0.39 * h);
ctx.setFillStyle("black");

this.canvasTextAutoLine("  sui疯潜入夜，细无声sui疯潜入夜，细无声细无声细无声细无声细无声细无声细无声疯潜入夜", ctx, width * 0.16 * w - 25 * w, width * 0.33 * h + 42 * h, 25 * h, w);


if (pi > 2) {
  for (let i = 0; i < 3; i++) {
    ctx.drawImage("/images/content" + (i + 1) + ".png", width * 0.108 * w + i * width * 0.25, height * 0.292 * h, width * 0.22 * w, height * h * 0.12);
  }
  ctx.setFontSize(14 * w);
  ctx.setFillStyle("#ccc");
  ctx.fillText("地址:大学城", width * 0.12 * w, height * 0.440 * h);

  ctx.fillText("点赞数，评论", width * 0.12 * w, height * 0.461 * h);
} else {
  for (let i = 0; i < 3; i++) {
    ctx.drawImage("/images/content" + (i + 1) + ".png", width * 0.108 * w + i * width * 0.25, height * 0.292 * h, width * 0.22 * w, height * h * 0.12);
    ctx.setFontSize(14 * w);
    ctx.setFillStyle("#ccc");
    ctx.fillText("地址:大学城", width * 0.12 * w, width * 0.58 * h + h * height * 0.12);

    ctx.fillText("点赞数，评论", width * 0.12 * w, width * 0.6625 * h + h * height * 0.12);
  }
} 