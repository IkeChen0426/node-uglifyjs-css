$(function () {
    // 初始化轮播图
    if (isMobile()) {
        var mySwiper = new Swiper('.banner', {
            //direction: 'vertical',
            loop: true,

            // 如果需要分页器
            pagination: {
                el: '.pagination',
                clickable: true
            },

            autoplay: {
                delay: 3000,
                stopOnLastSlide: false,
                disableOnInteraction: false
            },

            // 如果需要前进后退按钮
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
        });
        if (mySwiper.slides.length <= 3) {
            mySwiper.destroy();
        }
    } else {
        var mySwiper = new Swiper('.swiper-container', {
            loop: true,
            autoplay: 3000,
            speed: 500,
            autoplayDisableOnInteraction: false,
            pagination: '.pagination'
        });
    }

    // 轮播图图片点击事件
    $(".swiper-wrapper").on("click", ".swiper-slide", function () {
        window.location.href = $(this).attr("data-url");
    })

    // 选择意向服务类型
    $(".service-item").click(function () {
        if ($(this).hasClass("product-checked")) {
            $(this).removeClass("product-checked");
        } else {
            $(this).addClass("product-checked");
        }
    });
    // 验证手机号
    function checkMobile(str) {
        var re = /^1\d{10}$/;
        if (re.test(str)) {
            return true;
        } else {
            return false;
        }
    }

    // 联级城市
    var selectedCityName = "";
    var selectedPKCity = "";
    var provinces = [];

    if (window.cityData) {
        for (var i = 0; i < cityData.length; i++) {
            var province = {
                label: cityData[i].province,
                value: cityData[i].pkprovince,
                children: []
            };
            for (var j = 0; j < cityData[i].city.length; j++) {
                province.children.push({
                    label: cityData[i].city[j].cityName,
                    value: cityData[i].city[j].pkcity
                });
            }
            provinces.push(province);
        }
    }

    $("#city").click(function () {
        // 级联picker
        weui.picker(provinces, {
            className: 'custom-classname',
            container: 'body',
            defaultValue: [1, 3],
            onChange: function (result) {
                //console.log(result);
                $("#city").removeClass("red-border");
            },
            onConfirm: function (result) {
                selectedCityName = result[1].label;
                selectedPKCity = result[1].value;

                $("#city").text(selectedCityName);
                $("#city").css("color", "#333");
            },
            id: 'doubleLinePicker'
        });
    });

    // 置底按钮
    appointmentShowOrNot();
    $(".appointment-fixed").click(function () {
        //$(window).scrollTop(1215);
        //$("html").animate({ "scrollTop": 1215 }, 500);
        var top = $(".index-reservation").offset().top;
        //$(window).scrollTop(top);
        $("html, body").animate({ "scrollTop": top }, 500);
    });
    $(window).scroll(function () {
        appointmentShowOrNot();
    });

    function appointmentShowOrNot() {
        var scrollTop = $(window).scrollTop();
        if (scrollTop > 600) {
            $(".appointment-fixed").hide();
        }
        if (scrollTop < 600) {
            $(".appointment-fixed").show();
        }
    }

    // 查看活动规则
    //$(".active-rule").click(function () {
    //    window.location = "/activity/fooww1911/activeRule";
    //});

    // 立即预约
    $("#cellphone").blur(function () {
        $(this).removeClass("red-border");
    });
    $("select").blur(function () {
        $(this).removeClass("red-border");
    });
    var isSubmitting = false;
    $(".appointment").click(function () {
        var intents = "";
        $(".service-item").each(function () {
            if ($(this).hasClass("product-checked")) {
                if (intents.length === 0) {
                    intents += $(this).attr("title");
                } else {
                    intents += "," + $(this).attr("title");
                }
            }
        });

        var pkCity = selectedPKCity;
        var name = $("#username").val();
        var cellPhone = $("#cellphone").val();
        var email = $("#fanxun-account").val();
        var type = 0;
        //var src = window.location.search.split("=")[1] ? parseInt(window.location.search.split("=")[1]) : 40; // 来源
        //debugger
        var src;
        if ($.cookie("srcStr")) {
            src = $.cookie("srcStr").split("=")[1];
        } else {
            src = 40;
        }
        //var src = $.cookie("srcStr").split("=")[1] || 40;
        // 不为空检验
        if (!cellPhone) {
            $("#cellphone").addClass("red-border");
            customLayer("请输入正确的手机号", { time: 1000, type: 2 });
            return;
        }
        if (!pkCity) {
            $("#city").addClass("red-border");
            customLayer("请选择城市", { time: 1000, type: 2 });
            return;
        }
        if (!intents) {
            customLayer("请选择意向服务类型", { time: 1000, type: 2 });
            return;
        }

        // 手机号验证
        if (!checkMobile(cellPhone)) {
            customLayer("请输入正确的手机号", { time: 1500, type: 2 });
            return;
        }

        if (isSubmitting) {
            return;
        }

        var loading = layer.open({ type: 2, shadeClose: false });

        isSubmitting = true;
        $.ajax({
            url: "/activity/fooww1911/addReservationUser",
            type: "post",
            cache: false,
            dataType: 'json',
            data: {
                pkCity: pkCity,
                name: name,
                cellPhone: cellPhone,
                email: email,
                type: type,
                intents: intents,
                src: src
            },
            success: function (r) {
                if (r.result === 1) {
                    customLayer("预约成功", { time: 1500, type: 1 });

                    $("#username").val("");
                    $("#fanxun-account").val("");
                    $("#cellphone").val("");
                    $("select[name='province']").val("");
                    $("#city").text("请选择您所在的城市");
                    $("#cellphone").removeClass("red-border");
                    $(".f-checked-icon").css("display", "none");
                    $(".service-item").removeClass("product-checked");
                    selectedPKCity = "";
                    selectedCityName = "";

                    layer.close(loading);

                    setTimeout(function () {
                        $(window).scrollTop(0);
                        window.location.reload();
                    }, 1500);

                } else {
                    customLayer("预约失败", { time: 1000, type: 2 });
                }
            },
            error: function () {
                customLayer("出错啦", { time: 1000, type: 2 });
            },
            complete: function () {
                isSubmitting = false;
                layer.close(loading);
            }
        });
    });

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

    // 服务器时间
    var timeDif = 0;
    if (server.currentDate) {
        timeDif = new Date(server.currentDate.replace(/-/g, "/")).getTime() - new Date().getTime();
    };
    

    function timeFn(d1) {//d1作为一个变量传进来
        //如果时间格式是正确的，那下面这一步转化时间格式就可以不用了
        var dateBegin = new Date(d1.replace(/-/g, "/"));//将-转化为/，使用new Date
        var dateDiff = new Date().getTime() + timeDif - dateBegin.getTime();//时间差的毫秒数
        return dateDiff;
    };

    function changeBtnStatus() {
        // 拼团、抢券
        if ($(".go-to-activity.go-to-prize-draw").hasClass("canClick") && (timeFn(startTime08) < 0 || timeFn(endTime15) >= 0)) {
            $(".go-to-activity.go-to-group").removeClass('canClick').addClass("disablebtn").text("即将开启");
            $(".go-to-activity.go-to-prize-draw").removeClass('canClick').addClass("disablebtn").text("即将开启");
            $(".entrance-icon.go-to-group").removeClass('canClick').addClass("disablebtn");
            $(".entrance-icon.go-to-prize-draw").removeClass('canClick').addClass("disablebtn");
        } else if ($(".go-to-activity.go-to-prize-draw").hasClass("disablebtn") && timeFn(startTime08) >= 0 && timeFn(endTime15) < 0) {
            $(".go-to-activity.go-to-group").removeClass('disablebtn').addClass("canClick").text("立即拼团");
            $(".go-to-activity.go-to-prize-draw").removeClass('disablebtn').addClass("canClick").text("立即抢券");
            $(".entrance-icon.go-to-group").removeClass('disablebtn').addClass("canClick");
            $(".entrance-icon.go-to-prize-draw").removeClass('disablebtn').addClass("canClick");
        };

        // 随心配、满即送
        if ($(".go-to-activity.go-to-reservation").hasClass("canClick") && (timeFn(startTime11) < 0 || timeFn(endTime15) > 0)) {
            $(".go-to-activity.go-to-reservation").removeClass('canClick').addClass("disablebtn").text("即将开启");
            $(".go-to-activity.go-to-present").removeClass('canClick').addClass("disablebtn").text("即将开启");
            $(".entrance-icon.go-to-reservation").removeClass('canClick').addClass("disablebtn");
            $(".entrance-icon.go-to-present").removeClass('canClick').addClass("disablebtn");
        } else if ($(".go-to-activity.go-to-reservation").hasClass("disablebtn") && timeFn(startTime11) >= 0 && timeFn(endTime15) <= 0) {
            $(".go-to-activity.go-to-reservation").removeClass('disablebtn').addClass("canClick").text("立即选配");
            $(".go-to-activity.go-to-present").removeClass('disablebtn').addClass("canClick").text("立即查看");
            $(".entrance-icon.go-to-reservation").removeClass('disablebtn').addClass("canClick");
            $(".entrance-icon.go-to-present").removeClass('disablebtn').addClass("canClick");
        };

        // 秒杀
        if ($(".go-to-activity.go-to-sec-kill").hasClass("canClick") && (timeFn(startTime12) < 0 || (timeFn(endTime12) > 0 && timeFn(startTime14) < 0) || timeFn(endTime14) > 0)) {
            $(".go-to-activity.go-to-sec-kill").removeClass('canClick').addClass("disablebtn").text("即将开启");
            $(".entrance-icon.go-to-sec-kill").removeClass('canClick').addClass("disablebtn");
        } else if ($(".go-to-activity.go-to-sec-kill").hasClass("disablebtn") && ((timeFn(startTime12) >= 0 && timeFn(endTime12) <= 0) || (timeFn(startTime14) >= 0 && timeFn(endTime14) <= 0))) {
            $(".go-to-activity.go-to-sec-kill").removeClass('disablebtn').addClass("canClick").text("立即秒杀");
            $(".entrance-icon.go-to-sec-kill").removeClass('disablebtn').addClass("canClick");
        };
    };
    changeBtnStatus();
    setInterval(function () {
        changeBtnStatus();
    }, 1000);

    function getUrlParam(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
        var r = window.location.search.substr(1).match(reg);  //匹配目标参数
        if (r != null) return unescape(r[2]);
        return null; //返回参数值
    }
    var srcNum = getUrlParam("src") || ""
    //var srcStr = ""
    //$.cookie("srcStr", srcStr, {path: "/"} )
    if (srcNum) {
        $.cookie("srcStr", "?src=" + getUrlParam("src"), { path: "/" })
    }
    var urlArr = [
        '/activity/fooww1911/activity',
        '/activity/fooww1911/prizeDraw',
        '/activity/fooww1911/reservation' + ($.cookie("srcStr") || ""),
        '/activity/fooww1911/secKill',
        '/activity/fooww1911/present'
    ];

    $(".go-to-activity").click(function () {
        if ($(this).hasClass('canClick')) {
            location.href = urlArr[$(".go-to-activity").index($(this))];
        }
    }); 
    $(".entrance-icon").click(function () {
        if ($(this).hasClass('canClick')) {
            location.href = urlArr[$(".entrance-icon").index($(this))];
        } else {
            switch ($(".entrance-icon").index($(this))) {
                case 0:
                    var startTime = "2019.11.8";
                    break;
                case 1:
                    var startTime = "2019.11.8";
                    break;
                case 2:
                    var startTime = "2019.11.11";
                    break;
                case 3:
                    var startTime = "2019.11.12";
                    break;
                case 4:
                    var startTime = "2019.11.11";
                    break;
            }
            customLayer("活动暂未开启，开启时间：" + startTime, { time: 1500 });
        }
    }); 

    // 预约人数为0，隐藏播报
    if ($(".reservation-title span").text() == 0) {
        $(".bulletin-board").hide();
    } else {
        $(".bulletin-board").show();
    }
});


// 弹幕显示
$(function () {
    var userList = [
        [
            "陶先生",
            "46"
        ],
        [
            "黄女士",
            "46"
        ],
        [
            "胡女士",
            "58"
        ],
        [
            "王先生",
            "16"
        ],
        [
            "程先生",
            "14"
        ],
        [
            "占先生",
            "36"
        ],
        [
            "石女士",
            "29"
        ],
        [
            "王女士",
            "45"
        ],
        [
            "黄女士",
            "5"
        ],
        [
            "齐先生",
            "28"
        ],
        [
            "鲍先生",
            "34"
        ],
        [
            "徐女士",
            "33"
        ],
        [
            "姚女士",
            "45"
        ],
        [
            "代先生",
            "50"
        ],
        [
            "黄先生",
            "24"
        ],
        [
            "项先生",
            "25"
        ],
        [
            "王先生",
            "25"
        ],
        [
            "吴女士",
            "56"
        ],
        [
            "方女士",
            "20"
        ],
        [
            "杜先生",
            "51"
        ],
        [
            "丁先生",
            "51"
        ],
        [
            "胡先生",
            "60"
        ],
        [
            "蔡先生",
            "32"
        ],
        [
            "叶女士",
            "51"
        ],
        [
            "张女士",
            "2"
        ],
        [
            "朱女士",
            "12"
        ],
        [
            "汪先生",
            "39"
        ],
        [
            "闫女士",
            "27"
        ],
        [
            "刘女士",
            "56"
        ],
        [
            "王先生",
            "58"
        ],
        [
            "汪女士",
            "33"
        ],
        [
            "姚女士",
            "11"
        ],
        [
            "金先生",
            "42"
        ],
        [
            "李先生",
            "35"
        ],
        [
            "操先生",
            "31"
        ],
        [
            "方女士",
            "5"
        ],
        [
            "施女士",
            "16"
        ],
        [
            "倪先生",
            "46"
        ],
        [
            "干先生",
            "9"
        ],
        [
            "王女士",
            "21"
        ],
        [
            "石女士",
            "52"
        ],
        [
            "何先生",
            "45"
        ],
        [
            "高先生",
            "38"
        ],
        [
            "高先生",
            "28"
        ],
        [
            "黄女士",
            "12"
        ],
        [
            "洪先生",
            "1"
        ],
        [
            "甘先生",
            "53"
        ],
        [
            "凤女士",
            "55"
        ],
        [
            "刘先生",
            "49"
        ],
        [
            "齐女士",
            "7"
        ],
        [
            "李先生",
            "8"
        ],
        [
            "姚女士",
            "31"
        ],
        [
            "陈女士",
            "60"
        ],
        [
            "鲍女士",
            "4"
        ],
        [
            "华女士",
            "2"
        ],
        [
            "徐先生",
            "28"
        ],
        [
            "詹先生",
            "28"
        ],
        [
            "钱女士",
            "44"
        ],
        [
            "彭先生",
            "41"
        ],
        [
            "王女士",
            "47"
        ],
        [
            "何女士",
            "50"
        ],
        [
            "胡女士",
            "10"
        ],
        [
            "占先生",
            "2"
        ],
        [
            "张先生",
            "56"
        ],
        [
            "朱先生",
            "53"
        ],
        [
            "方先生",
            "12"
        ],
        [
            "王先生",
            "45"
        ],
        [
            "项先生",
            "59"
        ],
        [
            "丁先生",
            "15"
        ],
        [
            "宗先生",
            "19"
        ],
        [
            "张先生",
            "49"
        ],
        [
            "叶女士",
            "41"
        ],
        [
            "倪先生",
            "27"
        ],
        [
            "华女士",
            "45"
        ],
        [
            "赵先生",
            "34"
        ],
        [
            "吴女士",
            "46"
        ],
        [
            "王女士",
            "42"
        ],
        [
            "汪先生",
            "51"
        ],
        [
            "添先生",
            "34"
        ],
        [
            "齐女士",
            "13"
        ],
        [
            "周先生",
            "23"
        ],
        [
            "张先生",
            "37"
        ],
        [
            "钟先生",
            "13"
        ],
        [
            "洪先生",
            "47"
        ],
        [
            "邰小姐",
            "34"
        ],
        [
            "伍女士",
            "39"
        ],
        [
            "卫女士",
            "46"
        ],
        [
            "蒋先生",
            "26"
        ],
        [
            "顾女士",
            "4"
        ],
        [
            "毕先生",
            "4"
        ],
        [
            "李女士",
            "42"
        ],
        [
            "张先生",
            "34"
        ],
        [
            "陈女士",
            "32"
        ],
        [
            "潘先生",
            "22"
        ],
        [
            "沈先生",
            "40"
        ],
        [
            "查先生",
            "51"
        ],
        [
            "邱女士",
            "40"
        ],
        [
            "丁女士",
            "27"
        ],
        [
            "金先生",
            "38"
        ],
        [
            "樊女士",
            "40"
        ]
    ];

    // 先定义一个某数值范围内的随机数
    function getRandom(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    // 克隆数组方法
    function cloneArr(arr) {
        // 从第一个字符就开始 copy
        // slice(start,end) 方法可从已有的数组中返回选定的元素。
        return arr.slice(0);
    }

    // 洗牌
    function shuffle(arr, flag) {
        // console.log('arr',arr)
        var newArr = [];
        if (!flag) {
            flag = false

        }
        flag ? (newArr = arr) : (newArr = cloneArr(arr));

        for (var i = 0; i < newArr.length; i++) {
            var j = getRandom(0, i);
            var temp = newArr[i];
            newArr[i] = newArr[j];
            newArr[j] = temp;
        }
        // console.log('arr',arr,newArr)

        return newArr;
    }

    var newUserList = shuffle(userList);
    var userListHTML = "";
    for (var i = 0; i < newUserList.length; i++) {
        var barrageInfo = "";
        try {
            if (parseInt((Math.random() * 100)) % 5 == 0) {
                barrageInfo = "完成预约";
            } else {
                barrageInfo = "发起预约";
            }
        } catch (e) {
            barrageInfo = "发起预约";
        }

        userListHTML += '<li>' + newUserList[i][0] + newUserList[i][1] + 's前' + barrageInfo + '</li>';
    }
    $(".barrage-wrap").show();
    $(".barrage-wrap ul").append(userListHTML);

    setInterval(function () {
        var curMarginTop = parseInt($(".barrage-wrap ul").css("margin-top"));
        var userWrapH = $(".barrage-wrap ul").height();
        if (Math.abs(curMarginTop) >= userWrapH - 60) {
            $(".barrage-wrap ul").css("margin-top", "0");
        } else {
            var scillHeight = $(".notice-title").height();
            $(".barrage-wrap ul").animate({ "margin-top": curMarginTop - scillHeight });
        }
    }, 4000);
  
});