<template>
	<view class="fixed-bottom-padding">
		<view class="article-main">
			<view class="header">
				<view class="title">{{ articleDetail.title }}</view>
				<view class="time">{{ articleDetail.add_time }}</view>
			</view>
			<view class="content" v-if="articleDesc">
				<rich-text :nodes="articleDesc"></rich-text>
			</view>
			<view class="goods-list" v-if="articleDetail.related_goods && articleDetail.related_goods.length > 0">
				<view class="goods-item" v-for="(item,index) in articleDetail.related_goods" :key="index" @click="$outerHref('/pages/goodsDetail/goodsDetail?id='+item.goods_id,'app')">
					<view class="goods-left"><image :src="item.goods_thumb" class="img" /></view>
					<view class="goods-right">
						<view class="goods-name twolist-hidden">{{item.goods_name}}</view>
						<view class="plan-box">
							<view class="price">{{item.shop_price}}</view>
							<view class="btn">去购买</view>
						</view>
					</view>
				</view>
			</view>
			<view class="fx-deta-box" :class="{'active':is_like == 1}" @click="like">
				<view class="yuan">
					<icon class="iconfont icon-zan"></icon>
					<text>{{likenum}}</text>
				</view>
			</view>
		</view>
		<view class="comment">
			<view class="title">评论列表</view>
			<view class="comment-info" v-for="(item,index) in articleDetail.comment" :key="index" v-if="item.status > 0">
				<view class="comment-left"><image :src="item.user_picture" mode="widthFix"></image></view>
				<view class="comment-right">
					<view class="com-r-top">
						<view class="com-adm-box">{{ item.user_name }}</view>
						<view class="com-data-right">{{ item.add_time }}</view>
					</view>
					<view class="com-con">{{ item.content }}</view>
					<view class="admin-con" v-for="(adminitem,adminindex) in item.reply_content" :key="adminindex">管理员回复：{{adminitem.content}}</view>
				</view>
			</view>
			<view class="com-view-more" @click="commentMore">查看更多评论</view>
		</view>
		<view class="btn-goods-action">
			<view class="submit-bar-text submit-bar-text-left"><input name="content" v-model="content" placeholder="快来发表下评论吧~"/></view>
			<view class="btn-bar">
				<view class="btn btn-red" @click="addActComment">发送</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { mapState } from 'vuex'	
	
	import dscNotContent from '@/components/dsc-not-content.vue';
	import dscCommonNav from '@/components/dsc-common-nav.vue';
	export default {
		data() {
			return {
				id:0,
				content:'',
				is_like:0,
				routerName:'goods',
				disabled:false
			}
		},
		components: {
			dscNotContent,
			dscCommonNav,
		},
		computed:{
			...mapState({
				articleDetail: state => state.article.articleDetail,
			}),
			likenum:{
				get(){
					return this.articleDetail.likenum
				},
				set(val){
					this.articleDetail.likenum = val
				}
			},
			articleCommentLength(){
				return this.articleDetail.comment.length
			},
			articleDesc(){
				let result = this.articleDetail.content;
				const reg = /style\s*=(['\"\s]?)[^'\"]*?\1/gi;
				const regex = new RegExp('<img', 'gi');
				const regex2 = new RegExp('<p', 'gi');
				
				if(result){
					result = result.replace(reg, '');
					result = result.replace(regex, '<img style="width: 100% !important; height:auto;vertical-align:top;"');
					result = result.replace(regex2, '<p style="margin:0;padding:0;"');
				}
				return result
			}
		},
		methods: {
			show(){
				this.$store.dispatch('setArticleDetail',{
					id:this.id
				})
			},
			addActComment(){
				if(this.$isLogin()){
					if(this.content){
						uni.showLoading({title:'加载中...'});
						this.$store.dispatch('setActicleComment',{
							id:this.id,
							cid:0,
							content:this.content
						}).then(res =>{
							let data = res.data
							if(data == false){
								uni.showToast({
									icon:'none',
									title:'添加失败'
								})
							}else{
								uni.showToast({
									title:'添加成功'
								})
								this.show()
							}
							uni.hideLoading()
						})
					}
				}
			},
			commentMore(){
				uni.navigateTo({
					url:'/pages/article/commentlist/commentlist?id=' + this.id
				})
			},
			like(){
				this.$store.dispatch('setActicleCommentLike',{
					article_id:this.id
				}).then(res=>{
					if(res.data){
						this.likenum = res.data.like_num
						this.is_like = res.data.is_like
					}
				})
			},
		},
		onLoad(e){
			this.id = e.id ? e.id : 0;
			
			this.show();
		}
	}
</script>

<style>
.article-main { background: #FFFFFF; overflow: hidden;}
.article-main .header{ display: flex; flex-direction: column; padding: 20upx;}
.article-main .header .title{ font-size: 32upx; color: #333333; font-weight: bold;}
.article-main .header .time{ color: #999999; font-size: 25upx;}
.article-main .content{ padding: 0 20upx 20upx;}
.article-main .fx-deta-box{ margin: 20upx 0;}
.article-main .fx-deta-box .yuan{ width: 120upx; height: 120upx; border:2upx solid #F6F6F9; border-radius: 50%; display: flex; flex-direction: column; align-items: center; justify-content: center; margin: 0 auto; line-height: 1.5; }
.article-main .fx-deta-box .yuan text{ color: #999999; font-size: 25upx;}
.article-main .fx-deta-box:active .yuan,
.article-main .fx-deta-box .yuan text,
.article-main .fx-deta-box .yuan .iconfont{ color: #f92028;}

.comment{ margin-top: 20upx; background: #FFFFFF; }
.comment .title{ padding: 20upx; border-bottom: 2upx solid #F6F6F9; }
.comment .comment-info{ padding: 20upx; border-bottom: 2upx solid #F6F6F9; display: flex; flex-direction: row; }
.comment .comment-info .comment-left{ width: 120upx; height: 120upx; }
.comment .comment-info .comment-left image{ width: 120upx; height: 120upx; border-radius: 50%;}
.comment .comment-info .comment-right{ margin-left: 40upx; flex: 1; display: flex; flex-direction: column;}
.comment .comment-info .comment-right .com-r-top{ display: flex; flex-direction: row; justify-content: space-between;}
.comment .comment-info .comment-right .com-r-top .com-adm-box{ color: #607fa6;}
.comment .comment-info .comment-right .com-r-top .com-data-right{ font-size: 25upx; color: #999999;}
.comment .comment-info .comment-right .admin-con{ color: #999999; padding: 5upx 20upx; background: #f4f4f4; border-radius: 10upx; margin: 10upx 0; font-size: 25upx; }
.comment .com-view-more{ padding: 20upx 0; display: flex; justify-content: center; align-items: center;}
</style>
