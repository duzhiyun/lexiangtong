<template>
    <view class="search" :class="[titleNView ? 'search-home' : 'search-not-home']">
		<uni-nav-bar :color="nFontColor" :backgroundColor="nBackgroundColor" shadow="false" statusBar="false" :insertStatusBar="insertStatusBar" :fixed="fixed" :titleNView="titleNView" :leftState="leftState" right-icon="chat" left-icon="scan" @click-right="message" @click-left="scanClick">
			<view class="input-view">
				<uni-icon type="search" size="22" :color="tFontColor"></uni-icon>
				<input confirm-type="search" class="input" type="text" disabled="true" @click="searchFocus" :placeholder="searchValue" />
			</view> 
			<view class="mask"></view>
		</uni-nav-bar>
	</view>
</template>

<script>
import uniNavBar from '@/components/uni-nav-bar.vue'
import uniIcon from '@/components/uni-icon.vue'
import universal from '@/common/mixins/universal.js';

export default{
	props:["module", "preview",'shopId'],
	mixins: [universal],
	data(){
		return {
			leftState:false,
			nFontColor:'#FFFFFF',
			nBackgroundColor:'inherit',
			tFontColor:'#666666',
			insertStatusBar: false,
			fixed:true,
			titleNView:false
		}
	},
	components:{
		uniNavBar,
		uniIcon
	},
	created(){
		// #ifdef APP-PLUS
		if(this.shopId == 0){
			this.leftState = true;
			this.nBackgroundColor = "#FFFFFF";
			this.nFontColor = "#333333";
			this.insertStatusBar = true;
			this.titleNView = true;
		}
		// #endif
	},
	computed:{
		searchValue() {
			if(this.shopId == 0){
				return this.getText({
					dataNext: "allValue",
					attrName: "searchValue",
					defaultValue: '输入搜索关键词'
				})
			}else{
				return '输入搜索关键词'
			}
		},
	},
	methods:{
		message(){
			if(this.$isLogin()){
				uni.navigateTo({
					url:'/pagesB/message/message'
				})
			}else{
				uni.showModal({
					content: "您需要登录会员!",
					success:(res)=>{
						if(res.confirm){
							uni.navigateTo({
								url:'/pages/login/login?delta=1'
							})
						}
					}
				})
			}
		},
		searchFocus(){
			uni.reLaunch({
				url: '/pages/search/search'
			});
		},
		scanClick(){
			uni.scanCode({
				success:(res)=>{
					if(this.$isLogin()){
						let result = JSON.parse(res.result);
						let sid = result.sid;
						let url = result.url;
						let timestamp = Date.parse(new Date()) / 1000;
						uni.request({
							url:this.websiteUrl + '/api/v4/appqrcode/scancode',
							method: 'POST',
							header: {
								'Content-Type': 'application/json',
								'token': uni.getStorageSync('token'),
								'X-Client-Hash':uni.getStorageSync('client_hash')
							},
							data:{
								sid:sid,
								login_time:timestamp
							},
							success: (res) => {
								if(sid){
									uni.navigateTo({
										url:'/pages/scan/scan?sid='+ sid + '&url=' + url
									});
								}else{
									uni.showToast({
										title:'请扫描正确的二维码',
										icon:'none'
									})
								}
							},
							fail:(res)=>{
								console.log(res,2)
							}
						})
					}else{
						uni.navigateTo({
							url:'/pages/login/login?delta=1'
						})
					}
				}
			})
		}
	}
}
</script>

<style scoped>
.search-not-home .mask{ position: absolute;top: 0;right: 0;bottom: 0;left: 0;background: linear-gradient(180deg,rgba(0,0,0,.8) 0,transparent);z-index: -1;}
.search-not-home .input-view{ background: #FFFFFF; }

.search-home{
	height: calc(44px + var(--status-bar-height));
}
.search-home .mask{ display: none; }

@media only screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3){
	.search-home{ height: calc(30px + var(--status-bar-height));}
}

.search.active .input-view{ background: #e7e7e7; }
.search.active .mask{ display: none;}
</style>
