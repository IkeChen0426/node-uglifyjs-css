$(function () {

    //我要开团和继续开团
    $(".continue-to-group").click(function () {
        var groupBuyingType = 3;
        if (V.groupbuyingType) {
            groupBuyingType = V.groupbuyingType;
        }
        window.location = "/activity/fooww1911/product?groupbuyingType=" + groupBuyingType;
    });

    function payCheck(groupBuyingID) {
        var groupBuyingType = V.groupbuyingType;
        var pkUser = $.cookie("actor");
        if(!pkUser){
            pkUser="";
        }
        window.location = "/activity/fooww1911/pay/" + groupBuyingID + "?groupBuyingType=" + groupBuyingType + "&origin=" + pkUser;
    }

    var joinGroupType = 0; // 1:一键参团 2: 去参团
    var groupbuyingID;

    // 点击一键参团
    $(".js-invite-friend-join").click(function () {
        joinGroupType = 1;

        groupbuyingID = $(this).attr("data-id");

        // 判断是否登录
        if (!$.cookie("actor")) {
            $(".login-wrap,.mask").show();
            return;
        }

        payCheck(groupbuyingID);
    });

    // 点击去参团
    $(".join-group").click(function (e) {
        e.stopPropagation();

        joinGroupType = 2;

        groupbuyingID = $(this).attr("data-id");

        // 判断是否登录
        if (!$.cookie("actor")) {
            $(".login-wrap,.mask").show();
            return;
        }

        payCheck(groupbuyingID);
    });

    // 去查看团
    $(".my-no-group-to-login").click(function (e) {
        e.stopPropagation();

        joinGroupType = 3;
        // 判断是否登录
        if (!$.cookie("actor")) {
            $(".login-wrap,.mask").show();
            return;
        }

        window.location.reload();
    });

    // 点击选择账号按钮
    $(".match-result-wrap").on("click", ".choose-account", function () {
        var pkUser = $(this).parents(".match-result-item-wrap").attr("data-pk");


        var selectAccount = $(this).parents(".match-result-item-wrap").attr("data-account");

        // 设置cookie，先删除在添加
        $.cookie('account', '', { expires: -1 });
        $.cookie("account", selectAccount, { path: "/", expires: 30 });

        // 检查是否已经是该团成员
        var isGroupMember = false;
        if (joinGroupType == 1) {
            // 检查一键参团
            $(".js-member-wrap").each(function (index, obj) {
                if (pkUser == $(obj).attr("data-pk")) {
                    customLayer("您已是该团成员", { time: 1000, type: 2 });
                    isGroupMember = true;
                }
            });
        } else if (joinGroupType == 2) {
            // 检查去参团
            $(".img-wrap img").each(function (index, obj) {
                if (groupbuyingID == $(obj).parents(".grouping-item-wrap").attr("data-id") && pkUser == $(obj).attr("data-pk")) {
                    customLayer("您已是该团成员", { time: 1000, type: 2 });
                    isGroupMember = true;
                }
            });
        }
        else if (joinGroupType == 3) {
            // 查看我的团
            $.cookie("actor", pkUser, { path: "/", expires: 30 });
            window.location.reload();
            return;
        }

        if (isGroupMember) return;

        $.cookie('actor', '', { expires: -1 });
        $.cookie("actor", pkUser, { path: "/", expires: 30 });

        payCheck(groupbuyingID)
    });

    // 点击产品去详情
    $(".product-wrap").click(function () {
        var productType = $(this).attr("data-productType");
        if (!productType || productType==1) {
            productType=3;
        }
        window.location = "/activity/fooww1911/product?groupbuyingType=" + productType;
    });

    // 关闭提示框
    $(".js-warning-icon").click(function () {
        $(".warning-wrap").remove();
    });
});