<template>
	<view>
	    <view class="banners"><image :src="img[1]" class="banner bgind"></image></view>
		<view class="shoplist uni-flex">
			<view  class="box"  v-for="(item,index) in shop" :key="index">
				<view  class="box-s" @click="buy(item.shop_id)"><text>{{item.point}}\n乐享值</text></view>
				<view  class="box-b"> 
				     <view  class="box-b-a">{{item.price}}乐券</view>
					 <view class="box-b-b">
						 <view class="xiaobox" @click="changetcs(item.shop_id)"  :class="[tcsa=='ok'?'okbox':'']" v-if="index==0"></view>
						 <view class="xiaobox" @click="changetcs(item.shop_id)"  :class="[tcsb=='ok'?'okbox':'']" v-if="index==1"></view>
						 <view class="xiaobox" @click="changetcs(item.shop_id)"  :class="[tcsc=='ok'?'okbox':'']" v-if="index==2"></view>
						 <view class="xiaobox" @click="changetcs(item.shop_id)"  :class="[tcsd=='ok'?'okbox':'']" v-if="index==3"></view>
						 <view class="xiaobox" @click="changetcs(item.shop_id)"  :class="[tcse=='ok'?'okbox':'']" v-if="index==4"></view>
						 <view  class="shop-top-title-box"  @click="xieyi()">《增值会员协议》</view>
					 </view>
				</view>
			</view>	
		</view>
	</view>
</template>

<script>
	import * as localConfig from '@/config/local/config';
	import { mapState } from 'vuex'
	import uniIcon from "@/components/uni-icon.vue";
	import universal from '@/common/mixins/universal.js';
	import isLogin from '@/common/mixins/isLogin.js';
	import uniNumberBox from '@/components/uni-number-box.vue';
	import { pathToBase64, base64ToPath } from '@/common/image-tools/index.js'
	const webUrl = localConfig.websiteUrl
	export default {
		data() {
			return {
				bgind:'/static/weike/banner.png',
				token:'',
				show:false,
				tab:'a',
				sudoku:false,
				image:[],
				banner:'',
				tcsa:'',
				tcsb:'',
				tcsc:'',
				tcsd:'',
				tcse:'',
				tcsf:'',
				tcsg:'',
				shop:[],
				num:1
			}
		},
		computed: {
			img(){
				if(this.image.length > 0){
					let arr = []
					for(let i=0;i<this.image.length;i++){
						arr.push(this.image[i]['ad_code'])
					}
					return arr
				}else{
					return []
				}
			}
		},
		components: {
			uniNumberBox
		},
		methods: {
			bindChange(e){
				this.num = e
			},
			shoplist:function(){
				uni.request({
					url: webUrl + '/api/v4/task/shoplist', 
					data: {},
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token')
					},
					success: (res) => {
						if(res.data.status == 'success'){
							this.shop = res.data.data
						}
					}
				});
			},
			buy:function(shop_id){
				if(shop_id == 1){
					if(this.tcsa != 'ok'){
						uni.showToast({
								title: '请先同意增值会员协议',
								duration: 2000,
								icon:'none'
						});
						return false
					}
				}
				else if(shop_id == 2){
					if(this.tcsb != 'ok'){
						uni.showToast({
								title: '请先同意增值会员协议',
								duration: 2000,
								icon:'none'
						});
						return false
					}
				}
				else if(shop_id == 3){
					if(this.tcsc != 'ok'){
						uni.showToast({
								title: '请先同意增值会员协议',
								duration: 2000,
								icon:'none'
						});
						return false
					}
				}
				else if(shop_id == 4){
					if(this.tcsd != 'ok'){
						uni.showToast({
								title: '请先同意增值会员协议',
								duration: 2000,
								icon:'none'
						});
						return false
					}
				}
				else if(shop_id == 5){
					if(this.tcse != 'ok'){
						uni.showToast({
								title: '请先同意增值会员协议',
								duration: 2000,
								icon:'none'
						});
						return false
					}
				}
				else if(shop_id == 1000){
					if(this.tcsf != 'ok'){
						uni.showToast({
								title: '请先阅读并同意增值会员协议',
								duration: 2000,
								icon:'none'
						});
						return false
					}
				}
				else if(shop_id == 80000){
					if(this.tcsg != 'ok'){
						uni.showToast({
								title: '请先阅读并同意增值会员协议',
								duration: 2000,
								icon:'none'
						});
						return false
					}
				}
				let that = this
				uni.showModal({
					content: '确认兑换该套餐？',
					success: function (res) {
						if (res.confirm){
							uni.request({
								url: webUrl + '/api/v4/task/shopbuy',  
								data: {
									shop_id:shop_id,
									num:that.num,
								},
								header: {
									'Content-Type': 'application/json',
									'token': uni.getStorageSync('token')
								},
								success: (res) => {
									if(res.data.status == 'success'){
										uni.showToast({
											title: '购买成功',
											duration: 2000,
											success(){
												uni.reLaunch({
													url:'/pages/user/user'
												})
											}
										});
									}else{
										uni.showToast({
											title: res.data.errors.message,
											icon: "none",
											success(){
												if(res.data.errors.code == 250){
													setTimeout(function (){
														uni.navigateTo({
															url:'/pagesB/account/deposit/recharge'
														})
													},1000)
												}
											}
										});
									}
								},error:(res)=>{
									console.log(JSON.stringify(res))
								}
							});
						}else if (res.cancel) {
							
						}
					}
				})
			},
			bannerlist:function(){
				uni.request({
					url: webUrl + '/api/v4/task', 
					data: {page:1,size:5,type:2},
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token')
					},
					success: (res) => {
						if(res.data.status == 'success'){
							this.image = res.data.data.banner
							this.banner = this.image[1]['ad_code']
							for(let i=0;i<this.image.length;i++){
								this.img.push(this.image[i]['ad_code'])
							}
						}
					}
				});
			},
			changetcs(shop_id){
				if(shop_id == 1){
					if(this.tcsa == 'ok'){
						this.tcsa = ''
					}else{
						this.tcsa = 'ok'
					}
				}
				else if(shop_id == 2){
					if(this.tcsb == 'ok'){
						this.tcsb = ''
					}else{
						this.tcsb = 'ok'
					}
				}
				else if(shop_id == 3){
					if(this.tcsc == 'ok'){
						this.tcsc = ''
					}else{
						this.tcsc = 'ok'
					}
				}
				else if(shop_id == 4){
					if(this.tcsd == 'ok'){
						this.tcsd = ''
					}else{
						this.tcsd = 'ok'
					}
				}
				else if(shop_id == 5){
					if(this.tcse == 'ok'){
						this.tcse = ''
					}else{
						this.tcse = 'ok'
					}
				}
				else if(shop_id == 1000){
					if(this.tcsf == 'ok'){
						this.tcsf = ''
					}else{
						this.tcsf = 'ok'
					}
				}
				else if(shop_id == 80000){
					if(this.tcsg == 'ok'){
						this.tcsg = ''
					}else{
						this.tcsg = 'ok'
					}
				}
			},
			xieyi(){
				this.$outerHref('../../pagesC/xieyi/xieyi',1) 
			}
		},
		onLoad(e){
			this.bannerlist()
			this.shoplist()
		}
	}
</script>

<style>
body {background-color: #000000;	}
page {background-color: #000000;	}
.banners{width:92%;height:350rpx;margin:10rpx auto;border-radius: 30rpx;overflow:hidden;}
.bgind{width:100%;height:100%;background-size:100% 100%; 
       background-repeat: no-repeat;background-color:#000000;background-size:100% 100%;}

.uni-flex{display: flex;flex-direction: row;flex-wrap:wrap; justify-content:center;}
.box{  
	width:330rpx;margin:20rpx 10rpx;height:400rpx;
	background-color: #000000;border-radius: 20rpx;
	border:1rpx solid #7f7e7e;overflow:hidden;	
	                                                                   
	}
.box-s{
	width:100%;height:280rpx;background:#000000;
	/*border-bottom-left-radius: 110rpx;
	border-bottom-right-radius:110rpx;*/
	margin:0 auto; display: flex;
	justify-content:center;align-items:center;
	font-size:40rpx;color:#eb9414;
	text-align:center;
	}
.box-b{
	width:100%;height:120rpx;background:#eb9414;
	margin:0 auto;  
	}
.box-b-a{width:100%;height:60rpx;display: flex;justify-content:center;align-items:center;
         color:#ffffff;
}
.box-b-b{width:100%;height:60rpx; display: flex;   
		flex-direction:row;font-size:20rpx;
		justify-content:center;align-items:center;
		}
.uni-view{font-size:28rpx}
 
.xxbox{display:none}
.xiaobox{width:30rpx;height:30rpx;
         background-color:#ffffff;
		 border:1rpx solid #000000;
		 padding:5rpx;
		 border-radius: 20rpx;
		 justify-content:center;
		 align-items:center;
		}
.okbox{width:20rpx;
       height:20rpx;
       background-color:#ff0000;
	   display:block;
	   border-radius: 20rpx;
	   justify-content:center;align-items:center;

}
.shop-top-title-box{line-height:20rpx;display:flex;}
</style>
