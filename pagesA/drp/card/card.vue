<template>
	<view class="card">
		<view class="img-common" @longpress="downloadImg"><image :src="cardData" mode="widthFix"></image></view>
		
		<dsc-common-nav>
			<navigator url="../drp" class="nav-item" slot="right">
				<view class="iconfont icon-fenxiao"></view>
				<text>我的微店</text>
			</navigator>
		</dsc-common-nav>
	</view>
</template>

<script>
	import { mapState } from 'vuex'
	import uniIcon from "@/components/uni-icon.vue";
	
	import dscNotContent from '@/components/dsc-not-content.vue';
	import dscCommonNav from '@/components/dsc-common-nav.vue';
	
	export default {
		data() {
			return {
				cardData:''
			}
		},
		components:{
			uniIcon,
			dscNotContent,
			dscCommonNav,
		},
		onLoad() {
			this.load();
		},
		computed: {
		},
		methods: {
			load(){
				uni.request({
					url: this.websiteUrl + '/api/v4/drp/user_card',
					method: 'GET',
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token'),
						'X-Client-Hash':uni.getStorageSync('client_hash')
					},
					success: (res) => {
						let data = res.data.data;
						this.cardData = data.outImg;
					}
				})
			},
			preview(){
				uni.previewImage({
					current:1,
					urls:this.cardData,
					longPressActions:{
						itemList:['保存图片','识别图中二维码','收藏'],
						success:(res)=>{
							if(res.tapIndex == 1){
								uni.scanCode({
									scanType:['qrCode'],
									success:(res)=>{
										console.log(res)
									}
								})
							}
						}
					}
				})
			},
			downloadImg(){
				var that = this
				uni.downloadFile({
					url:that.cardData,
					success: (res) => {
						uni.saveImageToPhotosAlbum({
							filePath:res.tempFilePath,
							success:function(){
								uni.showToast({
									title: '图片保存成功',
									icon: 'none',
									duration: 2000
								})
							}
						})
					}
				})
			}
		},
	}
</script>

<style scoped>
.card{ height: 100vh; background:linear-gradient(90deg,rgba(236,36,91,1),rgba(212,0,52,1)); }
.img-common,.img-common image { width: 100%;}
</style>
