function productCountdown2(productName, startTime, endTime) {
    // 活动持续时间--全局变量
    continueTime2 = new Date(endTime.replace(/-/g, '/')).getTime() - new Date(startTime.replace(/-/g, '/')).getTime();
    var TimeDif = timeDif2(startTime);
    $("." + productName + "-hour").text(addZero(TimeDif[1]));
    $("." + productName + "-minute").text(addZero(TimeDif[2]));
    $("." + productName + "-second").text(addZero(TimeDif[3]));

    if (TimeDif[0] > 0) {
        $("." + productName + "-snap-up").text("即将开始");
        $("." + productName + "-time-title").text("双11活动开始倒计时");
    } else if (TimeDif[0] <= 0 && Math.abs(TimeDif[0]) < continueTime2) {
        $("." + productName + "-snap-up").addClass("snap-up-on").text("立即开团");
        $("." + productName + "-time-title").text("双11活动结束倒计时");

        var leftHour = parseInt(timeDif2(endTime)[1]);
        var leftMinute = parseInt(timeDif2(endTime)[2]);
        var leftSecond = parseInt(timeDif2(endTime)[3]);

        $("." + productName + "-hour").text(addZero(leftHour));
        $("." + productName + "-minute").text(addZero(leftMinute));
        $("." + productName + "-second").text(addZero(leftSecond));
    } else {
        $("." + productName + "-snap-up").text("已结束");
        $("." + productName + "-time-title").text("活动已结束");
    }

    var Timer = null;
    Timer = setInterval(function () {
        TimeDif[0] = TimeDif[0] - 1000;
        if (TimeDif[0] > 0) {
            $("." + productName + "-snap-up").text("即将开始");
            $("." + productName + "-time-title").text("双11活动开始倒计时");
        } else if (TimeDif[0] <= 0 && Math.abs(TimeDif[0]) < continueTime2) {
            $("." + productName + "-snap-up").addClass("snap-up-on").text("立即开团");
            $("." + productName + "-time-title").text("双11活动结束倒计时");
        } else {
            $("." + productName + "-snap-up").removeClass("snap-up-on").text("已结束");
            $("." + productName + "-time-title").text("活动已结束");
            clearInterval(Timer);
        }

        timeInterval2(TimeDif[0], productName + "-hour", productName + "-minute", productName + "-second", Timer);
    }, 1000);
}

// 倒计时函数
function timeInterval2(timeDif, hourDom, minuteDom, secondDom, timer) {
    var prevSecond = parseInt($("." + secondDom).text());
    var prevMinute = parseInt($("." + minuteDom).text());
    var prevHour = parseInt($("." + hourDom).text());

    if (prevSecond == 0) {
        if (prevMinute == 0) {
            if (prevHour !== 0) {
                $("." + hourDom).text(prevHour < 11 ? "0" + (prevHour - 1) : (prevHour - 1));
            } else {
                //clearInterval(timer);
                window.location.reload();

                //if (timeDif <= 0 && timeDif > continueTime2) {
                //    $("." + hourDom).text("00");
                //    $("." + minuteDom).text("59");
                //    $("." + secondDom).text("59");
                //}
                return;
            }

            $("." + minuteDom).text(59);            
        } else {
            $("." + minuteDom).text(prevMinute < 11 ? "0" + (prevMinute - 1) : (prevMinute - 1));
        }

        $("." + secondDom).text(59);
    } else {
        $("." + secondDom).text(prevSecond < 11 ? "0" + (prevSecond - 1) : (prevSecond - 1));
    }
}

// 求传入的time时间到现在的时间差
function timeDif2(time) {
    var timeDifArr = [];
    var timeDifHour;
    var timeDifMinute;
    var timeDifSecond;

    // 将时间转化为2018-09-20-00-00-00格式 time.split(" ")[0] + "-" + time.split(" ")[1].split(":").join("-")

    var dif = new Date(time.replace(/-/g, '/')).getTime() - new Date().getTime();

    if (window.server.currentDate) {
        dif = new Date(time.replace(/-/g, '/')).getTime() - new Date(window.server.currentDate.replace(/-/g, '/')).getTime();
    }

    if (dif > 0) {
        timeDifHour = parseInt(dif / (60 * 60 * 1000), 10);
        timeDifMinute = parseInt(dif / (60 * 1000) % 60, 10);
        timeDifSecond = parseInt(dif / 1000 % 60, 10);
    } else {
        timeDifHour = 0;
        timeDifMinute = 0;
        timeDifSecond = 0;
    }

    timeDifArr.push(dif, timeDifHour, timeDifMinute, timeDifSecond);

    return timeDifArr;
}

// 将0-9的数字前面加上0，例1变为01
function addZero(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}

$(".js-timer").each(function () {
    productCountdown2($(this).attr("data-groupName"), $(this).attr("data-startTime"), $(this).attr("data-endTime"));
});
