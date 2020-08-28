<template>
	<view>
		<view class="uni-card uni-card-not">
			<view class="uni-list">
				<view class="uni-list-cell" hover-class="uni-list-cell-hover" @click="paypwd">
					<view class="uni-list-cell-navigate uni-navigate-right uni-navigate-badge">
						<text class="title">开启支付密码</text>
						<view class="value uni-red" v-if="accountsafe.users_paypwd == 1">已开启，修改</view>
						<view class="value uni-red" v-else>未开启</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				accountsafe:{
					is_connect_user:'',
					is_validated:'',
					users_paypwd:''
				}
			}
		},
		methods: {
			paypwd(){
				uni.navigateTo({
					url:'paypwd/paypwd'
				})
			}
		},
		onLoad(){
			uni.request({
				url:this.websiteUrl + '/api/v4/accountsafe',
				method:'GET',
				data:{},
				header: {
					'Content-Type': 'application/json',
					'token': uni.getStorageSync('token'),
					'X-Client-Hash':uni.getStorageSync('client_hash')
				},
				success: (res) => {
					if(res.data.status == 'success'){
						this.accountsafe = res.data.data;
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

</style>
