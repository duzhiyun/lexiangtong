<template>
	<view class="profile">
		<view class="uni-card uni-card-not">
			<view class="s-user-top">
				<view class="user-bg-box-1"><image src="../../static/user-1.png" class="img"></image></view>
				<view class="user-bg2-box-1"><image src="../../static/user-2.png" class="img"></image></view>
				<view class="user_profile_box">
					<view class="user-img" @click="chooseImage"><image :src="userInfo.avatar" class="img" v-if="userInfo.avatar"></image></view>
					<view class="profile-index-top">
						<text v-if="userInfo.name != ''">{{ userInfo.name }}</text>
						<text v-else>{{ userInfo.username }}</text>
						<view class="username">用户名 {{ userInfo.username }}</view>
					</view>
				</view>
			</view>
			<view class="uni-list">
				<view class="uni-list-cell" hover-class="uni-list-cell-hover" @click="isShow('name')">
					<view class="uni-list-cell-navigate uni-navigate-right uni-navigate-badge">
						<text class="title">昵称</text>
						<view class="value">{{userInfo.name}}</view>
					</view>
				</view>
			</view>
			<view class="uni-list">
				<view class="uni-list-cell" hover-class="uni-list-cell-hover" @click="isShow('isSex')">
					<view class="uni-list-cell-navigate uni-navigate-right uni-navigate-badge">
						<text class="title">性别</text>
						<view class="value">{{isSex}}</view>
					</view>
				</view>
			</view>
			<view class="uni-list">
				<view class="uni-list-cell" hover-class="uni-list-cell-hover" @click="isShow('birthday')">
					<view class="uni-list-cell-navigate uni-navigate-right uni-navigate-badge">
						<text class="title">出生日期</text>
						<view class="value">{{userInfo.birthday}}</view>
					</view>
				</view>
			</view>
			<view class="uni-list">
				<navigator url="../address/address" hover-class="none">
				<view class="uni-list-cell" hover-class="uni-list-cell-hover">
					<view class="uni-list-cell-navigate uni-navigate-right uni-navigate-badge">
						<text class="title">收货地址</text>
					</view>
				</view>
				</navigator>
			</view>
		</view>
		<view class="uni-card uni-card-not" v-if="userInfo.user_real != 0">
			<view class="uni-list">
				<navigator url="../realname/realname" hover-class="none">
				<view class="uni-list-cell" hover-class="uni-list-cell-hover">
					<view class="uni-list-cell-navigate uni-navigate-right uni-navigate-badge">
						<text class="title">帐号认证</text>
					</view>
				</view>
				</navigator>
			</view>
		</view>
		<view class="uni-card uni-card-not">
			<view class="uni-list">
				<navigator url="../accountsafe/accountsafe" hover-class="none">
				<view class="uni-list-cell" hover-class="uni-list-cell-hover">
					<view class="uni-list-cell-navigate uni-navigate-right uni-navigate-badge">
						<text class="title">账号安全</text>
					</view>
				</view>
				</navigator>
			</view>
		</view>
		<view class="uni-card uni-card-not">
			<view class="uni-list">
				<navigator url="../help/help" hover-class="none">
				<view class="uni-list-cell" hover-class="uni-list-cell-hover">
					<view class="uni-list-cell-navigate uni-navigate-right uni-navigate-badge">
						<text class="title">使用帮助</text>
					</view>
				</view>
				</navigator>
			</view>
		</view>
		<!-- #ifdef APP-PLUS -->
		<view class="profile-btn">
			<button type="warn" plain="true" @click="handelLogout">退出</button>
		</view>
		<!-- #endif -->
		<view class="copyright">
			<view>Copyright©2019-2020</view>
			<view>{{wgtinfo.name}} 版权所有</view>
			<!-- #ifdef APP-PLUS -->
			<view>版本{{wgtinfo.version}}</view>
			<!-- #endif -->
		</view>
		
		<!--popup-->
		<uni-popup :show="show" type="right" v-on:hidePopup="handelClose()">
			<view class="my-box">
				<view class="uni-card uni-card-not">
					<view class="uni-list" v-if="typeState == 'name'">
						<view class="uni-list-cell">
							<view class="uni-list-cell-navigate">
								<text class="title">昵称</text>
								<view class="value uni-cell-input"><input v-model="nick_name" placeholder="昵称"></view>
							</view>
						</view>
					</view>
					<view class="uni-list" v-else-if="typeState == 'isSex'">
						<view class="user-sex">
							<view class="left" :class="{'active':isSexNum == 1}" @click="handleSex(1)">
								<view class="iconfont icon-nan"></view>
								<text>男</text>
							</view>
							<view class="right" :class="{'active':isSexNum == 2}" @click="handleSex(2)">
								<view class="iconfont icon-nv"></view>
								<text>女</text>
							</view>
						</view>
					</view>
					<view class="uni-list" v-else>
						<view class="uni-list-cell">
							<view class="uni-list-cell-navigate">
								<text class="title">出生日期</text>
								<view class="value uni-cell-input">
									<picker mode="date" :value="birthday" :start="startDate" :end="endDate" @change="bindDateChange" class="picker">
										<view class="uni-input">{{birthday}}</view>
									</picker>
								</view>
							</view>
						</view>
					</view>
				</view>
				<view class="btn-bar">
					<view class="btn btn-red" @click="updateInfo">确认</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import { mapState } from 'vuex'
	import uniPopup from '@/components/uni-popup.vue';
	import { pathToBase64, base64ToPath } from '@/common/image-tools/index.js'
	
	export default {
		components: {
			uniPopup,
		},
		data() {
			return {
				show:false,
				logoutState:true,
				typeState:'',
				imageSrc:'',
				wgtinfo:{},
				timer:''
			};
		},
		computed:{
			...mapState({
				userInfo: state => state.user.userInfo
			}),
			isSexNum:{
				get(){
					return this.userInfo.sex;
				},
				set(val){
					clearTimeout(this.timer);
					this.timer = setTimeout(()=>{
						this.$store.dispatch('userUpdateText',{
							type:'sex',
							val:val
						});
					},1000)
				}
			},
			nick_name:{
				get(){
					console.log(this.userInfo)
					return this.userInfo.name;
				},
				set(val){
					clearTimeout(this.timer);
					this.timer = setTimeout(()=>{
						this.$store.dispatch('userUpdateText',{
							type:'name',
							val:val
						});
					},100)
				}
			},
			birthday:{
				get(){
					return this.userInfo.birthday;
				},
				set(val){
					clearTimeout(this.timer);
					this.timer = setTimeout(()=>{
						this.$store.dispatch('userUpdateText',{
							type:'birthday',
							val:val
						});
					},1000)
				}
			},
			isSex(){
				let sexArr = ['保密', '男', '女'];
				return sexArr[this.isSexNum];
			},
			startDate() {
				return this.getDate('start');
			},
			endDate() {
				return this.getDate('end');
			}
		},
		methods:{
			chooseImage(){
				uni.chooseImage({
					count:1,
					sizeType: ['compressed'],
					success:(res)=>{
						pathToBase64(res.tempFilePaths[0]).then(base64 => {
							this.$store.dispatch('setMaterial',{
								file:{
									content:base64
								},
								type:'touxian'
							}).then(data=>{
								if(data.status == 'success'){
									uni.showLoading({title: '上传中...'});
									this.$store.dispatch('userUpdateAvatar',{
										pic:data.data[0]
									});
								}
							})
						}).catch(error => {
							console.error(error,5);
						});
					}
				})
			},
			isShow(val){
				this.show = true;
				this.typeState = val;
			},
			handelClose(){
				this.show = false
			},
			handleSex(val){
				this.isSexNum = val
			},
			bindDateChange: function(e){
				this.birthday = e.target.value
			},
			getDate(type) {
				const date = new Date();

				let year = date.getFullYear();
				let month = date.getMonth() + 1;
				let day = date.getDate();

				if (type === 'start') {
					year = year - 60;
				} else if (type === 'end') {
					year = year + 2;
				}
				month = month > 9 ? month : '0' + month;;
				day = day > 9 ? day : '0' + day;
				return `${year}-${month}-${day}`;
			},
			updateInfo(){
				uni.request({
					url:this.websiteUrl + '/api/v4/user/profile',
					method:'PUT',
					data:{
						sex:this.isSexNum,
						name:this.nick_name,
						birthday:this.birthday
					},
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token'),
						'X-Client-Hash':uni.getStorageSync('client_hash')
					},
					success: (res) => {
						if(res.data.status == 'success'){
							uni.showToast({
								title:'修改成功！',
								icon:'success'
							})
							this.show = false
						}else{
							uni.showToast({
								title:'删除失败！',
								icon:'none'
							})
						}
					}
				})
			},
			handelLogout(){
				this.$store.dispatch('userLogout');
			}
		},
		onShareAppMessage(res){
			return {
			  title: this.$store.state.common.shopConfig.shop_title,
			  path: '/pagesB/profile/profile'
			}
		},
		onLoad(){
			this.wgtinfo = JSON.parse(uni.getStorageSync('wgtinfo'))
			
			this.$store.dispatch('userProfile')
		}
	}
</script>

<style>
.s-user-top{ padding: 22upx 20upx; position: relative;}
.s-user-top .user-bg-box-1{ width: 90upx; height: 32upx; position: absolute; right: 0; top: 20upx;}
.s-user-top .user-bg2-box-1{ width: 91upx; height: 36upx; position: absolute; bottom: 0; left: 20upx;}
.s-user-top .user_profile_box{ display: flex; flex-direction: row;}
.s-user-top .user_profile_box .user-img{ width: 108upx; height: 108upx; border-radius: 50%; border:2px solid #EEEEEE;}
.s-user-top .user_profile_box .user-img .img{ border-radius: 50%; }
.s-user-top .user_profile_box .profile-index-top{ flex: 1; margin-left: 30upx;}
.s-user-top .user_profile_box .profile-index-top text{ font-size: 32upx; overflow: hidden; white-space: nowrap; text-overflow: ellipsis;}
.s-user-top .user_profile_box .profile-index-top .username{ font-size: 25upx; color: #777777;}

.my-box .uni-card{ margin: 0;}
.my-box .uni-list-cell-navigate{ justify-content: flex-start;}
.my-box .uni-list-cell-navigate .title{ padding: 20upx 0; font-size: 32upx; margin-right: 20upx; color: #333333;}
.my-box .uni-list-cell-navigate .value{ font-size:28upx; color: #666;}
.my-box .btn-bar{ padding: 0 30upx; margin-top: 20upx;}

.user-sex{ display: flex; flex-direction: row; padding: 50upx 30upx; justify-content: center; text-align: center;}
.user-sex .left,
.user-sex .right{ flex: 1 1 0%; color: #b2b2b2;}
.user-sex .iconfont{ font-size: 130upx; line-height: normal;}
.user-sex .left.active{ color: #3fc6ff;}
.user-sex .right.active{ color: #f36ab7;}

.picker{ width: 100%;}

.copyright{ text-align: center; margin-top: 50px;}
.copyright view{ font-size: 25upx; color: #999999;}

.profile-btn{ margin: 40upx 30upx 0;}
.profile-btn button{ font-size: 32upx;}
</style>
