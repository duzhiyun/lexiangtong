<template>
	<view>
		<block v-if="valueCardInfo.length > 0">
		<view class="ny-list">
			<view class="ny-item" v-for="(item,index) in valueCardInfo" :key="index">
				<view class="header">
					<view>订单号：{{ item.order_sn }}</view>
					<view>使用时间：{{ item.record_time }}</view>
				</view>
				<view class="content">
					<view class="item"><label>充值：</label><text class="uni-red">{{ item.add_val }}</text></view>
					<view class="item"><label>使用：</label><text class="uni-red">{{ item.use_val }}</text></view>
				</view>
			</view>
		</view>
		</block>
		<block v-else>
			<dsc-not-content></dsc-not-content>
		</block>
		<view class="btn-bar btn-bar-fixed">
			<view class="btn" @click="onClickBigBtn">充值</view>
		</view>
	</view>
</template>

<script>
	import dscNotContent from '@/components/dsc-not-content.vue';
	export default {
		data() {
			return {
				vc_id:''
			};
		},
		components:{
			dscNotContent
		},
		computed: {
			valueCardInfo:{
				get(){
					return this.$store.state.user.valueCardInfo
				},
				set(val){
					this.$store.state.user.valueCardInfo = val
				}
			}
		},
		methods: {
			valueCardLoad(id){
				this.$store.dispatch('setValueCardInfo',{
					vc_id:id
				})
			},
			onClickBigBtn(){
				uni.navigateTo({
					url:'../valueCard/add/add?type=deposit&vc_id='+ this.vc_id
				})
			},
		},
		onShareAppMessage(res){
			return {
			  title: this.$store.state.common.shopConfig.shop_title,
			  path: '/pagesB/valueCard/detail/detail'
			}
		},
		onLoad(e){
			this.vc_id = e.id
			this.valueCardLoad(e.id)
		}
	}
</script>

<style>

</style>
