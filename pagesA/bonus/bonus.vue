<template>
	<view class="container">
		<block v-if="bonusData.length > 0">
		<view class="bonus-items">
			<view class="bonus-item" v-for="(item,index) in bonusData" :key="index">
				<view class="cont">
					<view class="bonus-left">
						<view class="bonus-money">{{item.type_money}}</view>
					</view>
					<view class="bonus-right">
						<view class="bonus-tit">{{item.type_name}}</view>
						<view class="bonus-desc">满{{item.min_goods_amount}}元可以使用</view>
						<view class="bonus-desc">{{item.shop_name}}</view>
					</view>
					<view class="bonus-btn">
						<view class="btn btn-disabled" v-if="item.is_receive == 1">已领取</view>
						<view class="btn btn-disabled" v-else-if="item.is_left == 0">已领完</view>
						<view class="btn" @click="receive(item.type_id)" v-else>领取</view>
					</view>
				</view>
				<view class="time">使用期限：{{item.use_start_date}} 至 {{item.use_end_date}}</view>
			</view>
		</view>
		</block>
		<block v-else>
			<dsc-not-content></dsc-not-content>
		</block>
	</view>
</template>

<script>
	import { mapState } from 'vuex'
	import dscNotContent from '@/components/dsc-not-content.vue';
	export default {
		data() {
			return {
				status:4,
				page:1,
				size:10,
				id:0
			};
		},
		components:{
			dscNotContent
		},
		computed: {
			bonusData:{ 
				get(){
					return this.$store.state.ump.bonusData
				},
				set(val){
					this.$store.state.ump.bonusData = val
				}
			}
		},
		methods: {
			bonusClick(page){
				if(page){
					this.page = page
					this.size = Number(page) * 10
				}
			
				this.$store.dispatch('setBonus',{
					page: this.page,
					size: this.size,
					type: this.status,
					id:this.id
				})
			},
			receive(id){
				this.$store.dispatch('receiveBonus',{
					type_id:id
				}).then(res=>{
					let data = res.data
					uni.showToast({
						title:data.msg,
						icon:'none'
					})
					
					if(data.code == 0){
						this.bonusClick(1)
					}
				})
			}
		},
		onLoad(e){
			this.id = e.id;
			this.bonusClick();
		},
		onShareAppMessage(res){
			return {
			  title: '领取红包',
			  path: '/pagesA/bonus/bonus'
			}
		},
		onReachBottom(){
			if(this.page * this.size == this.bonusData.length){
				this.page ++
				this.bonusClick()
			}
		}
	}
</script>

<style>
.bonus-btn .btn{ padding: 5upx 20upx; border-radius: 30upx; background: #f92028; color: #FFFFFF; font-size: 25upx;}
.bonus-btn .btn-disabled{ background: #ccc;}
</style>
