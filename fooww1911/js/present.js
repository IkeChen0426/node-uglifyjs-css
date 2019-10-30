var app = new Vue({
    el: '#app',
    data: {
        isLogin: false,
        coupons: []
    },
    created() {
        // 判断是否登录
        if (location.search.split("pkUser=")[1]) {
            $.cookie('actor', '', { expires: -1 });
            $.cookie("actor", location.search.split("pkUser=")[1], { path: "/", expires: 30 });
        } else if (location.search.split("pkuser=")[1]) {
            $.cookie('actor', '', { expires: -1 });
            $.cookie("actor", location.search.split("pkuser=")[1], { path: "/", expires: 30 });
        };
        var pkUser = $.cookie('actor');
        if (!pkUser) {
            this.isLogin = false;
        } else {
            this.isLogin = true;
            axios
                .get('/activity/fooww1911/getDiscountTickets', {
                    params: {
                        pkUser: pkUser
                    }
                })
                .then(function (res) {
                    if (!res.data.isok || res.data.data.length === 0) {
                        return;
                    }
                    //debugger
                    app.coupons = res.data.data;
                })
                .catch(function (err) {
                    console.log(err);
                });
        }
    },
    methods: {
        useCoupon(id) {
            if (!id) return false;
            axios
                .post('/activity/fooww1911/checkOrderTask', {
                    pkFoowwOrderTask: id
                })
                .then(function (r) {
                    if (!r.data.isok) {
                        return;
                    }
                    location.href = 'https://activity.fooww.com/FoowwOrderTask/PayDetail/' + r.data.data.pkFoowwOrderTask + '?v=2'
                })
        },
        goToFoowwTraining() {
            if (this.isLogin) {
                location.href = 'https://vshow.fooww.com/foowwtrainingh5/#/index?pkUser=' + $.cookie('actor') + '&sceneid=41&src=3&city=wh';
            } else {
                location.href = 'https://vshow.fooww.com/foowwtrainingh5/#/index?sceneid=41&src=3&city=wh';
            }
        }
    }
});