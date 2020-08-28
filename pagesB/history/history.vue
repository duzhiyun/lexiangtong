<template>
	<view class="container">
		<block v-if="historyList.length>0">
		<view class="header">
			<view class="tit">浏览记录<text>{{length}}</text>条</view>
			<view class="more" @click="clearHistory">清空</view>
		</view>
		<view class="section-list">
			<view class="product-list">
				<view class="product-items">
					<view class="item" v-for="(item,index) in historyList" :key="index">
						<navigator class="product-img" :url="'/pages/goodsDetail/goodsDetail?id='+item.id" hover-class="none">
							<image :src="item.img" v-if="item.img"></image>
						</navigator>
						<view class="product-info">
							<navigator :url="'/pages/goodsDetail/goodsDetail?id='+item.id" class="product-name twolist-hidden" hover-class="none">{{ item.name }}</navigator>
							<view class="product-row">
								<view class="price">{{ item.price }}</view>
								<text @click="deleteHistory(item.id)">删除</text>
							</view>
						</view>
					</view>
				</view>
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
				
			};
		},
		components:{
			dscNotContent
		},
		computed:{
			...mapState({
				historyList : state => state.user.historyList,
			}),
			length(){
				return this.$store.state.user.historyList.length
			}
		},
		methods:{
			clearHistory(){
				this.$store.dispatch('setHistoryDelete')
			},
			deleteHistory(id){
				this.$store.dispatch('setHistoryDelete',{
					id:id
				})
			}
		},
		onShareAppMessage(res){
			return {
			  title: this.$store.state.common.shopConfig.shop_title,
			  path: '/pagesB/history/history'
			}
		},
		onLoad(){
			this.$store.dispatch('setHistory')
		}
	}
</script>

<style>
.header{ display: flex; flex-direction: row; justify-content: space-between; padding: 20upx;}
.header .tit{ color: #999999;}
.header .tit text{ color: #666666; margin: 0 10upx 0 5upx;}
.header .more,
.product-row text{ color: #0095d3;}
</style>
