<template>
	<view>
		<view class="container">
			    <view class="loading-login">
				    <image src="@/static/hxsimg/zhuanimg.png"></image>
			    </view>
			   
				<form @submit="formSubmit">
					<view class="cby">
						
						<view class="loadin-name id-ico">
							<input type="text" name="uid" v-model="uid" placeholder="请输入对方的乐享号" class="inp-100" :focus="true"/>
						</view>
						
						<view class="loadin-name phone-ico">
							<input type="text" name="mobile" v-model="mobile" placeholder="请输对方手机后四位" class="inp-100" :focus="true"/>
						</view>				
												
						<view class="loadin-name piont-ico">
							<input type="text" name="money" v-model="money" placeholder="数量" class="inp-100"/>
						</view>
						
						<view class="loadin-pass paypwd-ico">
							<input type="password" name="password" v-model="password" placeholder="请输入6位支付密码" class="inp-100" @click="focusclick()" />
						</view>
						 <radio-group @change="radioChange" v-model="get_id" class="radioGroup">
						      <label v-for="(item, index) in items" :key="item.name">
						        <radio :value="item.name" :checked="item.checked"/> {{item.value}}
						      </label>
						 </radio-group> 
						<view class="loadin-go">
							<button  class="loading-btn" formType="submit">确认并提交</button>
						</view>
			
					</view>
			    </form>
			
		</view>
	</view>
</template>

<script>
	import { mapState } from 'vuex'
	import uniIcon from '@/components/uni-icon.vue';
	import * as localConfig from '@/config/local/config';
	import store from '@/store';
	const graceChecker = require("@/common/graceChecker.js")
	const webUrl = localConfig.websiteUrl
	
	export default {
		data() {
			return {
				mobile:'',
				uid:'',
				money:'',
				password:'',
				gender:1,
				items: [
				        {name: '2', value: '乐券'},
						{name: '3', value: '乐豆'},
						{name: '4', value: '任务点', checked: 'true'}
				      ]
			};
		},
		computed: {
			...mapState({
				data: state => state.user.userInfo,
				mpChecked: state => state.common.mpChecked
				
			})
		},
		methods:{
			onNavigationBarButtonTap(e) {
					uni.navigateTo({
						url:'/pagesA/drp/log/roll'
					});
					
			},
				
			radioChange (e) {			      
				  let get_id = e.target.value;
				  this.get_id = get_id;
			    },
			formSubmit(e){
				var rule = [
					{name:"mobile", checkType : "notnull", checkRule:"",  errorMsg:"手机号后四位不能为空"},
					{name:"uid", checkType : "notnull", checkRule:"",  errorMsg:"对方乐享号不能为空"},
					{name:"password", checkType : "notnull", checkRule:"",  errorMsg:"支付密码不能为空，请填6位支付密码"}
				];
				
				//进行表单检查
				let formData = e.detail.value;
				let checkRes = graceChecker.check(formData, rule);
				let o = {
							mobile: this.mobile,
							uid: this.uid,
							money: this.money,
							password: this.password,
							type: this.get_id
						}
				if(checkRes){
					if(store.state.checkout){
						return false
					}
					store.commit('toggleCheckout',true)
					uni.request({
						method:'POST',
						url: webUrl + '/api/v4/user/SendGifts', 
						data: o,
						header: {
							'Content-Type': 'application/json',
							'token': uni.getStorageSync('token')
						},
						success: (res) => {
							store.commit('toggleCheckout',false)
							if(res.data.status == 'success'){
								uni.showToast({ 
									title: '操作成功',
									icon: 'success',
									duration: 1000
									})
									setTimeout(() => {
										uni.switchTab({
										url:'/pages/user/user'
										});
									}, 2000);
												
												
							}else{
								uni.showToast({ title: res.data.errors.message, icon: "none" });
							}
						},error:(res)=>{
							store.commit('toggleCheckout',false)
							console.log(JSON.stringify(res))
						}
					});
				}else{
					store.commit('toggleCheckout',false)
					uni.showToast({ title: graceChecker.error, icon: "none" });
				}
			},
			focusclick(){
				uni.pageScrollTo({
				    scrollTop: 300,
				    duration: 300
				});
			}
		},
		onShow(){
			store.commit('toggleCheckout',false)
		},
		onLoad(){
			store.commit('toggleCheckout',false)
		}
	}
</script>

<style lang="scss">
	
body,page{
		background-color:#020202;	
		background-repeat: no-repeat;	
		justify-content:center;
	}
.container{
		background-repeat: no-repeat;
		background-size: 100% 100%;		
		background-color:#030303;
				width:85%;
				margin-left:auto;
				margin-right:auto;
				border-radius: 30rpx;
		text-align:center;
		image{width:100%;
		      height:100%
		};
		
}
.loading-login{width:270rpx;height:150rpx;margin:10rpx auto; margin-top:10rpx;padding-top:2}
.cby{
	width:100%;
	height:auto;
	text-align:center;
}
.loadin-name,.loadin-pass{
	width:90%;
	height:100upx;
	border-bottom:1upx solid #7f7f7f;	
	margin:20upx auto;
    background-repeat: no-repeat;	
	background-size:10%;	
	background-position-x: 1upx;
	background-position-y: 50%;
	padding-left:50upx;
}
.phone-ico{
	background-image:url(@/static/hxsimg/phone-ico.png);
}
.id-ico{
	background-image:url(@/static/hxsimg/id-ico.png);
}
.piont-ico{
	background-image:url(@/static/hxsimg/piont-ico.png);
}

.grade-ico{
	background-image:url(@/static/hxsimg/grade-ico.png);
}
.paypwd-ico{
	background-image:url(@/static/hxsimg/paypwd-ico.png);
}
.loadin-name uni-input{line-height:90upx;color:#b1b1b1}
.loadin-go{
	width:90%;
	height:300upx;
	margin:0 auto;
	margin-top:30upx;
}
.inp-100{height:90upx;line-height:90upx;color:#b1b1b1}
.loading-btn{width:100%; background-color:#cf9d5f;border-radius:30upx;color:#ffffff}
.loadin-mima{
	align-items:center;
	width:100%;
	height:90upx;
	color:#FFFFFF;
	display: flex;
	text-align:center;
	justify-content:space-around;
	margin-top:50upx;
}
.news-user,.no-password{
	flex-shrink: 1;
	line-height:90upx;
}

.radioGroup {
		display: flex;
		justify-content: space-around;
		color:#ffffff;
		margin:60rpx auto;
		.radio1 {
			margin-top:20rpx;
			margin-left:20rpx;
		}

		.radio2 {
			margin-top:20rpx;
			margin-left:20rpx;
		}
	}
</style>