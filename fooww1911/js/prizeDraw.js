$(function () {
    var move = false;
    // 按钮状态
    function draw() {
        $("#ball_btn1").show();
        $("#ball_btn2").hide();
        $("#ball_btn3").hide();
    };
    function share() {
        $("#ball_btn1").hide();
        $("#ball_btn2").show();
        $("#ball_btn3").hide();
    };
    function tomorrow() {
        $("#ball_btn1").hide();
        $("#ball_btn2").hide();
        $("#ball_btn3").show();
    };
    // 给按钮绑定事件
    $("#ball_btn1").on("click", moveChange);
    $("#ball_btn2").on("click", function () {
        $(".share-mask").show();
    });
    $("#ball_btn3").off("click");

    $(".share-mask").on("click", function () {
        $(this).hide();
    })
    // 初始化按钮状态函数
    function initBtn() {
        if ($.cookie("actor")) {
            // 登陆了
            if (+$("#remaining-times").text() === 0) {
                //V.wasShared === "False" ? share() : tomorrow();
                tomorrow();
            } else {
                draw();
            }
        } else {
            // 没登录默认显示3次
            draw();
        }
    };
    initBtn();
    // 复原
    function reset() {
        $(".lottery-result").hide();
        $(".discount").hide().css({ "background": "" });
        $(".res-text").text('');
        $(".res-des").text('');
        $(".coupon").hide().css({ "background": "" });
        $(".coupon .left .price").text('');
        $(".coupon .left .coupon-type").text('');
        $(".coupon .right .coupon-type").text('');
        $(".coupon .right .coupon-des").text('');
        $(".chance").text('');
        $(".confirm-btn").text('');
    };
    // 神券或者未抽中 type = 0 没抽中 type = 1 神券
    function discountOrNone(type) {
        if (type === 1) {
            reset();
            $(".lottery-result").show();
            $(".discount").show().css({ "background-image": "url('/Content/fooww1911/img/prizeDraw/winDiscount.png')" });
            $(".res-text").text("恭喜你获得1张神券");
            $(".res-des").text("(任意购买一项梵讯产品，享受1折优惠)");
            showCountAndBtn();
        } else if (type === 0) {
            reset();
            $(".lottery-result").show();
            $(".discount").show().css({ "background-image": "url('/Content/fooww1911/img/prizeDraw/notWin.png')" });
            $(".res-text").text("很遗憾，没抽中~");
            $(".res-des").text("不要灰心，继续加油！么么哒~");
            showCountAndBtn();
        };
    };

    // 抵扣券或者满减券 type = 0 抵扣券 type = 1 满减券
    function deduction(type, condition, amount) {
        if (type === 0) {
            reset();
            $(".lottery-result").show();
            $(".lottery-result .coupon").show();
            $(".left .price").text(amount);
            $(".left .coupon-type").text("抵扣券");
            $(".right .coupon-type").text("抵扣券");
            $(".right .coupon-des").text("(无门槛使用)");
            showCountAndBtn();
        } else if (type === 1) {
            reset();
            $(".lottery-result").show();
            $(".lottery-result .coupon").show();
            $(".left .price").text(amount);
            $(".left .coupon-type").text("满减券");
            $(".right .coupon-type").text("满减券");
            $(".right .coupon-des").text("(满" + condition + "元可使用)");
            showCountAndBtn();
        };
    };

    function showCountAndBtn(count) {
        var countStr;
        var btnStr;
        if ($("#remaining-times").text() == 0) {
            countStr = "抽奖机会已用完";
            btnStr = "明日再来"
        } else {
            countStr = "你还有" + $("#remaining-times").text() + "次抽奖机会";
            btnStr = "继续抽奖"
        };
        $(".lottery-result .chance").text(countStr);
        $(".lottery-result .confirm-btn").text(btnStr);
    };
    $(".lottery-result .confirm-btn").on("click", function () {
        reset();
    });
    $(".lottery-result .close-icon").on("click", function () {
        reset();
    });
    function moveChange() {
        // 判断是否登录
        var pkUser = $.cookie("actor");
        if (!pkUser) {
            $('.login-wrap,.mask').show();
            return;
        };

        // 减之前判断是否为0
        if (+$("#remaining-times").text() <= 0) {
            return;
        };

        // 减少剩余次数，并且解绑扭蛋按钮
        $("#remaining-times").text(+$("#remaining-times").text() - 1);
        $("#ball_btn1").off("click");
        $("#ball_btn2").off("click");


        if (move === false) {
            move = true;
            drawmove();
            // ajax开始到成功的时间差，如果小于3000，就让小球运动3000，如果大于3000，让小球运动timeDiff
            var timeDiff = 3000;
            var startTime = new Date().getTime();
            $.ajax({
                url: "/activity/fooww1911/execDrawResult",
                type: "POST",
                data: {
                    pkUser: pkUser
                },
                success: function (res) {
                    if (!res.isok) {
                        $("#remaining-times").text(+$("#remaining-times").text() + 1);
                        return;
                    }
                    // 判断剩余次数是否为0
                    if ($("#remaining-times").text() == 0) {
                        tomorrow();
                        //$.ajax({
                        //    url: "/activity/fooww1911/getShareStatus",
                        //    type: "GET",
                        //    data: {
                        //        pkUser: pkUser
                        //    },
                        //    success: function (res) {
                        //        if (!res.isok) {
                        //            return;
                        //        };
                        //        res.data.wasShared ? tomorrow() : share();
                        //    }
                        //});
                    } else {
                        draw();
                    }
                    // 动画时长
                    timeDiff = new Date().getTime() - startTime
                    if (timeDiff >= 3000) {
                        showRes(0, res.data);
                    } else {
                        showRes(3000 - timeDiff, res.data);
                    };
                },
                error: function (err) {
                    console.log(err);
                    $("#remaining-times").text(+$("#remaining-times").text() + 1);
                }
            });
            function showRes(time, data) {
                setTimeout(() => {
                    move = false;
                    for (i = 1; i <= 10; i++) {
                        $(".qiu_" + i).removeClass("wieyi_" + i);
                    };
                    // 抽奖成功后给扭蛋按钮注册事件
                    $("#ball_btn1").on("click", moveChange);
                    $("#ball_btn2").on("click", function () {
                        $(".share-mask").show();
                    });
                    switch (data.ticketType) {
                        case -1:
                            console.log('无次数');
                            customLayer("当日次数已用完", { time: 2000, type: 2 });
                            return;
                        case 0:
                            console.log('未中奖');
                            discountOrNone(0);
                            return;
                        case 1:
                            console.log(data.amount + '元抵扣券（无门槛使用）');
                            deduction(0, data.condition, data.amount);
                            return;
                        case 2:
                            console.log(data.amount + '元满减券（满' + data.condition + '元可使用）');
                            deduction(1, data.condition, data.amount);
                            return;
                        case 3:
                            console.log(data.discount + '折折扣券');
                            discountOrNone(1);
                            return;
                    };
                }, time);
            };
        }
    }

    function drawmove() {
        var number = Math.floor(4 * Math.random() + 1);

        for (i = 1; i <= 10; i++) {
            $(".qiu_" + i).removeClass("diaol_" + i);
            $(".qiu_" + i).addClass("wieyi_" + i);
        };

        //setTimeout(function () {
        //    for (i = 1; i <= 10; i++) {
        //        $(".qiu_" + i).removeClass("wieyi_" + i);
        //    }
        //}, 1100);

        //setTimeout(function () {
        //    switch (number) {
        //        case 1: $(".zjdl").children("span").addClass("diaL_one"); break;
        //        case 2: $(".zjdl").children("span").addClass("diaL_two"); break;
        //        case 3: $(".zjdl").children("span").addClass("diaL_three"); break;
        //        case 4: $(".zjdl").children("span").addClass("diaL_four"); break;
        //    }
        //    $(".zjdl").removeClass("none").addClass("dila_Y");
        //    setTimeout(function () {
        //        switch (number) {
        //            case 1: $("#jianpin_one").show(); break;
        //            case 2: $("#jianpin_two").show(); break;
        //            case 3: $("#jianpin_three").show(); break;
        //            case 4: $("#jianpin_kong").show(); break;
        //        }
        //    }, 900);
        //}, 1100)

        //取消动画
        //setTimeout(function () {
        //    $(".zjdl").addClass("none").removeClass("dila_Y");
        //    $(".wdjifen").html(10);
        //    $(".zjdl").children("span").removeAttr('class');
        //}, 2500)

    }
});
//var RENDERER = {
//    init: function () {
//        this.setParameters();
//        this.reconstructMethods();
//        this.createParticles();
//        this.render();
//    },
//    setParameters: function () {
//        this.$container = $("#ball_body");
//        //this.width = this.$container.width() * 0.9;
//        //this.height = this.$container.height() * 0.6;
//        this.width = this.$container.width() * 1;
//        this.height = this.$container.height() * 0.75;
//        this.context = $("<canvas />")
//            .attr({
//                width: this.width,
//                height: this.height,
//                style: "border-radius:2.02rem;overflow:hidden"
//            })
//            .appendTo(this.$container)
//            .get(0)
//            .getContext("2d");
//        this.particles = [];
//        this.img1 = new Image();
//        this.img1.src = "/Content/fooww1911/img/innerBall-01.png";
//        this.img2 = new Image();
//        this.img2.src = "/Content/fooww1911/img/innerBall-02.png";
//        this.img3 = new Image();
//        this.img3.src = "/Content/fooww1911/img/innerBall-03.png";
//        this.img4 = new Image();
//        this.img4.src = "/Content/fooww1911/img/innerBall-04.png";
//        this.img5 = new Image();
//        this.img5.src = "/Content/fooww1911/img/innerBall-05.png";
//        this.img6 = new Image();
//        this.img6.src = "/Content/fooww1911/img/innerBall-06.png";
//        this.img7 = new Image();
//        this.img7.src = "/Content/fooww1911/img/innerBall-07.png";
//        this.img8 = new Image();
//        this.img8.src = "/Content/fooww1911/img/innerBall-08.png";
//        this.img9 = new Image();
//        this.img9.src = "/Content/fooww1911/img/innerBall-09.png";
//        this.img10 = new Image();
//        this.img10.src = "/Content/fooww1911/img/innerBall-10.png";
//        this.img = [this.img1, this.img2, this.img3, this.img4, this.img5, this.img6, this.img7, this.img8, this.img9, this.img10];
//        this.lenght = 15;
//        this.localPosition = {
//            x: this.width * 0.4,
//            y: this.height * 0.75
//        };
//    },
//    reconstructMethods: function () {
//        this.render = this.render.bind(this);
//    },
//    createParticles: function () {
//        for (var i = 1, length = this.lenght; i <= length; i++) {
//            var num = parseInt(Math.random() * 10, 10);
//            //if (i < 2) {
//            //    this.particles.push(
//            //        new PARTICLE(
//            //            this.width,
//            //            this.height,
//            //            this.img[num],
//            //            this.localPosition
//            //        )
//            //    );
//            //} else 
//            if (i < 15) {
//                var position = {
//                    x:
//                        this.localPosition.x +
//                        Math.pow(-1, i) * (i + 1) * this.width * 0.028,
//                    y:
//                        this.localPosition.y -
//                        (i + 1) * this.height * 0.009 * Math.pow(0.14 * i, 2)
//                };
//                this.particles.push(
//                    new PARTICLE(this.width, this.height, this.img[num], position)
//                );
//            } else if (i < 26) {
//                var position = {
//                    x:
//                        this.localPosition.x +
//                        Math.pow(-1, i - 15) * (i + 1 - 15) * this.width * 0.03,
//                    y:
//                        this.localPosition.y -
//                        (i - 10) * this.height * 0.005 * Math.pow(0.14 * (i - 15), 2) -
//                        this.height / 10
//                };
//                this.particles.push(
//                    new PARTICLE(this.width, this.height, this.img[num], position)
//                );
//            }
//        }
//    },
//    render: function () {
//        requestAnimationFrame(this.render);
//        this.context.clearRect(0, 0, this.width, this.height);
//        for (var i = 0, length = this.particles.length; i < length; i++) {
//            this.particles[i].render(this.context);
//        }
//        this.checkCollision();
//    },
//    checkCollision: function () {
//        for (
//            var i = 0, particleCount = this.particles.length;
//            i < particleCount;
//            i++
//        ) {
//            var particle = this.particles[i];

//            for (var j = i + 1; j < particleCount; j++) {
//                this.particles[j].checkCollision(particle);
//            }
//        }
//    }
//};
//var PARTICLE = function (width, height, img, position) {
//    this.width = width;
//    this.height = height;
//    this.img = img;
//    this.position = position;
//    this.init();
//};
//PARTICLE.prototype = {
//    // 半径
//    RADIUS: { MIN: 8, MAX: 8 },
//    // 混乱度
//    MASS_RATE: 1,
//    // 速度
//    VELOCITY: { MIN: 7, MAX: 7 },
//    // 墙体修复
//    WALL_RESTITUTION: 1,
//    // 粒子还原
//    PARTICLE_RESTITUTION: 1,
//    // 三角弧度
//    DELTA_RADIAN: { MIN: 4, MAX: 8 },

//    init: function () {
//        this.radius = this.createRandomValue(this.RADIUS);
//        this.mass = Math.round(Math.pow(this.radius, 3) * this.MASS_RATE);
//        this.x = this.createRandomValue({
//            MIN: this.radius,
//            MAX: this.width - this.radius
//        });
//        this.y = this.createRandomValue({
//            MIN: this.radius,
//            MAX: this.height - this.radius
//        });
//        this.previousX = this.x;
//        this.previousY = this.y;
//        this.deltaRadian = this.createRandomValue(this.DELTA_RADIAN) | 0;
//        this.vx =
//            this.createRandomValue(this.VELOCITY) * (Math.random() > 0.5 ? 1 : -1);
//        this.vy =
//            this.createRandomValue(this.VELOCITY) * (Math.random() > 0.5 ? 1 : -1);
//    },
//    createRandomValue: function (range) {
//        return range.MIN + Math.round((range.MAX - range.MIN) * Math.random());
//    },
//    moveParticle: function () {
//        this.previousX = this.x;
//        this.previousY = this.y;
//        this.x += this.vx;
//        this.y += this.vy;

//        if (this.x <= this.radius) {
//            this.x = this.radius;
//            this.vx *= -this.WALL_RESTITUTION;
//        } else if (this.x >= this.width - this.radius) {
//            this.x = this.width - this.radius;
//            this.vx *= -this.WALL_RESTITUTION;
//        }
//        if (this.y <= this.radius) {
//            this.y = this.radius;
//            this.vy *= -this.WALL_RESTITUTION;
//        } else if (this.y > this.height - this.radius) {
//            this.y = this.height - this.radius;
//            this.vy *= -this.WALL_RESTITUTION;
//        }
//    },
//    getParticleInfo: function () {
//        return {
//            x: this.x,
//            y: this.y,
//            previousX: this.previousX,
//            previousY: this.previousY,
//            vx: this.vx,
//            vy: this.vy,
//            radius: this.radius,
//            mass: this.mass
//        };
//    },
//    setParticleInfo: function (x, y, vx, vy) {
//        this.previousX = this.x;
//        this.previousY = this.y;
//        this.x = x;
//        this.y = y;
//        this.vx = vx;
//        this.vy = vy;

//        if (this.radian > 0) {
//            this.radian = Math.max(0, this.radian - this.deltaRadian);
//        }
//    },
//    checkCollision: function (particle) {
//        if (this.radian === 0) {
//            return;
//        }
//        var particle1 = this.getParticleInfo(),
//            particle2 = particle.getParticleInfo(),
//            dx = particle2.x - particle1.x,
//            dy = particle2.y - particle1.y,
//            distance = Math.sqrt(dx * dx + dy * dy);

//        if (distance > particle1.radius + particle2.radius) {
//            return;
//        }
//        var angle = Math.atan2(dy, dx),
//            axis1 = { x: 0, y: 0 },
//            axis2 = this.rotate(dx, dy, angle),
//            v1 = this.rotate(particle1.vx, particle1.vy, angle),
//            v2 = this.rotate(particle2.vx, particle2.vy, angle),
//            vSum = (v1.x - v2.x) * this.PARTICLE_RESTITUTION;

//        v1.x =
//            ((particle1.radius - particle2.radius * this.PARTICLE_RESTITUTION) *
//                v1.x +
//                particle2.radius * v2.x * (1 + this.PARTICLE_RESTITUTION)) /
//            (particle1.radius + particle2.radius);
//        v2.x = v1.x + vSum;

//        var vAbs = Math.abs(v1.x) + Math.abs(v2.x),
//            overlap =
//                particle1.radius + particle2.radius - Math.abs(axis1.x - axis2.x);

//        if (axis1.x >= axis2.x) {
//            axis1.x += Math.abs((overlap * v1.x) / vAbs);
//            axis2.x -= Math.abs((overlap * v2.x) / vAbs);
//        } else {
//            axis1.x -= Math.abs((overlap * v1.x) / vAbs);
//            axis2.x += Math.abs((overlap * v2.x) / vAbs);
//        }
//        axis1 = this.rotate(axis1.x, axis1.y, -angle);
//        axis2 = this.rotate(axis2.x, axis2.y, -angle);
//        v1 = this.rotate(v1.x, v1.y, -angle);
//        v2 = this.rotate(v2.x, v2.y, -angle);

//        this.setParticleInfo(
//            particle1.x + axis1.x,
//            particle1.y + axis1.y,
//            v1.x,
//            v1.y
//        );
//        particle.setParticleInfo(
//            particle1.x + axis2.x,
//            particle1.y + axis2.y,
//            v2.x,
//            v2.y
//        );
//    },
//    rotate: function (x, y, angle) {
//        var sin = Math.sin(angle),
//            cos = Math.cos(angle);
//        return { x: x * cos + y * sin, y: y * cos - x * sin };
//    },
//    render: function (context) {
//        if (move === true) {
//            this.moveParticle();
//        }
//        context.save();
//        var axis = this.getParticleInfo();
//        context.beginPath();
//        if (move === true) {
//            context.drawImage(
//                this.img,
//                axis.x,
//                axis.y,
//                this.width / 4,
//                this.height * 9 / 25
//            );
//        } else {
//            context.drawImage(
//                this.img,
//                this.position.x,
//                this.position.y,
//                this.width /4,
//                this.height * 9/ 25
//            );
//        }
//    }
//};
//window.onload = function () {
//    RENDERER.init();
//}
//})


// 弹幕显示
$(function () {
    var userList = [["陶先生", "4", "100元", "抵扣券"], ["黄女士", "29", "300元", "满减券"], ["胡女士", "11", "80元", "抵扣券"], ["王先生", "25", "60元", "抵扣券"], ["程先生", "11", "600元", "满减券"], ["占先生", "16", "100元", "抵扣券"], ["石女士", "14", "900元", "满减券"], ["王女士", "10", "1200元", "满减券"], ["黄女士", "47", "100元", "抵扣券"], ["齐先生", "53", "300元", "满减券"], ["鲍先生", "51", "300元", "满减券"], ["徐女士", "53", "1200元", "满减券"], ["姚女士", "43", "100元", "抵扣券"], ["代先生", "38", "100元", "抵扣券"], ["黄先生", "51", "1200元", "满减券"], ["项先生", "36", "60元", "抵扣券"], ["王先生", "18", "600元", "满减券"], ["吴女士", "60", "100元", "抵扣券"], ["方女士", "45", "100元", "抵扣券"], ["杜先生", "59", "60元", "抵扣券"], ["丁先生", "54", "300元", "满减券"], ["胡先生", "9", "60元", "抵扣券"], ["蔡先生", "44", "100元", "抵扣券"], ["叶女士", "53", "1折", "神券"], ["张女士", "44", "60元", "抵扣券"], ["朱女士", "11", "900元", "满减券"], ["汪先生", "18", "10元", "抵扣券"], ["闫女士", "3", "100元", "抵扣券"], ["刘女士", "28", "10元", "抵扣券"], ["王先生", "53", "60元", "抵扣券"], ["汪女士", "12", "100元", "抵扣券"], ["姚女士", "9", "80元", "抵扣券"], ["金先生", "22", "300元", "满减券"], ["李先生", "41", "80元", "抵扣券"], ["操先生", "8", "100元", "抵扣券"], ["方女士", "51", "60元", "抵扣券"], ["施女士", "10", "80元", "抵扣券"], ["倪先生", "44", "80元", "抵扣券"], ["干先生", "10", "900元", "满减券"], ["王女士", "46", "600元", "满减券"], ["石女士", "17", "100元", "抵扣券"], ["何先生", "21", "80元", "抵扣券"], ["高先生", "49", "300元", "满减券"], ["高先生", "22", "100元", "抵扣券"], ["黄女士", "13", "10元", "抵扣券"], ["洪先生", "18", "600元", "满减券"], ["甘先生", "46", "1200元", "满减券"], ["凤女士", "14", "300元", "满减券"], ["刘先生", "21", "600元", "满减券"], ["齐女士", "19", "600元", "满减券"], ["李先生", "40", "900元", "满减券"], ["姚女士", "32", "300元", "满减券"], ["陈女士", "2", "900元", "满减券"], ["鲍女士", "16", "10元", "抵扣券"], ["华女士", "10", "80元", "抵扣券"], ["徐先生", "36", "300元", "满减券"], ["詹先生", "54", "80元", "抵扣券"], ["钱女士", "7", "600元", "满减券"], ["彭先生", "42", "300元", "满减券"], ["王女士", "7", "900元", "满减券"], ["何女士", "13", "100元", "抵扣券"], ["胡女士", "47", "900元", "满减券"], ["占先生", "40", "10元", "抵扣券"], ["张先生", "6", "600元", "满减券"], ["朱先生", "45", "100元", "抵扣券"], ["方先生", "34", "10元", "抵扣券"], ["王先生", "56", "80元", "抵扣券"], ["项先生", "49", "600元", "满减券"], ["丁先生", "39", "900元", "满减券"], ["宗先生", "60", "600元", "满减券"], ["张先生", "12", "300元", "满减券"], ["叶女士", "13", "1200元", "满减券"], ["倪先生", "32", "600元", "满减券"], ["华女士", "3", "900元", "满减券"], ["赵先生", "36", "100元", "抵扣券"], ["吴女士", "13", "80元", "抵扣券"], ["王女士", "49", "1折", "神券"], ["汪先生", "6", "300元", "满减券"], ["添先生", "14", "1200元", "满减券"], ["齐女士", "40", "10元", "抵扣券"], ["周先生", "11", "900元", "满减券"], ["张先生", "40", "600元", "满减券"], ["钟先生", "45", "80元", "抵扣券"], ["洪先生", "46", "300元", "满减券"], ["邰小姐", "46", "900元", "满减券"], ["伍女士", "49", "1200元", "满减券"], ["卫女士", "25", "900元", "满减券"], ["蒋先生", "55", "10元", "抵扣券"], ["顾女士", "19", "80元", "抵扣券"], ["毕先生", "25", "900元", "满减券"], ["李女士", "2", "1200元", "满减券"], ["张先生", "30", "10元", "抵扣券"], ["陈女士", "47", "300元", "满减券"], ["潘先生", "12", "80元", "抵扣券"], ["沈先生", "7", "1200元", "满减券"], ["查先生", "16", "900元", "满减券"], ["邱女士", "13", "10元", "抵扣券"], ["丁女士", "21", "300元", "满减券"], ["金先生", "16", "1200元", "满减券"], ["樊女士", "21", "1折", "神券"]];

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

        return newArr;
    }

    var newUserList = shuffle(userList);
    var userListHTML = "";
    for (var i = 0; i < newUserList.length; i++) {
        userListHTML += '<li>' + newUserList[i][0] + newUserList[i][1] + 's前抽中' + newUserList[i][2] + newUserList[i][3] + '</li>';
    }
    $(".barrage-wrap").show();
    //$(".barrage-wrap ul").append(userListHTML);
    //setInterval(function () {
    //    //debugger
    //    var curMarginTop = parseFloat($(".barrage-wrap ul").css("margin-top"));
    //    var userWrapH = $(".barrage-wrap ul").height();
    //    if (Math.abs(curMarginTop) >= userWrapH - userWrapH / 20) {
    //        $(".barrage-wrap ul").css("margin-top", "0");
    //    } else {
    //        //$(".barrage-wrap ul").css("margin-top", curMarginTop - userWrapH / 5);
    //        $(".barrage-wrap ul").animate({ "margin-top": curMarginTop - userWrapH / 20 }, 500);
    //    }
    //}, 5000);

    // 无限滚动
    $(".barrage-wrap ul").append(userListHTML + userListHTML);
    setInterval(function () {
        //debugger
        var curMarginTop = parseFloat($(".barrage-wrap ul").css("margin-top"));
        var userWrapH = $(".barrage-wrap ul").height();
        if (Math.abs(curMarginTop) >= userWrapH / 2) {
            $(".barrage-wrap ul").css("margin-top", "0");
        } else {
            $(".barrage-wrap ul").css("margin-top", curMarginTop - 0.5);
        }
    }, 16);

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
        window.location.reload();
    });
});