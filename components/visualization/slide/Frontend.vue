<template>
    <view class="page-section">
    	<view class="page-section-spacing" v-if="!bSeparateShow">
    		<swiper class="swiper" :indicator-dots="indicatorDots" :autoplay="autoplay" :interval="interval" :duration="duration" :style="{height:imgheights + 'px'}">
    			<swiper-item v-for="(item,index) in module.list" :key="index">
    				<view class="swiper-item" @click="$outerHref(
						item.appPage ? item.appPage : item.url,
						item.appPage ? 'app' : 'undefined'
						)">
    					<view class="desc" v-if="item.desc != ''">{{ item.desc }}</view>
    					<image :src="item.img" mode="widthFix" @load="imageLoad" class="image"></image>
    				</view>
    			</swiper-item>
    		</swiper>
    	</view>
		<view v-else class="separat-show" :class="{mini: bMiniList}">
			<view v-for="item in module.list" :key="item.id" class="item" @click="$outerHref(
						item.appPage ? item.appPage : item.url,
						item.appPage ? 'app' : 'undefined'
						)">
				<view class="desc" v-if="item.desc != ''">{{ item.desc }}</view>
				<image :src="item.img || item.goods_img" mode="widthFix" class="img"></image>
			</view>
		</view>
    </view>
</template>

<script>
export default{
	props:['module', 'preview', 'modulesIndex'],
	data(){
		return {
			autoplay: true,
			interval: 5000,
			duration: 500,
			imgheights:'',
			current:0
		}
	},
	computed:{
		bSeparateShow() {
            return '1' == this.module.isStyleSel ? true : false
        },
        bMiniList() {
            return '1' == this.module.isSizeSel ? true : false
        },
		indicatorDots(){
			return this.module.list.length > 1 ? true : false
		}
	},
	methods:{
		imageLoad(e){
			let imgwidth = e.detail.width,
				imgheight = e.detail.height,
				//设备宽度
				windowWidth = uni.getSystemInfoSync().windowWidth;
			
			this.imgheights = (windowWidth/imgwidth) * imgheight
		}
	},
	watch:{
		bSeparateShow(){
			console.log(this.bSeparateShow)
		}
	}
}
</script>

<style>
.page-section{ overflow: hidden;}
.page-section .swiper-item{ position: relative; line-height: 0; font-size: 0;}
.page-section .swiper-item .image{ width: 100%; }
.page-section .swiper-item .desc{box-sizing: border-box; position: absolute; left: 10upx; right: 10upx; bottom: 0; background: rgba(0, 0, 0, .5); color: #FFFFFF;}
.separat-show{ display: flex; flex-direction: column;}
.separat-show .item{ width: 100%; position: relative; line-height: 0; font-size: 0;}
.separat-show .desc{ box-sizing: border-box; position: absolute; left: 10upx; right: 10upx; bottom: 0; background: rgba(0, 0, 0, .5); color: #FFFFFF; }
.separat-show.mini{ display: block;}
.separat-show.mini .item{ width: 50%; float: left;}
</style>
