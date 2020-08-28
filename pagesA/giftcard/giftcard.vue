<template>
	<view class="giftcard" v-if="show">
		<form @submit="formSubmit">
			<view class="uni-card uni-card-not">
				<view class="header-title">礼品卡</view>
				<view class="uni-list">
					<view class="uni-list-cell uni-list-cell-title uni-list-cell-right">
						<view class="uni-list-cell-navigate">
							<text class="title">礼品卡卡号</text>
							<view class="value"><input placeholder="请输入礼品卡卡号" name="gift_card" v-model="gift_card"></view>
						</view>
					</view>
					<view class="uni-list-cell uni-list-cell-title uni-list-cell-right">
						<view class="uni-list-cell-navigate">
							<text class="title">礼品卡密码</text>
							<view class="value"><input placeholder="请输入礼品卡密码" type="password" name="gift_pwd" v-model="gift_pwd"></view>
						</view>
					</view>
				</view>
			</view>
			<view class="btn-bar btn-bar-fixed">
				<button formType="submit" type="primary" class="btn btn-red">提交</button>
			</view>
		</form>
		<dsc-common-nav></dsc-common-nav>
	</view>
</template>

<script>
	import dscCommonNav from '@/components/dsc-common-nav.vue';
	
	var graceChecker = require("@/common/graceChecker.js");
	
	export default {
		data() {
			return {
				show:false,
				gift_card:'',
				gift_pwd:'',
			}
		},
		components:{
			dscCommonNav
		},
		onReachBottom(){
			if(this.page * this.size == this.cateGoodsList.length){
				this.page ++
				this.getGoodsList()
			}
		},
		methods: {
			checkLoginGift(){
				uni.request({
					url:this.websiteUrl + '/api/v4/gift_gard',
					data:{},
					method:'GET',
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token')
					},
					success: (res) => {
						uni.hideLoading();
						
						let data = res.data;
						if(data.status == 'success'){
							if(data.data.error == 0){
								uni.showToast({
									title:data.data.msg,
									icon:'success'
								});
								
								setTimeout(()=>{
									this.goList();
								},1000)
							}else{
								this.show = true
							}
						}else{
							if(data.errors.code == 12){
								uni.showToast({
									title:'用户未登录',
									icon:'none'
								})
								
								setTimeout(()=>{
									uni.navigateTo({
										url:'/pages/login/login?delta=1'
									})
								},1000)
							}
						}
					}
				})
			},
			formSubmit(e){
				var rule = [
					{name:"gift_card", checkType : "notnull", checkRule:"",  errorMsg:"请输入礼品卡卡号"},					
					{name:"gift_pwd", checkType : "notnull", checkRule:"",  errorMsg:"请输入礼品卡密码"},
				];
				
				//进行表单检查
				var formData = e.detail.value;
				var checkRes = graceChecker.check(formData, rule);
				if(checkRes){
					uni.request({
						url:this.websiteUrl + '/api/v4/gift_gard/check_gift',
						data:{
							gift_card:this.gift_card,
							gift_pwd:this.gift_pwd
						},
						method:'GET',
						header: {
							'Content-Type': 'application/json',
							'token': uni.getStorageSync('token')
						},
						success: (res) => {
							let data = res.data;
							
							if(data.status == "success"){
								uni.showToast({
									title:data.data.msg,
									icon:'none'
								});
								
								if(data.data.error == 0){
									setTimeout(()=>{
										this.goList();
									},1000)
								}
							}else{
								console.log(JSON.stringify(data))
							}
						}
					})
				}else{
					uni.showToast({ title: graceChecker.error, icon: "none" });
				}
			},
			goList(){
				uni.redirectTo({
					url:'/pagesA/giftcard/result/result'
				})
			}
		},
		onLoad(){
			
		},
		onShow() {
			uni.showLoading({
				title:"加载中"
			})
			
			this.checkLoginGift();
		}
	}
</script>

<style>
.header-title{ padding: 20upx 30upx; border-bottom: 1px solid #DDDDDD; font-size: 30upx; }
.uni-list-cell::after{ left: 0;}
</style>
