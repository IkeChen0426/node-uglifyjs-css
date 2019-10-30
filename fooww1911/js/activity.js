$(function () {
    // 播报向左滚动
    if (V.notice) {
        $(".anim-notice").html(V.notice);

        var spaceWidth = 150;
        if (V.notice.indexOf("错过哭一年") >= 0) {
            spaceWidth = 180;
        } else if (V.notice.indexOf("经纪人都在拼") >= 0) {
            spaceWidth = 220;
        }

        var noticeWidth = parseInt($(".anim-notice").css("width")) + spaceWidth;

        $(".anim-notice-wrap").css("width", noticeWidth * 2 + "px");
        $(".anim-notice").css("width", noticeWidth + "px");

        var num = 0;
        function goLeft() {
            if (num == -noticeWidth) {
                num = 0;
            }
            num -= 1;
            $(".anim-notice-wrap").css({
                left: num
            })
        }

    }

    setTimeout(function () {
        setInterval(goLeft, 30);
    }, 1000);


    // 查看我的开团
    $(".view-my-group").click(function () {
        if (new Date().getTime() < new Date(V.avtivityStartTime.replace(/-/g, '/')).getTime()) {
            customLayer("活动尚未开始~", { time: 1000, type: 2 });
            return;
        }

        if (!$.cookie("actor")) {
            $(".login-wrap,.confirm-login,.mask").show();
            return;
        }
        window.location = "/activity/fooww1911/my";
    });

    // 已有多少人开团
    $(".cur-three-group-people span").text(V.misc.threeMemberGroupCount);
    $(".cur-five-group-people span").text(V.misc.fiveMemberGroupCount);
    $(".cur-total-group-people span").text(V.misc.groupbuyingTotalCount);

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

        window.location = "/activity/fooww1911/my";
    });

    // 跳转商品详情
    $(".fooww-activity-snap-up").click(function () {
        if (!$(this).hasClass("snap-up-on")) return;

        var groupbuyingType = $(this).attr("data-id");
        window.location = "/activity/fooww1911/product?groupbuyingType=" + groupbuyingType;
    });

    // 跳转拼团规则说明
    $(".js-to-rule").click(function () {
        window.location = "/activity/fooww1911/rule";
    });
});