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
if (!isMobile()) {
    var newURL = "/activity/fooww1911/pcindex";
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
        $(".layer-msg").before('<img src="/Content/images/fooww1911/success-icon.png" style="width: 35px;"/>');
    } else {
        $(".custom-layer-wrap").addClass("layer-content-no-icon");
    }

    $(".layer-content").fadeIn();

    setTimeout(function () {
        $(".layer-content").fadeOut(function () {
            $(".custome-layer").remove();
        });
        
    }, condition.time);
}


; $(function () {
    // 跳转团详情
    $(".grouping-item-wrap").click(function () {
        var groupDetailID = $(this).attr("data-id");

        window.location = "/activity/fooww1911/groupDetail/" + groupDetailID;
    });

    // 分享
    $(".js-share").click(function (e) {
        e.stopPropagation();

        if (V.isFoowwBrowser == 1) {
            BackClick();
        }
        else {
            //显示分享导图
            $(".share-wechat-wrap").show();
        }
    });
    $(".js-share-set-sessionStorage").click(function () {
        if (V.isFoowwBrowser == 1) {
            BackClick();
        }
        else {
            //显示分享导图
            // $(".share-wechat-wrap").show();
            window.sessionStorage.shareImgShow = true;
        }
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
        window.location = "/activity/fooww1911/index";
    });
});
