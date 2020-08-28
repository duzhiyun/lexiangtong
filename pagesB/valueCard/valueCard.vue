<template>
	<view>
		<block v-if="valueCardList.length > 0">
		<view class="value-card-items">
			<view class="value-card-item" v-for="(item,index) in valueCardList" :key="index">
				<view class="valuecard-top" :style="{'background':'url('+ valuecardBg +') no-repeat','background-size':'cover'}">
					<view class="user-col">
						<text class="user-sn">NO.{{item.value_card_sn}}</text>
						<label class="user-tag-box">
							<block v-if="item.status">已激活</block>
							<block v-else>已过期</block>
						</label>
					</view>
					<view class="card-money">
						<text>金额:</text>
						<view class="price">{{ item.card_money }}</view>
					</view>
					<navigator :url="'../valueCard/detail/detail?id='+item.vid" class="user-col-a" hover-class="none">查看详情</navigator>
				</view>
				<view class="user-card-num">
					<view class="time">过期时间:{{item.end_time}}</view>
					<view class="valuecard-num">面值:{{ item.vc_value}}</view>
				</view>
				<view class="new-store-radio-box">
					<text class="iconfont icon-ok"></text>
				</view> 
			</view>
		</view>
		</block>
		<block v-else>
			<dsc-not-content></dsc-not-content>
		</block>
		<view class="btn-bar btn-bar-fixed">
			<view class="btn" @click="onClickBigBtn">绑定储值卡</view>
		</view>
	</view>
</template>

<script>
	import dscNotContent from '@/components/dsc-not-content.vue';
	export default {
		data() {
			return {
				page:1,
				size:10,
			};
		},
		components:{
			dscNotContent
		},
		computed: {
			valueCardList:{
				get(){
					return this.$store.state.user.valueCardList
				},
				set(val){
					this.$store.state.user.valueCardList = val
				}
			},
			valuecardBg(){
				return this.websiteUrl + '/img/ka_bg.jpg'
			}
		},
		methods:{
			valueCardLoad(page){
				if(page){
					this.page = page
					this.size = Number(page) * 10
				}

				this.$store.dispatch('setValueCard',{
					page: this.page,
					size: this.size
				})
			},
			onClickBigBtn(){
				uni.navigateTo({
					url:'../valueCard/add/add'
				})
			},
		},
		onShareAppMessage(res){
			return {
			  title: this.$store.state.common.shopConfig.shop_title,
			  path: '/pagesB/valueCard/valueCard'
			}
		},
		onLoad(){
			this.valueCardLoad()
		}
	}
</script>

<style>

</style>
