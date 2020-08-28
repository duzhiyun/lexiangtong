<template>
	<view class="privacy">
		<view class="title">隐私声明</view>
		<view class="content">
			<scroll-view scroll-y :style="{height:winHeight + 'px'}">
				<rich-text :nodes="articleDesc"></rich-text>
			</scroll-view>
		</view>
		<view class="btn-bar privacy-btn">
			<view class="btn btn-disabled" @click="no">不同意</view>
			<view class="btn btn-red" @click="ok">同意</view>
		</view>
		
		<uni-popup :show="show" type="middle" v-on:hidePopup="handelClose">
			<view class="icon"><icon class="iconfont icon-yanzheng"></icon></view>
			<view class="text">你需要同意《隐私政策》方可使用本软件</view>
			<view class="bottom" @click="handelClose">我知道了</view>
		</uni-popup>
	</view>
</template>

<script>
	import { mapState } from 'vuex';
	import uniPopup from '@/components/uni-popup.vue';
	
	export default {
		data() {
			return {
				winHeight: 0,
				show:false
			}
		},
		components:{
			uniPopup
		},
		onLoad(){
			this.winHeight = uni.getSystemInfoSync().windowHeight - 310/2;
			
			let configData = uni.getStorageSync('configData').privacy;
			
			this.load(configData);
		},
		computed:{
			...mapState({
				articleDetail: state => state.article.articleDetail,
			}),
			articleDesc(){
				let result = this.articleDetail.content;
				const reg = /style\s*=(['\"\s]?)[^'\"]*?\1/gi;
				const regex = new RegExp('<img', 'gi');
				const regex2 = new RegExp('<p', 'gi');
			
				if(result){
					result = result.replace(reg, '');
					result = result.replace(regex, '<img style="width: 100% !important; height:auto;vertical-align:top;"');
					result = result.replace(regex2, '<p style="margin:0;padding:0;"');
				}
				return result
			},
		},
		methods: {
			load(id){
				this.$store.dispatch('setArticleDetail',{
					id:id
				})
			},
			no(){
				this.show = true;
				uni.setStorageSync('privacy',false);
			},
			ok(){
				uni.setStorageSync('privacy',true);
				
				uni.redirectTo({
					url:"/pages/splash/splash"
				})
			},
			handelClose(){
				this.show = false;
			}
		}
	}
</script>

<style>
.privacy{ height: calc(100vh - env(safe-area-inset-top)); background: #FFFFFF; padding: 0 30upx; padding-top: env(safe-area-inset-top); overflow: hidden;}
.privacy .title{ height: 60upx; font-size: 40upx; color: #333; text-align: center; padding:30upx 0;}

/* #ifdef APP-PLUS */
.privacy .title{ padding-top: 80upx; }
/* #endif */

.privacy .content{ margin-top: 20upx; }
.privacy .privacy-btn{ position: fixed; bottom: 100upx; left: 20upx; right: 20upx; padding-bottom: env(safe-area-inset-bottom);}
.privacy .privacy-btn .btn{ margin: 0 20upx; height:70upx; line-height:70upx; font-size:25upx; }

.privacy .uni-popup-middle{ height:auto; padding:0; text-align: center;}
.privacy .uni-popup-middle .icon{ font-size:80upx; color:#f92028; height: 80upx; line-height: 80upx;}
.privacy .uni-popup-middle .text{ padding:10upx 30upx 30upx; font-size: 25upx; text-align: center; color: #666666;}
.privacy .uni-popup-middle .bottom{ background:#f6f6f9; color:#f92028; width: 100%; text-align: center; font-size: 25upx; padding: 10upx 0; border-radius: 0 0 10upx 10upx;}
</style>
