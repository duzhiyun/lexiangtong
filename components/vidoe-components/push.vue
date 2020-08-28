<template>
	<view style="flex: 1;">
		<uni-list @change="onchange" :num="playerList.length">
			<cell :recycle="false" v-for="(item, index) in playerList" :key="index" :data-index="index" :style="{'height': screenHeight + 'px'}">
				<uni-video :src="item.url" :playStatus="playStatus" :screenHeight="screenHeight" v-if="playerCur === index" @play="onplay"></uni-video>
				<image :lazy-load="true" :fade-show="false" v-if="!item.isPlay" :src="item.cover" mode="" style="width: 750rpx; filter: blur(10px);"
				 :style="{height: screenHeight+ 'px'}"></image>
				<!--<image :lazy-load="true" :fade-show="false" v-if="!item.isPlay" :src="item.cover" mode="" style="width: 750rpx;position:absolute;left: 0;right: 0;top: 0;bottom: 0; filter: blur(10px);" :style="{height: screenHeight+ 'px'}"></image>-->
				<view class="" style="position: absolute;bottom: 130rpx;left: 0;right: 0;padding-left: 20rpx;padding-right: 20rpx; flex-direction: row;justify-content: space-between;align-items: center;">
					<view class="">
						<text style="color: #FFFFFF;font-size: 32rpx;font-weight: 600;padding: 10rpx;">{{item.nickname}}</text>
						<text style="color: #FFFFFF;font-size: 28rpx;padding: 10rpx;lines: 1;width: 600rpx;text-overflow: ellipsis;">{{item.title}}</text>
						<view class="" style="flex-direction: row;align-items: center;">
							<text class="iconfont" style="color:#FFFFFF;font-size: 30rpx;">&#xe605;</text>
							<text style="color: #FFFFFF;font-size: 28rpx;padding: 10rpx;width:400rpx;">{{item.nickname}}的原声创作</text>
						</view>
					</view>
					<view class="" style="flex-direction: row;">
						<image src="/static/logo.png" mode="" style="width: 90rpx;height: 90rpx;border-radius: 100rpx;"></image>
					</view>
				</view>
				<view class="" style="position: absolute;top: 0;bottom: 0; right: 0;align-items: center;justify-content: center;padding-right: 20rpx;">
					<view class="" style="border-radius: 100rpx;border-color: #FFFFFF;border-width: 3rpx;">
						<image src="/static/logo.png" mode="" style="width: 90rpx;height: 90rpx;border-radius: 100rpx;"></image>
					</view>
					<view class="" style="flex-direction: column;align-items: center;margin-top: 40rpx;">
						<text class="iconfont" style="font-size: 66rpx;color: #FFFFFF;">&#xe608;</text>
						<text style="font-size:24rpx;font-weight: 500;text-align: center;color: #FFFFFF;">7036</text>
					</view>
					<view class="" style="flex-direction: column;align-items: center;margin-top: 40rpx;">
						<text class="iconfont" style="font-size: 66rpx;color: #FFFFFF;">&#xe606;</text>
						<text style="font-size:24rpx;font-weight: 500;text-align: center;color: #FFFFFF;">4566</text>
					</view>
					<view class="" style="flex-direction: column;align-items: center;margin-top: 40rpx;">
						<text class="iconfont" style="font-size: 66rpx;color: #FFFFFF;">&#xe600;</text>
						<text style="font-size:24rpx;font-weight: 500;text-align: center;color: #FFFFFF;">分享</text>
					</view>
				</view>
			</cell>
		</uni-list>
	</view>
</template>

<script>
	var list = [{
		nickname: "@岳老板",
		title: "生活需要有仪式感",
		url: 'http://alimov2.a.yximgs.com/upic/2020/05/01/17/BMjAyMDA1MDExNzQzMzlfNzQyNjgwNV8yNzc1MzI4ODE5NV8xXzM=_b_Ba6505d9e7300f19dbd8a53b985c002c8.mp4',
		cover: 'http://ali2.a.yximgs.com/upic/2020/05/01/17/BMjAyMDA1MDExNzQzMzlfNzQyNjgwNV8yNzc1MzI4ODE5NV8xXzM=_low_Bbbc7e17bc0c665e5a7b1683dd62544bd.webp?tag=1-1591411861-sp-0-bvoa098wty-284a28dd4356fb26&type=hot&di=784f591e&bp=12621',
		isPlay: false
	}, {
		nickname: "@火隐忍者",
		title: "鼬先生说我是一个无药可救的人",
		url: 'http://183.240.22.110/upic/2019/04/14/14/BMjAxOTA0MTQxNDI5MzBfMTI2MTE0NzEzNF8xMjE5ODAxOTU4N18yXzM=_b_B77567b6ac999fd8a7df8b614611caf60.mp4',
		cover: 'http://ali2.a.yximgs.com/upic/2019/04/14/14/BMjAxOTA0MTQxNDI5MzBfMTI2MTE0NzEzNF8xMjE5ODAxOTU4N18yXzM=_low_Bc6c7281a739323796ce3ac4e4517a2bb.webp?tag=1-1591411904-sp-0-yji5x9y0xw-4f306cfcca46db82&type=hot&di=784f591e&bp=12621',
		isPlay: false,
	}, {
		nickname: "@攀娘",
		title: "祝我的粉丝 活的开心 活的快乐🎊",
		url: 'http://alimov2.a.yximgs.com/upic/2020/06/05/20/BMjAyMDA2MDUyMDE5MDZfMzE1Mjk3MzdfMjk5MzQ2NzY1MTJfMV8z_b_Bd7df3ae3985aab7279ae7afd5b806e03.mp4',
		cover: 'http://ali2.a.yximgs.com/upic/2020/06/05/20/BMjAyMDA2MDUyMDE5MDZfMzE1Mjk3MzdfMjk5MzQ2NzY1MTJfMV8z_low_B0f994e8a6a4de448c85065f431a831d2.webp?tag=1-1591412362-sp-0-5onmtzgkuz-70528c5be2e4ef25&type=hot&di=784f591e&bp=12621',
		isPlay: false,
	}, {
		nickname: "@瑞琪组合",
		title: "选来选去这首歌最合适放学的她😂😂😂#搞笑我是认真的",
		url: 'http://183.240.22.86/upic/2020/05/26/11/BMjAyMDA1MjYxMTI0MDlfNTQzMzU2MTQ2XzI5MjkyODc0MTI0XzFfMw==_b_B3c45621e8bb098f7a30267a7efa185b7.mp4',
		cover: 'http://ali2.a.yximgs.com/upic/2020/05/26/11/BMjAyMDA1MjYxMTI0MDlfNTQzMzU2MTQ2XzI5MjkyODc0MTI0XzFfMw==_low_Bd8db21455dd18e8734304d6a44794166.webp?tag=1-1591412468-sp-0-pharttgdia-194b703e2f74eb76&type=hot&di=784f591e&bp=12621',
		isPlay: false,
	}];
	import uniList from './list';
	import uniVideo from './video';
	export default {
		components: {
			uniList,
			uniVideo
		},
		props: {
			screenHeight: {
				default: 0
			},
			playStatus: {
				default: false
			}
		},
		data() {
			return {
				playerCur: 0,
				playerList: list
			}
		},
		created() {

		},
		methods: {
			onplay: function(time) {
				if (time > 0) {
					this.playerList[this.playerCur].isPlay = true;
				}
			},
			onchange: function(index) {
				console.log(index);
				if (index != this.playerCur) {
					this.playerList[this.playerCur].isPlay = false;
					this.playerCur = index;
				}
			}
		}
	}
</script>

<style>

</style>
