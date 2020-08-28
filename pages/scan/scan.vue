<template>
	<view class="scan-view container-bwg">
		<view class="scan-img"><image src="../../static/scan.jpg" class="img" /></view>
		<view class="scan-content">
			<view class="title">扫码成功</view>
			<view class="subtitle">
				<view>{{wgtinfo.name}}登录确认</view>
				<view>为保障您的账户安全，请确认是您本人操作</view>
			</view>
			<view class="btn">
				<button type="warn" @click="subimtBtn">确认登录</button>
				<button type="default" @click="cancelBtn">取消登录</button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				sid:'',
				timestamp:'',
				wgtinfo:{}
			};
		},
		onLoad(e){
			this.wgtinfo = JSON.parse(uni.getStorageSync('wgtinfo'))
			this.sid = e.sid;
		},
		methods:{
			subimtBtn(){
				var timestamp = Date.parse(new Date()) / 1000;
				uni.request({
					url:this.websiteUrl + '/api/v4/appqrcode/appuser',
					method: 'POST',
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token'),
						'X-Client-Hash':uni.getStorageSync('client_hash')
					},
					data:{
						sid:this.sid,
						type:'app_login',
						token:uni.getStorageSync('token'),
						login_time:timestamp
					},
					success: (res) => {
						uni.showToast({
							title:res.data.data.message,
							icon:'none'
						});
						
						if(res.data.data.error == 1){
							uni.reLaunch({
								url:'/pages/index/index'
							})
						}else{
							uni.reLaunch({
								url:'/pages/index/index?type=scan'
							})
						}
					},
					fail:(res)=>{
						console.log(res)
					}
				})
			},
			cancelBtn(){
				var timestamp = Date.parse(new Date()) / 1000;
				uni.request({
					url:this.websiteUrl + '/api/v4/appqrcode/cancel',
					method: 'POST',
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token'),
						'X-Client-Hash':uni.getStorageSync('client_hash')
					},
					data:{
						sid:this.sid,
						login_time:timestamp
					},
					success: (res) => {
						uni.showToast({
							title:res.data.message,
							icon:'none'
						});
						if(res.data.error == 1){
							uni.reLaunch({
								url:'/pages/index/index?type=scan'
							})
						}
					},
					fail:(res)=>{
						console.log(res)
					}
				})
			}
		}
	}
</script>

<style>
.scan-img{ width: 750upx; height: 450upx;}
.scan-content{ text-align: center; }
.scan-content .title{ font-size: 35upx; color: #000000; margin-top: 50upx;}
.scan-content .subtitle{ color: #999999; margin-top: 20upx;}
.scan-content .subtitle view{ line-height: 1.5;}
.scan-content .btn{ margin: 0 100upx; padding-top: 20upx;}
.scan-content .btn button{ margin-top: 30upx; font-size:16px;}
.scan-content .btn button[type=default]{ background: #FFFFFF; color: #999999;}
</style>
