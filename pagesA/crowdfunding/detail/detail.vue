<template>
    <view class="con">
        <view class="con_main goods bargain-detail cro-detail">			
            <view class="dis-box tab-common nav f-05 bg-color-write text-center">
                <view class="box-flex">
                    <view class="item text-right" :class="{'active':filter === 'goods'}" @click="handleFilter('goods')">
                        <text>商品</text>
                    </view>
                </view>
                <view class="box-flex">
                    <view class="item" :class="{'active':filter === 'detail'}" @click="handleFilter('detail')">
                        <text>详情</text>
                    </view>
                </view>
                <view class="box-flex">
                    <view class="item text-left" :class="{'active':filter === 'topic'}" @click="handleFilter('topic')">
                        <text>话题</text>
                    </view>
                </view>
            </view>
            <!--商品-->
            <view class="tabCon m-top40" v-if="filter =='goods'">
                <!-- 商品模块 -->
                <view class="cont-max-height" v-show="filter == 'goods'">					
                    <!-- 轮播图 -->
                    <view class="van-swipe van-swipe-track">
                        <view class="van-swipe-item">
                            <img class="title_img" :src="crowdShowData.info.title_img" />
                        </view>
                    </view>
                    <view class="dis-box detail-user bg-color-write padding-all">
                        <view class="left">
                            <img class="img" :src="crowdShowData.user_info.img" />
                        </view>
                        <view class="center name color-red p-l05">{{crowdShowData.user_info.name}}</view>
                        <view class="box-flex right" @click="onChat(0,0)">
                            <text class="span f-04 tag-gradients-color br-100 color-white fr">咨询</text>
                        </view>
                    </view>
                    <!-- title -->
                    <view class="cont-box m-top08">
                        <view class="title bg-color-write  padding-all">
                            <view class="f-05 color-3 f-weight">{{crowdShowData.info.title}}</view>
                            <view class="m-top06 of-hidden">
                                <view class="fr color-9 f-03">还剩：
                                    <text class="color-red">{{crowdShowData.info.shenyu_time}}</text>天
								</view>
                            </view>
                            <view class="ect-progress dis-box m-top08">
                                <view class="wrap box-flex">
                                    <view class="bar" :style="{width:crowdShowData.info.baifen_bi + '%'}">
                                        <text class="color"></text>
                                    </view>
                                </view>
                                <view class="txt">{{crowdShowData.info.baifen_bi}}%</view>
                            </view>
                            <view class="text-center color-9 f-02 m-top08 of-hidden">
                                <view class="van-col">
									<view class="iconfont icon-jinqian col-9"></view>
                                    <view>目标资金</view>
                                    <text class="color-red f-04">{{crowdShowData.info.amount}}</text>元
                                </view>
                                <view class="van-col">
									<view class="iconfont icon-jinqian col-9"></view>
                                    <view>已筹资金</view>
                                    <text class="color-red f-04">{{crowdShowData.info.join_money}}</text>元
                                </view>
                                <view class="van-col">
									<view class="iconfont icon-jinqian col-9"></view>
                                    <view>支持人数</view>
                                    <text class="color-red f-04">{{crowdShowData.info.join_num}}</text>人
                                </view>
                            </view>
                        </view>
                    </view>
                    <view class="padding-all   bg-color-write border-t-common" @click="detailClick">
						<view class="text-center color-red f-04">
							<text calss="label">查看项目详情</text>
							<text class="iconfont icon-jinqian col-9"></text>
						</view>
                    </view>
					
					<view class="m-top08 f-04 van-cell-group van-hairline--top-bottom">
						<view class="van-cell">
							<view class="van-cell__title">
								<text>方案回报</text>
							</view>
						</view>
					</view>		
                    <view class="dis-box detail-scheme bg-color-write" v-for="(item,index) in crowdShowData.goods.goods_arr" :key="index">
                        <view class="left">
                            <img class="img" :src="item.img" />
                        </view>
                        <view class="right box-flex">
                            <view class="dis-box">
                                <view class="box-flex f-04">支持
                                    <text class="color-red">{{item.price}}</text>元</view>
                                <view v-if="item.wuxian == 0" class="color-9 f-03">剩余
                                    <text class="color-red ">{{item.shenyu_ren}}</text>份
                                </view>
                                <view v-else class="color-9 f-03">
                                    <text class="color-red ">无限额</text>
                                </view>
                            </view>
                            <view class="color-3 f-03 m-top06">{{item.content}}</view>
                            <view class="color-9 f-03 m-top04">回报时间:{{item.return_time}}</view>
                            <view class="color-9 f-03">配送费用:{{item.shipping_fee!=0?item.shipping_fee:'免运费'}}</view>
                        </view>
                    </view>
                    <!-- 详情 -->
                    <view class="m-top08 bg-color-write van-tabs">
						<view class="van-tabs-wrap van-hairline-top-bottom">
							<view class="van-tabs-nav van-tabs-nav-line text-center">
								<!-- <view class="van-tabs-line" style="width: 62.5px; transform: translateX(31.25px); transition-duration: 0.2s;"></view> -->
								<view class="van-tab" :class="{'active':datailfilter === 'topic'}" @click="datailFilter('topic')">
									<text class="van-ellipsis">实时话题</text>
								</view>
								<view class="van-tab" :class="{'active':datailfilter === 'backer'}" @click="datailFilter('backer')">
									<text class="van-ellipsis">a的支持者</text>
								</view>
								<view class="van-tab" :class="{'active':datailfilter === 'progress'}" @click="datailFilter('progress')">
									<text class="van-ellipsis">项目动态</text>
								</view>
							</view>
						</view>	
						<view class="van-tabs-content">
							<view v-if="datailfilter =='topic'">
								<view class="qinyou-cont crowd-comment-icon">
									<view v-if="crowdShowData.topic_list!=''">
										<view class="van-cell-group van-hairline-top-bottom">
											<view class="van-cell van-cell-clickable" @click="topicListMore">
												<view class="van-cell-title"><text>话题列表</text></view>
												<view class="van-cell-value"><text>更多</text></view>
												<i class="van-icon van-icon-arrow van-cell-right-icon"></i>
											</view>
										</view>	
										<view class="bg-color-write li" v-for="(item, index) in crowdShowData.topic_list " :key="index">
											<view class="dis-box">
												<view class="left">
													<view class="img-box">
														<img v-if="item.user_picture" class="img" :src="item.user_picture" />
														<img v-else class="img" src="../../../static/get_avatar.png" />
													</view>
												</view>
												<view class="box-flex">
													<view class="dis-box m-top02">
														<text class="f-05 color-3 box-flex">{{item.user_name}}</text>
													</view>
													<text class="color-9 f-02 m-top04">{{item.add_time}}</text>
												</view>
											</view>
											<view class="f-03 color-3 padding-all">{{item.content}}</view>
										</view>
									</view>
									<view v-else>
										<dsc-not-content></dsc-not-content>
									</view>
								</view>
							</view>
							<view v-if="datailfilter =='backer'">
								<view class="qinyou-cont">
									<view v-if="crowdShowData.backer_list!=''">
										<view class="li dis-box bg-color-write" v-for="(item, index) in crowdShowData.backer_list" :key="index">
											<view class="left">
												<view class="img-box">
													<img v-if="item.user_picture" class="img" :src="item.user_picture" />
													<img v-else class="img" src="../../../static/get_avatar.png" />
												</view>
											</view>
											<view class="box-flex">
												<view class="dis-box m-top02">
													<text class="f-05 color-3 box-flex">{{item.user_name}}</text>
													<view class="color-9 f-02 text-right">支持
														<text class="color-red ">{{item.price}}</text>元</view>
												</view>
												<text class="color-9 f-02 m-top04">{{item.add_time}}</text>
											</view>
										</view>
									</view>
									<view v-else>
										<dsc-not-content></dsc-not-content>
									</view>
								</view>
							</view>
							<view v-if="datailfilter =='progress'">
								<!-- 话题模块 -->
								<view class="cont-max-height bg-color-write">
									<section class="swiper-slide goods-info-attr swiper-slide-next">
										<view class="order-id-list order-id-list-raise">
											<ul class="padding-all b-color-f">
												<li v-for="(item,index) in crowdShowData.progress" :key="index">
													<text class="t-remark3">{{item.add_time}}</text>
													<text class="t-remark m-top02">{{item.progress}}</text>
													<view class="t-remark m-top02 n-comments-img">
														<view v-for="itemImg in item.img">
															<img class="img" :src="itemImg">
														</view>
													</view>
												</li>
											</ul>
										</view>
									</section>
								</view>
							</view>
						</view>	                        
                    </view>
					<view class="van-goods-action">
						<view class="van-hairline van-goods-action-mini-btn" :class="{'curr':is_collect == 1}"  @click="Collection" >
							<i class="van-icon van-icon-like-o van-goods-action-mini-btn-icon"></i>关注
						</view>
						<view class="van-hairline van-goods-action-mini-btn" @click="topicClick">
							<i class="van-icon van-icon-edit van-goods-action-mini-btn-icon"></i>话题
						</view>
						<view class="van-button van-button-danger van-button-large van-button-square van-goods-action-big-btn" @click="crowsdCheck">
							<text class="van-button-text">支持</text>
						</view>
					</view>
                </view>
                <!--属性弹框-->				
				<uni-popup :show="showBase" type="bottom" mode="fixed" v-on:hidePopup="closeSku()">					
					<view class="attr-goods-box van-popup van-popup--bottom">						
						<view class="attr-goods-header wallet-bt">
							<view class="title">
								<view class="txt">方案回报</view>
								<uni-icon type="closeempty" size="36" color="#999999" @click="closeSku()"></uni-icon>
							</view>
                        </view>
                        <view class="attr-goods-content crowd-cont">
                            <van-radio-group v-model="radio" class="bg-color-write">
                                <van-radio :name ='item.id' :class="{'active':crowArr_id == item.id}"  v-for="(item,index) in crowdShowData.goods.goods_arr" :key="index">
                                    <view class="dis-box detail-scheme bg-color-write li" @click="crowArr(item)">
                                        <view class="left-icon"><text class="label"><i class="iconfont icon-gou"/></text></view>
                                        <view class="left">
                                            <img class="img" :src="item.img" />
                                        </view>
                                        <view class="right box-flex">
                                            <view class="dis-box">
                                                <view class="box-flex f-04">支持
                                                    <text class="color-red">{{item.price}}</text>元</view>
                                                <view v-if="item.wuxian == 0" class="color-9 f-03">剩余
                                                    <text class="color-red ">{{item.shenyu_ren}}</text>份
                                                </view>
                                                <view v-else class="color-9 f-03">
                                                    <text class="color-red ">无限额</text>
                                                </view>
                                            </view>
                                            <view class="color-3 f-03 m-top06">{{item.content}}</view>
                                            <view class="color-9 f-03 m-top04">回报时间:{{item.return_time}}</view>
                                            <view class="color-9 f-03">配送费用:{{item.shipping_fee}}</view>
                                        </view>
                                    </view>
                                </van-radio>
                            </van-radio-group>
                        </view>					
						<view class="van-sku-actions dis-box corwd-footer">
							<view class="left-btn box-flex color-red">
								<text class="color-9">合计:</text><text>{{crowdPropertyData.result?crowdPropertyData.result:'请选择'}}</text>
							</view>
							<view style="width: 200upx;">
								<view class="van-button-bottom-action van-button van-button-primary van-button-normal">
									<text class="van-button-text" @click="bargainLogCheckout">确定</text>
								</view>
							</view>
						</view>				
						
						
					</view>
                </uni-popup>
            </view>
            <!--详情-->
            <view v-if="filter =='detail'" style="margin-top:80upx">
                <view class="dis-box tab-common  f-05 bg-color-write text-center">
                    <view class="box-flex ">
                        <view class="item " :class="{'active':filter_detail === 'detail-index'}" @click="handleFilterDetail('detail-index')">
                            <text>项目主页</text>
                        </view>
                    </view>
                    <view class="box-flex" @click="onInstructions">
                        <view class="item" :class="{'active':filter_detail === 'instructions'}" @click="handleFilterDetail('instructions')">
                            <text>风险说明</text>
                        </view>
                    </view>
                </view>
                <!--主页-->
                <view v-if="filter_detail =='detail-index'">
                  <view class="bg-color-write padding-all f-03 goods_desc" v-if="crowdProoertiesData.details!=''" v-html="crowdProoertiesData.details"></view>
                    <view v-else>
                        <dsc-not-content></dsc-not-content>
                    </view>
                </view>
                <view v-if="filter_detail =='instructions'">
                    <view class="bg-color-write padding-all f-03" v-if="crowdProoertiesData.risk_instruction!=''" v-html="crowdProoertiesData.risk_instruction"></view>
                    <view v-else>
                       <dsc-not-content></dsc-not-content>
                    </view>
                </view>
            </view>
            <!--话题-->
            <view v-if="filter =='topic'" style="margin-top:80upx">
                <view waterfall-disabled="disabled" waterfall-offset="300" v-if="crowdTopicListData != ''">
                    <view class="qinyou-cont crowd-comment-icon">
                        <view class="bg-color-write li" v-for="(item, index) in crowdTopicListData" :key="index">
							<view class="dis-box">
								<view class="left">
									<view class="img-box">
										<img v-if="item.user_picture" class="img" :src="item.user_picture" />
										<img v-else class="img" src="../../../static/get_avatar.png" />
									</view>
								</view>
								<view class="box-flex">
									<view class="dis-box m-top02">
										<text class="f-05 color-3 box-flex">{{item.user_name}}</text>
									</view>
									<text class="color-9 f-02 m-top04">{{item.add_time}}</text>
								</view>
							</view>
							<view class="f-03 color-3 padding-all">{{item.content}}</view>
                        </view>
                    </view>
                </view>
                <view v-else>
                    <dsc-not-content></dsc-not-content>
                </view>
            </view>
			
        </view>
		
		<dsc-common-nav>
			<navigator  @click="$outerHref('/pagesA/crowdfunding/crowd','app')" class="nav-item" slot="right">
				<view class="iconfont icon-team"></view>
				<text>微筹广场</text>
			</navigator>			
		</dsc-common-nav>		
    </view>
</template>

<script>
import { mapState } from 'vuex'
import uniPopup from '@/components/uni-popup.vue'; 
import dscNotContent from '@/components/dsc-not-content.vue';
import dscCommonNav from '@/components/dsc-common-nav.vue';


export default {
    name: "auction-detail",
    components: {
		uniPopup,
		dscNotContent,
        dscCommonNav
    },
    data() {
        return {
			navTabs: ['商品', '详情','话题'],
            routerName:'crowd_funding',
            radio: '1',
            crowArr_id:'',
            pid:'',
            id:'',
            number:1,
            showBase: false,
            filter: "goods", //默认选中值
			datailfilter:"topic",
            filter_detail:'detail-index',
            tabs: ['实时话题', 'ta的支持者', '项目动态'],
            active: 0,
            disabled:false,
            loading:true,
            size:10,
            page:1,
        }
    },
    //初始化加载数据
    onLoad(e){
    	this.id = e.id
        this.$store.dispatch('setCrowdfundingShow',{
            id:this.id
        })

        this.crfTopicList()

        this.onInstructions()
    },
    computed: {
        ...mapState({
            //众筹商品信息
            crowdShowData: state => state.crowdfunding.crowdShowData,
            //众筹详情信息
            crowdProoertiesData: state => state.crowdfunding.crowdProoertiesData,
            //众筹详情属性信息
            crowdPropertyData: state => state.crowdfunding.crowdPropertyData,
        }),
        //众筹话题
        crowdTopicListData:{
            get(){
                return this.$store.state.crowdfunding.crowdTopicListData
            },
            set(val){
                this.$store.state.crowdfunding.crowdTopicListData = val  
            }
        },
        isLogin(){
        	return this.$isLogin()
        },
        crowdCollectStatue(){
            return this.$store.state.crowdfunding.crowdCollectStatue
        },
        is_collect:{
            get(){
                return this.$store.state.crowdfunding.crowdShowData.info.is_collect
            },
            set(val){
                this.$store.state.crowdfunding.crowdShowData.info.is_collect = val
            }
        },
    },
    methods: {
        //话题列表请求
        crfTopicList(page){
            if(page){
                this.page = page
                this.size = Number(page) * 10
            }

            this.$store.dispatch('setCrowdfundingMyTopicList',{
                id:this.id,
                page:this.page,
                size:this.size
            })
        },
        //属性弹框  
        crowsdCheck() {
            this.showBase = true
        },
        //关闭属性弹框
        closeSku() {
            this.showBase = false;
            this.bargainBidData.bargain_join =''
        },
        //属性选择
        crowArr(item){
            this.crowArr_id = item.id
            this.pid= item.pid
            this.id= item.id
			
            this.$store.dispatch('setCrowdfundingProperty',{
                pid: this.pid,
                id:this.id,
                number: this.number,
            })
        },
        //提交
        bargainLogCheckout(){			
            if(this.$store.state.crowdfunding.crowdPropertyData.result==undefined){
				uni.showToast({
					title:'请选择回报方案',
					icon:'none'
				});	
            }else{
				uni.navigateTo({
					url:'/pagesA/crowdfunding/checkout/checkout?id='+this.id+'&pid='+this.pid+'&number='+this.number
				})		
            }
        },
        //菜单模式切换
        handleFilter(val) {
            this.filter = val;
        },		
		//菜单模式切换
		datailFilter(val) {
		    this.datailfilter = val;
		},	
        //话题、评论
        topicClick(item) {
            let topic_id = item.topic_id ? item.topic_id : 0
			let id = this.$store.state.crowdfunding.crowdShowData.info.id
			uni.navigateTo({
				url:'/pagesA/crowdfunding/topic/topic?id='+id+'&topic_id='+topic_id
			})
        },
        //设置详情
        detailClick(){
            this.filter = 'detail'
        },
        topicListMore(){
            this.filter = 'topic'
        },
        handleFilterDetail(val){
            this.filter_detail = val;
        },
        //风险说明
        onInstructions(){
            let Instructions= {
                id:this.id,
            }
            this.$store.dispatch('setCrowdfundingProperties',Instructions)
        },
        //收藏
        Collection(){
            if(this.$isLogin()){
                this.$store.dispatch('setCrowdfundingFocus',{
					
                    id:this.$store.state.crowdfunding.crowdShowData.info.id,
                    status:this.is_collect
                })
            }else{
				uni.showModal({
					content:'请登录后收藏该商品!',
					success:(res)=>{
						if(res.confirm){
							uni.navigateTo({
								url:'/pages/login/login?delta=1'
							})
						}
					}
				})
				
				
            }
        },
    },
	onReachBottom(){
		if(this.page * this.size == this.crowdTopicListData.length){
			this.page ++
			this.crfTopicList()
		}
	},
    watch:{
        crowdCollectStatue(){
            this.is_collect = this.crowdCollectStatue
        }
  	}
}
</script>


<style>
	.con {max-width: 640px; min-width: 320px; min-height: 100vh; margin-right: auto; margin-left: auto; overflow: hidden;}
	.con_main {padding-bottom: 200upx;}
	.cro-detail .nav {position: fixed; left: 0; right: 0; top: 0; z-index: 9;}
	.tab-common {overflow: hidden; width: 100%; height: 80upx; line-height: 80upx; border-bottom: 1px solid #f4f4f4;}
	.f-05 {font-size: 30upx;}
	.text-center {text-align: center;}
	.bg-color-write {background: #fff;}
	.dis-box {display: -webkit-box;}
	.box-flex {-webkit-box-flex: 1; display: block!important; width: 100%;}
	.tab-common .item {position: relative;}
	.tab-common .item.active, .tab-common .item.active .iconfont { color: #f92028;}
	.text-right { text-align: right;}
	.text-left {text-align: left;}
	.m-top40 {margin-top: 80upx;}
	.van-swipe {overflow: hidden; position: relative; user-select: none;}
	.van-swipe-track {width: 375px;transition-duration: 500ms;transform: translateX(0px); height: 100%;}
	.van-swipe-item {float: left;width: 375px; height: 100%; transform: translateX(0px);}
	.title_img{width:100%;}
	.padding-all {padding: 22upx;}
	.cro-detail .detail-user img {width: 76upx;height: 76upx;border-radius: 100%;}
	.cro-detail .detail-user .name {font-size: 36upx;line-height: 2.2;}
	.p-l05 {padding-left: 20upx;}
	.color-red {color: #f92028;}
	.cro-detail .detail-user .right .span {padding: 4upx 20upx; margin-top: 16upx;}
	.color-white {color: #fff;}
	.br-100 {border-radius: 100px;}
	.f-04 {font-size: 28upx;}
	.fr {float: right;}
	
	.m-top08 {margin-top: 16upx;}
	.goods .cont-box .title {line-height: 1.3;}
	.color-3 {color: #333;}
	.f-weight {font-weight: 700;}
	.m-top06 {margin-top: 18upx;}
	.of-hidden {overflow: hidden;}
	.color-9 {color: #999;}
	.f-03 {font-size: 26upx;}
	.ect-progress {margin: 18upx 0;}
	.ect-progress .wrap {position: relative;margin-bottom: 2px;height: 5px;border-radius: 5px;background-color: #efeeee;overflow: hidden;}
	.ect-progress .bar, .ect-progress .color {display: block;height: 100%;border-radius: 4px;}	
	.ect-progress .color {width: 100%;background: #f92028;}
	.ect-progress .txt {font-size: 24upx;text-align: right;color: #777;line-height: 10upx;padding-left: 20upx;}
	.f-02 {font-size: 24upx;}
	.van-col {width: 33.33333333%; float: left; box-sizing: border-box;}
	.col-9 {color: #999;}
	.iconfont {margin-right:10rpx;font-size:14px;}
	.border-t-common {border-top: 1px solid #f3f3f3;}
	.label {display: inline-block; max-width: 100%;font-weight: 400;margin-bottom: 0;}
	.van-cell-group {background-color: #fff;}
	.van-cell {padding: 13px 15px;}
	.van-cell-title{-webkit-box-flex: 1;flex: 1;}
	.ect-progress .color {width: 100%; background: #f92028;}
	.goods-li .li .left .title-img {width: 100%; display: block;}
	.cro-detail .detail-scheme {padding: 16upx 22upx;}
	.cro-detail .detail-scheme .left {width: 120upx;}
	.cro-detail .detail-scheme .left img {width: 80upx; height: 80upx;	}
	.f-04 {font-size: 28upx;}
	.m-top04 {margin-top: 8upx;}
	
	.van-tabs {padding-top: 44px;position: relative;}
	.van-tabs-wrap {height: 44px;}
	.van-tabs-wrap {top: 0; left: 0; right: 0; overflow: hidden; position: absolute;}
	.van-tabs-nav-line {height: 100%;padding-bottom: 15px; box-sizing: content-box;}	
	.van-tabs-nav {display: flex;user-select: none; position: relative;background-color: #fff;}
	.van-tabs-line {z-index: 1;left: 0;bottom: 15px;height: 2px;position: absolute;border-radius: 2px 0;background-color: #f44;}
	.van-tabs-line {height: 1px; display: none;}
	.van-tab {-webkit-box-flex: 1;flex: 1;cursor: pointer;padding: 0 5px;font-size: 14px;position: relative;line-height: 44px; text-align: center;box-sizing: border-box;
	    background-color: #fff; min-width: 0;}
	.van-tab.active { color: #f92028;}
	.van-ellipsis {overflow: hidden;white-space: nowrap;text-overflow: ellipsis;}
	.van-cell {padding: 13px 15px;}
	.van-cell-value {overflow: hidden;text-align: right;position: relative;vertical-align: middle;}
	.van-cell-title, .van-cell-value {flex: 1;}
	.bargain-detail .qinyou-cont .li {padding: 16upx 22upx;border-bottom: 1px solid #f4f4f4;}
	.bargain-detail .qinyou-cont .li .left {width: 80upx;margin-right: 20upx;}
	.bargain-detail .qinyou-cont .li .left .img-box {width: 80upx;border-radius: 50%;overflow: hidden;}
	.img-box {position: relative;display: block;padding-top: 100%;}
	.img-box .img {position: absolute;top: 0;left: 0; width: 100%;height: 100%;}
	.m-top02 {margin-top: .2rem;}
	.van-goods-action {left: 0; right: 0; bottom: 0; display: flex; position: fixed;}
	.van-goods-action-mini-btn.curr {color: #f92028;}
	.van-goods-action-mini-btn {display: flex;height: 50px;font-size: 10px;min-width: 15%;line-height: 1;text-align: center;background-color: #fff;-webkit-box-orient: vertical;
	    -webkit-box-direction: normal;flex-direction: column;-webkit-box-pack: center;justify-content: center;}
	.van-goods-action-big-btn {-webkit-box-flex: 1;flex: 1;padding: 0;}
	.van-button-square {border-radius: 0;}
	.van-button--large {width: 100%;height: 50px;line-height: 48px;}
	.van-button-danger {color: #fff;background-color: #f44;border: 1px solid #f44;}
	.van-button {position: relative;display: inline-block;box-sizing: border-box;font-size: 16px;text-align: center;-webkit-appearance: none;}
	
	
	.van-modal {position: fixed; width: 100%; height: 100%; top: 0;left: 0;background-color: rgba(0,0,0,.7);}
	.van-popup.attr-goods-box {overflow: visible!important;}
	.van-popup-bottom {width: 101%;}
	.van-popup-bottom {top: auto; bottom: 0; right: auto;left: 50%;transform: translate3d(-50%,0,0);}
	
	
	.attr-goods-box .crowd-cont .van-radio .li .left-icon {width: 60upx;}
	.attr-goods-box .crowd-cont .van-radio .li .left-icon .label {margin-top: 20upx;width: 36upx;height: 36upx;border-radius: 40upx; border: 1px solid #ccc;}
	.label {display: inline-block;max-width: 100%;font-weight: 400;margin-bottom: 0;}
	.attr-goods-box .crowd-cont .van-radio {border-bottom: 1px solid #f6f6f9;}
	.my-bottom, .wallet-bt {border-bottom: 1px solid #f6f6f9;}
	.van-sku-actions {display: flex;}
	.attr-goods-box .corwd-footer {border-top: 1px solid #eee;}
	.attr-goods-box .corwd-footer .left-btn {line-height: 74upx;padding-left: 22upx;font-size: 30upx;}
	.color-red {color: #f92028;}
	.van-button-bottom-action.van-button-primary {background-color: #f92028;}
	.van-button-primary {background-color: #f92028;border-color: #f92028;}
	.van-button-bottom-action {width: 100%;height: 50px;line-height: 50px;border: 0;border-radius: 0;font-size: 16px;color: #fff;}
	
</style>
