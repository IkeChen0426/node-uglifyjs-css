var app = new Vue({
    el: '.tab-contain',
    data: {
        cur: 0,
        showDialog: false,
        myCoupons: [],
        isLogin: false
    },
    created() {
        if (location.search.split("tab=")[1]) {
            this.cur = 1
        }
        var pkUser = $.cookie('actor');
        // 判断是否登录
        if (!pkUser) {
            this.isLogin = false;
            return;
        }
        //debugger
        this.isLogin = true
        axios
            .get('/activity/fooww1911/getMyDiscountTickets', {
                params: {
                    pkUser: pkUser
                }
            })
            .then(function (res) {
                if (!res.data.isok) {
                    return;
                }
                for (var i = 0; i < res.data.data.length; i++) {
                    if (res.data.data[i].status === 1) {
                        app.myCoupons.push(res.data.data[i])
                    }
                }
            })
            .catch(function (err) {
                console.log(err);
            });
    },
    methods: {

    }
});