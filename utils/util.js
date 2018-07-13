const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
//添加获取系统信息的方法
const getSystem=()=>{
  var sys;
  wx.getSystemInfo({
    success: function(res) {
      // console.log(res);
      sys= res;
    },
  })
  return sys;
}
function request(urlLastAdded,method,data,resolve,reject){
  // var result;
  wx.request({
    url: 'http://192.168.1.18:8011/helpyou/api/v1/' + urlLastAdded,
    method:method,
    header:{
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    },
    data:data,
    success:function(res){
      resolve(res);
    },
    fail:function(err){
      reject(err);
    },
  })
  // console.log(result);
  
}
const login=()=>{
  var key;
  wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        console.log(res);
        wx.request({
          url: 'http://192.168.1.18:8011/helpyou/api/v1/app/login',
          method:"POST",
          header:{
            'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
          },
          data:{
            code:""+res.code
          },
          success:function(r){
            // console.log(r.data.data.wego168SessionKey);
            key = r.data.data.wego168SessionKey;
          }
          
        })
      }
    })
    return key;
}


module.exports = {
  formatTime: formatTime,
  getSystem:getSystem,
  login:login,
  request:request
}
