<template>
	<view>
		<view  class="content" v-if='from_user_id <= 0'>
		  <view class="headtitle imgbg">无相关信息</view>
		</view>
		<view  class="content"  v-if='from_user_id > 0 '>
			<view class="headtitle"  v-if='bean>0'>乐豆转帐信息</view>
			<view class="headtitle"  v-if='point>0'>乐券转帐信息</view>
			<view class="headtitle"  v-if='dot>0'>任务点转帐信息</view>
			<view class="particularStatistics ">			 
				<view class="particularText">
					<view  class="title">用户昵称</view>
					<view class="particularSon1">{{nick_name}}</view>
				</view>
				<view class="particularText">
					<view class="title">转帐编号</view>
					<view class="particularSon2">{{id}}</view>
				</view>
				<view class="particularText"  v-if='bean>0'>
					<view  class="title"> 乐豆数量</view>
					<view  class="title"> ————></view>
					<view class="particularSon3">{{bean}} </view>
				</view> 
				<view class="particularText"  v-if='point>0'>
					<view  class="title"> 乐券数量</view>
					<view  class="title">———></view>
					<view class="particularSon3">{{point}}</view>
				</view>
				
				<view class="particularText"  v-if='dot>0'>
					<view  class="title"> 任务点</view>
					<view  class="title">———></view>
					<view class="particularSon3">{{dot}}</view>
				</view>
				 
				<view class="particularText">
					<view class="title">转出乐享号</view>				
					<view class="particularSon4">{{from_user_id}}</view>
				</view>
				<view class="particularText">
					<view  class="title">转入乐享号</view>				
					<view class="particularSon5">{{to_user_id}}</view>
				</view>
				<view class="particularText">
					<view  class="title">手续费</view>				
					<view class="particularSon6">{{commission}}</view>
				</view>
				<view class="particularText">
					<view  class="title">时间</view>				
					<view class="particularSon7">{{date}}</view>
				</view>
			</view>
		</view>
			
	</view>
	
</template>

<script>
	import * as localConfig from '@/config/local/config'
	const webUrl = localConfig.websiteUrl
	export default {
		onLoad(e) {
			if(e.id != undefined){
				this.id = e.id
				uni.request({
					method:'GET',
					url: webUrl + '/api/v4/user/rolldetail', 
					data: {id:this.id},
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token')
					},
					success: (res) => {
						if(res.data.status == 'success'){
							this.nick_name = res.data.data.member.nick_name
							this.bean = res.data.data.bean
							this.point = res.data.data.points
							this.dot = res.data.data.dot
							this.from_user_id = res.data.data.from_user_id
							this.to_user_id = res.data.data.to_user_id
							this.commission = res.data.data.commission
							this.date = res.data.data.date
						}else{ 							
							uni.showToast({
								title: '这条记录不是转账记录',
								icon: "none" ,
								duration: 1000
								})
								setTimeout(() => {
									uni.navigateBack();
								}, 2000);

						}
					},error:(res)=>{
						console.log(JSON.stringify(res))
					}
				});	
			}
		},
		data() {
			return {
				id:0,
				nick_name:'',
				point:0,
				bean:0,
				to_user_id:0,
				from_user_id:0,
				commission:0,
				date:''
			}
		},
		methods: {
			detail:function(){
				
			}
		}
	}
</script>
<style lang="scss">
	body,page{background:#000000;}
	.content {
		padding: 20rpx;
	}
    .headtitle{
		width:650rpx;	
		height:150rpx;
		border-radius:20rpx;
		margin:10rpx auto;
		height:150rpx;
		text-align:center;
		line-height:150rpx;
		font-size:40rpx;
		background:#000000;
		color:#ffffff;
		background-image:url(../../../static/hxsimg/ok.png);
		background-repeat:no-repeat;
		background-size:80rpx;
		background-position-x: 100rpx;
		background-position-y: 50%;
	}
	.imgbg{background-image:url(../../../static/hxsimg/nook.png);}
	.particularStatistics {
         background:#000000;
		 color:#ffffff;
		 border-radius: 20rpx;
		 width:650rpx;
		 margin:0 auto;		
		.particularText {
			height: 100rpx;
			border-bottom: 1px solid rgb(54, 54, 54);
			display: flex;
			align-items: center;
		    color: rgb(159, 159, 159);
			
			justify-content: space-between;
            .title{
				width:150rpx;
				height:100rpx;
				line-height:100rpx;
				text-align-last:justify;				
				text-align:justify;				
				text-justify:distribute-all-lines; // 这行必加，兼容baiie浏览器
				}
			.particularSon1 {
				padding-left: 60rpx;
				color: #ffffff;
				padding-right:40rpx;
			}
			.particularSon2 {
				padding-left: 56rpx;
				color: #ffffff;
				padding-right:40rpx;
			}
			.particularSon3 {
				padding-left: 60rpx;
				color: #ffffff;
				padding-right:40rpx;
			}
			.particularSon4 {
				padding-left: 32rpx;
				color: #ffffff;
				padding-right:40rpx;
			}
			.particularSon5 {
				padding-left: 32rpx;
				color: #ffffff;
				padding-right:40rpx;
			}
			
			.particularSon6 {
				padding-left: 34rpx;
				color: #ffffff;
				padding-right:40rpx;
			}
			.particularSon7 {
				padding-left: 63rpx;
				color: #ffffff;
				padding-right:40rpx;
			}
		}
	}
</style>
