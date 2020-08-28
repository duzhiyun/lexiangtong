<template>
	<view class="container-bwg">
		<view class="user-lr-form">
			<view class="title">重置密码</view>
			<form @submit="formSubmit">
			<view class="item-inputs">
				<view>请设置新的登录密码</view>
				<view class="item-input">
					<input :type="pwd" name="new_password" placeholder="请输入6-20位登录密码" />
					<view class="icon" @click="handlePwdShow">
						<uni-icon :color="pwdColor" type="eye" size='18'></uni-icon>
					</view>
				</view>
			</view>
			<view class="btn-bar btn-bar-radius">
				<button class="btn btn-red" formType="submit">确定修改</button>
			</view>
			</form>
			<view class="tips">备注：请将密码设置为6-20位，并且由字母，数字和符号两种以上组合，不能与旧密码相同</view>
		</view>
	</view>
</template>

<script>
	import uniIcon from '@/components/uni-icon.vue';
	
	var graceChecker = require("@/common/graceChecker.js");
	export default {
		data() {
			return {
				pwd: 'password',
				pwdColor: '#bdbdbd',
				new_password:'',
				mobile:'',
				client:'',
				code:'',
			}
		},
		components: {
			uniIcon,
		},
		onLoad(e){
			this.mobile = e.mobile;
			this.client = e.client;
			this.code = e.code;
		},
		methods: {
			handlePwdShow() {
				this.pwd = this.pwd == 'password' ? 'text' : 'password';
				this.pwdColor = this.pwd == 'password' ? '#bdbdbd' : '#f92028';
			},
			formSubmit(e) {
				var rule = [
					{name: "new_password",checkType: "notnull",checkRule: "",errorMsg: "密码不能为空"},
					{name: "new_password",checkType: "length6",checkRule: "",errorMsg: "密码不能少于6位"},
				];
				//进行表单检查
				var formData = e.detail.value;
				var checkRes = graceChecker.check(formData, rule);
				if (checkRes) {
					uni.request({
						url: this.websiteUrl + '/api/v4/user/reset',
						method: 'POST',
						data: {
							password:e.detail.value.new_password,
							mobile:this.mobile,
							client:this.client,
							code:this.code
						},
						header: {
							'Content-Type': 'application/json',
							'X-Client-Hash':uni.getStorageSync('client_hash')
						},
						success: (res) => {
							let data = res.data
							if(data.status === 'success'){
								uni.showToast({
									title:'密码重置成功',
									icon:'none'
								});
								uni.reLaunch({
									url: '/pages/user/user',
								});
							}else{
								if(data.errors){
									uni.showToast({
										title:data.errors.message,
										icon:'none'
									})
								} 
							}
						},
						fail: (res) => {
							console.log(JSON.stringify(res))
						}
					})
				} else {
					uni.showToast({
						title: graceChecker.error,
						icon: "none"
					});
				}
			},
		}
	}
</script>

<style>

</style>
