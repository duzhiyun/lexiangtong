<template>
	<view class="content">
			<view class="lvru">
				<view class="list-ul ">
					<view class="list-name"> 资金类型：</view>					
					<view  class="list-inp">
						<picker @change="bindPickerChanget" :value="tindex" :range="type">
							<view style="padding-top:2%;">{{type[tindex]}}</view>
						</picker>
					</view>				
				</view>
				<view class="list-ul">
					<view class="list-name"> 任务标题：</view>
					<view class="list-inp"> 
					   <input type="text"  class="inp-100" name="title" v-model="title"  placeholder=" 请输入任务标题"/>	
				    </view>					
				</view>
				<view class="list-ul ">
					<view class="list-name"> 任务分类：</view>					
					<view  class="list-inp">
						<picker @change="bindPickerChange" :value="cindex" :range="cate">
							<view style="padding-top:2%;">{{cate[cindex]}}</view>
						</picker>
					</view>				
				</view>
				<view class="list-ul">
					<view class="list-name"> 任务等级：</view>
					<view  class="list-inp">
						<picker @change="bindPickerChanges" :value="index" :range="array">
							<view style="padding-top:2%;">{{array[index]}}</view>
						</picker>
					</view>				
				</view>
				<view class="list-ul">
					<view class="list-name"> 完成方式：</view>
					<view  class="list-inp">
						<picker @change="bindPickerChangess" :value="iindex" :range="info">
							<view style="padding-top:2%;">{{info[iindex]}}</view>
						</picker>
					</view>				
				</view>
				<view class="list-ul ">
					<view class="list-name"> 审核类型：</view>					
					<view  class="list-inp">
						<picker @change="bindPickerChangea" :value="aindex" :range="automatic">
							<view style="padding-top:2%;">{{automatic[aindex]}}</view>
						</picker>
					</view>				
				</view>
				<view class="list-ul">
					<view class="list-name"> 任务佣金：</view>
					<view class="list-inp"> 
						<view  class="inp-100 redcolor" >
							<input type="number"  class="inp-100" name="price" v-model="price"  placeholder=" 请输入任务佣金"/>	
						</view>
					</view>					
				</view>
				<view class="list-ul">
					<view class="list-name"> 任务个数：</view>
					<view class="list-inp"> 
						<view  class="inp-100 redcolor" >
							<input type="number"  class="inp-100" name="count" v-model="count"  placeholder=" 请输入任务个数"/>	
						</view>
					</view>					
				</view>
				<view class="list-ul">
					<view class="list-name"> 资源点数：</view>
					<view class="list-inp"> 
						<view  class="inp-100 redcolor" >
							<input type="number"  class="inp-100" name="resource" v-model="resource"  placeholder=" 请输入资源点数"/>	
						</view>
					</view>					
				</view>
				<view class="list-ul">
					<view class="list-name"> 链接类型：</view>
					<view class="list-inp">
						<picker @change="bindPickerChangel" :value="lindex" :range="linktype">
							<view style="padding-top:2%;">{{linktype[lindex]}}</view>
						</picker>	
				    </view>					
				</view>
				<view class="list-ul">
					<view class="list-name"> 链接内容：</view>
					<view class="list-inp">
						<input type="text"  class="inp-100" name="link" v-model="link"  placeholder=" 请输入任务链接内容(带上http的完整链接)"/>	
				    </view>					
				</view>
				<view class="list-ul">
					<view class="list-name"> 过期时间：</view>
					<view class="list-inp">						
						<view  class="list-inp">
							<picker @change="timeChange" mode="date" :value="end_date">
								<view style="padding-top:2%;">{{end_date}}</view>
							</picker>
						</view>
					</view>					
				</view>
				<view class="list-ul">
					<view class="list-name"> 详细介绍：</view>
					<view class="list-inp" style="margin-top: 1%;">						
						<textarea v-model="detail"></textarea>
					</view>					
				</view>
				<view class="list-ul">
					<view class="list-name"> 多图说明：</view> 
					<view class="list-inp" @click="chooseImage('front_of_id_card')">						
						<image class="pzimg" :src="image[0]"></image>
						<image class="pzimg" :src="image[1]"></image>
						<image class="pzimg" :src="image[2]"></image>
					</view>				
				</view>
				<view class="list-ul" v-if="showb">
					<view class="list-name"> 可上传9张：</view>
					<view class="list-inp" @click="chooseImage('front_of_id_card')">						
						<image class="pzimg" :src="image[3]"></image>
						<image class="pzimg" :src="image[4]"></image>
						<image class="pzimg" :src="image[5]"></image>
					</view>				
				</view>
				<view class="list-ul" v-if="showc">
					<view class="list-name"> 不大于2M：</view>
					<view class="list-inp" @click="chooseImage('front_of_id_card')">						
						<image class="pzimg" :src="image[6]"></image>
						<image class="pzimg" :src="image[7]"></image>
						<image class="pzimg" :src="image[8]"></image>
					</view>				
				</view>
				<view class="loadin-go">
					<button  class="loading-btn liti uni-button"  @click="publish()">确认发布</button>
				</view>
			
			</view>	
	</view>
</template>

<script>
	import * as localConfig from '@/config/local/config';
	import { mapState } from 'vuex'
	import uniIcon from "@/components/uni-icon.vue";
	import universal from '@/common/mixins/universal.js';
	import isLogin from '@/common/mixins/isLogin.js'
	import { pathToBase64, base64ToPath } from '@/common/image-tools/index.js'
	const webUrl = localConfig.websiteUrl
    export default {
		data() {
			return {
				zt01:'1',
				fb_money:'1',
				fb_app:'snssdk1128',
				title:'',
				price:0.5,
				array:['所有会员','VIP会员','白银VIP','黄金VIP','铂金VIP','钻石VIP'],
				cate:['请选择任务类别'],
				info:['请选择完成方式','点赞','转发','点赞/关注/评论','CPA注册/推广','阅读/游戏 ','体验/试用/营销','购物类任务','线下/技能类任务'],
				iprice:['0','0.5','1','1','1','1','5','4','50'],
				linktype:['请选择链接类型','抖音','快手','微视','淘宝','网站','内页'],
				automatic:['人工审核','自动审核'],
				type:['乐券','悬赏币'],
				lindex:0,
				aindex:0,
				iindex:0,
				index:0,
				cindex:0,
				tindex:0,
				resource:1,
				count:5,
				link:'',
				detail:'',
				end_date:'请选择过期时间',
				image:['../../static/hxsimg/errorImage.jpg'],
				showb:false,
				showc:false 
			}
		},
		methods: {
			bindPickerChangea: function(e) {
				this.aindex = e.target.value
			},
			bindPickerChange: function(e) {
				this.cindex = e.target.value
			},
			bindPickerChanges: function(e) {
				this.index = e.target.value
			},
			bindPickerChangess: function(e) {
				this.iindex = e.target.value
			},
			bindPickerChangel: function(e) {
				this.lindex = e.target.value
			},
			bindPickerChanget: function(e) {
				this.tindex = e.target.value
			},
			timeChange: function(e) {
				this.end_date = e.target.value
			},
			tasklist:function(){
				uni.request({
					url: webUrl + '/api/v4/task/info', 
					data: {page:1,size:1,level:-1,cid:-1},
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token')
					},
					success: (res) => {
						if(res.data.status == 'success'){
							let len = res.data.data.cate.length;
							for(let i=0;i<len;i++){
								this.cate.push(res.data.data.cate[i].name)
							}
						}
					}
				});
			},
			chooseImage: function(val) {
				uni.chooseImage({
					count:9,
					sizeType: ['original', 'compressed'],
					sourceType: ['album', 'camera'],
					success:(res)=>{
						let len = res.tempFilePaths.length
						if(len>0){
							this.image = []
						}
						if(len != 9){
							this.image.push('../../static/hxsimg/errorImage.jpg')
						}
						for(let i=0;i<len;i++){
							if(i == 2){
								this.showb = true
							}
							else if(i == 5){
								this.showc = true
							}
							pathToBase64(res.tempFilePaths[i]).then(base64 => {
								this.$store.dispatch('setMaterial',{
									file:{
										content:base64
									},
									type:val
								}).then(data=>{
									if(data.status == 'success'){
										this.image.push(data.data[0])
									}
								})
							}).catch(error => {
								console.error(error,5);
							});
						}
					}
				})
			},
			publish:function(){
				if(this.title == ''){
					uni.showToast({
						title:'任务标题不能为空',
						icon:'none'
					})
					return false;
				}
				if(this.cindex == 0){
					uni.showToast({
						title:'请选择任务类别',
						icon:'none'
					})
					return false;
				}
				if(this.iindex == 0){
					uni.showToast({
						title:'请选择完成方式',
						icon:'none'
					})
					return false;
				}
				if(Number(this.price)<this.iprice[this.iindex]){
					uni.showToast({
						title:'最低佣金不能低于'+this.iprice[this.iindex]+'元',
						icon:'none'
					})
					return false;
				}
				if(Number(this.count)<1){
					uni.showToast({
						title:'任务个数不能低于1个',
						icon:'none'
					})
					return false;
				}
				if(Number(this.resource)<0){
					uni.showToast({
						title:'资源点数不能低于0',
						icon:'none'
					})
					return false;
				}
				if(this.lindex == 0){
					uni.showToast({
						title:'请选择链接类型',
						icon:'none'
					})
					return false;
				}
				if(this.link == ''){
					uni.showToast({
						title:'链接内容不能为空',
						icon:'none'
					})
					return false;
				}
				if(this.end_date == '请选择过期时间'){
					uni.showToast({
						title:'请选择过期时间',
						icon:'none'
					})
					return false;
				}
				if(this.detail == ''){
					uni.showToast({
						title:'详细介绍不能为空',
						icon:'none'
					})
					return false;
				}
				if(this.detail.length < 10){
					uni.showToast({
						title:'详细介绍不能少于10个字符',
						icon:'none'
					})
					return false;
				}
				if(this.image[0] == '../../static/hxsimg/errorImage.jpg' && this.image.length==1){
					uni.showToast({
						title:'至少要上传一张图片说明',
						icon:'none'
					})
					return false;
				}
				let o = {
					title:this.title,
					cate:this.cindex,
					level:this.index,
					automatic:this.aindex,
					way:this.iindex,
					price:this.price,
					count:this.count,
					resource:this.resource,
					linktype:this.lindex,
					link:this.link,
					end_date:this.end_date+' 23:59:59',
					detail:this.detail,
					image:this.image,
					type:this.tindex
				}
				uni.request({
					url: webUrl + '/api/v4/task/send',  
					data: o,
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token')
					},
					success: (res) => {
						if(res.data.status == 'success'){
							uni.showToast({
								title: '发布成功',
								duration: 2000,
								success(){
									uni.reLaunch({
										url:'/pages/user/user'
									})
								}
							});
						}else{
							uni.showToast({
								title: res.data.errors.message,
								icon: "none",
								success(){
									if(res.data.errors.code == 250){
										setTimeout(function (){
											uni.navigateTo({
												url:'/pagesB/account/deposit/recharge'
											})
										},2000)
									}
								}
							});
						}
					},error:(res)=>{
						console.log(JSON.stringify(res))
					}
				});
			}
		},
		onLoad(e){
			this.tasklist()
		}
	}
</script>

<style lang="scss">
	
body,page{
		background-color:#ebebeb;	
		background-repeat: no-repeat;	
		justify-content:center;
	}
	.pzimg{width:33%;height:150rpx;margin:0 auto}
	.content{width:690rpx;margin:0 auto;overflow:hidden}
	.banners{width:690rpx;height:100rpx;text-align:center;font-size:30rpx; 
		  margin:20rpx auto}
	.bin_two{text-align:center;font-size:30rpx;line-height:100rpx;height:100rpx;color:#ffffff;border-radius: 10rpx;overflow: hidden;}
	.zt01{background-color:#d81e07;}
	.zt02{background-color:#1f0199;}
	.zt03{background-color:#5e5e5e;}
	.lvru{width:690rpx;height:auto;background-color:#ffffff;
	      border-radius: 10rpx;overflow: hidden;padding:40rpx 0;
		  margin:20rpx auto}
	.list-ul{ width:650rpx;
	         height:auto;
			 display: -webkit-flex; /* Safari */
			 -webkit-justify-content: space-around; /* Safari 6.1+ */
			 display: flex;
			 justify-content: flex-start;
			 padding:5rpx 20rpx;
			 margin:0 auto;
			 background-color:#ffffff;	
			 border-bottom:1rpx solid #f5f5f5;
	
	}
	.list-inp{width:75%;     
			line-height:70rpx;
			text-align:center;
			color:#000000;
			font-size:24rpx;
			text-align:left;
	}

	
	.list-name{
		width:25%;
		margin-left:1rpx;
		line-height:70rpx;
		text-align:left;
		color:#000000;
		font-size:24rpx;
		text-align:left;
	}
    .inp-100{line-height:70upx;color:#000000;font-size:24rpx;min-width: 70rpx;padding-top:1%;}
	
	.textcolor{color:#d81e07;margin-left:20rpx;}
    .gourl,.videourl{width:40%;height:50rpx;margin:20rpx 5%;background-color:#F0AD4E;font-size:24rpx;border-radius: 10rpx;line-height:50rpx;text-align:center;color:#ffffff}
	.gourl{background-color:#f08a76}
	
	.disnone{display:none}	
	
	.loadin-go{
		width:80%;
		height:70rpx;
		margin:0 auto;
		margin-top:30upx;
	}
	.loading-btn{width:100%; background-color:#1385ff;border-radius:50upx;color:#FFFFFF}
	.uni-button{height:70rpx;line-height:70rpx;font-size:28rpx}
	.redcolor{color:#d81e07}
	.imgcss{width:100rpx;height:100rpx;margin:10rpx}
	.autoheight{height:auto !important}	
	.fy{display: block}
	.fy image{max-width:400rpx}
	.liti{border:3rpx solid rgba(226, 226, 226, 0.55);box-shadow: -3rpx -3rpx 15rpx 1rpx rgba(232, 232, 232, 127), 3rpx 3rpx 15rpx 1rpx rgba(223, 223, 223, 127)}
.ulimoney{     min-width:200rpx; width:auto;
              text-align:left;color:#d81e07;
			  background-image:url(../../static/weike/ulimoney.png);
			  background-size: 40rpx 40rpx;
			  background-repeat: no-repeat;
			  background-position: 100% 50%;
			  padding-right: 35px;
			  line-height:70upx;
    }
			  
</style>
