<template>
    <view>
		<image :src="img_url" mode="scaleToFill" class="myimage" @longpress="saveImage()"></image>
    </view>
</template>

<script>
	import {mapState} from 'vuex'
	import uniIcon from "@/components/uni-icon.vue";
	import universal from '@/common/mixins/universal.js';
	import * as localConfig from '@/config/local/config.js';
	
	
	const webUrl = localConfig.websiteUrl
	export default {
		data() {
			return {
				img_url:''
			}
		},
		methods: {
			getcode(){
				uni.showLoading({
					title: '加载中'
				});
				uni.request({
					url: webUrl + '/api/v4/user/qrcode',
					method: 'GET',
					data: {},
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token')
					},
					success: (res) => {
						if(res.data.status == 'success'){
							this.img_url = res.data.data.bg_url;
							this.downloadfile(res.data.data.bg_url);
						}else{
							uni.showToast({
								title: ' '+res.errors.message,
								duration: 2000,
								icon:'none'
							});
						}
					},
					complete: (res) => {
						uni.hideLoading();
					}
				})
			},
			downloadfile(url){
				uni.downloadFile({
				    url: url,
				    success: (res) => {
						uni.saveFile({
							tempFilePath: res.tempFilePath,
							success: function (ret) {
								uni.setStorage({
									key: 'storage_qrcode',
									data: ret.savedFilePath
								});
								uni.setStorage({
									key: 'storage_url',
									data: url
								});
							}
						});
				    }
				});
			},
			saveImage(){
				uni.showModal({
					title: '',
					content: '是否保存该名片',
					success: function (res) {
						if (res.confirm) {
							uni.getStorage({
								key: 'storage_qrcode',
								success:(res) =>{
									uni.saveImageToPhotosAlbum({
										filePath: res.data,
										success: function() {
											uni.showToast({
												title: "保存成功",
												duration: 2000,
											});
										},
										fail: function() {
											uni.showToast({
												title: "保存失败，请稍后重试",
												duration: 2000,
												icon: "none"
											});
										}
									});
								}
							});
						}
					}
				});
			}
		},
		onLoad(){
			uni.getStorage({
				key: 'storage_qrcode',
				success:(res) =>{
					uni.getSavedFileInfo({
						filePath:res.data,
						success:(ret)=>{
							this.img_url = res.data;
						},
						fail:(ret)=>{
							this.getcode();
						}
					});
				},
				fail:(res) => {
					this.getcode();
				}
			});
		},
		onNavigationBarButtonTap(e){
			if(e.type == 'share'){
                uni.share({ 
                    provider: "weixin",
                    scene: "WXSceneSession",
                    type: 0,
                    href:uni.getStorageSync('storage_url'),
                    title: "分享码",
                    summary: "人无外财不富，马无夜草不肥，随时随地生财有道。",                         
                    imageUrl: uni.getStorageSync('storage_url'),
                    success: function(res) {
                        console.log("success:" + JSON.stringify(res));
                    },
                    fail: function(err) {
                        console.log("fail:" + JSON.stringify(err));
                    }
                });
			}
		}
	}
</script>
<style>
.myview {background:#000; color:#FFF}
.myimage{text-align: center; width: 750rpx; height: 1390rpx;}
</style>
