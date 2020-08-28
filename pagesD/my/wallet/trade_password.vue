<template>
	<view class="page">
		<view class="content">
			<uni-list class="list">
				<uni-list-item ref="uitem" :title="title"
							   :show-arrow="true"
							   :showArrow="true"
							   @tap="goPath(path)"/>
				<!--<uni-list-item title="忘记支付密码"-->
							   <!--:show-arrow="true"-->
							   <!--:showArrow="true"-->
							   <!--@tap="goPath('../set/forget_trade_password')"/>-->
			</uni-list>
		</view>
	</view>
</template>

<script>
	import _hook from '../../../common/_hook';
	import _data from '../../../common/_data';
	import ulist from  '../../../components/uni-list/uni-list'
	import uitem from  '../../../components/uni-list-item/uni-list-item'
	export default {
		data() {
			return {
				user_info:{},
				set:false
			}
		},
		components:{
			ulist,
			uitem
		},
		computed:{
			title(){
				return this.set ? '修改支付密码' : '设置支付密码';
			},
			path(){
				return this.set ? '../set/edit_trade_password' : '../set/set_trade_password';
			}
		},
		onShow(){
			_hook.routeSonHook();
			let _this = this;

			uni.$on('data_user_info', function (data) {
				_this.user_info = data;
				if(_this.user_info.trade_password)_this.set = true
			});
			if(!_this.user_info.length){
				_this.user_info = _data.data('user_info');
			}
			if(_this.user_info.trade_password)_this.set = true;
			console.log(_this.set)

		},
		methods: {
			goPath(path){
				if(path){
					uni.navigateTo({
						url: path
					});
				}
			}
		}
	}
</script>

<style>
.content .list{
	margin-top: 20upx;
}
</style>
