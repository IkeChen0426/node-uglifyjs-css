// 5种活动按钮状态控制
// 拼团、抢券
var startTime08 = V.groupbuyingStartTime;
var endTime15 = "2019-11-15 23:59:59";

// 随心配、满即送
var startTime11 = V.extraTime.PresentStartTime;

// 秒杀
var startTime12 = V.extraTime.SecKillStartTime1;
var endTime12 = V.extraTime.SecKillEndTime1;
var startTime14 = V.extraTime.SecKillStartTime2;
var endTime14 = V.extraTime.SecKillEndTime2;

function productCountdown(productName, startTime, endTime) {
    // currentDate  服务器和本地时间差 优先服务器时间
    var currentDate = 0;
    if (window.server.currentDate) {
        currentDate = new Date(window.server.currentDate.replace(/-/g, '/')).getTime() - new Date().getTime();
    }
    var Timer = null;
    var dif1; // 距结束
    var dif2; // 距开始
    var showTime = null;

    function changeTime() {
        dif1 = new Date(endTime.replace(/-/g, '/')).getTime() - new Date().getTime() - currentDate;
        dif2 = new Date(startTime.replace(/-/g, '/')).getTime() - new Date().getTime() - currentDate;
        if (dif2 > 0) {
            $("." + productName + "-time-title").text("双11活动开始倒计时");
            showTime = dif2;
        } else if (dif1 > 0) {
            $("." + productName + "-time-title").text("双11活动结束倒计时");
            showTime = dif1;
        } else {
            $("." + productName + "-time-title").text("双11活动已结束");
            showTime = 0;
            clearInterval(Timer);
        }

        timeInterval(showTime, productName + "-day", productName + "-hour", productName + "-minute", productName + "-second");
    };
    changeTime();
    Timer = setInterval(function () {
        changeTime();
    }, 1000);
}

// 倒计时函数
function timeInterval(showTime, dayDom, hourDom, minuteDom, secondDom) {
    var timersTime = calculateDiffTime(showTime);
    if (timersTime.timediff > 0) {
        $("." + dayDom).text(timersTime.day);
        $("." + hourDom).text(timersTime.hour);
        $("." + minuteDom).text(timersTime.minute);
        $("." + secondDom).text(timersTime.second);
    }
}


function calculateDiffTime(date3) {
    //date3 时间差的毫秒数
    //计算出相差天数
    var day = Math.floor(date3 / (24 * 3600 * 1000))
    //计算出小时数
    var leave1 = date3 % (24 * 3600 * 1000)    //计算天数后剩余的毫秒数
    var hour = Math.floor(leave1 / (3600 * 1000))
    //计算相差分钟数
    var leave2 = leave1 % (3600 * 1000)        //计算小时数后剩余的毫秒数
    var minute = Math.floor(leave2 / (60 * 1000))
    //计算相差秒数
    var leave3 = leave2 % (60 * 1000)      //计算分钟数后剩余的毫秒数
    var second = Math.round(leave3 / 1000)
    return {
        timediff: date3,
        day: handelTimeNum(day),
        hour: handelTimeNum(hour),
        minute: handelTimeNum(minute),
        second: handelTimeNum(second)
    }
}
/**
 * @description 将单个数据前面价格0
 *
 * @param {Number} num
 * @returns {Number} num
 */
function handelTimeNum(num) {
    return num > 0 ? (num < 10 ? ('0'+num) : num) : "00"
}
