<template>
	<view>
		<view class="allwidth">
		
			<view >
				<image src="../../static/weike/erwma.png" class="erweima"></image>
			</view>			
		</view>
		
			
		<view class="lvru">
			<view class="list-ul">
				<view class="list-name"> 银行帐户：</view>
				<view class="list-inp"> 
					<input type="text"  class="inp-100" name="bank" v-model="bank"  placeholder=" 请输入开户支行全称"/>	
				</view>					
			</view>
			<view class="list-ul">
				<view class="list-name"> 银行卡号：</view>
				<view class="list-inp"> 
					<input type="text"  class="inp-100" name="banknumber" v-model="banknumber"  placeholder="请输入银行卡号" />	
				</view>					
			</view>
			<view class="list-ul">
				<view class="list-name"> 支付宝号：</view>
				<view class="list-inp"> 
					<input type="text"  class="inp-100" name="alipay" v-model="alipay"  placeholder="请输入支付宝账号" />	
				</view>					
			</view>
			<view class="list-ul">
				<view class="list-name"> 收款姓名：</view>
				<view class="list-inp"> 
					<input type="text"  class="inp-100" name="real_name" v-model="real_name"  placeholder="请输入收款人姓名" />	
				</view>					
			</view>
			<view class="list-ul">
				<view class="list-name"> 身份证号：</view>
				<view class="list-inp"> 
					<input type="text"  class="inp-100" name="real_id" v-model="real_id"  placeholder="请输入银行卡号" />	
				</view>					
			</view>
		</view>		    
				
		<view class="real-button">
		    <view class="getreal">
				<text class="gettext">
					开始认证
			    </text>
			</view>
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



.getreal{width:70%;height:80rpx;border-radius: 40rpx;background-color:#d81e07;margin:0 auto;color:#ffffff;text-align:center}
.gettext{line-height:80rpx;color:#ffffff}
.real-desc{text-align:center;height:300rpx;
           flex-direction:column;padding-top:20rpx}
.desc{width:600rpx;margin:0 auto;text-align:left}
.real-button{margin:60rpx}
.lvru{width:710rpx;height:auto;
	  border-radius: 20rpx;overflow: hidden;padding:20rpx;
	   margin:20rpx auto
}
.inp-100{height:70upx;line-height:70upx;color:#000000;border-bottom:1px solid #000000;font-size:24rpx}
.list-ul{ width:680rpx;
	         height:auto;
			 display: -webkit-flex; /* Safari */
			 -webkit-justify-content: space-around; /* Safari 6.1+ */
			 display: flex;
			 justify-content: flex-start;
			 padding:0 20rpx;
			 margin:0 auto;
			
			 padding-bottom:10rpx;
	
	}
	.list-inp{width:70%;
	        height:70rpx;        
			line-height:70rpx;
			text-align:center;
			color:#000000;
			font-size:24rpx;
			text-align:left;
	}
	.list-name{
		width:20%;
		margin-left:20rpx;
		height:70rpx;
		line-height:70rpx;
		text-align:center;
		color:#000000;
		font-size:24rpx;
		text-align:left;
	}   
</style>
