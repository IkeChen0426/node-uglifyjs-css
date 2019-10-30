$(function () {
    // 切换三人团五人团
    $(".change-group-type-wrap a").click(function () {
        $(".change-group-type-wrap a").removeClass("group-people-active");
        $(this).addClass("group-people-active");
    });
    if (V.groupbuyingType == 5) {
        $(".cur-group-people").text(V.misc.fiveMemberGroupCount);
        if (V.misc.fiveMemberGroupCount && parseInt(V.misc.fiveMemberGroupCount)) {
            $(".barrage").css("display","block")
        } else {
            $(".barrage").css("display", "none")
        }
    } else {
        $(".cur-group-people").text(V.misc.threeMemberGroupCount);
        if (V.misc.fiveMemberGroupCount && parseInt(V.misc.threeMemberGroupCount)) {
            $(".barrage").css("display", "block")
        } else {
            $(".barrage").css("display", "none")
        }
    }

    // 跳转拼团规则说明
    $(".js-to-rule").click(function () {
        window.location = "/activity/fooww1911/rule";
    });

    var joinGroupType=0;

    // 点击选择账号按钮
    $(".match-result-wrap").on("click", ".choose-account", function () {
        var pkUser = $(this).parents(".match-result-item-wrap").attr("data-pk");


        var selectAccount = $(this).parents(".match-result-item-wrap").attr("data-account");
        // 设置cookie，先删除在添加
        $.cookie('account', '', { expires: -1 });
        $.cookie("account", selectAccount, { path: "/", expires: 30 });

        if (joinGroupType == 1) {
            $.cookie("actor", pkUser, { path: "/", expires: 30 });
            window.location.href = "/activity/fooww1911/pay/?groupBuyingType=1&origin=" + pkUser;
        } else if (joinGroupType == 2) {
            $.cookie("actor", pkUser, { path: "/", expires: 30 });
            payCheck("");
        } else if (joinGroupType == 3) {
            // 检查去参团是否已经是该团成员
            var isGroupMember = false;
            $(".img-wrap img").each(function (index, obj) {
                if (lastClickGoGroupbuyingID == $(obj).parents(".grouping-item-wrap").attr("data-id") && pkUser == $(obj).attr("data-pk")) {
                    customLayer("您已是该团成员", { time: 1000, type: 2 });
                    isGroupMember = true;
                }
            });

            if (isGroupMember) return;

            if (!lastClickGoGroupbuyingID) {
                window.location.reload();
            }

            $.cookie('actor', '', { expires: -1 });
            $.cookie("actor", pkUser, { path: "/", expires: 30 });
            payCheck(lastClickGoGroupbuyingID);
        }
        
    });

    function payCheck(groupBuyingID) {
        var groupBuyingType = V.groupbuyingType;
        var pkUser = $.cookie("actor");
        if(!pkUser){
            pkUser="";
        }
        window.location.href = "/activity/fooww1911/pay/" + groupBuyingID + "?groupBuyingType=" + groupBuyingType + "&origin=" + pkUser;
    }


    // 原价购买
    $(".full-price-buy").click(function () {
        joinGroupType = 1;
        if (!$.cookie("actor")) {
            $(".login-wrap,.mask").show();
            return;
        }

        var pkUser = $.cookie("actor");
        if(!pkUser){
            pkUser="";
        }
        window.location = "/activity/fooww1911/pay/?groupBuyingType=1&origin=" + pkUser;
    });

    // 点击一键开团
    $(".to-start-group").click(function () {
        joinGroupType = 2;

        checkLogin("");
    });

    // 点击去参团
    var lastClickGoGroupbuyingID;
    $(".join-group").click(function (e) {
        e.stopPropagation();
        joinGroupType = 3;
        var groupbuyingID = $(this).attr("data-id");
        lastClickGoGroupbuyingID = groupbuyingID;

        checkLogin(groupbuyingID);
    });

    function checkLogin(groupbuyingID) {
        // 判断是否登录
        if (!$.cookie("actor")) {
            $(".login-wrap,.mask").show();
            return;
        }

        // 如果是去参团，判断是否已经是该团成员
        var isGroupMember = false;
        if (joinGroupType == 3) {
            $(".img-wrap img").each(function (index, obj) {
                if (lastClickGoGroupbuyingID == $(obj).parents(".grouping-item-wrap").attr("data-id") && $.cookie("actor") == $(obj).attr("data-pk")) {
                    customLayer("您已是该团成员", { time: 1000, type: 2 });
                    isGroupMember = true;
                }
            });
        }

        if (isGroupMember) return;

        payCheck(groupbuyingID);
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
    function shuffle(arr, flag = false) {
        // console.log('arr',arr)
        var newArr = [];
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
                barrageInfo = "完成拼团";
            } else {
                barrageInfo = "发起拼团";
            }
        } catch(e){
            barrageInfo = "发起拼团";
        }

        userListHTML += '<li>' + newUserList[i][0] + newUserList[i][1] + 's前' + barrageInfo+'</li>';
    }
    if (V.groupbuyingType == 5) {
        if (V.misc.fiveMemberGroupCount && parseInt(V.misc.fiveMemberGroupCount)) {
            $(".barrage-wrap").show();
        } else {
            $(".barrage-wrap").hide();
        }
    } else {
        if (V.misc.fiveMemberGroupCount && parseInt(V.misc.threeMemberGroupCount)) {
            $(".barrage-wrap").show();
        } else {
            $(".barrage-wrap").hide();
        }
    }
    
    $(".barrage-wrap ul").append(userListHTML);

    setInterval(function () {
        var curMarginTop = parseInt($(".barrage-wrap ul").css("margin-top"));
        var userWrapH = $(".barrage-wrap ul").height();

        if (Math.abs(curMarginTop) >= userWrapH - 60) {
            $(".barrage-wrap ul").css("margin-top", "0");
        } else {
            $(".barrage-wrap ul").animate({ "margin-top": curMarginTop - 30 });
        }
    }, 4000);

});