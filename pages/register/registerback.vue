<template>
	<view>
		<view class="container">
			<view class="loading-login">
				<image src="../../static/logo_img.png" style="height: 250rpx;"></image>
			</view>
			
				<form @submit="formSubmit">
				<view class="cby">
			        <view class="loadin-name">
					    <view class="phoneclass">
			        	     <input type="text" name="mobile" v-model="mobile" placeholder="请输入手机号" class="inp-100"/>
					    </view>
			             <view class="key">
			        		<text @click="sendVerifyCode" v-if="button_type">获取验证码</text>
			        		<text v-else>{{ button_text }}</text>
			             </view>
			        </view>
					
					<view class="loadin-name">
					    <view class="phoneclass">						    
					        <input type="text" name="imgverifyValue" v-model="imgverifyValue" placeholder="请输入图形验证码"  class="inp-100"/>
						</view>					    
						<view class="kkey" @click="clickCaptcha">
							<image :src="captcha" class="img w100 h100" ></image>
						</view>
					</view>
					
					
					
					<view class="loadin-name">
						
						<input type="text" name="sms" v-model="sms" maxlength="6" placeholder="请输入收到的短信验证码" class="inp-100"/>
					</view>
					
			        <view class="loadin-name">
						<input type="password" name="pwd" v-model="pwd" placeholder="请输入6-20位登录密码"  class="inp-100"/>
			        </view>
					<view class="loadin-name">
						<input type="text" name="reference " v-model="reference" placeholder="请输入推荐人编号或手机号码" class="inp-100"/>
					</view>
			        <view class="loadin-go">
			        	<button  class="loading-btn" formType="submit">注册</button>
			        </view>
			
			        <!-- <view class="loadin-mima">
			        	<navigator url="../register/register" class="news-user" hover-class="none">直接登陆</navigator>
			            <navigator url="../login/forget/forget" class="no-password" hover-class="none">忘记密码?</navigator>
			        </view> -->
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
				pwd:'',
				reference:'',
				button_text:'重发(60s)',
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
						'token': uni.getStorageSync('token')
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
					{name:"pwd", checkType : "notnull", checkRule:"",  errorMsg:"登录密码不能为空"},
					{name:"pwd", checkType : "length6", checkRule:"",  errorMsg:"登密码不能少于6位"},
				];
				
				//进行表单检查
				var formData = e.detail.value;
				var checkRes = graceChecker.check(formData, rule);
				if(checkRes){
					this.$store.dispatch('userRegister',{
						client:this.client,
						mobile:this.mobile,
						code:this.sms,
						parent_id:this.reference,
						pwd:this.pwd,
						allow_login:0
					}).then(res=>{
						if(res.status == 'success'){
							uni.showToast({
								title:"注册成功",
								success: (data) => {
									this.token = res.data;
									uni.setStorage({
										key:'token',
										data:res.data,
										success: (res) => {
										// #ifdef APP-PLUS
										    uni.reLaunch({
											    url:'/pages/user/user'
										    });
										// #endif
										// #ifdef H5
											let userAgent = navigator.userAgent.toLowerCase()
											if (userAgent.match(/MicroMessenger/i) == 'micromessenger') {
												window.location.href =' https://task.dtionuoaa.vip/app'
											} else {
												uni.reLaunch({
													url:'/pages/user/user'
												});
											}																	
										// #endif
										}
									});
								}
							});
						}else{
							uni.showToast({
								title:' '+res.errors.message,
								icon:'none'
							})
						}
					})
				}else{
					uni.showToast({ title: graceChecker.error, icon: "none" });
				}
			}
		},
		onLoad(get){
			if(get.parent_id != undefined){
				this.reference = get.parent_id;
			}
			this.clickCaptcha();
			this.shopConfig();
		}
	}
</script>


<style lang="scss">
body,page{
		background-repeat: no-repeat;	
		justify-content:center;
		background-color:#FFFFFF;
	}
.container{
	background-color:#FFFFFF;
     	text-align:center;	
		image{width:100%;
		      height:100%
		}		
}
.loading-login{width:360upx;height:151upx;margin:100upx auto; margin-top:100upx}
.cby{
	width:100%;
	height:auto;
	text-align:center;
}
.loadin-name{
	width:70%;
	height:100upx;
	border-bottom:1upx solid #FFFFFF;	
	margin:30upx auto;
	
	background-repeat: no-repeat;
	background-size:10%;	
	background-position-x: 1upx;
	background-position-y: 50%;
	padding-left:100upx;
}

.loadin-name uni-input{line-height:100upx;}
.loadin-name:nth-child(1){
	 display: flex;
	 display: -webkit-flex;
	 align-items:center;
	 justify-content:center;
	 background-image:url(../../static/hxsimg/phonenb.png);
}
.loadin-name:nth-child(2){
	 display: flex;
	 display: -webkit-flex;
	 align-items:center;
	 justify-content:center;
	 background-image:url(../../static/hxsimg/photoma.png);
	 background-size:11%;	
}
.loadin-name:nth-child(3){
	background-image:url(../../static/hxsimg/phonema.png);
}
.loadin-name:nth-child(4){
	background-image:url(../../static/hxsimg/password.png);
}
.loadin-name:nth-child(5){
	background-image:url(../../static/hxsimg/tuiid.png);
}
.phoneclass{
	width:60%;height:100upx;
  
}
.key{width:39%;height:80upx;color:#ffffff; 
    background-color:#585858;
	border-radius:20upx;
	margin:10upx 0;
    text{
	    line-height:80upx;
	}
}
.kkey{
	width:39%;height:80upx;
	color:#ffffff; 
    background-color:#585858;
	border-radius:10upx;
	overflow:hidden;
	margin-top:10upx;
	margin-bottom:10upx;
}

.loadin-go{
	width:80%;
	height:100upx;
	margin:0 auto;
	margin-top:30upx;
}
.inp-100{height:100upx;line-height:100upx;font-size:24upx;color:#000000;text-align:left}
.loading-btn{
	width:100%;
	border:#131415 solid 1upx;
	background-color:#353535;
    border-radius:30upx;color:#ffffff;
	height:100upx;
	line-height:100upx;
	}
.loadin-mima{
	align-items:center;
	width:100%;
	height:100upx;
	color:#ffffff;
	 display: flex;
	 text-align:center;
	 justify-content:space-around;
	 margin-top:50upx;
}
.news-user,.no-password{
	flex-shrink: 1;
	line-height:100upx;
}
</style>
