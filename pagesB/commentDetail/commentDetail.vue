<template>
	<view class="container">
		<view class="section-list">
			<view class="product-list">
				<view class="product-items">
					<view class="item">
						<navigator class="product-img" :url="'/pages/goodsDetail/goodsDetail?id='+commentInfo.goods_id">
							<image :src="commentInfo.goods_thumb" v-if="commentInfo.goods_thumb"></image>
						</navigator>
						<view class="product-info">
							<navigator :url="'/pages/goodsDetail/goodsDetail?id='+commentInfo.goods_id" class="product-name twolist-hidden">{{ commentInfo.goods_name }}</navigator>
							<view class="product-row">
								<view class="price">{{ commentInfo.shop_price }}</view>
								<view class="number">x{{ commentInfo.goods_number }}</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="comment-form">
			<view class="commont-hd">
				<text>评价</text>
				<uni-rate value="0" @change="changeRank"></uni-rate>
			</view>
			<view class="commont-bd">
				<textarea v-model="textarea" placeholder="商品质量如何？大小合适么？快写下你的评价，分享给大家吧！(0-100字)" maxlength="100" />
			</view>
			<view class="commont-ft">
				<view class="uni-uploader">
					<view class="uni-uploader-head">
						<view class="uni-uploader-title">图片信息</view>
						<view class="uni-uploader-info">{{imageList.length}}/9</view>
					</view>
					<view class="uni-uploader-body">
						<view class="uni-uploader__files">
							<block v-for="(image,index) in imageList" :key="index">
								<view class="uni-uploader__file">
									<image class="uni-uploader__img" :src="image" :data-src="image" @click="previewImage"></image>
									<uni-icon type="trash" color="#4183c4" @click="deteleImg(index)"></uni-icon>
								</view>
							</block>
							<view class="uni-uploader__input-box">
								<view class="uni-uploader__input" @click="chooseImage"></view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="btn-bar btn-bar-radius">
			<view class="btn btn-red" @click="btnSubmit">提交评论</view>
		</view>
	</view>
</template>

<script>
	import { mapState } from 'vuex'
	
	import uniRate from '@/components/uni-rate.vue'
	import uniIcon from '@/components/uni-icon.vue'
	
	import { pathToBase64, base64ToPath } from '@/common/image-tools/index.js'
	export default {
		data() {
			return {
				textarea:'',
				type:0,
				rank:0,
				server:0,
				delivery:0,
				imageList:[]
			};
		},
		components:{
			uniRate,
			uniIcon
		},
		onShareAppMessage(res){
			return {
			  title: this.$store.state.common.shopConfig.shop_title,
			  path: '/pagesB/commentDetail/commentDetail'
			}
		},
		computed:{
			...mapState({
				materialList: state => state.user.materialList,
				commentInfo: state => state.user.commentInfo
			})
		},
		methods:{
			chooseImage: function() {
				let that = this
				if(this.imageList.length > 9){
					uni.showToast({
						title:'最多上传9张图片',
						icon:'none'
					})
					return;
				}
				
				uni.chooseImage({
					count:9,
					sizeType: ['compressed'],
					success: (res) => {
						if(this.imageList.length + res.tempFilePaths.length > 9){
							uni.showToast({
								title:'最多上传9张图片',
								icon:'none'
							})
							return;
						}else{
							res.tempFilePaths.forEach(file=>{
								pathToBase64(file).then(base64 =>{
									that.getMaterial(base64)
								})
							})
						}
					}
				})
			},
			getMaterial(base64){
				let that = this
				this.$store.dispatch('setMaterial',{
					file:{
						content:base64
					},
					type:'dange'
				}).then(data=>{
					if(data.status == 'success'){
						console.log(data.data[0])
						that.imageList.push(data.data[0])
					}else{
						uni.showToast({
							title:'上传出错',
							icon:'none'
						});
					}
				})
			},
			previewImage: function(e) {
				var current = e.target.dataset.src
				uni.previewImage({
					current: current,
					urls: this.imageList
				})
			},
			deteleImg(index){
				console.log(this.imageList)
				let that = this
				
				
				uni.showModal({
					title:'',
					content:'您确定要删除此图片吗？',
					success: (res) => {
						if(res.confirm){
							that.imageList.splice(index, 1)
						}
					}
				})
			},
			changeRank(e){
				this.rank = e.value
			},
			btnSubmit(){
				if(this.textarea == ''){
					uni.showToast({
						title:'评论内容不能为空',
						icon:'none'
					});
					
					return;
				}else if(this.rank == 0){
					uni.showToast({
						title:'请选择评论星级',
						icon:'none'
					});
					
					return;
				}else{
					this.$store.dispatch('setAddgoodscomment',{
						id:this.commentInfo.goods_id,
						order_id:this.commentInfo.order_id,
						rec_id:this.commentInfo.rec_id,
						type:this.type,
						rank:this.rank,
						server:this.server,
						content:this.textarea,
						delivery:this.delivery,
						pic:this.imageList
					}).then(res=>{
						if(res.data.error == 0){
							uni.showToast({
								title:'评论成功',
								icon:'success'
							});
							
							uni.reLaunch({
								url:'../comment/comment'
							});
						}else{
							uni.showToast({
								title:'评论失败',
								icon:'none'
							});
						}
					})
				}
			}
		},
		onLoad(e){
			this.$store.dispatch('setAddcomment',{
				rec_id:e.id
			})
		}
	}
</script>

<style>
.comment-form{ position: relative;}
.comment-form .commont-hd{ background: #FFFFFF; padding: 20upx; display: flex; flex-direction: row; align-items: center; border-bottom: 1px solid #f6f6f9;}
.comment-form .commont-hd text{ color: #999999; font-size: 30upx; margin-right: 15upx;}
.comment-form .commont-bd{ background: #FFFFFF; padding: 30upx 20upx;}
.comment-form .commont-bd textarea{ width: 100%;}
.comment-form .commont-ft{ background: #FFFFFF; margin-top: 20upx; padding: 20upx;}
.comment-form .commont-ft .uni-uploader-head{ padding: 0 10upx;}
.comment-form .commont-ft .uni-uploader-head .uni-uploader-title{ font-size: 30upx; color: #999999;}

.btn-bar{ margin: 40upx 30upx 0;}

.uni-uploader__file{ position: relative;}
.uni-uploader__file .uni-icon{ position: absolute; top: 0; right: 0;}
</style>
