/**
 * Created by sail on 2017/6/1.
 */
import WeCropper from "../we-cropper/we-cropper.js";

const app = getApp();
const config = app.globalData.config;

const device = wx.getSystemInfoSync();
const width = device.windowWidth;
const height = device.windowHeight - 50;

Page({
    data: {
        cropperOpt: {
            id: "cropper",
            targetId: "targetCropper",
            pixelRatio: device.pixelRatio,
            width,
            height,
            scale: 2.5,
            zoom: 8,
            cut: {
                x: (width - 300) / 2,
                y: (height - 300) / 2,
                width: 300,
                height: 300
            },
            boundStyle: {
                color: config.getThemeColor(),
                mask: "rgba(0,0,0,0.8)",
                lineWidth: 1
            }
        },
        avatarUrl: '',
        target: '',
        id: ''
    },
    touchStart(e) {
        this.cropper.touchStart(e);
    },
    touchMove(e) {
        this.cropper.touchMove(e);
    },
    touchEnd(e) {
        this.cropper.touchEnd(e);
    },
    getCropperImage() {
        let _this = this;
        this.cropper
            .getCropperImage()
            .then(src => {
                let target = _this.data.target;
                let url = `/pages/${target}/${target}?cropUrl=${src}`;
                if (_this.data.id !== '') {
                    url += `&objectId=${_this.data.id}`;
                }
                wx.redirectTo({
                    url
                });
                // wx.previewImage({
                //     current: "", // 当前显示图片的http链接
                //     urls: [src] // 需要预览的图片http链接列表
                // });
            })
            .catch(() => {
                console.log("获取图片地址失败，请稍后重试");
            });
    },
    uploadTap() {
        const self = this;

        wx.chooseImage({
            count: 1, // 默认9
            sizeType: ["compressed"], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ["album", "camera"], // 可以指定来源是相册还是相机，默认二者都有
            success(res) {
                const src = res.tempFilePaths[0];
                //  获取裁剪图片资源后，给data添加src属性及其值

                self.cropper.pushOrign(src);
            }
        });
    },
    onLoad(option) {
        if (option.src) {
            this.setData({
                avatarUrl: option.src
            });
        };
        if (option.target) {
            this.setData({
                target: option.target
            });
        };
        if (option.id) {
            this.setData({
                id: option.id
            });
        }
        const { cropperOpt } = this.data;

        cropperOpt.boundStyle.color = config.getThemeColor();

        this.setData({ cropperOpt });

        this.cropper = new WeCropper(cropperOpt)
            .on("ready", ctx => {
                console.log(`wecropper is ready for work!`);
            })
            .on("beforeImageLoad", ctx => {
                wx.showToast({
                    title: "上传中",
                    icon: "loading",
                    duration: 20000
                });
            })
            .on("imageLoad", ctx => {
                wx.hideToast();
            });
    },
    onShow () {
        let avatarUrl = this.data.avatarUrl;
        if (avatarUrl !== '') {
            this.cropper.pushOrign(avatarUrl);
        }
    }
});