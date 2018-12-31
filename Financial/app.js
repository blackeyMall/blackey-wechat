//app.js
App({
    onLaunch: function() {
        // 检测是否登录
        this.globalData.checkLoginStatus();
    },
    globalData: {
        // 服务器地址
        serverUrl: "http://192.168.1.124:1099",
        // 检查登录状态
        checkLoginStatus() {
            let openId = wx.getStorageSync("openId");
            if (openId === '') {
                wx.navigateTo({
                    url: "/pages/login/login"
                });
                return false;
            };
            return true;
        }
    }
});