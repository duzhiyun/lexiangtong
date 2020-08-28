<template>
	<view class="shop-list">
		<scroll-view class="scroll-view scroll-view-shop" scroll-x="true" scroll-left="0">
			<view class="scroll-view-item" v-for="(item,index) in storeList" :key="index" @click="$outerHref('/pages/shop/shopHome/shopHome?ru_id='+item.user_id,'app')">
				<view class="imgbox"><image :src="item.street_thumb" mode="widthFix" class="image"></image></view>
				<view class="icon"><image :src="item.logo_thumb" mode="widthFix" class="image"></image></view>
				<view class="info">
					<text class="h2">{{ item.rz_shopName }}</text>
					<view class="txt">共计<text class="num">{{item.total}}</text> 件商品</view>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
import universal from '@/common/mixins/universal.js';
export default{
	mixins:[universal],
	props: ['module', 'preview'],
	data(){
		return {
			storeList: []
		}
	},
	created() {
		uni.request({
			url: this.websiteUrl + '/api/v4/visual/store',
			method: 'POST',
			data: {
				number: this.nNumber < 1 ? 1 : this.nNumber
			},
			header: {
				'Content-Type': 'application/json',
				'X-Client-Hash':uni.getStorageSync('client_hash')
			},
			success: (res) => {
				let data = res.data.data
				
				if (data || data.length > 0) {
				    this.storeList = data
				}else{
				    this.storeList = []
				}
			},
			fail: (err) => {
				console.error(err)
			}
		})
    },
	methods: {
    },
    computed: {
        nNumber() {
            return this.module.allValue.number
        }
    }
}
</script>

<style>
.shop-list{ position: relative; margin-top: 20upx;}
.scroll-view-shop{ white-space: nowrap; width: 100%;}
.scroll-view-shop .scroll-view-item{ position:relative; display: inline-block;margin-left: 15upx; width: 402upx; height: 366upx; border-radius: 10upx; background: #ffffff; overflow: hidden;}
.scroll-view-shop .scroll-view-item .imgbox{ width: 100%; height: 200upx; overflow: hidden;}
.scroll-view-shop .scroll-view-item .imgbox .image{ width: 100%;}
.scroll-view-shop .scroll-view-item .icon{ width:100upx; height: 100upx; overflow: hidden; position: absolute; top: 150upx; left: 150upx; z-index: 10;}
.scroll-view-shop .scroll-view-item .icon .image{ width: 100%; height: 100%; border-radius: 50%; box-shadow: 0 1px 6px #ccc; }
.scroll-view-shop .scroll-view-item .info{ width: 100%; height: 166upx; position: absolute; bottom: 0; left: 0; background: #FFFFFF; z-index: 9; text-align: center; box-sizing: border-box; padding: 60upx 20upx 0; line-height: 1.5;}
.scroll-view-shop .scroll-view-item .h2{ display: block; width: 100%; text-align: center; }
.scroll-view-shop .scroll-view-item .txt{ display: block; width: 100%; text-align: center; color: #999999;}
.scroll-view-shop .scroll-view-item .num{ color: #000000; }
</style>
