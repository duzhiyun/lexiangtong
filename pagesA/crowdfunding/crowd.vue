<template>
    <view class="cro_funing con_main" >
        <view class="search-nav">
            <view class="search dis-box">
              <view class="f-04 box-flex">
                <input class="f-03 input" type="text" v-model="value" placeholder="商品搜索" autocomplete="off" value="">
              </view>
              <!-- <view class="icon-search-box" @click="onSearch"><i class="iconfont icon-sousuo1 f-05 color-7"/></view> -->
			  <view class="uni-icon uni-icon uni-icon-search uni-icon-search icon-search-box" style="color:#666666;font-size:22px;" @click="onSearch"></view>
			  
            </view>
        </view>
        <!--分类-->
        <view class="dis-box tab-common nav f-05 bg-color-write text-center">
            <view class="box-flex">
                <view class="item" :class="{'active':filter === 'sort'}" @click="handleFilter('sort')">
                    <text>综合排序</text>                    
					<text class="iconfont icon-arrow-down"></text>
                </view>
            </view>
            <view class="box-flex">
                <view class="item" :class="{'active':filter === 'all'}" @click="handleFilter('all')">
                    <text>全部商品</text>
                    <text class="iconfont icon-arrow-down"></text>
                </view>
            </view>
            <view class="item item-icon" @click="listModeClick">
                <view v-if="listMode === 'active'">
                    <i class="iconfont icon-grid"></i>
                </view>
                <view v-else>
                    <i class="iconfont icon-list"></i>
                </view>
            </view>
        </view>
        <!--导航-->
        <view class="tabCon  bg-color-write" :class="{'active':tabMode === 'active'}">
            <view class="cont-max-height" v-show="filter == 'sort'">
               <view v-model="radio" class="padding-all bg-color-write van-radio-group">
					<view v-for="(item,index) in filterSort" :key="index" :name ='1' class="van-radio" :class="{'active':filter_sort === item.cat_id}">
						<view class="van-radio-input">
                            <text class="van-radio-control" @click="sortingClick(item)">{{item.cat_name}}</text>
						</view>
					</view>
                </view>
            </view>
            <view class="cont-max-height" v-show="filter == 'all'">
                <view v-model="radio" class="padding-all bg-color-write  van-radio-group">
					<view :name ='0' class="van-radio" :class="{'active':cur_id == 0}" >
						<view class="van-radio-input">
							<text class="van-radio-control" @click="navCheck(0)"> 全部</text>
						</view>
					</view>
					<view :name ='item.cat_id' class="van-radio" :class="{'active':cur_id == item.cat_id}"  v-for="(item,index) in crowdIndexData" :key="index">
						<view class="van-radio-input">
							<text class="van-radio-control" @click="navCheck(item)"> {{item.cat_name}}</text>
						</view>
					</view>
                </view>
            </view>
            <view class="foorer-nav" @click="bgClick">
                <i class="iconfont icon-Collapse j-text-all"></i>
            </view>
        </view>
        <!--商品列表-->
        <view class="goods-li" v-waterfall-lower="loadMore" waterfall-disabled="disabled" waterfall-offset="300" v-if="crowdGoodsData  && crowdGoodsData.length > 0">
            <view  class="show bg-color-write li" :class="{'active':listMode === 'active'}" v-for='(item,index) in crowdGoodsData' :key="index" @click="$outerHref('/pagesA/crowdfunding/detail/detail?id='+item.id,'app')">
                <view class="left p-r">
                    <img style="width: 100%; height: auto; display: block;" class="img" :src="item.title_img" v-if="item.title_img" />
                    <img class="img" src="../../static/not_goods.png" v-else />
                    <view class="raise-cate-tag"><i class="iconfont icon-gerenzhongxin icon-geren"></i>{{item.join_num}}</view>
                </view>
                <view class="right">
                    <text class="f-05 color-3">{{item.title}}</text>
                    <view class="goods-num">
                        <view class="list f-02 color-9">支持人数
                            <text class="color-red">{{item.join_num}}</text>人
                        </view>
                        <view class="list f-02 color-9">剩余时间：{{item.shenyu_time}}天</view>
                    </view>
                    <view class="ect-progress dis-box">
                        <text class="wrap box-flex">
                            <text class="bar" :style="{width:item.baifen_bi + '%'}">
                                <i class="color"></i>
                            </text>
                        </text>
                        <text class="txt f-02">{{item.baifen_bi}}%</text>
                    </view>
                    <view class="goods-cont">
                        <view class="list f-02 color-9">已筹：
                            <text class="color-red">{{item.join_money}}</text>
                        </view>
                        <view class="list f-02 color-9">目标：
                            <text class="color-red">{{item.amount}}</text>
                        </view>
                    </view>
                </view>
            </view>
        </view>
        <view v-else>
            <dsc-not-content></dsc-not-content>
        </view>
        <view v-if="loading">
            <van-loading type="spinner" color="black" />
        </view>        
        <view class="bg-cont" :class="{'active':tabMode === 'active'}" @click="bgClick"></view>
        <CroTabbar> </CroTabbar>
		<dsc-common-nav></dsc-common-nav>
    </view>
</template>

<script>
	import { mapState } from 'vuex' 
	import CroTabbar from './components/croTabbar' 	
	import dscNotContent from '@/components/dsc-not-content.vue'; 
	import dscCommonNav from '@/components/dsc-common-nav.vue';
	export default {
		name: "auction",
		data() {
			return {
				routerName:'crowd_funding',
				filter_sort:'id',
				filterSort:[
				{
					cat_id:'id',
					cat_name:'综合排序'
				},
				{
					cat_id:'new',
					cat_name:'最新上线'
				},
				{
					cat_id:'amount',
					cat_name:'金额最多'
				},
				{
					cat_id:'join_num',
					cat_name:'支持最多'
				}
			  ],
				cur_id:0,
				radio: '1',
				listMode: "active", //模式列表模式
				tabMode: "",
				filter: "", //默认选中值
				value: "", //搜索默认值
				disabled:false,
				loading:true,
				size:10,
				page:1,
			};
		},
		components: {
			 CroTabbar,
			 dscNotContent,
			 dscCommonNav
		},
		//初始化加载数据
		created() {
			this.$store.dispatch('setCrowdfunding')
			this.crowdGoods(this.filter_sort,this.cur_id,this.value)
		},
		computed: {
			...mapState({
				crowdIndexData: state => state.crowdfunding.crowdIndexData
			}),
			crowdGoodsData:{
				get(){
					return this.$store.state.crowdfunding.crowdGoodsData
				},
				set(val){
					this.$store.state.crowdfunding.crowdGoodsData = val
				}
			}
		},
		methods: {
			//综合排序
			navCheck(item){
				this.page=1  
				if(item === 0){
					this.cur_id = item
				}else{
					this.cur_id = item.cat_id
				}
				this.crowdGoods(this.filter_sort,this.cur_id,this.value)
				this.tabMode = this.tabMode === "active" ? "" : "active"
			},
			//全部商品
			sortingClick(item){
				this.page = 1   
				this.filter_sort = item.cat_id
				this.crowdGoods(this.filter_sort,this.cur_id,this.value)
				this.tabMode = this.tabMode === "active" ? "" : "active"
			},
			onSearch() {
				let value = this.value;
				this.crowdGoods(this.filter_sort,this.cur_id,this.value)
			},
			crowdGoods(status,cat_id,value) {
				let crowdGoods = {
					status: status,
					cat_id:cat_id,
					keyword: value,
					page:this.page,
					size:this.size
				}
				this.$store.dispatch('setCrowdfundingGoods',crowdGoods)
			},
			//菜单模式切换
			handleFilter(val) {
				this.filter = val
				this.tabMode = this.tabMode === "" ? "active" : "active"
			},
			//商品列表模式
			listModeClick() {
				this.listMode = this.listMode === "active" ? "" : "active"
				this.tabMode = this.tabMode === "active" ? "" : ""
			},
			//菜单显示影藏
			bgClick() {
				this.tabMode = this.tabMode === "active" ? "" : "active"
			},
		},
		onReachBottom(){
			if(this.page * this.size == this.crowdGoodsData.length){
				this.page ++
				this.crowdGoods(this.filter_sort,this.cur_id,this.value)
			}
		}
	}
</script>

<style>
	/* 搜索 */
	.search-nav {background: #fff!important; border-bottom: 1px solid #f5f5f5; padding: 20upx;}
	.search-nav .search {height: 72upx; border: 1px solid #e6e6e6; border-radius: 40upx; overflow: hidden; padding: 0 0 0 30upx;}
	.dis-box {display: -webkit-box;}
	.f-04 {font-size: 28upx;}
	.box-flex {display: block!important; -webkit-box-flex: 1;width: 100%;}
	.search-nav .search .input {height:72rpx; line-height: 72upx; width: 100%upx;}
	.f-03 {font-size: 28upx;}
	.search-nav .search .icon-search-box {width: 80upx;text-align: center;height: 72upx;line-height: 72upx;}
	.color-7 {color: #777;}
	.f-05 {font-size: 30upx;}
	/* 分类 */
	.tab-common {overflow: hidden; width: 100%; height: 90upx; line-height: 90upx; border-bottom: 1px solid #f4f4f4;}	
	.text-center {text-align: center;}
	.bg-color-write {background: #fff;}
	.dis-box {display: -webkit-box;}
	.tab-common .item {position: relative;}
	.cro_funing .nav .item-icon {width: 120upx;}
	.tab-common .item.active, .tab-common .item.active .iconfont { color: #f92028;}
	.tab-common .item {position: relative;}
	.cro_funing .tabCon.active {display: block;}
	.cro_funing .tabCon {position: fixed;z-index: 100;left: 0; right: 0; top: 194upx; display: none;}
	.cro_funing .tabCon .cont-max-height { min-height: 200upx; max-height: 200upx;}
	.cro_funing .tabCon .van-radio-group {overflow: hidden;}
	.padding-all {padding: 22upx;}
	.cro_funing .tabCon .van-radio-group .van-radio:nth-child(3n+1) {padding-left: 0; padding-right: 12upx;}
	.cro_funing .tabCon .van-radio-group .van-radio {padding: 10upx 8upx;float: left;width: 31%;}
	.van-radio {user-select: none;}
	.van-radio-input {height: 20upx; position: relative; font-size: 30upx;}
	.van-radio-control {top: 0; left: 0; margin: 0; width: 100%; height: 100%;}
	.cro_funing .bg-cont {background: rgba(0,0,0,.4);position: fixed;right: 0;left: 0; bottom: 0; top: 194upx; z-index: 1; display: none;}
	.cro_funing .bg-cont.active {display: block;}
	/*列表 */
	.goods-li {overflow: hidden; margin-bottom: 20upx;}
	.goods-li .li.active:nth-child(2n-1) {padding-left: 14upx; padding-right: 2upx;}
	.goods-li .li:first-child { border-top: none;}
	.goods-li .li.active {background: #f4f4f4;position: relative;padding: 16upx 14upx 0 2upx; width: 50%;float: left; margin: 0;}
	.goods-li .li {border-radius: 5px;}
	.goods-li .li.active .left { border-radius: 8px 8px 0 0;}
	.goods-li .li.active .left, .goods-li .li.active .right {float: inherit; width: 100%;background: #fff; overflow: hidden;}
	.p-r {position: relative;}
	image {width:320px;height:240px;display:inline-block;overflow:hidden;}
	.cro_funing .goods-li .li.active .raise-cate-tag {background: rgba(0,0,0,.5);display: inline-block;position: absolute; top: 20upx; right: 20upx;padding: 2upx 16upx 2upx 40upx;
	    color: hsla(0,0%,100%,.8);font-size: 1.3rem;border-radius: 3rem;}
	.goods-li .li.active .right {padding: 12upx 20upx 26upx;border-radius: 0 0 8px 8px;}
	.goods-li .li.active .left, .goods-li .li.active .right {float: inherit;width: 100%;background: #fff;overflow: hidden;}
	.goods-li .li.active .right {padding: 12upxrem 20upx 26upx; border-radius: 0 0 8px 8px;}
	.goods-li .li.active .left, .goods-li .li.active .right {float: inherit; width: 100%; background: #fff;overflow: hidden;}
	.cro_funing .goods-li .li.active .right h4 {overflow: hidden;text-overflow: ellipsis;display: -webkit-box;-webkit-line-clamp: 2; -webkit-box-orient: vertical; height: 68upx;}
	.cro_funing .goods-li .li.active .goods-num { display: none;}
	.cro_funing .goods-li .li .goods-cont, .cro_funing .goods-li .li .goods-num { overflow: hidden;}
	.cro_funing .goods-li .li .goods-cont .list, .cro_funing .goods-li .li .goods-num .list { width: 50%;float: left;}	
	.color-9 {color: #999;}
	.f-02 {font-size: 24upx;}
	.color-red {color: #f92028;}
	.ect-progress {margin: 12upx 0;}
	.ect-progress .wrap {position: relative; margin-bottom: 2px;height: 5px;border-radius: 5px;background-color: #efeeee;overflow: hidden;}
	.box-flex {-webkit-box-flex: 1;display: block!important;width: 100%;}
	.ect-progress .bar, .ect-progress .color {display: block;height: 100%;border-radius: 4px;}
	.ect-progress .bar, .ect-progress .color {display: block; height: 100%; border-radius: 4px;}
	.ect-progress .color { width: 100%; background: #f92028;}
	.ect-progress .txt { font-size: 24upx;text-align: right;color: #777; line-height: 10upx; padding-left: 20upx;}
	.cro_funing .goods-li .li.active .goods-cont .list {width: 100%;}
	.cro_funing .goods-li .li .goods-cont .list, .cro_funing .goods-li .li .goods-num .list {float: left;}

</style>