<template>
<!-- 	<view class="content">
		<image v-for="(logoSrc,i) in logoSrcs" :key="i" class="logo" :src="logoSrc"></image>
		<view>
            <input type="number" name="real_id" v-model="real_id" placeholder="请输入身份证号码"  class="inp-100"/>
			<input type="text" name="real_name" v-model="real_name" placeholder="请输入身份证姓名"  class="inp-100"/>
            <button @click="inter(1)">人脸收集</button>
			<button @click="inter(2)">人脸收集</button>
			<button @click="inter(1)">开始认证</button>
		</view>
		<view>
			默认静音(仅Android有效)
			<switch :checked="!isSound" @change="(e)=>{isSound=!e.target.value}" />
		</view>
		<view style="margin-top: 20rpx;">
			默认截取脸部区域
			<switch :checked="AutoClip" @change="(e)=>{AutoClip=e.target.value}" />
		</view>
		<view style="margin-top: 20rpx;">
			后置摄像头
			<switch :checked="backCamera" @change="(e)=>{backCamera=e.target.value}" />
		</view>
		<scroll-view scroll-y="true">
			<view class="msg" v-html="msg">
			</view>
		</scroll-view>
	</view> -->
	<view style="height: 1500rpx;">
		<view class="allwidth">
		
			<view >
				<image src="../../static/weike/face.gif" class="erweima"></image>
			</view>			
		</view>
		
			
		<view class="lvru">
			<view class="list-ul">
				<view class="list-name"> 真实姓名：</view>
				<view class="list-inp"> 
					<input type="text"  class="inp-100" name="real_name" v-model="real_name"  placeholder="请输入身份证姓名" />	
				</view>					
			</view>
			<view class="list-ul">
				<view class="list-name"> 身份证号：</view>
				<view class="list-inp"> 
					<input type="text"  class="inp-100" name="real_id" v-model="real_id"  placeholder="请输入身份证号" />	
				</view>					
			</view>
			<view class="list-ul">
				<view class="list-name">后摄像头:</view>
				<view class="list-inp">
				    <switch :checked="backCamera" @change="(e)=>{backCamera=e.target.value}" />
				</view>	
			</view>
		</view>		    
				
		<view class="real-button" @click="inter(1)">
		    <view class="getreal">
				<text class="gettext">
					开始认证
			    </text>
			</view>
		</view>
		
	</view>
</template>

<script>
	import { mapState } from 'vuex'
	import { pathToBase64, base64ToPath } from '@/common/image-tools/index.js'
	export default {
		data() {
			return {
				title: 'Hello',
				msg: '',
				logoSrcs: ['/static/logo.png'],
				logo64: [],
				isSound: true,
				AutoClip: true,
				backCamera:false,
				real_id:'',
				real_name:'',
				bank_name:'',
				bank_card:'',
				alipay:''
			}
		},
		onLoad() {

		},
		methods: {
			check_id(value){
			  var arrExp = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];//加权因子 
			  var arrValid = [1, 0, "X", 9, 8, 7, 6, 5, 4, 3, 2];//校验码 
			  if(/^\d{17}\d|x$/i.test(value)){  
				var sum = 0, idx; 
				for(var i = 0; i < value.length - 1; i++){ 
				  // 对前17位数字与权值乘积求和 
				  sum += parseInt(value.substr(i, 1), 10) * arrExp[i]; 
				} 
				// 计算模（固定算法） 
				idx = sum % 11; 
				// 检验第18为是否与校验码相等 
				return arrValid[idx] == value.substr(17, 1).toUpperCase(); 
			  }else{ 
				return false; 
			  } 
			},
			identity(){
				if(this.real_name == ''){
					uni.showToast({
						title:'请输入身份证姓名',
						icon:'none',
						duration:2000
					})
					return false;
				}
				if(this.check_id(this.real_id) == false){
					uni.showToast({
						title:'身份证格式不正确',
						icon:'none',
						duration:2000
					})
					return false;
				}
				let o = {
					real_id:this.real_id,
					real_name:this.real_name,
					image:this.logo64[0]
				}
				uni.request({
					url:this.websiteUrl + '/api/v4/realname/verify',
					method:'POST',
					data:o,
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token')
					},
					success: (res) => {
						if(res.data.status == 'success'){
							uni.showToast({
								title:res.data.data,
								duration:2000,
								success(){
									setTimeout(function (){
										uni.navigateTo({
											url:'/pagesB/realname/realname'
										})
									},1000)
								}
							})
						}else{
							uni.showToast({
								title:res.data.errors.message,
								icon:'none',
								duration:2000
							})
						}
					},
					fail:(res) => {
						console.log(res)
					}
				})
			},
			inter(inx) {
				if(this.real_name == ''){
					uni.showToast({
						title:'请输入身份证姓名',
						icon:'none',
						duration:2000
					})
					return false;
				}
				if(this.check_id(this.real_id) == false){
					uni.showToast({
						title:'身份证格式不正确',
						icon:'none',
						duration:2000
					})
					return false;
				}
				const _self = this;
				const PPFace = uni.requireNativePlugin('PP-BaiduFace');
				let config = {
					licenseName: 'idl-license',
					licenseSuffix: 'face-android',
					licenseId: 'task-dtionuoaa-vip-face-android',
					liveActionArray: ["Eye", "HeadLeftOrRight"],
					bgColor: "#56445D",
					textColor: "#C5E99B",
					isSound: _self.isSound, //默认是否开启语音提示（仅Android有效）默认值：false
					AutoClip: _self.AutoClip ,//自动裁剪用户脸部区域 默认：false
					isBackCamera:_self.backCamera //启用后置摄像头
				}

				if (plus.os.name == 'iOS') {
					config.licenseSuffix = 'face-ios';
					config.licenseId = 'www-beilimall-com-face-ios';
				}

				if (inx == 1) {
					PPFace.faceliveness(config, result => {
						_self.msg = new Date().getHours() + ':' + new Date().getMinutes() + '  ' + JSON.stringify(result) + '<br/>' +
							_self.msg;
						if (result.FaceStatusEnum == '"OK"') {
							_self.saveImgs(result.base64ImageMap);
						}
					});

				} else if (inx == 2) {
					PPFace.recycler(config, result => {
						_self.msg = new Date().getHours() + ':' + new Date().getMinutes() + '  ' + JSON.stringify(result) + '<br/>' +
							_self.msg;
						if (result.FaceStatusEnum == '"OK"') {
							_self.saveImgs(result.base64ImageMap);
						}
					});
				}

			},
			saveImgs(imgsobj) {
				let _self = this;
				_self.logoSrcs = [];
				for (let key in imgsobj) {
					var base64data = imgsobj[key];
					_self.logo64.push(base64data);
					this.identity();
					break;
					//_self.bitmapsave(base64data);
				}
			},
			bitmapsave(basedata) {
				let _self = this;
				var bitmap = new plus.nativeObj.Bitmap("test");
				bitmap.loadBase64Data(basedata, function(e) {
					bitmap.save('_doc/_tmp/head' + new Date().getTime() + '.png', {}, function(e) {
						_self.logoSrcs.push(e.target);
					});
				}, function() {
					console.log('加载Base64图片数据失败：' + JSON.stringify(e));
				});
			},
			focusclick(){
				uni.pageScrollTo({
				    scrollTop: 300,
				    duration: 300
				});
			}
		}
	}
</script>

<style>
	body,page{background:#ffffff}
	.inp-100{height:100upx;line-height:100upx;font-size:24upx;color:#000000;}
	.content {
		text-align: center;
		height: 400upx;
	}

	.logo {
		height: 200upx;
		width: 200upx;
		margin-top: 50upx;
	}

	.title {
		font-size: 36upx;
		color: #8f8f94;
	}

	.msg {
		text-align: left;
		padding: 40rpx;
		font-size: 25rpx;
		color: #F0AD4E;
	}
	
.allwidth{width:100%;height:auto;text-align:center;}
.real-tit{text-align:center;font-size:40rpx;height:300rpx;
          flex-direction:column;}
.erweima{text-align:center;margin:0 auto}
.fz24{font-size:28rpx;color:#e8e8e8;white-space: pre-wrap;}
.fz72{font-size:78rpx;color:#e3e3e3;white-space: pre-wrap;}
.cloblack{color:#000000;font-size:28rpx;font-weight:bold;line-height:60rpx}



.getreal{width:70%;height:80rpx;border-radius: 40rpx;background-color:#478bc9;margin:0 auto;color:#ffffff;text-align:center}
.gettext{line-height:80rpx;color:#ffffff}
.real-desc{text-align:center;height:300rpx;
           flex-direction:column;padding-top:20rpx}
.desc{width:600rpx;margin:0 auto;text-align:left}
.real-button{margin:60rpx}
.lvru{width:710rpx;height:auto;
	  border-radius: 20rpx;overflow: hidden;padding:20rpx;
	   margin:20rpx auto
}
.inp-100{height:70upx;line-height:70upx;color:#000000;text-align:center;border-bottom:1px solid #000000;font-size:24rpx}
.list-ul{ width:650rpx;
	         height:auto;
			 display: -webkit-flex; /* Safari */
			 -webkit-justify-content: space-around; /* Safari 6.1+ */
			 display: flex;
			 justify-content: flex-start;
			 padding:0 20rpx;
			 margin:0 auto;
			 padding-bottom:30rpx;
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
		text-align:center;
	}   
</style>
	
</style>
