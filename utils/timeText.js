var time = '2017年06月02日 10:43:24';
// 时间统一函数
function getTimeText(argument) {
    var timeS = argument;
    var todayT = ''; //
    var yestodayT = '';
    var timeCha = getTimeS(timeS);
    timeS = timeS.slice(-8);
    todayT = new Date().getHours()*60*60*1000 + new Date().getMinutes()*60*1000 + new Date().getSeconds()*1000;
    yestodayT = todayT + 24*60*60*1000;
    if(timeCha > yestodayT) {
        return argument.slice(0,11);
    }
    if(timeCha > todayT && timeCha < yestodayT) {
        return timeS.slice(0,2)>12?'昨天 下午 '+(timeS.slice(0,2)==12 ? 12 : timeS.slice(0,2) - 12)+timeS.slice(2,5):'昨天 上午 '+timeS.slice(0,5);
    }
    if(timeCha < todayT) {
        return timeS.slice(0,2)>=12?'下午 '+(timeS.slice(0,2)==12 ? 12 : timeS.slice(0,2) - 12)+timeS.slice(2,5):'上午 '+timeS.slice(0,5);
    }
    
}

// 时间戳获取
function getTimeS(argument) {
  var timeS = argument;
  timeS = timeS.replace(/[-]/,'/').replace(/[-]/,'/').replace(/[日]/,' ');
  return new Date().getTime() - new Date(timeS).getTime() - 1000; //有一秒的误差

}

module.exports = {
  getTimeText: getTimeText
}
