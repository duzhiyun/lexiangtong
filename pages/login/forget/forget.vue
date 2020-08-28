<template>
	<view class="container-bwg">
		<view class="user-lr-form">
			<view class="title">忘记密码</view>
			<form @submit="formSubmit">
				<view class="item-inputs">
					<view class="item-input">
						<label><text class="iconfont icon-picture"></text></label>
						<input type="text" name="imgverifyValue" v-model="imgverifyValue" placeholder="请输入图形验证码" />
						<view class="code-box" @click="clickCaptcha"><image :src="captcha" class="img"></image></view>
					</view>
					<view class="item-input">
						<label><text class="iconfont icon-mobiles"></text></label>
						<input type="text" name="mobile" v-model="mobile" placeholder="请输入手机号" />
						<view class="key">
							<text @click="sendVerifyCode" v-if="button_type">获取验证码</text>
							<text v-else>{{ button_text }}</text>
						</view>
					</view>
					<view class="item-input">
						<label><text class="iconfont icon-key"></text></label>
						<input type="text" name="sms" v-model="sms" maxlength="6" placeholder="请输入收到的短信验证码" />
					</view>
				</view>
				<view class="btn-bar btn-bar-radius">
					<button class="btn" :class="[disabled ? 'btn-disabled' : 'btn-red']" formType="submit" :disabled="disabled">下一步</button>
				</view>
			</form>
		</view>
	</view>
</template>

<script>
	import { mapState } from 'vuex'
	import uniIcon from '@/components/uni-icon.vue';
	var graceChecker = require("@/common/graceChecker.js");
	export default {
		data() {
			return {
				mobile:'',
				imgverifyValue:'',
				sms:'',
				button_text:'重新发送(60s)',
				button_type:true,
				disabled:true
			};
		},
		components:{
			uniIcon
		},
		computed:{
			...mapState({
				captcha: state => state.common.imgVerify.captcha,
				client: state => state.common.imgVerify.client,
			}),
			token:{
				get(){
					return this.$store.state.user.token
				},
				set(val){
					this.$store.state.user.token = val
				}
			},
		},
		methods:{
			clickCaptcha(){
				this.$store.dispatch('setImgVerify')
			},
			sendVerifyCode() {
			    let o = {
			        captcha: this.imgverifyValue,
			        client: this.client,
			        mobile: this.mobile
			    }
				
				uni.request({
					url: this.websiteUrl + '/api/v4/user/profile/basic',
					method: 'GET',
					data: {
						name:this.mobile
					},
					header: {
						'Content-Type': 'application/json',
						'X-Client-Hash':uni.getStorageSync('client_hash')
					},
					success: (res) => {
						let data = res.data
						if(data.status === 'success'){
							this.disabled = false
							this.$store.dispatch('setSendVerify', o).then(res => {
								if (res == 'success') {
									this.button_type = false
									let second = 60
									const timer = setInterval(() => {
										second--
										if (second) {
											this.button_text = '重新发送(' + second + 's)'
										} else {
											this.button_type = true
											clearInterval(timer);
										}
									}, 1000)
								}
							})
						}else{
							this.disabled = true
							uni.showToast({
								title:'此会员不存在',
								icon:'none'
							})
						}
					},
					fail: (res) => {
						console.log(JSON.stringify(res))
					}
				})
			},
			formSubmit(e){
				var rule = [
					{name:"imgverifyValue", checkType : "notnull", checkRule:"",  errorMsg:"图形验证码不能为空"},					
					{name:"mobile", checkType : "notnull", checkRule:"",  errorMsg:"手机号码不正确"},
					{name:"sms", checkType : "notnull", checkRule:"",  errorMsg:"短信验证码不能为空"},
				];
				
				//进行表单检查
				var formData = e.detail.value;
				var checkRes = graceChecker.check(formData, rule);
				if(checkRes){
					uni.navigateTo({
						url:'../reset/reset?mobile='+this.mobile+'&client='+this.client+'&code='+this.sms
					})
				}else{
					uni.showToast({ title: graceChecker.error, icon: "none" });
				}
			}
		},
		onLoad(){
			this.clickCaptcha();
		}
	}
</script>

<style>
.user-lr-form .item-input label{ width: auto; height: 1.4rem; line-height: 1.4rem; }
.tips{ font-size: 25upx; color: #888888; margin-top: 10upx;}
</style>
