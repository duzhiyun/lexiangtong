<template>
	<view>
		<view class="container">
			<view class="loading-login">
				<image src="../../static/logo_img.png" style="height: 250rpx;"></image>
			</view>
			
				<form @submit="formSubmit"> 
				<view class="cby">
			        <view class="loadin-name">
			        	<input type="text" name="username" placeholder="请输入您的用户名/手机号" class="inp-100"/>
			        </view>
			        <view class="loadin-pass">
			        	<input type="password" name="password" placeholder="请输入6-20位登录密码" class="inp-100" />
			        </view>
			        <view class="loadin-go">
			        	<button  class="loading-btn" formType="submit">登录</button>
			        </view>
			
			        <view class="loadin-mima">
			        	<navigator url="../register/register" class="news-user" hover-class="none">新用户注册</navigator>
			            <navigator url="../login/forget/forget" class="no-password" hover-class="none">忘记密码?</navigator>
						<navigator url="../login/loginMobile/loginMobile" class="no-password" hover-class="none">短信验证码登录<uni-icon color="#f92028"
							 type="arrowright" size='20'></uni-icon>
						</navigator>
			        </view>
				</view>
			    </form>
		</view>
		
	</view>
</template>

<script>

	import {
		mapState,
		mapMutations
	} from 'vuex'

	import uniIcon from '@/components/uni-icon.vue';
	import dscCommonNav from '@/components/dsc-common-nav.vue';

	var graceChecker = require("@/common/graceChecker.js");

	export default {
		data() {
			return {
				providerList: [],
				pwd: 'password',
				pwdColor: '#bdbdbd',
				scopeUserInfo: {},
				scope: 'userInfo',
				scopeSessions: {},
				oauthList: [],
				clientHight: 0,
				footerHight: 0,
				delta: '',
				parent_id: uni.getStorageSync('parent_id'),
				//imageURL:'../../static/hxsimg/bgbg2.jpg'
				
			}
		},
		components: {
			uniIcon,
			dscCommonNav
		},
		computed: {
			...mapState({
				phoneNumber: state => state.common.phoneNumber
			}),
			thirdPartyImg() {
				let arr = []
				this.oauthList.forEach((v) => {
					arr.push('../../../static/oauth/' + v + '.png')
				})
				return arr
			},
			footerTop() {
				return this.clientHight - this.footerHight
			}
		},
		onLoad(e) {
			this.delta = e.delta ? e.delta : ''

			uni.hideLoading();

			//#ifdef MP-WEIXIN
			uni.removeStorage({
				key: 'scopeSession',
				success: (res) => {
					this.scopeSession();
				}
			})
			//#endif

			// #ifdef APP-PLUS
			uni.getProvider({
				service: 'oauth',
				success: (res) => {
					this.oauthList = ['weixin']; // res.provider;
				}
			});
			// #endif
		},
		onReady() {
			this.getClientHight();
		},
		methods: {
			getClientHight() {
				let that = this;
				uni.getSystemInfo({
					success(res) {
						that.clientHight = res.screenHeight;
						that.footerHight = that.clientHight * 0.3;
					}
				})
			},
			handlePwdShow() {
				this.pwd = this.pwd == 'password' ? 'text' : 'password';
				this.pwdColor = this.pwd == 'password' ? '#bdbdbd' : '#f92028';
			},
			scopeSession() {
				uni.login({
					provider: 'weixin',
					success: (res) => {
						this.$store.dispatch('getScopeAppSession', {
							code: res.code
						}).then(sessionRes => {
							uni.setStorage({
								key: 'scopeSession',
								data: sessionRes.data
							});

							this.scopeSessions = sessionRes.data;
						})
					},
					fail: (res) => {
						uni.showToast({
							title: res.errMsg,
							icon: 'none'
						});
					}
				});
			},
			getUserInfo(e) {
				uni.getUserInfo({
					provider: 'weixin',
					success: (infoRes) => {
						uni.getStorage({
							key: 'scopeSession',
							success: (session) => {
								this.$store.dispatch('getScopeAppDecrypt', {
									sessionKey: session.data.session_key,
									iv: infoRes.iv,
									encryptData: infoRes.encryptedData
								}).then(res => {
									this.scopeSessions = {
										openid: res.data.openId,
										unionid: res.data.unionId,
										session_key: session.data.session_key,
										expires_in: session.data.expires_in
									}
								})
							}
						});

						uni.setStorage({
							key: 'scopeUserInfo',
							data: infoRes.userInfo
						});
						this.scopeUserInfo = infoRes.userInfo;
						this.scope = 'phoneNumber';
					},
					fail: (infoRes) => {
						uni.showToast({
							title: '授权失败',
							icon: 'none'
						});
					}
				})
			},
			getPhoneNumber(e) {
				//读取本地scopeSession
				uni.getStorage({
					key: 'scopeSession',
					complete: (res) => {
						this.$store.dispatch('getScopeAppDecrypt', {
							sessionKey: res.data.session_key,
							iv: e.detail.iv,
							encryptData: e.detail.encryptedData
						}).then(obj => {
							if (obj.status == 'success') {
								let o = {}
								if (this.delta) {
									o = {
										scopeSessions: this.scopeSessions,
										phoneNumber: obj.data.phoneNumber,
										userInfo: this.scopeUserInfo,
										delta: this.delta,
										parent_id: this.parent_id,
										platform: uni.getStorageSync('platform'),
									}
								} else {
									o = {
										scopeSessions: this.scopeSessions,
										phoneNumber: obj.data.phoneNumber,
										userInfo: this.scopeUserInfo,
										parent_id: this.parent_id,
										platform: uni.getStorageSync('platform'),
									}
								}
								this.$store.dispatch('getScopeAppLogin', o);
							}
						});
					}
				});
			},
			formSubmit(e) {
				var rule = [{
						name: "username",
						checkType: "notnull",
						checkRule: "",
						errorMsg: "用户名不能为空"
					},
					{
						name: "password",
						checkType: "notnull",
						checkRule: "",
						errorMsg: "密码不能为空"
					},
				];
				//进行表单检查
				var formData = e.detail.value;
				var checkRes = graceChecker.check(formData, rule);
				var o = {}
				if (checkRes) {
					if (this.delta) {
						o = {
							username: e.detail.value.username,
							password: e.detail.value.password,
							delta: this.delta
						}
					} else {
						o = {
							username: e.detail.value.username,
							password: e.detail.value.password
						}
					}
					this.$store.dispatch('userLogin', o)
				} else {
					uni.showToast({
						title: graceChecker.error,
						icon: "none"
					});
				}
			},
			thirdPartyLink(value) {
				uni.login({
					provider: value,
					success: (res) => {
						uni.showLoading({title: '同步登录中...'});
						uni.getUserInfo({
							provider: value,
							success: (infoRes) => {
								uni.setStorage({
									key: 'scopeUserInfo',
									data: infoRes.userInfo
								});
								
								// 验证授权用户
								uni.request({
									url: this.websiteUrl + '/api/v4/oauth/check/auth',
									method: 'POST',
									data: {
										userInfo:infoRes.userInfo,
										type:value
									},
									header: {
										'Content-Type': 'application/json',
									},
									success: (res) => {
										console.log('oauth/app request success')
										console.log(JSON.stringify(res))
										let data = res.data.data
										uni.hideLoading();
										console.log(data.registered)
										if (data.registered === 1) {
											this.$store.dispatch('userFastLogin',{
												data:data.token
											})
										} else {
											uni.navigateTo({
												url: '/pages/login/bind/bind?type=' + value,
											});
										}
									},
									fail: (res) => {
										console.log('oauth/check/auth request fail')
									}
								})
							},
							fail: (infoRes) => {
								uni.showToast({
									title: '授权失败',
									icon: 'none'
								});
							}
						})
					}
				})
			}
		}
	}
	
</script>

<style lang="scss">
page{
	background-repeat: no-repeat;	
	justify-content:center;
	background-color:#FFFFFF;
	}
.container{			
		text-align:center;
		height:100%;
		width:100%;
		image{width:100%;
		      height:100%
		};
		
}
.loading-login{width:360upx;height:150upx;margin:100upx auto; margin-top:120upx}
.cby{
	width:100%;
	height:auto;
	text-align:center;
}
.loadin-name,.loadin-pass{
	width:70%;
	height:100upx;
	border:1upx solid #000000;	
	margin:30upx auto;
	border-radius:30upx;
	input{
		line-height:100upx;
	}
	
}
.loadin-name uni-input{line-height:100upx;}
.loadin-go{
	width:70%;
	height:100upx;
	margin:0 auto;
	margin-top:30upx;
}
.inp-100{height:100upx;line-height:100upx;color:#000000}
.loading-btn{width:100%;
            border:#FF0000 solid 1upx;
			background-color:#FF0000;
			border-radius:30upx;
			color:#FFFFFF;
			height:80upx;
			line-height:80upx;
			}
.loadin-mima{
	align-items:center;
	width:100%;
	height:100upx;
	color:#000000;
	 display: flex;
	 text-align:center;
	 justify-content:space-around;
	 margin-top:50upx;
}
.news-user,.no-password{
	flex-shrink: 1;
	line-height:80upx;
}
</style>
