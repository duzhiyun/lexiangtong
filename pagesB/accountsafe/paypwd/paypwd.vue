<template>
	<view>
		<form @submit="formSubmit">
			<view class="uni-card uni-card-not">
				<view class="header-title">修改支付密码</view>
				<view class="uni-list">
					<view class="uni-list-cell uni-list-cell-title uni-list-cell-right">
						<view class="uni-list-cell-navigate">
							<text class="title">手机号码</text>
							<view class="value"><input name="mobile" v-model="mobile" :disabled="isDisabled"></view>
						</view>
					</view>
					<view class="uni-list-cell uni-list-cell-title uni-list-cell-right">
						<view class="uni-list-cell-navigate">
							<text class="title">图片验证码</text>
							<view class="value value-items">
								<input placeholder="请输入图片验证码" name="imgverifyValue" v-model="imgverifyValue">
								<view class="code-box" @click="clickCaptcha"><image :src="captcha" class="img"></image></view>
							</view>
						</view>
					</view>
					<view class="uni-list-cell uni-list-cell-title uni-list-cell-right">
						<view class="uni-list-cell-navigate">
							<text class="title">短信验证码</text>
							<view class="value value-items">
								<input placeholder="请输入短信验证码" maxlength="6" name="sms" v-model="sms">
								<button size="mini" type="warn" @click="sendVerifyCode" v-if="button_type">获取验证码</button>
								<button size="mini" type="default" v-else>{{ button_text }}</button>
							</view>
						</view>
					</view>
					<view class="uni-list-cell uni-list-cell-title uni-list-cell-right">
						<view class="uni-list-cell-navigate">
							<text class="title">支付密码</text>
							<view class="value"><input name="pwd" type="number" v-model="pwd" maxlength="6"></view>
						</view>
					</view>
				</view>
			</view>
			<view class="btn-bar btn-bar-fixed">
				<button class="btn btn-red" type="primary" formType="submit" v-if="paypwd_id > 0">修改</button>
				<button class="btn btn-red" type="primary" formType="submit" v-else>启用</button>
			</view>
		</form>
	</view>
</template>

<script>
	import { mapState } from 'vuex'
	var graceChecker = require("@/common/graceChecker.js");
	export default {
		data() {
			return {
				mobile:'',
				imgverifyValue: '',
				sms: '',
				button_text: '重新发送(60s)',
				button_type: true,
				button_edit_type : false,
				button_edit: '提交',
				isDisabled:true,
				pwd:'',
				paypwd_id:0,
				notice:''
			}
		},
		computed: {
			...mapState({
				captcha: state => state.common.imgVerify.captcha,
				client: state => state.common.imgVerify.client,
			})
		},
		methods: {
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
			formSubmit(e){
				var rule = [
					{name:"imgverifyValue", checkType : "notnull", checkRule:"",  errorMsg:"图形验证码不能为空"},
					{name:"sms", checkType : "notnull", checkRule:"",  errorMsg:"短信验证码不能为空"},
					{name:"mobile", checkType : "phoneno", checkRule:"",  errorMsg:"手机号码不正确"},
					{name:"pwd", checkType : "notnull", checkRule:"",  errorMsg:"请填写支付密码"},
				];
				console.log(e.detail.value)
				//进行表单检查
				var formData = e.detail.value;
				var checkRes = graceChecker.check(formData, rule);
				
				if(checkRes){
					if(this.pwd.length < 6){
						uni.showToast({
							title:'请输入6位数支付密码',
							icon:'none'
						})
						
						return false
					}
					
					let o = {
						paypwd_id: this.paypwd_id,
						pay_paypwd: this.pwd,
						client: this.client,
						code: this.sms,
						mobile: this.mobile
					}
					
					uni.request({
						url:this.websiteUrl + '/api/v4/accountsafe/edit_paypwd',
						method:'POST',
						data:o,
						header: {
							'Content-Type': 'application/json',
							'token': uni.getStorageSync('token'),
							'X-Client-Hash':uni.getStorageSync('client_hash')
						},
						success: (res) => {
							let data = res.data
							if(data.status == 'success'){
								uni.showToast({ title: data.data.msg, icon: "none" });
								if (data.data.code == 0) {
									uni.navigateBack({
										url:'/pagesB/accountsafe/accountsafe'
									})
								}
							}else{
								uni.showToast({ title: data.errors.message, icon: "none" });
							}
						}
					})
				}else{
					uni.showToast({ title: graceChecker.error, icon: "none" });
				}
			}
		},
		onLoad(){
			this.$store.dispatch('setImgVerify');
			
			uni.request({
				url:this.websiteUrl + '/api/v4/accountsafe/add_paypwd',
				method:'GET',
				data:{},
				header: {
					'Content-Type': 'application/json',
					'token': uni.getStorageSync('token'),
					'X-Client-Hash':uni.getStorageSync('client_hash')
				},
				success: (res) => {
					if(res.data.status == 'success'){
						this.mobile = res.data.data.user_info.mobile_phone
						this.paypwd_id = res.data.data.users_paypwd.paypwd_id ? res.data.data.users_paypwd.paypwd_id : 0
						this.notice = res.data.data.notice
					}else{
						uni.showToast({
							title:'接口加载失败',
							icon:'none'
						})
					}
				}
			})
		}
	}
</script>

<style>
.header-title{ padding: 20upx 30upx; border-bottom: 1px solid #DDDDDD; font-size: 30upx;}
</style>
