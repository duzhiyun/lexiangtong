<template>
	<view>
		<view class="allwidth">
			<view class="real-tit">
				<view><text class="fz72">请认证您的身份</text></view>
				<view><text class="fz24">为了防范您的身份信息被冒用，保证资金安全</text></view>
				<view><text class="fz24">需要进行人脸识别以确保为本人操作</text></view>
			</view>
			<view >
				<image src="../../static/weike/erwma.png" class="erweima"></image>
			</view>			
		</view>
		<view class="real-button"> 
		    <view class="getreal">
				<text class="gettext">
					支付2元进行认证
			    </text>
			</view>
		</view>
		<view class="real-desc desc">			
			<view><text class="cloblack">1、认证需要2元，失败3次后请重新支付认证</text></view>
			<view><text class="cloblack">2、请在光线充足的环境下进行,确保认证通过</text></view>
		    <view><text class="cloblack">3、跟随APP认证流程提示完成所需要认证动作</text></view>
		    <view><text class="cloblack">4、本次认证对接公安系统数据库进行核对完成</text></view>
		   </view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			
		}
	}
</script>

<style>

.allwidth{width:100%;height:auto;background-color:#d81e07;text-align:center;}
.real-tit{text-align:center;font-size:40rpx;height:300rpx;
          flex-direction:column;}
.erweima{text-align:center;margin:0 auto}
.fz24{font-size:28rpx;color:#e8e8e8;white-space: pre-wrap;}
.fz72{font-size:78rpx;color:#e3e3e3;white-space: pre-wrap;}
.cloblack{color:#000000;font-size:28rpx;font-weight:bold;line-height:60rpx}


.real-button{margin:60rpx}
.getreal{width:70%;height:80rpx;border-radius: 40rpx;background-color:#d81e07;margin:0 auto;color:#ffffff;text-align:center}
.gettext{line-height:80rpx;color:#ffffff}
.real-desc{text-align:center;height:300rpx;
           flex-direction:column;padding-top:20rpx}
.desc{width:600rpx;margin:0 auto;text-align:left}
</style>
