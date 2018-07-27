var app = getApp().globalData;
export default class DrawImageData {
  palette(opt, qrcode) {
    return ({
      width: '750rpx',
      height: '1200rpx',
      background: '#ff5433',
      views: [{
          type: 'image',
          url: '/images/bgli.png',
          css: {
            bottom: '0rpx',
            left: '0rpx',
            width: '750rpx',
            height: '1200rpx',
          },
        },
        {
          type: 'text',
          text: opt.username || '小帮管家',
          css: [{
            top: `90rpx`,
            left: '220rpx',
            width: '750rpx',
            fontSize: '28rpx',
            color: '#fff',
            textAlign: 'center',
          }],
        },
        {
          type: 'text',
          text: `#${opt.category}#`,
          css: [{
            top: `135rpx`,
            left: '220rpx',
            width: '750rpx',
            fontSize: '48rpx',
            color: '#fff',
            textAlign: 'center',
          }],
        },
        {
          type: 'image',
          url: opt.headImage || '/images/admin_head_img2.jpg',
          css: {
            top: '250rpx',
            left: '100rpx',
            width: '75rpx',
            height: '75rpx',
            borderRadius: '75rpx',
          },
        },
        {
          type: 'text',
          text: opt.username || '小帮管家',
          css: [{
            top: `260rpx`,
            left: '200rpx',
            maxLines: 1,
            fontSize: '28rpx',
          }],
        },
        ..._imgList(opt.imgUrl),
        _iconText(opt.createTime, '300rpx', '200rpx'),
        {
          type: 'text',
          text: `#${opt.category}#${opt.content}`,
          css: [{
            width: '540rpx',
            top: '350rpx',
            left: '100rpx',
            maxLines: 2,
            fontSize: '28rpx',
          }],
        },
        _iconText(opt.address, '660rpx', '130rpx'),
        _iconText(opt.visitQuantity + '', '710rpx', '140rpx'),
        _iconText(opt.commentQuantity + '', '710rpx', '280rpx'),
        _iconText(opt.praiseQuantity + '', '710rpx', '410rpx'),
        {
          type: 'image',
          url: qrcode,
          css: {
            top: '1030rpx',
            left: '588rpx',
            width: '120rpx',
            height: '120rpx',
          },
        },
      ],
    });
  }
}

function _iconText(text, top, left) {
  return ({
    type: 'text',
    text,
    css: {
      top,
      left,
      fontSize: '24rpx',
      color: '#a0a0a0'
    },
  });
}

function _imgList(img) {
  if (!img) {
    return []
  }
  let data = []
  let imgs = img.split(',');
  imgs.map((res, index) => {
    console.log(index)
    if (index < 2) {
      data.push({
        type: 'image',
        url: app.imgHost + res,
        css: {
          top: '440rpx',
          left: 70 + 30 + (230 * index) + 'rpx',
          width: '200rpx',
          height: '200rpx',
        },
      })
    }
  })
  return data
}