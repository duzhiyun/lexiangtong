<template>
    <view class="shop-menu">
		<view class="items">
			<view class="item" @click="$outerHref('/pages/shop/shopDetail/shopDetail?id='+shopId,'app')">
				<view class="info">
					<text class="iconfont icon-dianpu1"></text>
					<text>店铺详情</text>
				</view>
			</view>
			<view class="item" :class="{'active':bCategorySubmenu}" @click.stop="showCategory">
				<view class="info">
					<text class="iconfont icon-fenlei1"></text>
					<text>热门分类</text>
				</view>
				<view class="sub-menu">
					<view v-for="(item,index) in aCategory" :key="index" @click="getCatUrl(item.cat_id)" class="menu-item">
						{{item.cat_name}}
					</view>
				</view>
			</view>
			<view class="item" @click="onChat(0,shopId)">
				<view class="info">
					<text class="iconfont icon-kefu"></text>
					<text>客服</text>
				</view>
			</view>
			<view class="item item-follow" @click.stop="isFollow()">
				<view class="info">
				<text class="iconfont" :class="[bFollow ? 'icon-collection-alt' : 'icon-collection']"></text>
				<text>{{ sFollow }}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { mapState } from 'vuex'

import universal from '@/common/mixins/universal.js';

export default{
	props: ['shopId'],
	mixins:[universal],
	data(){
		return {
			bCategorySubmenu: false,
			aCategory: [],
			sKf:'',
		}
	},
	created(){
		let that = this
		
		that.$store.dispatch('setVisualStorein',{
			ru_id: that.shopId
		});
		
		uni.request({
			url: that.websiteUrl + '/api/v4/visual/storedown',
			method: 'POST',
			data: {
				ru_id:that.shopId
			},
			header: {
				'Content-Type': 'application/json',
				'X-Client-Hash':uni.getStorageSync('client_hash')
			},
			success: (res) => {
				let data = res.data.data
				const {
				  shop_category: shopCategory,
				  shop_about: shopAbout,
				  kf,
				} = data[0]
				
				that.sKf = kf
				that.aCategory = shopCategory.slice(0,9)
			},
			fail: (res) => {
				console.log('api/v4/visual/storedown request fail')
			}
		})
	},
	computed:{
		...mapState({
			shopInfo: state => state.shop.shopInfo,
		}),
		bFollow(){
			return this.shopInfo.count_gaze == 1 ? true : false
		},
		sFollow(){
			return this.shopInfo.count_gaze != 1 ? '关注' : '已关注'
		},
	},
	methods:{
		isFollow() {
			let that = this
			if(that.$isLogin()){
				that.$store.dispatch('stVisualAddcollect',{
					ru_id: that.shopId
				})
			}else{
				uni.showModal({
					content:'请登录会员',
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
		showCategory(){
			this.bCategorySubmenu = !this.bCategorySubmenu
		},
		getCatUrl(str){
			uni.navigateTo({
				url:"/pages/shop/shopGoods/shopGoods?ru_id="+this.shopId + "&cat_id=" + str
			})
		}
	}
}
</script>

<style scoped>
.shop-menu{ position: fixed; bottom: 0; width: 100%; background: #FFFFFF; border-top: 2upx solid #e3e8ee;}
.shop-menu .items{ display: flex; }
.shop-menu .items .item{ width: 25%; flex: 1;  border-right: 2upx solid #e3e8ee; position: relative;}
.shop-menu .items .item .info{ display: flex; flex-direction: column; justify-content: center; align-items: center;padding: 15upx 0 10upx;color: #333333;}

.shop-menu .items .item:last-child{ border-right: 0; }
.shop-menu .items .item .info .iconfont{ line-height: 1; color: #333333; }
.shop-menu .items .item.item-follow .info{ background: #f92028; color: #FFFFFF; flex-direction: row; height: calc(100% - 25upx);}
.shop-menu .items .item.item-follow .info .iconfont{ color: #FFFFFF; margin-right: 10upx;}

.sub-menu{ position: absolute; bottom: 0; left: 0; width: 100%; border-left: 2upx solid #e3e8ee;transform: translateY(100%);transition: all .2s;}
.sub-menu .menu-item{ width: 100%;background: #fff;border-top: 1px solid #e3e8ee; text-align: center;}
.shop-menu .items .item.active .sub-menu{ display: block; transition: all .2s; transform: translateY(0); bottom: 106upx;}
</style>
