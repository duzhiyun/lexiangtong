<template>
	<view class="container">
		<view class="drp-withdraw" style="width:95%;border-radius: 20rpx;margin:20rpx auto;border:1rpx solid #000000">
			<form @submit="formSubmit">
				<view class="uni-form-item uni-column">
					<view class="title">第一期：总数<block> 50000乐豆 (2乐券/个)</block></view>
					<view class="title"  v-if="drpTransData.max_money>0" >剩余数：<block v-if="drpTransData.max_money">{{drpTransData.max_money}}乐豆</block></view>
					<view class="title"  v-else>剩余数：<block v-if="drpTransData.max_money">本期众筹已完成</block></view>
					
					<view style="width:100%;margin:0 auto;display: flex;align-items:center; flex-direction:row" v-if="drpTransData.is_now<0"> 
					    <view class="title" style="padding-right:0">参与数：</view>
						<view style="border-bottom:1px solid #000000;">
							<input class="uni-input" type="number" v-model="amount" focus placeholder="每帐户最高500个" />
						</view>							
					</view>
					<view style="width:100%;margin:0 auto;display: flex;align-items:center; flex-direction:row" v-else>
					  		
					</view>

					<view class="sub"></view>
				</view>
				<view class="btn-bar btn-bar-radius" v-if="drpTransData.is_now<0 && drpTransData.max_money>0">
					<button class="btn" formType="submit" style="width:300rpx;height:60rpx;line-height:60rpx">众筹乐豆</button>
				</view>
				<view class="btn-bar btn-bar-radius" v-else>
					<view class="btn" v-if="drpTransData.max_money>0" style="background:#b8b8b8;height:60rpx;line-height:60rpx">2020年8月18日10:00开始认筹</view>
					<view class="btn"  style="background:#b8b8b8;height:60rpx;line-height:60rpx" v-else >已结束！期待下次再来！</view>
				</view>				
			</form>
		</view>

		
		<dsc-loading :dscLoading="dscLoading"></dsc-loading>
	</view>
</template>

<script>
	import { mapState } from 'vuex'
	import uniIcon from "@/components/uni-icon.vue";
	import uniCollapse from '@/components/uni-collapse/uni-collapse.vue'
	import uniCollapseItem from '@/components/uni-collapse-item/uni-collapse-item.vue'
	import dscNotContent from '@/components/dsc-not-content.vue';
	
	export default {
		data() {
			return {
				amount:'',
				money:0
			}
		},
		components:{
			uniIcon,
			uniCollapse,
			uniCollapseItem,
			dscNotContent
		},
		onLoad(e) {
			if(e.money != undefined){
				this.money = e.money
			}
			this.load();
		},
		computed: {
			...mapState({
				drpTransData: state => state.drp.drpTransData,
			})
		},
		methods: {
			load(){
				this.$store.dispatch('setDrpTrans',{type:3});
			},
			formSubmit(e){
				let minMoney = parseInt(1)
				let maxMoney = parseInt(500)
				let inputValue = parseInt(this.amount)
				
				if (inputValue < minMoney) {
					uni.showToast({
						title: '众筹数量不能小于' + minMoney + '元',
						icon: 'none'
					});
				} else if (inputValue > maxMoney) {
					uni.showToast({
						title: '超出最众筹额度',
						icon: 'none'
					});
				} else {
					this.$store.dispatch('setDrpTransferred',{
						amount:inputValue,
						type:3
					}).then(res=>{
						if(res.status == 'success'){
							uni.showToast({
								title:res.data.msg,
								icon:'none'
							});
							
							if(res.data.error == 0){
								uni.reLaunch({
									url:'/pages/user/user'
								});
							}
						}else{
							uni.showToast({
								title:'众筹失败',
								icon:'none'
							});
						}
					})
				}
			}
		}
	}
</script>

<style scoped>
.drp-withdraw{ background: #FFFFFF; }
.drp-withdraw .title{ font-size: 35upx; test-align:center;}
.drp-withdraw .sub{ padding: 0 25upx; color: #999999;}
.drp-duzytitle{font-size: 33upx;margin:20rpx 0}
.drp-withdraw .btn-bar{ margin: 25upx; }
</style>

