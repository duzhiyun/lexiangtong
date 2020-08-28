<template>
	<view class="container">
		<view class="header-search">
			<view class="input-view">
				<uni-icon type="search" size="22" color="#666666"></uni-icon>
				<input confirm-type="search" disabled="true" @click="searchFocus" class="input" type="text" placeholder="输入搜索关键词" />
			</view>
		</view>
		<view class="page-body">
			<scroll-view class="nav-left" scroll-y :style="'height:'+height+'px'">
				<view class="nav-left-item" @click="bindChangeFirstCate(index,item.cat_id)" :key="index" :class="index==currentFirstIndex?'active':''"
				    v-for="(item,index) in cateListAll">
					<text>{{item.cat_name}}</text>
				</view>
			</scroll-view>
			<scroll-view class="nav-right" scroll-y :scroll-top="scrollTop" @scroll="scroll" :style="'height:'+height+'px'" scroll-with-animation>
				<view class="adv" v-if="touch_catads">
					<image :src="touch_catads" @click="$outerHref(touch_catads_url)" v-if="touch_catads_url"></image>
					<image :src="touch_catads" v-else></image>
				</view>
				<view class="item" v-for="(item,index) in cateListSecond" :key="index">
					<navigator :url="'/pages/goodslist/goodslist?id='+item.cat_id" hover-class="none"><text class="tit"><text>{{ item.cat_name }}</text></text></navigator>
					<view class="nav-right-item" v-for="(third,itemIndex) in item.child" :key="itemIndex">
						<navigator :url="'/pages/goodslist/goodslist?id='+third.cat_id" hover-class="none">
							<image :src="third.touch_icon" />
							<view class="uni-ellipsis">{{third.cat_name}}</view>
						</navigator>
					</view>
				</view>
			</scroll-view>
		</view>
		<tabbar :curpage="curpage"></tabbar>
	</view>
</template>

<script>
	import { mapState } from 'vuex'
	
	import uniIcon from '@/components/uni-icon.vue'
	import tabbar from "@/components/tabbar/tasktabbar.vue";
	
	export default {
		components: {
			uniIcon,
			tabbar
		},
		data() {
			return {
				currentFirstIndex: 0,
				touch_catads:'',
				touch_catads_url:'',
				cat_id:0,
				height: 0,
				scrollTop: 0,
				scrollHeight: 0,
				curpage:''
			}
		},
		onShareAppMessage(res){
			return {
			  title: this.$store.state.common.shopConfig.shop_title,
			  path: '/pages/category/category'
			}
		},
		computed:{
			...mapState({
				cateListAll: state => state.category.cateListAll
			}),
			cateListSecond:{
				get(){
					return this.$store.state.category.cateListSecond
				},
				set(val){
					this.$store.state.category.cateListSecond = val
				}
			},
		},
		methods: {
			scroll(e) {
				this.scrollHeight = e.detail.scrollHeight;
			},
			bindChangeFirstCate(index,cat_id) {
				this.cat_id = cat_id;
				this.currentFirstIndex = index;
				this.scrollTop = -this.scrollHeight * index;
				
				this.cateListSecond = []
				this.$store.dispatch('setCategoryList',{
					index:index,
					id:cat_id
				})
			},
			handelTouchCatads(){
				this.cateListAll.forEach(v=>{
					if(v.cat_id == this.cat_id){
						this.touch_catads = v.touch_catads;
						this.touch_catads_url = v.touch_catads_url
					}
				})
			},
			searchFocus(){
				uni.reLaunch({
					url: '/pages/search/search'
				});
			},
		},
		onLoad() {
			this.$store.dispatch('setCategoryList',{
				index:this.currentFirstIndex
			})
			
			let difHeight = 50
			
			//#ifdef APP-PLUS
			difHeight = 100
			//#endif
			
			if(uni.getSystemInfoSync().model == 'Redmi Note 7'){
				difHeight = 26
			}
			this.height = uni.getSystemInfoSync().windowHeight - difHeight;
		},
		onShow() {
			let pages = getCurrentPages()
			this.curpage = pages[pages.length - 1].route
		},
		watch:{
			cateListAll(){
				this.cat_id = this.cateListAll[this.currentFirstIndex].cat_id;

				this.$store.dispatch('setCategoryList',{
					id:this.cat_id
				})

				this.handelTouchCatads()
			},
			cat_id(){
				this.handelTouchCatads()
			}
		}
	}
</script>

<style>
.container{ overflow: hidden;}
.header-search{ display: flex; width: calc(100% - 40upx); padding:0 20upx; background: #FFFFFF; border-bottom: solid 1px #E0E0E0; position: fixed; top: 0; height: 50px; align-items: center; z-index: 99;}

.page-body { display: flex; padding-top: 50px; background: #FFFFFF;}
.nav {display: flex;width: 100%;}

.nav-left {width: 28%;border-right: solid 1px #E0E0E0;}
.nav-left-item {height: 100upx;display: flex;align-items: center;justify-content: center;}
.nav-left-item text{ display: block; width: 100%; text-align: center; }
.nav-left-item.active { color: #f23030; }
.nav-left-item.active text{ border-left: 5upx solid #f23030; }

.nav-right { width: 72%;}
.nav-right .adv{ width: 100%; height: 240upx; padding: 0 20upx; margin-top: 20upx; box-sizing: border-box;}
.nav-right .adv image{ width: 100%; height: 100%;}
.nav-right .item{ padding: 0 20upx; overflow: hidden; margin-bottom: -20upx;}
.nav-right .item .tit{ display: flex; justify-content: center; margin: 15upx 0 30upx; position: relative;}
.nav-right .item .tit text{ background: #FFFFFF;position: relative; z-index: 2; padding: 0 10upx;}
.nav-right .item .tit:after{content: " "; height: 1upx; width: 35%; background: #E0E0E0; position: absolute; top: 26upx; z-index: 1;}
.nav-right .item .nav-right-item { width: 33.3%; height: 220upx;float: left;text-align: center;font-size: 28upx;}
.nav-right .item .nav-right-item image { width: 100upx;height: 100upx;}

/* #ifdef APP-PLUS */
.header-search{ padding-top: 50px; }
.page-body{ padding-top: 100px;}
/* #endif */
</style>
