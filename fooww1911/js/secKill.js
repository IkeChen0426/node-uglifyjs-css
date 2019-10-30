
/**
* @description 计算时间戳之间的差值
* @param date1 开始时间戳
* @param date2 结束时间戳
*/
// 服务器和本地时间差
var localServiceDiff = new Date(V.nowTime.replace(/-/g, '/')).getTime() - new Date().getTime();
function calculateDiffTime(dateStr) {
    dateStr = dateStr.replace(/-/g, '/')
    var date = new Date(dateStr);
    var time_str = date.getTime();
    var date3 = time_str - new Date().getTime() - localServiceDiff  //时间差的毫秒数
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
$(function () {
    /*
 * 抢购时间 
    2019-11-12-11-00
 */
    timer();
    function timer() {
        function changeTime() {
            // 十一点场
            var timers = calculateDiffTime(V.extraTime.SecKillStartTimeScene1);
            var timers2 = calculateDiffTime(V.extraTime.SecKillStartTimeScene2);
            var timers3 = calculateDiffTime(V.extraTime.SecKillStartTimeScene3);
            var timers4 = calculateDiffTime(V.extraTime.SecKillStartTimeScene4);

            if (timers.timediff > 0) {
                //$(".first-but").removeClass('themebg').text("即将开始")
                if (timers.day > 0) {
                    $(".firstScene .fooww-activity-data").text(timers.day + '天');
                } else {
                    $(".firstScene .fooww-activity-data").hide();
                }
                $(".firstScene .fooww-activity-hour").text(timers.hour);
                $(".firstScene .fooww-activity-minute").text(timers.minute);
                $(".firstScene .fooww-activity-second").text(timers.second);
                //场景1：未开始
            } else if (timers.timediff <= 0 && V.Activity[0].Cnt > 0) {
                //场景2：活动开始且有商品
                $(".first-but").addClass('themebg').text("立即秒杀")
                $(".firstScene .fooww-activity-hour").text(timers.hour);
                $(".firstScene .fooww-activity-minute").text(timers.minute);
                $(".firstScene .fooww-activity-second").text(timers.second);
            } else {
                //场景3：商品抢完了
                $(".first-but").removeClass('themebg').text("已结束")
            }

            if (timers2.timediff > 0) {
                //$(".second-but").removeClass('themebg').text("即将开始")
                if (timers2.day > 0) {
                    $(".secondScene .fooww-activity-data").text(timers2.day + '天')
                } else {
                    $(".secondScene .fooww-activity-data").hide();
                }
                $(".secondScene .fooww-activity-hour").text(timers2.hour);
                $(".secondScene .fooww-activity-minute").text(timers2.minute);
                $(".secondScene .fooww-activity-second").text(timers2.second);
                //场景1：未开始
            } else if (timers.timediff <= 0 && V.Activity[1].Cnt > 0) {
                //场景2：活动开始且有商品
                $(".second-but").addClass('themebg').text("立即秒杀")
                $(".secondScene .fooww-activity-hour").text(timers2.hour);
                $(".secondScene .fooww-activity-minute").text(timers2.minute);
                $(".secondScene .fooww-activity-second").text(timers2.second);
            } else {
                //场景3：商品抢完了
                $(".second-but").removeClass('themebg').text("已结束")
            }

            if (timers3.timediff > 0) {
                //$(".third-but").removeClass('themebg').text("即将开始")
                if (timers3.day > 0) {
                    $(".thirdScene .fooww-activity-data").text(timers3.day + '天');
                } else {
                    $(".thirdScene .fooww-activity-data").hide();
                }
                $(".thirdScene .fooww-activity-hour").text(timers3.hour);
                $(".thirdScene .fooww-activity-minute").text(timers3.minute);
                $(".thirdScene .fooww-activity-second").text(timers3.second);
                //场景1：未开始
            } else if (timers.timediff <= 0 && V.Activity[2].Cnt > 0) {
                //场景2：活动开始且有商品
                $(".third-but").addClass('themebg').text("立即秒杀")
                $(".thirdScene .fooww-activity-hour").text(timers3.hour);
                $(".thirdScene .fooww-activity-minute").text(timers3.minute);
                $(".thirdScene .fooww-activity-second").text(timers3.second);
            } else {
                //场景3：商品抢完了
                $(".third-but").removeClass('themebg').text("已结束")
            }

            if (timers4.timediff > 0) {
                if (timers4.day > 0) {
                    $(".fourScene .fooww-activity-data").text(timers4.day + '天')
                } else {
                    $(".fourScene .fooww-activity-data").hide();
                }
                $(".fourScene .fooww-activity-hour").text(timers4.hour);
                $(".fourScene .fooww-activity-minute").text(timers4.minute);
                $(".fourScene .fooww-activity-second").text(timers4.second);
                //$(".four-but").removeClass('themebg').text("即将开始")
                //场景1：未开始
            } else if (timers.timediff <= 0 && V.Activity[3].Cnt > 0) {
                //场景2：活动开始且有商品
                $(".four-but").addClass('themebg').text("立即秒杀")
                $(".fourScene .fooww-activity-hour").text(timers4.hour);
                $(".fourScene .fooww-activity-minute").text(timers4.minute);
                $(".fourScene .fooww-activity-second").text(timers4.second);
            } else {
                //场景3：商品抢完了
                $(".four-but").removeClass('themebg').text("已结束")
            }

        };
        changeTime();
        setInterval(function () {
            changeTime();
        }, 1000)
    }

    // 切换tab
    $(".tab1, .tab2").click(function () {
        $(".active-tab div").removeClass('active');
        $(this).addClass('active');
        if (this.classList[0] == "tab2") {
            $(".item1").hide();
            $(".item2").show();
            $(".active-tab").css("background-image", " url('../../Content/fooww1911/img/seckill/tabright.png')")
        } else {
            $(".item2").hide();
            $(".item1").show();
            $(".active-tab").css("background-image", " url('../../Content/fooww1911/img/seckill/tableft.png')")
        }
    })
    var startTime1114 = new Date(V.extraTime.SecKillStartTime2.replace(/-/g, '/')).getTime();
    var now = new Date(V.nowTime.replace(/-/g, '/')).getTime();
    //debugger
    if (now - startTime1114 >= 0) {
        // 显示第二个tab
        $(".active-tab div").removeClass('active');
        $(".item1").hide();
        $(".item2").show();
        $(".tab2").addClass("active");
        $(".active-tab").css("background-image", " url('../../Content/fooww1911/img/seckill/tabright.png')");
    } else {
        // 显示第一个tab
        $(".active-tab div").removeClass('active');
        $(".item2").hide();
        $(".item1").show();
        $(".tab1").addClass("active");
        $(".active-tab").css("background-image", " url('../../Content/fooww1911/img/seckill/tableft.png')");
    }
    // 点击其他 关闭弹窗
    $('.seckill-success, .seckill-fail').click(function () {
        $(this).removeClass("tipshow");
    })
    $('.fail-but ').click(function () {
        $(".seckill-fail").removeClass("tipshow");
    })
    // 秒杀
    var specialField = [
        "一年企业网站旗舰版",
        "一年PC软件冠名",
        "一年微站小程序标准版",
        "一年VR产品套餐"
    ];
    var failTip = [
        "下场秒杀17点开始",
        "下场秒杀14日11点开始",
        "秒杀活动已全部结束"
    ];
    var taskpk = "";
    $(".m-button").click(function () {
        if (!$.cookie("actor")) {
            $(".login-wrap,.confirm-login,.mask").show();
            return;
        }
        if (!$(this).hasClass("themebg")) {
            return
        }
        var type = $(this).attr('data-type');
        var loading = layer.open({ type: 2, shadeClose: false });
        var self = this
        $.ajax({
            url: "/activity/fooww1911/addSecKiller",
            type: "post",
            cache: true,
            dataType: 'json',
            data: {
                pkUser: $.cookie("actor"),
                type: type
            },
            success: function (r) {

                if (r.isok) {
                    // 抢购=》 成功是返回订单，弹出成功窗口
                    if (r.data && r.data.remainCnt == 0) {
                        V.Activity[type - 1].Cnt = 0;
                        $(self).removeClass('themebg').text("已结束");
                    }
                    if (r.data.result === 1) {
                        // 成功
                        $('.seckill-success').addClass('tipshow');
                        $('.shop-title').text(specialField[type - 1]);
                        taskpk = r.data.pkFoowwOrderTask;
                    } else if (r.data.result === 0) {
                        // 失败
                        $('.seckill-fail').addClass('tipshow');
                        if (type == 1 || type == 3) {
                            $('.fail-title').text(failTip[0]);
                            $('.fail-text').text("不要灰心，再接再厉");
                            $('.fail-but').text("我知道了")
                        } else if (type == 2) {
                            $('.fail-title').text(failTip[1]);
                            $('.fail-text').text("不要灰心，再接再厉");
                            $('.fail-but').text("我知道了");
                        } else {
                            $('.fail-title').text(failTip[2]);
                            $('.fail-text').text("可参加其他优惠活动");
                            $('.fail-but').hide();
                            $('.fail-but-js').show().text("查看其他优惠")
                        }

                    } else if (r.data.result === 2) {
                        // 未找到用户
                        $(".login-wrap,.confirm-login,.mask").show();
                        customLayer("未找到用户,重新登录", { time: 2000, type: 2 });
                    } else if (r.data.result === -1) {
                        customLayer("秒杀未开始", { time: 1500, type: 2 });
                    }
                }
            },
            error: function () {
                customLayer("出错啦", { time: 1500, type: 2 });
            },
            complete: function () {
                layer.close(loading);
            }
        });
    })
    // 去支付
    $(".seckill-bg").click(function () {
        // 阻止冒泡
        window.event ? window.event.cancelBubble = true : e.stopPropagation();
        location.href = 'https://activity.fooww.com/FoowwOrderTask/PayDetail/' + taskpk + '?v=2';
    })

    $(".fail-seckill-bg").click(function () {
        // 阻止冒泡
        window.event ? window.event.cancelBubble = true : e.stopPropagation();
    })

    $(".fail-but-js").click(function () {
        // 阻止冒泡  返回落地页
        window.event ? window.event.cancelBubble = true : e.stopPropagation();
        window.location.href = "/activity/fooww1911/index";
    })

    // 点击选择账号按钮
    $(".match-result-wrap").on("click", ".choose-account", function () {
        var pkUser = $(this).parents(".match-result-item-wrap").attr("data-pk");
        var selectAccount = $(this).parents(".match-result-item-wrap").attr("data-account");
        // 设置cookie，先删除在添加
        $.cookie('account', '', { expires: -1 });
        $.cookie("account", selectAccount, { path: "/", expires: 30 });

        $.cookie('actor', '', { expires: -1 });
        $.cookie("actor", pkUser, { path: "/", expires: 30 });
        $(".mask").click();
    });

})
