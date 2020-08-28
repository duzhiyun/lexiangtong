<template>
	<view >
		<view class="content1">
			<view class="list-ul" v-for="(item,index) in list" :key="index">
				<view class="list-li list-name"><text>{{item.nick_name}}</text></view>
				<view class="list-li"><text> 买入 </text><text class="textcolor">{{item.amount}}</text></view>
				<view class="buyin" @click="buyClick(item)">卖出</view>
			</view>
		</view>
	</view>
</template>

<script>
	import * as localConfig from '@/config/local/config'
	const webUrl = localConfig.websiteUrl
	export default {
		data() {
			return {
				page:1,
				size:15,
				type:1,
				list:[]
			};
		},
		methods:{
			buylist(size = 0){
				if(size){
					this.size = size
				}
				uni.request({
					method:'GET',
					url: webUrl + '/api/v4/order/tradelist', 
					data: {page:this.page,size:this.size,type:this.type},
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token')
					},
					success: (res) => {
						if(res.data.status == 'success'){
							if(size){
								let len = res.data.data.length;
								for(let i=0;i<len;i++){
									this.list.push(res.data.data[i])
								}
							}else{
								this.list = res.data.data
							}
							this.page = this.page + 1;
						}else{
							uni.showToast({ title: res.data.errors.message, icon: "none" });
						}
					},error:(res)=>{
						console.log(JSON.stringify(res))
					}
				});	
			},
			buyClick(item){
				uni.navigateTo({
					url:'/pagesC/jiaoyi/buyinfo/buyinfo?id='+item.id,					
				 })
			}
		},
		
		computed:{
			
		},
		onShow(){
			this.page = 1
			this.buylist()
		},
		onLoad(){
			this.page = 1
			this.buylist()
		},
		onReachBottom(){
			if(this.page != 1){
				this.buylist(15)
			}
		}
		
	}
</script>

<style lang="scss">
	
	body,page{
			background-color:#d9d9d9;	
			background-repeat: no-repeat;	
			justify-content:center;
		}

	.list-ul{ width:750rpx;
			 height:auto;
			 display: -webkit-flex; /* Safari */
			 -webkit-justify-content: space-around; /* Safari 6.1+ */
			 display: flex;
			 justify-content: space-between;
			 padding:0 20rpx;
			 margin:2rpx auto;
			 background-color:#ffffff;		
	}
	.list-li{width:50%;
			height:100rpx;        
			line-height:100rpx;
			text-align:center;
			color:#000000;
			font-size:26rpx;
			margin-bottom:1rpx;
			text-align:left;
	}
	.list-name{
		width:20%
	}
	.buyin{
		width:150rpx;
		height:60rpx;
		border-radius: 10rpx;
		background:#FF0000;	
		line-height:60rpx;
		margin:10rpx 0;
		color:#ffffff;
		text-align:center;
		font-size:26rpx;
	}
	.textcolor{color:#ff0000;margin-left:20rpx;}
</style>
