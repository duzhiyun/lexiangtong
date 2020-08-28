<template>
	<view>
		<view class="va" :class="[tab=='a'?'':'taba']">
			<view class="fabu-one"></view>
			<view class="fabu-order">
				<view style="width:94%;margin:0 auto">
					<view class="fabu-two-title" style="width:30%"><text>任务标题</text></view>
					<view style="border-bottom:1rpx solid #000000">
						<input type="text" name="title" v-model="title" placeholder=" 请输入任务标题" style="height:100rpx;line-height:100rpx" />
					</view>
				</view>
			</view>

			<view class="fabu-order">
				<view style="width:94%;margin:0 auto">
					<view class="fabu-two-title" style="width:30%"><text>任务图标</text></view>
					<view @click="chooseImagetask('front_of_id_card')">
						<image :src="taskimage" style="width:200rpx; height:200rpx;margin:10rpx"></image>
					</view>
				</view>
			</view>


			<view class="fabu-two">
				<view class="fabu-two-title" style="width:30%"><text>任务步骤</text></view>
				<view class="fabu-two-link">
					<text @click="addExplain">增加图文说明:最多加10条</text>
				</view>
				<!-- 				<view class="fabu-two-link" style="background:#000000;color:#FFFFFF">
					<text>增加截图说明</text>
				</view> -->
			</view>

			<view class="fabu-three">
				<view style="width:94%;margin:30rpx auto" v-for="(item,index) in list" :key="index">
					<view class="fabu-three-title">
						<view><text>{{index+1}}、第{{index+1}}步</text></view>
						<view class="det" @click="del(index)" v-if="index == (list.length-1)">X</view>
					</view>
					<u-input class="inputs" v-model="detail[index]" :type="type" :border="border" :clearable="false" />
					<view @click="chooseImage('front_of_id_card',index)">
						<image :src="image[index]" style="width:200rpx; height:200rpx;margin:10rpx"></image>
					</view>
				</view>
				<!-- 				<view style="width:94%;margin:30rpx auto">
					<view class="fabu-three-title"><view><text>1、第二步（截图说明）</text> </view><view class="det">X</view></view>
					<view><text>详情讲解详情讲解详情讲解详情讲解详情讲解详情讲解详情讲解详情讲解详情讲解详情讲解详情讲解详情讲解详情讲解详情讲解</text></view>
					
					<view>
						<image src="../../static/hxsimg/errorImage.jpg" style="width:200rpx; height:200rpx;margin:10rpx"></image>
					</view>
				</view>		 -->
			</view>
			<view class="footer">
				<view @click="changetab(b)" style="color:#ffffff; font-size:36rpx">下一步</view>


			</view>
		</view>

		<view class="fabu-top" :class="[tab=='a'?'taba':'']">
			<view class="list-ul ">
				<view class="list-name"> 任务类别：</view>
				<view class="list-inp">
					<picker @change="bindPickerChange" :value="cindex" :range="cate">
						<view style="padding-top:2%;">{{cate[cindex]}}</view>
					</picker>
				</view>
			</view>

			<view class="list-ul" style="display:none">
				<view class="list-name"> 任务等级：</view>
				<view class="list-inp">
					<picker @change="bindPickerChanges" :value="index" :range="array">
						<view style="padding-top:2%;">{{array[index]}}</view>
					</picker>
				</view>
			</view>

			<view class="list-ul ">
				<view class="list-name"> 审核类型：</view>
				<view class="list-inp">
					<picker @change="bindPickerChangea" :value="aindex" :range="automatic">
						<view style="padding-top:2%;">{{automatic[aindex]}}</view>
					</picker>
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
					<input type="text" name="link" v-model="link" placeholder=" 请输入任务链接内容(带上http的完整链接)" style="height:100%;font-size:20rpx" />
				</view>
			</view>

			<view class="list-ul">
				<view class="list-name"> 过期时间：</view>
				<view class="list-inp">
					<view class="list-inp">
						<picker @change="timeChange" mode="date" :value="end_date">
							<view style="padding-top:2%;">{{end_date}}</view>
						</picker>
					</view>
				</view>
			</view>
			<view class="list-ul">
				<view class="list-name"> 资源点：</view>
				<view class="list-inp">
					<input type="text" name="resource" v-model="resource" placeholder=" 请输入任务所需资源点个数" style="height:100%;font-size:20rpx" />
				</view>
			</view>
			<view class="list-ul">
				<view class="list-ul" style=" padding-left:0">
					<view class="list-name" style="width:200rpx;padding-left:0"> 任务佣金：</view>
					<view class="list-inp">
						<view class="inp-100 redcolor">
							<input type="number" class="inp-100" name="price" v-model="price" placeholder=" 请输入任务佣金" @input="countamount" />
						</view>
					</view>
				</view>
				<view class="list-ul" style=" padding-left:0">
					<view class="list-name" style="width:200rpx;padding-left:0"> 任务个数：</view>
					<view class="list-inp">
						<view class="inp-100 redcolor">
							<input type="number" class="inp-100" name="count" v-model="count" placeholder=" 请输入任务个数" @input="countamount" />
						</view>
					</view>
				</view>
			</view>

			<view class="list-ul">
				<view class="list-name"> 支付总额：</view>
				<view class="list-inp" style="border-bottom:none">
					<view class="list-inp" style="border-bottom:none;color:#ff0000">
						任务报酬：{{amount}} + 服务费：{{tax}}
					</view>
				</view>
			</view>





			<view class="list-ul ">
				<view class="list-name"> 支付资产：</view>
				<view class="list-inp">
					<picker @change="bindPickerChanget" :value="tindex" :range="type">
						<view style="padding-top:2%;">{{type[tindex]}}</view>
					</picker>
				</view>
			</view>


			<view class="list-ul" style="height:auto">
				<view style="padding:20rpx;width:100%;border-radius: 20rpx;border:1px solid #000000;margin:40rpx 0;display: flex;">
					<text>
						注：
						1、发布任务需要20%服务费用，请确保对应帐户有足够的余额;
						2、严禁发布违返法律法规以及相关类型的任务，平台对此零容忍,发现一次立即封号处理;
						3、严禁发布与第三方利益相冲突的任务，一切后果由发布者自行承担;
					</text>
				</view>
			</view>

			<view class="footer">
				<view @click="commit()" style="color:#ffffff;font-size:36rpx"> 确认提交</view>
				<!-- 
				<view  @click="commit()" >确认修改</view>
				<view >任务已完成</view>
				 -->
			</view>
		</view>

	</view>
</template>

<script>
	import * as localConfig from '@/config/local/config';
	import {
		mapState
	} from 'vuex'
	import uniIcon from "@/components/uni-icon.vue";
	import universal from '@/common/mixins/universal.js';
	import isLogin from '@/common/mixins/isLogin.js'
	import {
		pathToBase64,
		base64ToPath
	} from '@/common/image-tools/index.js'
	const webUrl = localConfig.websiteUrl
	export default {
		data() {
			return {
				value: '',
				border: true,
				tab: 'a',
				zt01: '1',
				fb_money: '1',
				fb_app: 'snssdk1128',
				title: '',
				price: 0.5,
				array: ['所有会员', 'VIP会员', '白银VIP', '黄金VIP', '铂金VIP', '钻石VIP'],
				cate: ['请选择任务类别'],
				info: ['请选择完成方式', '点赞', '转发', '点赞/关注/评论', 'CPA注册/推广', '阅读/游戏 ', '体验/试用/营销', '购物类任务', '线下/技能类任务'],
				iprice: ['0', '0.5', '1', '1', '1', '1', '5', '4', '50'],
				linktype: ['请选择链接类型', '抖音', '快手', '微视', '淘宝', '网站', '内页'],
				automatic: ['人工审核', '自动审核'],
				type: ['乐券', '悬赏币'],
				lindex: 5,
				aindex: 0,
				iindex: 0,
				index: 0,
				cindex: 0,
				tindex: 0,
				resource: 1,
				count: 5,
				link: '',
				detail: ['','','','','','','','','',''],
				end_date: '请选择过期时间',
				image: ['','','','','','','','','',''],
				taskimage:'../../static/hxsimg/errorImage.jpg',
				showb: false,
				showc: false,
				list: [],
				amount:2.5,
				tax:0.5
			}
		},
		methods: {
			countamount(){
				this.amount = this.price * this.count
				this.tax = this.amount * 0.2
			},
			del() {
				this.list.pop()
			},
			// 增加图片说明
			addExplain() {
				let len = this.list.length
				this.image[len] = '../../static/hxsimg/errorImage.jpg'
				this.list.push(1)
			},
			changetab(i) {
				if (this.title == '') {
					uni.showToast({
						title: '任务标题不能为空',
						icon: 'none'
					})
					return false;
				}
				if (this.taskimage == '../../static/hxsimg/errorImage.jpg') {
					uni.showToast({
						title: '请上传任务图标',
						icon: 'none'
					})
					return false;
				}
				this.tab = i
			},

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
			tasklist: function() {
				uni.request({
					url: webUrl + '/api/v4/task/info',
					data: {
						page: 1,
						size: 1,
						level: -1,
						cid: -1
					},
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token')
					},
					success: (res) => {
						if (res.data.status == 'success') {
							let len = res.data.data.cate.length;
							for (let i = 0; i < len; i++) {
								this.cate.push(res.data.data.cate[i].name)
							}
						}
					}
				});
			},
			chooseImagetask: function(val) {
				uni.chooseImage({
					count: 1,
					sizeType: ['original', 'compressed'],
					sourceType: ['album', 'camera'],
					success: (res) => {
						pathToBase64(res.tempFilePaths[0]).then(base64 => {
							this.$store.dispatch('setMaterial', {
								file: {
									content: base64
								},
								type: val
							}).then(data => {
								if (data.status == 'success') {
									this.taskimage = data.data[0]
								}
							})
						}).catch(error => {
							console.error(error, 5);
						});
					}
				})
			},
			chooseImage: function(val,index) {
				uni.chooseImage({
					count: 1,
					sizeType: ['original', 'compressed'],
					sourceType: ['album', 'camera'],
					success: (res) => {
						pathToBase64(res.tempFilePaths[0]).then(base64 => {
							this.$store.dispatch('setMaterial', {
								file: {
									content: base64
								},
								type: val
							}).then(data => {
								if (data.status == 'success') {
									this.$set(this.image,index,data.data[0])
								}
							})
						}).catch(error => {
							console.error(error, 5);
						});
					}
				})
			},
			commit: function() {
				if (this.cindex == 0) {
					uni.showToast({
						title: '请选择任务类别',
						icon: 'none'
					})
					return false;
				}

				if (this.end_date == '请选择过期时间') {
					uni.showToast({
						title: '请选择过期时间',
						icon: 'none'
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
				let o = {
					title: this.title,
					cate: this.cindex,
					automatic: this.aindex,
					price: this.price,
					count: this.count,
					resource: this.resource,
					linktype: this.lindex,
					link: this.link,
					end_date: this.end_date + ' 23:59:59',
					detail: this.detail,
					image: this.image,
					type: this.tindex,
					tushi:this.taskimage
				}
				uni.request({
					url: webUrl + '/api/v4/task/send',
					data: o,
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token')
					},
					success: (res) => {
						if (res.data.status == 'success') {
							uni.showToast({
								title: '发布成功',
								duration: 2000,
								success() {
									uni.reLaunch({
										url: '/pages/user/user'
									})
								}
							});
						} else {
							uni.showToast({
								title: res.data.errors.message,
								icon: "none",
								success() {
									if (res.data.errors.code == 250) {
										setTimeout(function() {
											uni.navigateTo({
												url: '/pagesB/account/deposit/recharge'
											})
										}, 2000)
									}
								}
							});
						}
					},
					error: (res) => {
						console.log(JSON.stringify(res))
					}
				});
			}
		},
		onLoad(e) {
			this.tasklist()
		}
	}
</script>

<style>
	page,
	body {
		background: #ffffff
	}

	.fabu-top {
		width: 94%;
		background: #ffffff;
		margin: 20rpx auto;
		padding-bottom: 100rpx
	}

	.fabu-title {
		color: #ffffff;
		line-heighe: 30rpx;
		margin-left: 20rpx;
		font-size: 36rpx;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.fabu-nav {
		width: 100%;
		line-height: 30rpx;
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		color: #8c5e1e;
		flex-wrap: wrap;
	}

	.fabu-team {
		font-size: 20rpx;
		width: 27%;
		margin: 10rpx 2%;
		border-radius: 50rpx;
		border: 1rpx solid #8c5e1e;
		text-align: center;
	}

	.fabu-imgteam {
		font-size: 20rpx;
		width: 25%;
		margin: 10rpx 10rpx;
		text-align: left;
		padding-left: 30rpx
	}
	.inputs{
		margin-top:20px;
		margin-bottom: 10px;
	}
	.fabu-header {
		margin-top: -100rpx;
		display: flex;
		flex-direction: row;
		justify-content: center;
		overflow: hidden;
		width: 100%;
		border-top-left-radius: 40rpx;
		border-top-right-radius: 40rpx;
		height: 180rpx;
		background: #ffffff
	}

	.fabu-header-left {
		width: 140rpx;
		height: 140rpx;
		margin: 20rpx;
		background: #FF495E;
		border-radius: 90rpx;
		overflow: hidden;
	}

	.fabu-header-mid {
		width: 300rpx;
		height: 180rpx;
	}

	.fabu-header-right {
		color: #c77f2b;
		width: 250rpx;
		height: 180rpx;
		text-align: center;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 36rpx;
	}

	.fabu-one {
		width: 100%;
		height: 20rpx;
		background: #f3f3f3
	}

	.fabu-name {
		font-size: 20rpx;
		width: 100%;
		text-align: left;
		height: 50%;
		flex-wrap: wrap-reverse;
		display: flex;
	}

	.fabu-userinfo {
		width: 100%;
		line-height: 30rpx;
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		color: #ffaa00;
	}

	.fabu-more {
		font-size: 20rpx;
		width: 50%;
		margin: 10rpx 2%;
		border-radius: 20rpx;
		border: 1rpx solid #ffaa00;
		text-align: center;
	}

	.fabu-two {
		width: 94%;
		background: #ffffff;
		padding: 10rpx 3%;
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		border-bottom: 1rpx solid #d9d9d9
	}

	.fabu-two-title {
		line-height: 80rpx;
		font-size: 36rpx;
		font-weight: bold
	}

	.fabu-two-link {
		height: 50rpx;
		width: 50%;
		border: 1px solid #000701;
		padding: 0 20rpx;
		border-radius: 40rpx;
		margin: 15rpx;
		text-align: center
	}

	.fabu-three {
		width: 100%;
		min-height: 1000rpx;
		background: #ffffff;
		padding-top: 30rpx;
		padding-bottom: 100rpx
	}

	.fabu-order {
		width: 100%;
		min-height: 100rpx;
		background: #ffffff;
	}

	.fabu-three-title {
		display: flex;
		justify-content: space-between;
	}

	.det {
		width: 40rpx;
		height: 40rpx;
		border: 1px solid #000307;
		border-radius: 30rpx;
		line-height: 40rpx;
		text-align: center
	}

	.footer {
		height: 100upx;
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		background-color: #000000;
		color: #6e6d6b;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		border-top: 2upx solid #e2e2e2;
		z-index: 99999;
		padding-bottom: env(safe-area-inset-bottom);
	}


	.list-ul {
		width: 650rpx;
		height: auto;
		display: -webkit-flex;
		/* Safari */
		-webkit-justify-content: space-around;
		/* Safari 6.1+ */
		display: flex;
		justify-content: flex-start;
		padding: 5rpx 20rpx;
		margin: 0 auto;
		background-color: #ffffff;
		height: 70rpx;

	}

	.list-inp {
		width: 75%;
		line-height: 70rpx;
		text-align: center;
		color: #000000;
		font-size: 24rpx;
		text-align: left;
		height: 70rpx;
		border-bottom: 1px solid #000000
	}


	.list-name {
		width: 25%;
		margin-left: 1rpx;
		line-height: 70rpx;
		text-align: left;
		color: #000000;
		font-size: 24rpx;
		text-align: left;
	}

	.inp-100 {
		line-height: 70upx;
		color: #000000;
		font-size: 24rpx;
		min-width: 70rpx;
		padding-top: 1%;
		height: 100%;
		font-size: 20rpx
	}

	.taba {
		display: none
	}
</style>
