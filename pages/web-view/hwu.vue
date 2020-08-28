
<template>
	
    <view>
		<view class="top"></view>
		<web-view :webview-styles="webviewStyles" :src='link'></web-view>		
		<tabbar :curpage="curpage"></tabbar>
    </view>
</template>

<script>
	import tabbar from "@/components/tabbar/taskfooter.vue";
    export default {
		components: {	
			tabbar
		},
        data() {
            return {
                webviewStyles: {
                    progress: {
                        color: '#FF3333'
                    }
                } ,
				link:''
            }
        },
        onLoad(data) {
            this.link = data.url
        },
        methods: {
			
			 
        }
		
    }
</script>
<style>
	.secul{whdth:690upx;height:80upx;display: flex;justify-content: space-between;
	       text-align: center;margin-bottom:10rpx;border:1px solid #FFFfFF}
	.secli{width:50%;height:80rpx;background:#000000;
	       border:1rpx solid #000000;line-height:80rpx;
		   color:#FFFFFF;
		   }
		   
	.tab-active{background-color:#ffffff;color:#000000}
	
	.nons{display:none}
	
	.taba{display:block}
	.duicon24{height:44upx;width:44upx}
	.uni-input{height:80upx}
	.top{width:100%;height:45rpx;background:#000000;display: flex;justify-content: space-between;
	       text-align: center;}
	
</style>