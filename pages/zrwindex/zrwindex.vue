<template>
	<view>
		<view class="banner">
			<swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="500" class="g-banner" indicator-color="rgba(255, 255, 255, .9)"
			 indicator-active-color="#0a95db">
				<swiper-item v-for="(item,index) in banner" :key="index" @click="$outerHref(item.ad_link,'app')">
					<view class="swiper-item">
						<image :src="item.ad_code" mode="widthFix"></image>
					</view>
				</swiper-item>
			</swiper>
		</view>
		<swiper class="news"   autoplay="true" circular="true">
			<swiper-item   @click="gotnews(item.id)"  v-for="(item,index) in gonggao"  :key="index">
				<text>{{item.amity_time}} {{item.title}}</text>
			</swiper-item>
		</swiper>

		<view class="navs">
			<view class="team-box" @click="gotozrwrenwu(item.id)" v-for="(item,index) in cate" :key="index">
				<view class="navsimg">
					<image :src="geturl(item.ico)" class="navsimgcss"></image>
				</view>
				<view class="navsspan"><span>{{item.name}} </span></view>
			</view>
		</view>
		<!-- 弹出层 -->
		<view class="itemN">
			<view class="bannertwo" @click="signone()">
				<!-- <image src="../../static/weike/qiandaobanner.png" class="img100"></image> -->
				<view style="text-align:center; line-height:180rpx;font-size:40rpx;width:100%;height:180rpx;border-radius: 15rpx;background:#ec971b;color:#ffffff;">
					每日签到
				</view>
			</view>
			<view class="bannertwo"  @click="signtwo()">
				<!-- <image src="../../static/weike/qiandaobanner.png" class="img100"></image> -->
				<view style="text-align:center; line-height:180rpx;font-size:40rpx;width:100%;height:180rpx;border-radius: 15rpx;background:#ec971b;color:#ffffff;">
					提交任务点
				</view>
			</view> 
		</view>

		<view class="wklist">
			<view class="uli uni-flex liti pt20" @click="gotozrwvip(item.id,item.level)" hover-class="hoverclass" v-for="(item,index) in task"
			 :key="index">

				<view class="uli-left">
					<image :src="item.tushi" class="imgcss" style="width:100rpx;height:100rpx"></image>
				</view>
				<view class="uli-mide">
					<view class="title mb10"><span>{{item.title}}</span></view>
					<view>
						<span class="lei duzyborder"> 编号:{{item.id}}</span>
						<span class="lei duzyborder">{{item.name}}</span>
					</view>
				</view>
				<view class="uli-right duzyborder mt10 duzybradius">
					<view class="ulimoney duzycolor">￥{{item.price}}</view>
					<view class="ulibuy duzybg">剩余 {{item.leftnum}}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import pop from '@/components/pop.vue';
	import * as localConfig from '@/config/local/config';
	import {
		mapState
	} from 'vuex'
	import uniIcon from "@/components/uni-icon.vue";
	import universal from '@/common/mixins/universal.js';
	import isLogin from '@/common/mixins/isLogin.js'
	import uniCountdown from "@/components/uni-countdown.vue";
	import sempNoticeBar from "@/components/semp-notice-bar/semp-notice-bar.vue";
	const webUrl = localConfig.websiteUrl
	export default {
		components: {
			uniCountdown,
			sempNoticeBar,
			pop
		},
		data() {
			return {
				percentNumber: '10',
				updatebtn: true,
				update: false,
				show: true,
				banner: [],
				task: [],
				notice: [],
				cate: [],
				page: 1,
				size: 5,
				get: false,
				level: -1,
				warn: 'success',
				sum: 0,
				bean: 0,
				min: 0,
				max: 0,
				news:[]
			}
		},
		computed: {
			sdateTime() {
				let sTime = 1587463200
				return this.$formatDateTime(sTime - 28800)
			}
		},
		methods: {		
			signone: function() {
				uni.request({
					url: webUrl + '/api/v4/task/sign',
					data: {},
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token')
					},
					success: (res) => {
						if (res.data.status == 'success') {
							uni.showToast({
								title: res.data.data,
							});
						} else {
							uni.showToast({
								title: res.data.errors.message,
								
							});
						}
					},
					error: (res) => {
						console.log(JSON.stringify(res))
					}
				});
			},
			signtwo: function() {
				uni.request({
					url: webUrl + '/api/v4/task/signtwo',
					data: {},
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token')
					},
					success: (res) => {
						if (res.data.status == 'success') {
							uni.showToast({
								title: res.data.data,
							});
						} else {
							uni.showToast({
								title: res.data.errors.message,
								icon: 'none'
							});
						}
					},
					error: (res) => {
						console.log(JSON.stringify(res))
					}
				});
			},
			bannerlist: function() {
				uni.request({
					url: webUrl + '/api/v4/task',
					data: {
						page: this.page,
						size: this.size
					},
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token')
					},
					success: (res) => {
						
						if (res.data.status == 'success') {
							this.cate = res.data.data.cate
							this.banner = res.data.data.banner
							this.task = res.data.data.task
							this.notice = res.data.data.notice.split('，')
							this.level = res.data.data.level
							this.page = this.page + 1
							this.warn = res.data.data.warn
							this.sum = res.data.data.sum
							this.bean = res.data.data.bean
							this.min = res.data.data.interval_min
							this.max = res.data.data.interval_max	
							this.gonggao = res.data.data.gonggao
							if (this.level > 0 && res.data.data.address == 0) {
								// uni.showToast({
								// 	title:'请先填写收货地址',
								// 	icon:'none',
								// 	duration:2000,
								// 	success: (e) => {
								// 		uni.reLaunch({
								// 			url:'/pagesB/address/address',
								// 		})
								// 	}
								// })
							}
							if (this.warn != 'success') {
								uni.showModal({
									content: this.warn,
									success: function(res) {
										if (res.confirm) {
											uni.navigateTo({
												url: '../../pagesA/drp/log/warn'
											})
										}
									}
								})
							}
						} else {
							uni.showToast({
								title: res.data.errors.message,
								duration: 5000,
								icon: 'none'
							});
						}
					}
				});
			},
			morelist: function() {
				uni.request({
					url: webUrl + '/api/v4/task',
					data: {
						page: this.page,
						size: this.size
					},
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token')
					},
					success: (res) => {
						if (res.data.status == 'success') {
							let len = res.data.data.task.length;
							for (let i = 0; i < len; i++) {
								this.task.push(res.data.data.task[i])
							}
							this.page = this.page + 1
						}
					}
				});
			},
			geturl(ico) {
				if (this.CheckUrl(ico)) {
					return ico
				} else {
					return ico
				}
			},
			gotnews(id){
			  uni.navigateTo({
					url: '/pages/article/gonggao/gonggao?id='+ id
			   })
			},
			
			gotozrwvip(id, level) {
				if (this.level == -1) {
					uni.showToast({
						title: '请登录查看更多内容',
						duration: 2000,
						icon: 'none'
					});
					return false
				}
				if (level > this.level) {
					uni.showToast({
						title: '您的等级不足以查看该内容',
						duration: 2000,
						icon: 'none'
					});
					return false
				}
				uni.navigateTo({
					url: '/pagesC/zrwword/zrwdetail/zrwdetail?id=' + id
				})
			},
			gotozrwrenwu(cid) {
				uni.navigateTo({
					url: '/pagesC/zrwrenwu/zrwrenwu?cid=' + cid
				})
			},
			gotozrwrenwuforlevel(level) {
				uni.reLaunch({
					url: '/pagesC/zrwrenwu/zrwrenwu?level=' + level
				})
			},
			gotozrwshop() {
				uni.navigateTo({
					url: '/pagesC/zrwshop/zrwshop'
				})
			},
			CheckUrl(str) {
				var RegUrl = new RegExp();
				RegUrl.compile("^[A-Za-z]+://[A-Za-z0-9-_]+\\.[A-Za-z0-9-_%&\?\/.=]+$");
				if (!RegUrl.test(str)) {
					return false;
				}
				return true;
			}
		},
		onLoad(e) {
			this.page = 1
			uni.showTabBar()			
			this.bannerlist()
		},
		onReachBottom() {
			if (this.page != 1) {
				this.morelist()
			}
		}
	}
</script>

<style lang="scss">
	.popupVersions {
		display: flex;
		flex-direction: column;
		align-items: center;

		.versions {
			padding: 20rpx;
			margin-top: 80rpx;
			font-size: 30rpx;
			font-weight: 700;
			color: #000;
		}

		.versionsBox {
			padding: 20rpx;
		}
	}

	uni-view,
	text {
		font-size: 24rpx;
		color: #919191
	}

	page,
	body {
		background: #000
	}

	.img100 {
		width: 100%;
		height: 100%
	}

	.uni-view {
		font-size: 28rpx
	}

	.banner {
		width: 100%;
		height: 350rpx;
		background-color: #000701
	}

	.bannertwo {
		width: 340rpx;
		margin: 0 auto;
		margin-top: 20rpx
	}

	.news {
		width: 632rpx;
		height: 80rpx;
		margin: 0 auto;
		background-image: url(../../static/weike/messg.png);
		background-size: 5%;
		background-repeat: no-repeat;
		background-position: 10rpx 50%;
		line-height: 80rpx;
		padding-left: 60rpx
	}

	.uni-flex {
		display: flex;
		flex-direction: row;
	}

	.navs {
		width: 96%;
		display: flex;
		background: none;
		border-radius: 20rpx;
		flex-direction: row;
		flex-wrap: wrap;
		align-content: flex-start;
		margin: 10rpx auto;
	}

	.team-box {
		width: 25%;
		height: 170rpx;
	}

	.navsimg {
		width: 100%;
		height: 100rpx;
		overflow: hidden;
		text-align: center;
		padding-top: 20rpx
	}

	.navsimgcss {
		width: 70rpx;
		height: 70rpx;
		margin: 5rpx;
		padding: 10rpx;
		background: #ffffff;
		border-radius: 50rpx;
	}

	.navsspan {
		line-height: 50rpx;
		height: 50rpx;
		text-align: center
	}

	.itemN {
		width: 710rpx;
		border-radius: 15rpx;
		display: flex;
		flex-direction: row;
		margin-left: auto;
		margin-right: auto;
		justify-content: space-between;
		margin-bottom:20rpx;
	}

	.itemaa {
		width: 32%;
		padding: 20rpx 0;
		line-height: 40rpx;
		text-align: center;
		border-radius: 15rpx;
	}

	.tab {
		width: 692rpx;
		height: 134rpx;
		margin: 0 auto 30rpx auto;
		border-radius: 15rpx;
		display: flex;
		flex-direction: row;
	}

	.tableft {
		width: 50%;
		height: 64rpx;
		border-right: 1rpx solid #bababa;
		padding-left: 20%;
		background-image: url(../../static/weike/putong.png);
		background-size: 15%;
		background-repeat: no-repeat;
		background-position: 20% 50%;
		margin: 35rpx 0;
		line-height: 64rpx
	}

	.tabright {
		width: 50%;
		height: 64rpx;
		margin: 35rpx 0;
		padding-left: 20%;
		background-image: url(../../static/weike/zhuangshi.png);
		background-size: 15%;
		background-repeat: no-repeat;
		background-position: 20% 50%
	}



	.wklist {
		width: 712rpx;
		height: auto;
		margin: 0 auto
	}

	.uli {
		width: 100%;
		height: 145rpx;
		border-radius: 15rpx;
		border: 1rpx solid #e1e1e1;
		overflow: hidden;
		margin: 10rpx 0;
		display: flex;
		justify-content: space-between;
	}

	.uli-left {
		width: 120rpx;
		height: 170rpx;
	}

	.grade {
		width: 120rpx;
		height: 50rpx;
		color: #eb9414;
		line-height: 50rpx;
		text-align: center
	}

	.image-view {
		width: 120rpx;
		height: 120rpx
	}

	.imgcss {
		width: 90rpx;
		height: 90rpx;
		margin: 15rpx
	}

	.uli-mide {
		line-height: 50rpx;
		padding: 10rpx 10rpx;
		width: 420rpx;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	.title {
		font-size: 28rpx;
	}

	.lei {
		border-radius: 20rpx;
		padding: 0 15rpx;
		width: auto;
		line-height: 30rpx;
		margin: 0 5rpx
	}

	.sums {
		margin-left: 20rpx;
		min-width: 120rpx;
		padding-left: 10rpx;
		padding-right: 10rpx;
		;
		height: 45rpx;
		border-radius: 15rpx;
		top: 0;
		z-index: 1;
		border: 2rpx solid;
		line-height: 45rpx
	}

	.u-popup {}

	.uli-right {
		width: 140rpx;
		margin-right: 5px;
		text-align: center;
		height: 70rpx;
		margin-top: 30rpx
	}

	.ulimoney {
		width: 100%;
		font-size: 24rpx;
		line-height: 40rpx;
		height: 40rpx;
		font-weight: bold;
	}

	.ulibuy {
		width: 100%;
		height: 30rpx;
		line-height: 30rpx;
		text-align: center;
		background-color: #eb9414;
		color: #ffffff;
	}

	.liti {
		border: 1rpx solid rgba(226, 226, 226, 0.55)
	}

	.btn {
		margin-top: 50rpx;
		margin-left: 60rpx;
	}
</style>
