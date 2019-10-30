/* 手机端和电脑端互跳 */
function isMobile() {
    var regex_match = /(nokia|iphone|android|motorola|^mot-|softbank|foma|docomo|kddi|up.browser|up.link|htc|dopod|blazer|netfront|helio|hosin|huawei|novarra|CoolPad|webos|techfaith|palmsource|blackberry|alcatel|amoi|ktouch|nexian|samsung|^sam-|s[cg]h|^lge|ericsson|philips|sagem|wellcom|bunjalloo|maui|symbian|smartphone|midp|wap|phone|windows ce|iemobile|^spice|^bird|^zte-|longcos|pantech|gionee|^sie-|portalmmm|jigs browser|hiptop|^benq|haier|^lct|operas*mobi|opera*mini|320x320|240x320|176x220)/i;
    var u = navigator.userAgent;
    if (null == u) {
        return true;
    }
    var result = regex_match.exec(u);
    if (null == result) {
        return false
    } else {
        return true
    }
}
if (isMobile()) {
    var newURL = "/activity/fooww1911/index";

    window.location = newURL;
}

function addRandomToUrl(srcUrl) {
    if (!srcUrl) {
        return "";
    }

    var ret = "";
    if (srcUrl.indexOf("?") > 0) {

        if (/_t=[0-9]+/.test(srcUrl)) {
            ret = srcUrl.replace(/_t=[0-9]+/, '_t=' + new Date().getTime());
        } else {
            ret = srcUrl + "&_t=" + new Date().getTime();
        }
    }
    else {
        ret = srcUrl + "?_t=" + new Date().getTime();
    }

    return ret;
}


// 手机梵讯中自动注册
(function autoLogin() {
    var actor = $.cookie("actor");
    if (window.local_obj && window.local_obj.getCurViewer) {
        // 从手机梵讯获取
        actor = window.local_obj.getCurViewer();
        try {
            if (actor != null && actor.length > 0)
                $.cookie("actor", actor, { path: "/", expires: 30 });
        } catch (e) {
        }
    }
})();

function setCurViewer(pkUser) {
    var actor = $.cookie("actor");
    try {
        if (pkUser != null && pkUser.length > 0) {
            $.cookie("actor", pkUser, { path: "/", expires: 30 });
        }
    } catch (e) {
    }
}

// 弹窗
function customLayer(msg, condition) {
    var layerHTML = "";

    layerHTML += '<div class="custome-layer">';
    layerHTML += '<div class="custom-layer-wrap">';
    layerHTML += '<div class="layer-content">';
    layerHTML += '<p class="layer-msg">' + msg + '</p>';
    layerHTML += '</div>';
    layerHTML += '</div>';
    layerHTML += '</div>';

    $("body").append(layerHTML);

    // type: 1成功
    if (condition.type == 1) {
        $(".layer-msg").before('<img src="/Content/images/fooww201811/success-icon.png" style="width: 35px;"/>');
    } else {
        $(".custom-layer-wrap").addClass("layer-content-no-icon");
    }

    $(".custome-layer").fadeIn();

    setTimeout(function () {
        $(".custome-layer").fadeOut();
        $(".custome-layer").remove();
    }, condition.time);
}


; $(function () {
    // 跳转团详情
    $(".grouping-item-wrap").click(function () {
        var groupDetailID = $(this).attr("data-id");

        window.location = "/activity/fooww1911pc/groupDetail/" + groupDetailID;
    });

    // 分享
    $(".js-share,.js-share-set-sessionStorage").click(function (e) {
        e.stopPropagation();

        //if (V.isFoowwBrowser == 1) {
        //    BackClick();
        //}
        //else {
        //    //显示分享导图
        //    $(".share-wechat-wrap").show();
        //}

        var curURL = window.location.href;
        var newURL = curURL.replace("/activity/fooww1911pc/", "/activity/fooww1911/");

        var wechatShareHTML = '<div id="wechat-share-wrap">';
        wechatShareHTML += '<p style="font-weight: 700;">分享到微信</p>';
        wechatShareHTML += '<div id="wechat-share-img"></div>';
        wechatShareHTML += '<p>打开微信，点击底部的“发现”</p>';
        wechatShareHTML += '<p>使用“扫一扫”即可将网页分享至朋友圈。</p>';
        wechatShareHTML += ' </div>';

        $("body").append(wechatShareHTML);

        // 生成二维码
        $("#wechat-share-wrap").css("top", ($(window).height() - 220) / 2);
        $("#wechat-share-wrap").css("left", ($(window).width() - 220) / 2);
        $("#wechat-share-wrap").show();

        $("#wechat-share-img").empty().qrcode({
            render: "image",
            text: newURL
        });
    });
    //$(".js-share-set-sessionStorage").click(function () {
    //    if (V.isFoowwBrowser == 1) {
    //        BackClick();
    //    }
    //    else {
    //        //显示分享导图
    //        // $(".share-wechat-wrap").show();
    //        window.sessionStorage.shareImgShow = true;
    //    }
    //});
    // 关闭微信分享
    $(document).on("click", "#wechat-share-wrap", function (e) {
        e.stopPropagation();
    });
    $(document).click(function () {
        $("#wechat-share-wrap").remove();
    });

    function BackClick() {
        try {
            //window.webkit.messageHandlers.goIndex.postMessage("https://activity.fooww.com/Content/images/FoowwWeizhan3Years/introduce.png");
            window.location.href = "mobile://share";
        } catch (e) {
        }
    }

    // 关闭分享导图
    $(".share-wechat-wrap").click(function () {
        $(".share-wechat-wrap").hide();
    });

    // 返回落地页
    $(".js-to-index").click(function () {
        window.location = "/activity/fooww1911/pcindex";
    });
});