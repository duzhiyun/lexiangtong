<template>
	<view class="container-bwg">
		<view class="header app-header-top">
			<uni-nav-bar color="#333333" background-color="#FFFFFF" shadow="false" statusBar="false" fixed="false" leftState="false" :titleNView="titleNView">
				<view class="input-view">
					<uni-icon type="search" size="20" color="#666666"></uni-icon>
					<input confirm-type="search" class="input" type="text" v-model="keyValue" focus="true" :placeholder="placeholder" @input="KeyInput" @confirm="confirm" />
				</view>
				<view slot="right">
					<button type="warn" size="mini" @click="confirm" style="padding: 0; width: 96upx;">搜索</button>
				</view>
			</uni-nav-bar>
		</view>
		<view class="ms-search-wraper">
			<view class="recent-search" v-if="latelyKeyword.length > 0">
				<view class="ms-search-head">
					<text>历史搜索</text>
					<view class="colse" @click="colse">清除</view>
				</view>
				<view class="ms-search-tags">
					<text class="uni-ellipsis" v-for="(item,index) in latelyKeyword" :key="index" @click="searchTag(item)">{{item}}</text>
				</view>
			</view>
			<view class="hot-search">
				<view class="ms-search-head clearfix">热门搜索</view>
				<view class="ms-search-tags">
					<text class="uni-ellipsis" v-for="(item,index) in search_keywords" :key="index" @click="searchTag(item)">{{ item }}</text>
				</view>
			</view>
		</view>
		
		<tabbar :curpage="curpage"></tabbar>
	</view>
</template>

<script>
	import uniNavBar from '@/components/uni-nav-bar.vue';
	import uniIcon from '@/components/uni-icon.vue';
	import tabbar from "@/components/tabbar/tabbar.vue";
	
	export default {
		components:{
			uniNavBar,
			uniIcon,
			tabbar
		},
		data() {
			return {
				keyword:'',
				keyValue:'',
				arr:[],
				latelyKeyword:[],
				search_keywords:[],
				placeholderState:0,
				placeholder:'输入搜索关键词',
				titleNView:false
			};
		},
		onShareAppMessage(res){
			return {
			  title: this.$store.state.common.shopConfig.shop_title,
			  path: '/pages/search/search'
			}
		},
		methods:{
			KeyInput(e){
				this.keyword = e.detail.value;
			},
			searchTag(val){
				uni.navigateTo({
					url:'/pages/goodslist/goodslist?keywords='+val
				})
			},
			confirm(){
				this.keyValue = '';
				
				this.keyword = this.keyword.replace(/\s*/g,"");
				
				if(!this.keyword && this.placeholderState == 1){
					uni.navigateTo({
						url:'/pages/goodslist/goodslist?keywords=' + this.placeholder
					})
					
					return 
				}
				
				//当前搜索 内容
				if(this.keyword){
					this.placeholder = this.keyword;
					this.placeholderState = 1;
					
					this.arr.push(this.keyword);
				}
				
				//和已存在搜索内容组合并去除重复项
				if(this.latelyKeyword){
					this.arr = this.unique(this.arr.concat(this.latelyKeyword))
				}
				
				if(this.arr.length > 0){
					//存本地缓存
					uni.setStorage({
						key:'LatelyKeyword',
						data:this.arr,
						success: (res) => {
							uni.navigateTo({
								url:'/pages/goodslist/goodslist?keywords='+this.keyword
							})
						}
					})
				}
			},
			colse(){
				this.placeholder = '输入搜索关键词';
				this.placeholderState = 0;
				
				//删除本地缓存
				uni.removeStorage({
					key:'LatelyKeyword',
					success: (res) => {
						this.latelyKeyword = []
					}
				})
			},
			shopConfig(){
				uni.request({
					url:this.websiteUrl + '/api/v4/shop/config',
					method:'GET',
					data:{},
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token'),
						'X-Client-Hash':uni.getStorageSync('client_hash')
					},
					success: ({data:{data}}) => {
						if(data.search_keywords){
							this.search_keywords = data.search_keywords.split(',')
						}
					}
				});
			},
			unique(arr){
				//去除重复项
				var result = [], hash = {};
				for (var i = 0, elem; (elem = arr[i]) != null; i++) {
					if (!hash[elem]) {
						result.push(elem);
						hash[elem] = true;
					}
				}
				return result;
			}
		},
		onLoad(e) {
			this.shopConfig();
			
			// #ifdef APP-PLUS
			this.titleNView = true
			// #endif
		},
		onShow(e){
			//读取本地缓存
			uni.getStorage({
				key:'LatelyKeyword',
				success: (res) => {
					this.latelyKeyword = res.data
					this.placeholder = res.data[0]
					this.placeholderState = 1
				}
			});
		},
		onHide(e){
			// #ifdef APP-PLUS
			plus.key.hideSoftKeybord()
			// #endif
		}
	}
</script>

<style>
	/*header*/
	.header .uni-navbar { border-bottom: solid 1px #e6e6e6; }
	.header .uni-navbar-header{ height: 50px;}
	.header .uni-navbar-container{ margin-left: 20upx; width: auto; flex: 1;}
	.header .uni-navbar-container .input-view{ background-color: #FFFFFF; border:1px solid #e6e6e6; margin: 9px 0; line-height: 30px;}
	.header .uni-navbar-header .uni-navbar-header-btns:last-child{ width: 120upx; position: relative;}
	.header .uni-navbar-header .uni-navbar-header-btns button{position: absolute; top: 9px;}
	
	/*search*/
	.ms-search-wraper{ position: relative; padding: 0 20upx;}
	.recent-search,.hot-search{ padding-top: 30upx;}
	.ms-search-head{ display: flex; flex-direction: row; justify-content: space-between; align-items: center; padding-bottom: 20upx; font-size: 30upx;}
	.ms-search-head .colse{ font-size: 25upx; color: #f92028;}
	.ms-search-tags text{ padding: 5upx 25upx; display: inline-block; background: #f0f2f5; border-radius: 8upx; font-size: 25upx; max-width: 200upx; margin:0 15upx 15upx 0;}
</style>
