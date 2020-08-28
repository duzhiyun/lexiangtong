<template>
	<view>
		<block v-if="accountlog_list.length>0">
		<view class="ny-list">
			<view class="ny-item" v-for="(item,index) in accountlog_list" :key="index">
				<view class="card-div">
					<block v-if="item.short_change_desc_part1">
						<view>{{ item.short_change_desc_part1}}</view>
						<view>{{ item.short_change_desc_part2}}</view>
					</block>
					<block v-else>
						<view>{{ item.short_change_desc}}</view>
					</block>
					<view class="time">{{ item.change_time }}</view>
				</view>
				<view class="uni-red">{{ item.type }}<text>{{ item.amount }}</text></view>
			</view>
		</view>
		</block>
		<block v-else>
			<dsc-not-content></dsc-not-content>
		</block>
	</view>
</template>

<script>
	import dscNotContent from '@/components/dsc-not-content.vue';
	export default {
		data() {
			return {
				accountlog_list:[]
			};
		},
		components:{
			dscNotContent
		},
		onLoad(){
			uni.request({
				url:this.websiteUrl + '/api/v4/account/accountlog',
				method:'GET',
				data:{},
				header: {
					'Content-Type': 'application/json',
					'token': uni.getStorageSync('token'),
					'X-Client-Hash':uni.getStorageSync('client_hash')
				},
				success: (res) => {
					if(res.data.status == 'success'){
						this.accountlog_list = res.data.data
					}
				}
			})
		},
		onShareAppMessage(res){
			return {
			  title: this.$store.state.common.shopConfig.shop_title,
			  path: '/pagesB/account/detail/detail'
			}
		},
	}
</script>

<style>

</style>
