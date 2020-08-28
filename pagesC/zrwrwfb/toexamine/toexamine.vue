<template>
	<view>
		<view class="fabu-top">
			<view class="fabu-title"><text>需求：{{item.title}}</text></view>
			<view class="fabu-nav">
				<view class="fabu-team"><text>{{item.name}}</text></view>
				<view class="fabu-team"><text>赚：{{item.price}}乐券</text></view>
				<view class="fabu-team"><text>赚：{{item.dot}}任务点</text></view>
			</view>
			<view class="fabu-nav" style="border-top:1px solid #515151;margin-top:40rpx;border-bottom:1px solid #515151;">
				<view class="fabu-imgteam ren-suma" ><text>{{item.apply_num}}人已赚 </text></view>
				<view class="fabu-imgteam ren-sumb"><text>剩余{{item.max_num-item.apply_num}}人</text></view>
				<view class="fabu-imgteam ren-sumc"><text>编号:{{id}}</text></view>
			</view>
		</view>
		<view class="fabu-header">
			<view class="fabu-header-left">
				<image :src="gethead(item.user.user_picture)" style="width:140rpx; height:140rpx"></image>
			</view>
			<view class="fabu-header-mid">
				<view class="fabu-name">
					<text style="height:50rpx;font-size:36rpx;line-height:50rpx;color:#FFA538">{{item.user.nick_name}}</text>
				</view>
				<view class="fabu-userinfo" v-if="item.user.real == 1">
					<view class="fabu-more"><text>已实名认证</text></view>
					<view class="fabu-more"><text>已缴预付</text></view>
				</view>
				<view class="fabu-userinfo" v-else>
					<view class="fabu-more"><text>未实名认证</text></view>
					<view class="fabu-more"><text>已缴预付</text></view>
				</view>
			</view>
			<view class="fabu-header-right">
				{{item.max_num * item.price}}乐券
			</view>
		</view>
		<view class="fabu-one"></view>

		<view class="list-ul">
			<view class="videourl" @click="outlink(item.link,item.linktype)"> 一键直达 </view>
			<view class="gourl" @click="copy(item.link)"> 复制链接 </view>
		</view>
		<view class="list-ul" v-if="showa">
			<view class="list-name"> 任务截图：</view>
			<view class="list-inp">
				<view class="inp-100 fy" style="text-align:left">
					<image :src="aimage[0]" mode="widthFix" class="imgwidth" @click="previewifb(0)" ></image>
					<image :src="aimage[1]" v-if="showb" mode="widthFix" @click="previewifb(1)"  class="imgwidth"></image>
					<image :src="aimage[2]" v-if="showc" mode="widthFix" @click="previewifb(2)"  class="imgwidth"></image>
				</view>
			</view>
		</view>
		<view class="fabu-two" style="border:none">
			<view class="fabu-two-title" style="width:50%"><text>任务步骤</text></view>
		</view>
		<view class="fabu-three" >
			<view style="width:94%;margin:30rpx auto" v-for="(item,index) in description" :key="index">
				<view><text style="font-size:36rpx;font-weight: bold;">【第{{index+1}}步】</text></view>
				<view><text>{{item}}</text></view>
				<view>
					<image :src="image[index]" style="width:600rpx;margin:20rpx"  mode="widthFix"  @click="previewi(index)"></image>
				</view>
			</view>
			<view style="width:94%;margin:30rpx auto" v-for="(item,index) in oimage" :key="index">
				<view>
						<image :src="item" style="width:600rpx;margin:20rpx"  mode="widthFix" @click="previewo(index)"></image>
				</view>
			</view>
			<view class="radioScreenshot"  v-if="item.tstatus==1">
				<radio-group @change="radioChange" class="radioGroup">
					<label>
						<text>审核通过</text>
						<view class="radio1">
							<radio value="1" />
						</view>
					</label>
					<label>
						<text>审核未通过</text>
						<view class="radio2">
							<radio value="2" />
						</view>
					</label>
				</radio-group>
			</view>
		</view>



		<view class="footer">
			<view style="color:#ffffff;font-size:36rpx" v-if="item.tstatus==2">任务已通过</view>
			<view @click="commit()" style="color:#ffffff;font-size:36rpx" v-if="item.tstatus==1">确认提交</view>
			<view style="color:#ffffff;font-size:36rpx" v-if="item.tstatus==-1">任务已失败</view>
			<view style="color:#ffffff;font-size:36rpx" v-if="item.tstatus==-2">任务已放弃</view>
		</view>
	</view>

</template>

<script>
	import * as localConfig from '@/config/local/config';
	import {
		mapState
	} from 'vuex'
	import uniIcon from "@/components/uni-icon.vue";
	import universal from '@/common/mixins/universal.js';
	import isLogin from '@/common/mixins/isLogin.js'
	import {
		pathToBase64,
		base64ToPath
	} from '@/common/image-tools/index.js'
	const webUrl = localConfig.websiteUrl
	export default {
		data() {
			return {
				current: '0',
				id: 0,
				choose: 0,
				item: [],
				description: [],
				image: [],
				oimage: [],
				showa: false,
				showb: false,
				showc: false,
				aimage: ['../../static/hxsimg/errorImage.jpg'],
				ImageList: [{
						img: '../../../static/2.jpg',
					},
					{
						img: '../../../static/1.jpg',
					},
					{
						img: '../../../static/3.jpg',
					}
				]
			}
		},
		methods: {
			
			onNavigationBarButtonTap(e) {
					uni.redirectTo({
						url:"/pagesC/zrwrwfb/taskmanagement/taskmanagement"
					});
				},
			previewifb(index){
			    uni.previewImage({urls: [this.aimage[index]]});
			},
			
			previewi(index){
			    uni.previewImage({urls: [this.image[index]]});
			},
			previewo(index){
			    uni.previewImage({urls: [this.oimage[index]]});
			},
			
			radioChange: function(e) {
				this.choose = e.target.value
			},
			radio(e) {
				this.current = e
				this.choose == e
			},
			gethead(ico) {
				if (ico == '') {
					return '../../../static/hxsimg/headerimg.png'
				} else {
					return ico
				}
			},
			chooseImage: function(val) {
				uni.chooseImage({
					count: 3,
					sizeType: ['original', 'compressed'],
					sourceType: ['album', 'camera'],
					success: (res) => {
						this.showa = true
						let len = res.tempFilePaths.length
						if (len > 0) {
							this.aimage = []
						}
						for (let i = 0; i < len; i++) {
							if (i == 1) {
								this.showb = true
							} else if (i == 2) {
								this.showc = true
							}
							pathToBase64(res.tempFilePaths[i]).then(base64 => {
								this.$store.dispatch('setMaterial', {
									file: {
										content: base64
									},
									type: val
								}).then(data => {
									if (data.status == 'success') {
										this.aimage.push(data.data[0])
									}
								})
							}).catch(error => {
								console.error(error, 5);
							});
						}
					}
				})
			},
			applydetail: function() {
				uni.request({
					url: webUrl + '/api/v4/task/applydetail',
					data: {
						id: this.id
					},
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token')
					},
					success: (res) => {
						if (res.data.status == 'success') {
							this.item = res.data.data
							let len = this.item.description.length
							let ll = 0
							for (let i = 0; i < len; i++) {
								if (this.item.description[i] != '') {
									this.description.push(this.item.description[i])
									this.image.push(this.item.step_info[i])
									ll = ll + 1;
								}
							}
							let olen = this.item.step_info.length
							for (let i = ll; i < olen; i++) {
								if (this.item.step_info[i] != '') {
									this.oimage.push(this.item.step_info[i])
								}
							}
							this.aimage = this.item.file
							len = this.item.file.length
							if (len > 0) {
								this.showa = true
							}
							if (len > 1) {
								this.showb = true
							}
							if (len > 2) {
								this.showc = true
							}
						} else {
							uni.showToast({
								title: res.data.errors.message,
								icon: "none"
							});
						}
					},
					error: (res) => {
						console.log(JSON.stringify(res))
					}
				});
			},
			copy: function(link) {
				uni.setClipboardData({
					data: link,
					success: function() {
						uni.showToast({
							title: '复制链接成功'
						});
					}
				});
			},
			outlink: function(link, type) {
				if (type == 5) {
					if (link.substr(0, 7).toLowerCase() == "http://" || link.substr(0, 8).toLowerCase() == "https://") {
						link = link;
					} else {
						link = "http://" + link;
					}
				} else if (type == 1) {
					link = "snssdk1128://app?url=" + link;
				} else if (type == 2) {
					link = "kwai://app?url=" + link;
				} else if (type == 3) {
					link = "weishiiosscheme://app?url=" + link;
				} else if (type == 4) {
					link = "taobao://" + link;
				} else if (type == 6) {
					uni.navigateTo({
						url: link
					})
					return false
				}
				plus.runtime.openURL(link);
			},
			geturl: function(ico) {
				return ico
			},
			commit: function() {
				if (this.choose == 0) {
					uni.showToast({
						title: '请选择审核是否通过',
						icon: 'none'
					})
					return false;
				}
				let myurl
				let o
				if (this.choose == 1) {
					myurl = webUrl + '/api/v4/task/pass'
					o = {
						id: this.id
					}
				} else {
					myurl = webUrl + '/api/v4/task/fail'
					o = {
						id: this.id
					}
				}
				uni.request({
					url: myurl,
					data: o,
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token')
					},
					success: (res) => {
						if (res.data.status == 'success') {
							uni.showToast({
								title: '确认提交成功',
								duration: 2000,
								success() {
									uni.navigateTo({
										url: '/pagesC/zrwrwfb/taskmanagement/taskmanagement'
									})
								}
							});
						} else {
							uni.showToast({
								title: res.data.errors.message,
								icon: "none"
							});
						}
					},
					error: (res) => {
						console.log(JSON.stringify(res))
					}
				});
			},
			gotozrwvip() {
				uni.showToast({
					title: '领取成功',
					duration: 2000
				});
				uni.navigateTo({
					//url:'/pages/zrwvip/zrwvip'						
					url: '/pagesC/zrwword/zrwword'
				})
			},
			gotozrwrenwu() {
				uni.navigateTo({
					url: '/pagesC/zrwrenwu/zrwrenwu'
				})
			},
			gotozrwshop() {
				uni.reLaunch({
					url: '/pagesC/zrwflow/zrwflowlist'
				})
			}
		},
		onLoad(e) {
			if (e.id != undefined) {
				this.id = e.id
				this.applydetail()
			}
		}
	}
</script>

<style lang="scss">
	.fy {
		display: block
	}

	.inp-100 {
		line-height: 70upx;
		color: #000000;
		font-size: 24rpx;
		min-width: 70rpx;
	}

	.list-inp {
		width: 70%;
		line-height: 70rpx;
		text-align: center;
		color: #000000;
		font-size: 24rpx;
		text-align: left;
	}

	.list-name {
		width: 20%;
		margin-left: 1rpx;
		text-align: left;
		color: #000000;
		font-size: 24rpx;
		flex-shrink: 0;
		display: flex;
		align-items: center;
	}

	page,
	body {
		background: #000000
	}

	.imgwidth {
		max-width: 150rpx;
	}

	.list-ul {
		width: 710rpx;
		height: auto;
		display: -webkit-flex;
		/* Safari */
		-webkit-justify-content: space-around;
		/* Safari 6.1+ */
		display: flex;
		justify-content: flex-start;
		padding: 5rpx 20rpx;
		margin: 0 auto;
		background-color: #ffffff;
		border-bottom: 1rpx solid #f5f5f5;

	}

	.gourl,
	.videourl {
		width: 40%;
		height: 50rpx;
		margin: 20rpx 5%;
		background-color: #F0AD4E;
		font-size: 24rpx;
		border-radius: 10rpx;
		line-height: 50rpx;
		text-align: center;
		color: #ffffff
	}

	.gourl {
		background-color: #f08a76
	}

	.fabu-top {
		width: 94%;
		background: #000000;
		margin: 20rpx auto;
		padding-bottom: 100rpx
	}

	.fabu-title {
		color: #ffffff;
		line-heighe: 30rpx;
		margin-left: 20rpx;
		font-size: 36rpx;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		margin-bottom:30rpx;
	}

	.fabu-nav {
		width: 710rpx;
		line-height: 30rpx;
		display: flex;
		flex-direction: row;
		justify-content:space-between;
		color: #8c5e1e;
		flex-wrap: wrap;
	}

	.fabu-team {
		font-size: 24rpx;
		width: 27%;
		margin: 10rpx 1%;
		border-radius: 50rpx;
		border: 1rpx solid #8c5e1e;
		text-align: center;
		padding:0 10rpx;
	}

	.fabu-imgteam {
		font-size: 28rpx;
		margin: 20rpx 20rpx;
		text-align: left;
	    background-size:40rpx;
		background-repeat:no-repeat;
		background-position-x:0;
		background-position-y: 50%;	 
		 padding-left:50rpx;
	}
    .ren-suma{
		  background-image:url(../../../static/hxsimg/ok.png);
	  }
	  .ren-sumb{
	 	   background-image:url(../../../static/hxsimg/headerimg.png);
	   }
	    .ren-sumc{
	    	   background-image:url(../../../static/hxsimg/id.png);
	      }
	.fabu-header {
		margin-top: -100rpx;
		display: flex;
		flex-direction: row;
		justify-content: center;
		overflow: hidden;
		width: 100%;
		border-top-left-radius: 40rpx;
		border-top-right-radius: 40rpx;
		height: 180rpx;
		background: #ffffff
	}

	.fabu-header-left {
		width: 140rpx;
		height: 140rpx;
		margin: 20rpx;
		background: #FF495E;
		border-radius: 90rpx;
		overflow: hidden;
	}

	.fabu-header-mid {
		width: 320rpx;
		height: 180rpx;
	}

	.fabu-header-right {
		color: #c77f2b;
		width: 220rpx;
		height: 180rpx;
		text-align: center;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 36rpx;
	}

	.fabu-one {
		width: 100%;
		height: 20rpx;
		background: #f3f3f3
	}

	.fabu-name {
		font-size: 20rpx;
		width: 100%;
		text-align: left;
		height: 50%;
		flex-wrap: wrap-reverse;
		display: flex;
	}

	.fabu-userinfo {
		width: 100%;
		line-height: 30rpx;
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		color: #ffaa00;
	}

	.fabu-more {
		font-size: 20rpx;
		width: 50%;
		margin: 10rpx 2%;
		border-radius: 20rpx;
		border: 1rpx solid #ffaa00;
		text-align: center;
	}

	.fabu-two {
		width: 94%;
		background: #ffffff;
		padding: 10rpx 3%;
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		border-bottom: 1rpx solid #d9d9d9
	}

	.fabu-two-title {
		line-height: 80rpx;
		font-size: 36rpx;
		font-weight: bold
	}

	.fabu-two-link {
		height: 50rpx;
		width: 20%;
		border: 1px solid #000701;
		padding: 0 20rpx;
		border-radius: 40rpx;
		margin: 15rpx;
		text-align: center
	}

	.fabu-three {
		width: 100%;
		min-height: 1000rpx;
		background: #ffffff;
		padding-top: 30rpx;
		padding-bottom: 120rpx
	}

	.footer {
		height: 100upx;
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		background-color: #000000;
		color: #6e6d6b;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		border-top: 2upx solid #e2e2e2;
		z-index: 99999;
		padding-bottom: env(safe-area-inset-bottom);
	}

	.taskText {
		margin-left: 20rpx;
		font-size: 36rpx;
		font-weight: bold
	}

	.screenshot {
		display: flex;
		justify-content: center;

		.screenshot-box {

			.ImageScreenshot {
				margin-top: 30rpx;
				 
			}
		}
	}

	.radioGroup {
		display: flex;
		justify-content: space-around;
		.radio1 {
			margin-top:20rpx;
			margin-left:30rpx;
		}

		.radio2 {
			margin-top:20rpx;
			margin-left:30rpx;
		}
	}
</style>
