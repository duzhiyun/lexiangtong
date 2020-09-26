<template>
	<view class="content">
		<view class="content">
			<view class="moreTrave" v-for="(item, index) in list" :key="index" @click="toParticulars(item.id)">
				<image class="moreImage" :src="item.image"></image>
				<view class="moretraveText">
					{{item.title}}
				</view>
				<view class="moreTrave3">
					<view>
						{{item.exchange_num}}人已兑换
					</view>
					<view>
						{{item.buy_num}}人购买
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import isLogin from '@/common/mixins/isLogin'
	import * as localConfig from '@/config/local/config'
	const webUrl = localConfig.websiteUrl
	export default {
		onLoad(){
			this.page = 1
			this.travellist()
		},
		onReachBottom(){
			if(this.page != 1){
				this.travellist()
			}
		},
		data() {
			return {
				list: [],
				page:1,
				size:10,
				type:1
			}
		},
		methods: {
			travellist(){
				uni.request({
					method:'GET',
					url: webUrl + '/api/v4/travel/info', 
					data: {page:this.page,size:this.size,type:this.type},
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token')
					},
					success: (res) => {
						if(res.data.status == 'success'){
							let len = res.data.data.length;
							for(let i=0;i<len;i++){
								this.list.push(res.data.data[i])
							}
							this.page = this.page + 1;
						}else{
							uni.showToast({ title: res.data.errors.messag, icon: "none" });
						}
					},error:(res)=>{
						console.log(JSON.stringify(res))
					}
				});	
			},
			toParticulars(id) {
				uni.navigateTo({
					url: "../component/particulars?id="+id
				})
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: rgb(241, 241, 241);
	}

	.content {
		padding: 10rpx;
	}

	.moreTrave {
		display: inline-block;
		width: 325rpx;
		background-color: rgb(255, 255, 255);
		padding: 15rpx;
		margin-bottom: 20rpx;

		.moreImage {
			margin: 10rpx 0 0 15rpx;
			width: 300rpx;
			height: 200rpx;
		}

		.moretraveText {
			height: 50rpx;
			font-size: 32rpx;
		}

		.moreTrave3 {
			display: flex;
			font-size: 20rpx;
			justify-content: space-between;
			margin-top: 50rpx;
		}
	}
</style>
