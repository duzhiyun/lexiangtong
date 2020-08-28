<template>
	<view class="container-bwg">
		<view class="user-lr-form">
			<view class="title">短信验证码登录</view>
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
					<button class="btn btn-red" formType="submit">立即登录</button>
				</view>
				<view class="tips">若您输入的手机号未注册，将会进入注册流程。注册即视为同意用户隐私政策</view>
				<navigator url="/pages/login/login" class="list-new" hover-class="none">账号密码登录<uni-icon color="#f92028" type="arrowright" size='20'></uni-icon></navigator>
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
				register_article_id:6,
				articleShow:false,
				articleDetail:'',
				parent_id:uni.getStorageSync('parent_id')
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
			},
			shopConfig(){
				uni.request({
					url:this.websiteUrl + '/api/v4/shop/config',
					method:'GET',
					data:{},
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token'),
						'X-Client-Hash':uni.getStorageSync('client_hash')
					},
					success: ({data:{data}}) => {
						if(data.register_article_id){
							this.register_article_id = data.register_article_id
						}
					}
				});
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
					let device_id = plus.device.uuid
					device_id = device_id.replace(",","0")
					this.$store.dispatch('userRegister',{
						client:this.client,
						mobile:this.mobile,
						code:this.sms,
						parent_id:this.parent_id,
						allow_login:1,
						device_id:device_id
					}).then(res=>{
						if(res.status == 'success'){
							uni.showToast({
								title:'登录成功',
								success: (data) => {
									this.token = res.data;
									uni.setStorage({
										key:'token',
										data:res.data,
										success: (res) => {
											uni.reLaunch({ 
												url:'/pages/user/user'
											});
										}
									});
								}
							});
						}else{
							uni.showToast({
								title:res.errors.message,
								icon:'none'
							})
						}
					})
				}else{
					uni.showToast({ title: graceChecker.error, icon: "none" });
				}
			}
		},
		onLoad(){
			this.clickCaptcha();
			this.shopConfig();
		}
	}
</script>

<style>
.user-lr-form .item-input label{ width: auto; height: 1.4rem; line-height: 1.4rem; }
.tips{ font-size: 25upx; color: #888888; margin-top: 10upx;}
</style>
