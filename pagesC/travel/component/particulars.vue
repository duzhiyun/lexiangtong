<template>
	<view class="content">
		<view class="swipers">
			<swiper class="swiper" indicator-active-color="rgb(245, 245, 0)" indicator-color="white" :autoplay="autoplay"
			 :interval="interval" :duration="duration">
				<swiper-item class="swiperItem" v-for="(item, index) in photoList" :key="index">
					<image class="swiperImage" :src="item"></image>
				</swiper-item>
			</swiper>
		</view>
		<view class="navTravel">
			<view class="text">
				{{title}}
			</view>
			<view class="navTravel2">
				<view style="margin-right: 30rpx;">{{exchange_num}}人已兑换</view>
				<view>{{buy_num}}人购买</view>
			</view>
		</view>
		<view class="preferentialPrice">
			<view class="Price">
				<view class="Price2">
					金色远方价格:<text class="PriceText">￥{{price}}</text>
				</view>
				<view class="Price2">
					成人市场价:<text class="PriceText">￥{{market_price}}</text><text style="font-size: 23rpx;">起</text>
				</view>
			</view>
			<view class="agePrice">
				<image class="agepriceImage" src="../../../static/gantanhao.png" mode=""></image>
				<view class="age">16岁以下,60岁以上,港澳,新疆,以及境外游客,需要联系客服报名</view>
			</view>
			<view class="discountsReel" @click="discountsRoll">
				<view class="reel">
					<view class="reelText">
						优惠卷
					</view>
					<view>
						暂无优惠卷
					</view>
				</view>
				<image class="gantanhao" src="../../../static/right.png" mode=""></image>
			</view>
		</view>
		<view class="listCity">
			<view class="city">
				<image class="cityImage" src="../../../static/weizhi.png"></image>
			</view>
			<view class="cityLocation" @click="cityPup">
				<view class="location">
					{{defaultCity}}
				</view>
			</view>
			<view class="right">
				<image class="rightImage" src="../../../static/right.png"></image>
			</view>
		</view>
		<view class="listCity">
			<view class="city">
				<image class="cityImage" src="../../../static/riqi.png"></image>
			</view>
			<view class="cityLocation" @click="selectCity">
				<picker v-show="true" mode="date" @change="bindDateChange" :value="date" :start="date" :end="endDate">
					<view class="location">
						出发日期 {{date}}
					</view>
				</picker>
			</view>
			<view class="right">
				<image class="rightImage" src="../../../static/right.png"></image>
			</view>
		</view>
		<view class="journey">
			- 景点介绍 -
		</view>
		<view style="padding: 20rpx;">
			<rich-text :nodes="nodes"></rich-text>
		</view>

		<button class="button" @click="reservation">预定</button>
		<s-popup custom-class="demo-popup" :maskClose="false" position="bottom" v-model="visible">
			<view class="select">
				<view class="select2">
					<view class="selectSite">
						请选择出发地
					</view>
					<image class="selectImage" src="../../../static/del.png" mode="" @click="del"></image>
				</view>
				<view class="cityText">
					<view class="cityList" v-for="(item , index) in city" :key="index">
						<view class="cityName" @click="activeClick(index)" :class="{active:activeIndex === index}">
							{{item.cityName}}
						</view>
					</view>
					<button class="btn" @click="confirm(activeIndex)">确定</button>
				</view>
			</view>
		</s-popup>
	</view>
</template>

<script>
	import sPopup from '@/components/s-popup/index2.vue';
	import isLogin from '@/common/mixins/isLogin'
	import * as localConfig from '@/config/local/config'
	const webUrl = localConfig.websiteUrl
	export default {
		onLoad(e) {
			if (e.id != undefined) {
				this.id = e.id
				this.travedetail(e.id)
			}
			var day3 = new Date();
			day3.setTime(day3.getTime() + 24 * 60 * 60 * 1000);
			var s3 = day3.getFullYear() + "-" + (day3.getMonth() + 1) + "-" + day3.getDate();
			this.date = s3
		},
		components: {
			sPopup
		},
		computed: {
			startDate() {
				return this.getDate('start');
			},
			endDate() {
				return this.getDate('end');
			}
		},
		data() {

			const currentDate = this.getDate({
				format: true
			})
			return {
				defaultCity: '请选择城市',
				pickerDate: false,
				id: 0,
				date: '',
				activeIndex: 0,
				nodes: '',
				title: '',
				buy_num: 0,
				exchange_num: 0,
				price: 0,
				market_price: 0,
				visible: false,
				autoplay: true,
				interval: 5000,
				duration: 500,
				city: [{
					cityName: "广州"
				}, {
					cityName: "深圳"
				}, {
					cityName: "东莞"
				}, {
					cityName: "重庆"
				}, {
					cityName: "成都"
				}, {
					cityName: "西安"
				}, {
					cityName: "昆明"
				}, {
					cityName: "桂林"
				}, {
					cityName: "南宁"
				}, {
					cityName: "长沙"
				}, {
					cityName: "宁波"
				}, {
					cityName: "杭州"
				}, {
					cityName: "南京"
				}, {
					cityName: "福州"
				}, {
					cityName: "南昌"
				}, {
					cityName: "武汉"
				}, {
					cityName: "济南"
				}, {
					cityName: "北京"
				}],
				photoList: []
			}
		},
		methods: {
			bindDateChange: function(e) {
				this.date = e.target.value
				console.log(this.date)
			},
			getDate(type) {
				const date = new Date();
				let year = date.getFullYear();
				let month = date.getMonth() + 1;
				let day = date.getDate();

				if (type === 'start') {
					year = year - 50;
				} else if (type === 'end') {
					year = year + 50;
				}
				month = month > 9 ? month : '0' + month;;
				day = day > 9 ? day : '0' + day;
				return `${year}-${month}-${day}`;
			},
			activeClick(index) {
				this.activeIndex = index

				console.log(this.activeIndex)
			},
			confirm(activeIndex) {
				uni.showToast({
					title: '当前城市为' + this.city[activeIndex].cityName,
					icon: 'none'
				})
				this.defaultCity = this.city[activeIndex].cityName
				this.visible = false
			},
			travedetail(id) {
				uni.request({
					method: 'GET',
					url: webUrl + '/api/v4/travel/detail',
					data: {
						id: id
					},
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token')
					},
					success: (res) => {
						if (res.data.status == 'success') {
							this.title = res.data.data.title
							this.price = res.data.data.price
							this.market_price = res.data.data.market_price
							this.buy_num = res.data.data.buy_num
							this.exchange_num = res.data.data.exchange_num
							this.nodes = res.data.data.description
							this.photoList.push(res.data.data.image)
							this.photoList.push(res.data.data.image)
							this.photoList.push(res.data.data.image)
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
			selectCity() {
				this.pickerDate = true
			},
			reservation() {
				if (this.date == '' || this.defaultCity == '请选择城市') {
					uni.showToast({
						title: "请选择城市或出发日期",
						icon: 'none'
					})
				} else {
					uni.navigateTo({
						url: "reservation?id=" + this.id + "&date=" + this.date + "&city=" + this.defaultCity
					})
					return
				}
			},
			cityPup() {
				this.visible = true
			},
			del() {
				this.visible = false
			},
			discountsRoll() {
				uni.navigateTo({
					url: "discountsRoll"
				})
			}
		}
	}
</script>

<style lang="scss">
	.content {
		background-color: rgb(241, 241, 241);
	}

	.swiper {
		.swiperItem {

			.swiperImage {
				width: 100%;
			}
		}
	}

	.navTravel {
		margin: 20rpx;
		top: -60rpx;
		position: relative;
		height: 150rpx;
		background-color: rgb(255, 255, 255);
		border-radius: 30rpx;
		display: flex;
		flex-direction: column;
		padding: 20rpx;

		.text {
			margin-left: 20rpx;
			height: 100rpx;
			font-weight: 700;
		}

		.navTravel2 {
			font-size: 27rpx;
			display: flex;
			color: rgb(150, 150, 150);
		}
	}

	.preferentialPrice {
		margin: 20rpx;
		height: 250rpx;
		background-color: rgb(255, 255, 255);
		border-radius: 15rpx;

		.Price {
			padding: 20rpx;
			font-size: 25rpx;
			display: flex;
			justify-content: space-between;
			height: 20rpx;

			.Price2 {
				.PriceText {
					font-size: 35rpx;
					color: rgb(246, 109, 108);
					font-weight: 700;
				}
			}
		}
	}

	.agePrice {
		padding: 20rpx;
		display: flex;

		.agepriceImage {
			width: 30rpx;
			height: 30rpx;
		}

		.age {
			font-size: 22rpx;
			color: rgb(142, 142, 142);
		}
	}

	.discountsReel {
		padding: 20rpx;
		margin-top: 40rpx;
		height: 100rpx;
		border-top: 1px solid rgb(218, 218, 218);
		font-size: 30rpx;
		font-weight: 700;
		display: flex;
		justify-content: space-between;

		.reel {
			display: flex;
			width: 400rpx;

			.reelText {
				margin-right: 50rpx;
			}
		}

		.gantanhao {
			width: 32rpx;
			height: 32rpx;
		}
	}

	.listCity {
		height: 150rpx;
		background-color: rgb(255, 255, 255);
		display: flex;
		align-items: center;
		margin-bottom: 20rpx;

		.city {
			display: flex;
			justify-content: center;
			width: 150rpx;

			.cityImage {
				width: 100rpx;
				height: 100rpx;
			}
		}

		.cityLocation {
			flex: 1;

			.location {
				font-weight: 600;
			}

			.cityLocation2 {
				margin-top: 10rpx;
				font-size: 28rpx;
				color: rgb(142, 142, 142);
			}
		}

		.right {
			width: 70rpx;

			.rightImage {
				width: 32rpx;
				height: 32rpx;
			}
		}
	}

	.journey {
		height: 100rpx;
		text-align: center;
		line-height: 100rpx;
		font-size: 28rpx;
		color: rgb(151, 151, 151);
		font-weight: 700;
		border-bottom: 1px solid 241, 241, 241;

	}

	button {
		position: fixed;
		bottom: 25rpx;
		margin-left: 20rpx;
		width: 95%;
		height: 100rpx;
		background-color: rgb(255, 205, 38);
		color: rgb(254, 248, 214);
		border-radius: 30rpx;
	}

	.select {
		.select2 {
			padding: 25rpx;
			height: 70rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			border-bottom: 1px solid rgb(229, 229, 229);

			.selectSite {
				font-size: 35rpx;
			}

			.selectImage {
				width: 35rpx;
				height: 35rpx;
			}
		}
	}

	.cityText {
		height: 380rpx;
		display: flex;
		flex-wrap: wrap;
		margin-top: 30rpx;

		.cityList {
			display: flex;
			justify-content: space-around;
			width: 20%;

			.cityName {
				line-height: 70rpx;
				width: 100rpx;
				height: 70rpx;
				background-color: rgb(237, 237, 235);
				border-radius: 10rpx;
				text-align: center;
				color: rgb(166, 166, 165);
				font-size: 30rpx;
			}
		}
	}

	.scenic {
		padding: 20rpx;
		color: rgb(176, 176, 176);

		.scenicImage {
			width: 100%;
		}
	}


	.active {
		border: 1rpx solid rgb(55, 126, 214);
	}

	/deep/ rich-text img {
		width: 100%
	}
</style>
