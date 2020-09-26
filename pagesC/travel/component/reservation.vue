<template>
	<view class="content">
		<view class="fillInfo">
			<view class="info">
				<view class="infos">
					<image class="requiredImage" src="../../../static/bixutian-copy-copy.png" mode=""></image>
					<view class="infoName">提报姓名</view>
				</view>
				<input type="text" v-model="name" class="infoInput" placeholder="请输入您的姓名"></input>
			</view>
			<view class="info">
				<view class="infos">
					<image class="requiredImage" src="../../../static/bixutian-copy-copy.png" mode=""></image>
					<view class="infoName">手机号码</view>
				</view>
				<input type="text" class="infoInput" v-model="mobile" placeholder="请输入您的手机号码"></input>
			</view>
			<view class="info">
				<view class="infos">
					<view class="infoName" style="margin-left: 40rpx;">身份证号</view>
				</view>
				<input type="text" class="infoInput" v-model="idcard" placeholder="请输入您的身份证号"></input>
			</view>
			<view class="info">
				<view class="infos">
					<image class="requiredImage" src="../../../static/bixutian-copy-copy.png" mode=""></image>
					<view class="infoName">支付方式</view>
				</view>
				<view class="payment">
					<view class="zfbText">乐劵</view>
				</view>
			</view>
		</view>
		<view style="margin-top: 20rpx;padding: 15rpx;">
			<u-checkbox-group @change="checkboxGroupChange">
				<u-checkbox @change="checkboxChange" v-model="checked">我已阅读<text style="color:red" @click="readText">《出行须知》</text>并同意</u-checkbox>
			</u-checkbox-group>
		</view>

		<view class="bottom">
			<view>
				应付乐券：<text style="color:rgb(213, 110, 29);font-weight: 700;">￥{{price}}</text>
			</view>
			<view class="bottomImmediately" @click="apply">
				立即预订
			</view>
		</view>
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
				this.city = e.city
				this.date = e.date
				this.travedetail(e.id)
			}
		},
		data() {
			return {
				checked: false,
				name: "",
				mobile: "",
				idcard: "",
				id:0,
				price:0,
				city:'',
				date:'',
				agree:false
			}
		},
		methods: {
			apply:function(){
				if (this.name == '') {
					uni.showToast({
						title: '请输入您的姓名',
						icon: 'none'
					})
					return false;
				}
				if (this.mobile == '') {
					uni.showToast({
						title: '请输入您的手机号码',
						icon: 'none'
					})
					return false;
				}
				if(this.check_id(this.idcard) == false){
					uni.showToast({
						title:'身份证格式不正确',
						icon:'none',
						duration:2000
					})
					return false;
				}
				if(this.agree == false){
					uni.showToast({
						title:'请先阅读并同意出行须知',
						icon:'none',
						duration:2000
					})
					return false;
				}
				let o = {
					id:this.id,
					name:this.name,
					mobile:this.mobile,
					idcard:this.idcard,
					city:this.city,
					date:this.date
				}
				uni.request({
					url:webUrl + '/api/v4/travel/apply',
					method:'GET',
					data:o,
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token')
					},
					success: (res) => {
						if(res.data.status == 'success'){
							uni.showToast({
								title:res.data.data,
								duration:2000,
								success(){
									setTimeout(function (){
										uni.navigateBack({
											delta: 2
										});
									},1000)
								}
							})
						}else{
							uni.showToast({
								title:res.data.errors.message,
								icon:'none',
								duration:2000
							})
						}
					},
					fail:(res) => {
						console.log(res)
					}
				})
			},
			check_id(value){
			  var arrExp = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];//加权因子 
			  var arrValid = [1, 0, "X", 9, 8, 7, 6, 5, 4, 3, 2];//校验码 
			  if(/^\d{17}\d|x$/i.test(value)){  
				var sum = 0, idx; 
				for(var i = 0; i < value.length - 1; i++){ 
				  // 对前17位数字与权值乘积求和 
				  sum += parseInt(value.substr(i, 1), 10) * arrExp[i]; 
				} 
				// 计算模（固定算法） 
				idx = sum % 11; 
				// 检验第18为是否与校验码相等 
				return arrValid[idx] == value.substr(17, 1).toUpperCase(); 
			  }else{ 
				return false; 
			  } 
			},
			travedetail:function(id){
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
							this.price = res.data.data.price
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
			// 选中某个复选框时，由checkbox时触发
			checkboxChange(e) {
				this.agree = e.value
			},
			// 选中任一checkbox时，由checkbox-group触发
			checkboxGroupChange(e) {
				// console.log(e);
			},
			readText() {
				uni.navigateTo({
					url: "read"
				})
			}
		}
	}
</script>

<style lang="scss">
	.content {}

	.apply {
		padding: 15rpx;
		display: flex;
		justify-content: center;
		height: 120rpx;
		flex-direction: column;

		.applyTop {
			margin-left: 30rpx;
			display: flex;
			align-items: center;

			.applyMoney {
				margin-left: 25rpx;
			}
		}
	}

	.fillInfo {
		margin-top: 20rpx;
		width: 100%;
		height: 800rpx;
		border-radius: 15rpx;
		background-color: rgb(234, 234, 234);

		.info {
			height: 145rpx;
			padding: 25rpx;

			.infos {

				display: flex;

				.requiredImage {
					width: 45rpx;
					height: 45rpx;
				}

				.infoName {
					font-size: 30rpx;
					font-weight: 700;
				}
			}

			.infoInput {
				margin-top: 20rpx;
				border: 1px solid rgb(168, 168, 168);
				height: 60rpx;
				padding: 10rpx;
				border-radius: 10rpx;
			}

			.payment {
				display: flex;
				width: 200rpx;
				align-items: center;
				justify-content: center;
				height: 90rpx;
				background-color: rgb(255, 99, 7);
				border-radius: 10rpx;
				margin-top: 20rpx;

				.paymentImage {
					margin: 0 20rpx;
					width: 60rpx;
					height: 60rpx;
				}

				.zfbText {
					color: rgb(255, 216, 169);
					font-weight: 700;
					font-size: 35rpx;
				}
			}
		}
	}

	.bottom {
		display: flex;
		position: fixed;
		bottom: 0rpx;
		width: 95%;
		height: 80rpx;
		padding: 20rpx;
		background-color: rgb(234, 234, 234);
		align-items: center;

		.bottomImmediately {
			position: absolute;
			right: 0;
			height: 120rpx;
			line-height: 120rpx;
			text-align: center;
			font-size: 35rpx;
			width: 220rpx;
			color: rgb(200, 201, 204);
			background-color: red;
		}
	}
</style>
