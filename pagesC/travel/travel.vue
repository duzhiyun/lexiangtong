<template>
	<view class="content">
		<view class="swipers">
			<swiper class="swiper" :indicator-dots="indicatorDots" indicator-active-color="rgb(245, 245, 0)" indicator-color="white"
			 :autoplay="autoplay" :interval="interval" :duration="duration">
				<swiper-item class="swiperItem" v-for="(item, index) in photoList" :key="index">
					<image class="swiperImage" :src="item.image"></image>
				</swiper-item>
			</swiper>
		</view>
		<view class="exitText">
			<view class="exitText2">
				出境游专线
				<text class="exitText3">给你想要的旅行</text>
			</view>
			<view class="exitMore" @click="traveexMore">
				查看更多>
			</view>
		</view>

		<view class="travelList" v-for="(item, index) in list" :key="index" @click="toParticulars(item.id)">
			<image class="traveImage" :src="item.image" mode=""></image>
			<view class="traveText">
				{{item.title}}
			</view>
			<view class="trave2">
				<view>
					{{item.exchange_num}}人已兑换
				</view>
				<view>
					{{item.buy_num}}人购买
				</view>
			</view>
		</view>
		<view class="exitText">
			<view class="exitText2">
				VIP专区
				<text class="exitText3">体验VIP高端路线</text>
			</view>
			<view class="exitMore" @click="vipMore">
				查看更多>
			</view>
		</view>
		<view>
			<scroll-view class="scroll-view_H" scroll-x="true" @scroll="scroll" scroll-left="120">
				<view @click="toParticulars(item.id)" class="travelList2" v-for="(item, index) in navList" :key="index">
					<image class="traveImage2" :src="item.image" mode=""></image>
					<view class="traveText2">
						{{item.title}}
					</view>
					<view class="trave3">
						<view>
							{{item.exchange_num}}人已兑换
						</view>
						<view>
							{{item.buy_num}}人购买
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import isLogin from '@/common/mixins/isLogin'
	import * as localConfig from '@/config/local/config'
	const webUrl = localConfig.websiteUrl
	export default {
		onLoad() {
			this.travellist()
		},
		data() {
			return {
				scrollTop: 0,
				old: {
					scrollTop: 0
				},
				indicatorDots: true,
				autoplay: true,
				interval: 2000,
				duration: 500,
				navList: [{
						image: "../../static/bottom1.png",
						travelName: "臻值迪拜6日游",
						num: "1132",
						buy: '1055'
					},
					{
						image: "../../static/bottom2.png",
						travelName: "美国塞班岛5天享乐游",
						num: "10008",
						buy: '954'
					}
				],
				photoList: [{
						image: '../../static/222.png'
					},
					{
						image: '../../static/333.png'
					},
					{
						image: '../../static/111.png'
					}
				],
				list: [{
						image: "../../static/item1.png",
						text: "尊享新加坡、马兰西亚5日游",
						num: "1165",
						buy: "1193"
					},
					{
						image: "../../static/item2.png",
						text: "奇趣巴厘岛5天4晚游",
						num: "3796",
						buy: "3543"
					},
					{
						image: "../../static/item3.png",
						text: "泰国曼谷十芭提雅轻奢6日游",
						num: "3256",
						buy: "3137"
					},
					{
						image: "../../static/item4.png",
						text: "唯美芽庄天堂湾",
						num: "856",
						buy: "798"
					},
					{
						image: "../../static/item5.png",
						text: "探索缅甸、曼德拉、眉谬五天游",
						num: "1387",
						buy: "1268"
					},
					{
						image: "../../static/item6.png",
						text: "吴哥窑行程",
						num: "1098",
						buy: "1055"
					},
					{
						image: "../../static/item7.png",
						text: "悦动普吉5天4晚游大小pp岛、神仙岛",
						num: "1671",
						buy: "1532"
					},
					{
						image: "../../static/item8.png",
						text: "云南6日游",
						num: "0",
						buy: "0"
					},
				]
			}
		},
		methods: {
			travellist() {
				uni.request({
					method: 'GET',
					url: webUrl + '/api/v4/travel',
					data: {},
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token')
					},
					success: (res) => {
						if (res.data.status == 'success') {
							this.list = res.data.data.outside
							this.navList = res.data.data.vip
						} else {
							uni.showToast({
								title: res.data.errors.messag,
								icon: "none"
							});
						}
					},
					error: (res) => {
						console.log(JSON.stringify(res))
					}
				});
			},
			goTop: function(e) {
				// 解决view层不同步的问题
				this.scrollTop = this.old.scrollTop
				this.$nextTick(function() {
					this.scrollTop = 0
				});
				uni.showToast({
					icon: "none",
					title: "纵向滚动 scrollTop 值已被修改为 0"
				})
			},
			traveexMore() {
				uni.navigateTo({
					url: "component/traveexMore"
				})
			},
			changeAutoplay(e) {
				this.autoplay = !this.autoplay
			},
			intervalChange(e) {
				this.interval = e.target.value
			},
			durationChange(e) {
				this.duration = e.target.value
			},
			toParticulars(id) {
				uni.navigateTo({
					url: "component/particulars?id=" + id
				})
			},
			vipMore() {
				uni.navigateTo({
					url: "component/vipMore"
				})
			}
		}
	}
</script>

<style lang="scss">
	.content {
		padding: 20rpx;
		background-color: rgb(241, 241, 241);
	}

	.swiper {
		.swiperItem {

			.swiperImage {
				border-radius: 20rpx;
				width: 100%;
				height: 355rpx;
			}
		}
	}

	.exitText {
		height: 130rpx;
		align-items: center;
		justify-content: space-between;
		display: flex;

		.exitText2 {
			font-size: 40rpx;
			font-weight: 600;

			.exitText3 {
				font-size: 20rpx;
				margin-left: 30rpx;
				color: rgb(147, 141, 131);
				font-weight: 100;
			}
		}

		.exitMore {
			color: rgb(154, 148, 139);
			font-size: 25rpx;
		}
	}

	.travelList {
		margin-top: 20rpx;
		display: inline-block;
		width: 330rpx;
		border-radius: 10rpx;
		margin: 10rpx;
		margin-left: 15rpx;
		background-color: rgb(255, 255, 255);

		.traveImage {
			width: 330rpx;
			height: 270rpx;
		}

		.traveText {
			font-size: 35rpx;
			padding: 10rpx;
			height: 110rpx;
		}

		.trave2 {
			display: flex;
			padding: 10rpx;
			font-size: 25rpx;
			justify-content: space-between;
			margin-top: 10rpx;
			color: rgb(124, 113, 97);
		}
	}


	.scroll-Y {
		height: 300rpx;
	}

	.scroll-view_H {
		white-space: nowrap;
		width: 100%;
		height: 370rpx;
	}

	.travelList2 {
		margin-top: 20rpx;
		display: inline-block;
		width: 450rpx;
		border-radius: 10rpx;
		margin: 10rpx;
		background-color: rgb(255, 255, 255);

		.traveImage2 {
			width: 450rpx;
			height: 228rpx;
		}

		.traveText2 {
			font-size: 35rpx;
			padding: 10rpx;
			height: 40rpx;
		}

		.trave3 {
			display: flex;
			padding: 10rpx;
			font-size: 25rpx;
			justify-content: space-between;
			margin-top: 10rpx;
			color: rgb(124, 113, 97);
		}
	}
</style>
