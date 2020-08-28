<template>
	<view>
		<form @submit="formSubmit">
			<view class="input-list">
				<view class="input-item"><input v-model="vc_num" name="vc_num" type="text" placeholder="储值卡卡号(必填)" /></view>
				<view class="input-item"><input v-model="vc_password" name="vc_password" type="password" placeholder="储值卡密码(必填)" /></view>				
			</view>
			<view class="btn-bar btn-bar-radius">
				<button formType="submit" class="btn btn-red">
					<block v-if="type=='deposit'">充值此储值卡</block>
					<block v-else>绑定当前账户</block>
				</button>
			</view>
		</form>
	</view>
</template>

<script>
	var graceChecker = require("@/common/graceChecker.js");
	
	export default {
		data() {
			return {
				vc_num:'',
				vc_password:'',
				type:'',
				vc_id:''
			};
		},
		methods: {
			//数据提交
			formSubmit(e) {
				var rule = [
					{name:"vc_num", checkType : "notnull", checkRule:"",  errorMsg:"储值卡卡号不能为空"},					
					{name:"vc_password", checkType : "notnull", checkRule:"",  errorMsg:"储值卡密码不能为空"},
				];
				
				//进行表单检查
				var formData = e.detail.value;
				var checkRes = graceChecker.check(formData, rule);
				
				if(checkRes){
					if(this.type == 'deposit'){
						this.$store.dispatch('setDepositValueCard',{
							vc_num:this.vc_num,
							vc_password:this.vc_password,
							vc_id:this.vc_id
						}).then(res=>{
							uni.showToast({ title: res.data.msg, icon: "none" });
							if(res.data.error == 0){
								setTimeout(()=>{
									uni.redirectTo({
										url:'/pagesB/valueCard/valueCard'
									})
								},1000)
							}
						})
					}else{
						this.$store.dispatch('setAddValueCard',{
							vc_num:this.vc_num,
							vc_password:this.vc_password
						}).then(res=>{
							uni.showToast({ title: res.data.msg, icon: "none" });
							if(res.data.error == 0){
								setTimeout(()=>{
									uni.redirectTo({
										url:'/pagesB/valueCard/valueCard'
									})
								},1000)
							}
						})
					}
				} else {
					uni.showToast({ title: graceChecker.error, icon: "none" });
				}
			}
		},
		onShareAppMessage(res){
			return {
			  title: this.$store.state.common.shopConfig.shop_title,
			  path: '/pagesB/valueCard/add/add'
			}
		},
		onLoad(e){
			if(e){
				this.type = e.type;
				this.vc_id = e.vc_id
			}
		}
	}
</script>

<style>
.btn-bar{ margin: 30upx; }
</style>
