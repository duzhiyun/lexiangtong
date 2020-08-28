<template>
	<view class="container">
		<uni-nav-bar mpNavbar="true" backgroundColor="#F8F8F8" leftState="false" title="商品详情" :curpage="curpage"></uni-nav-bar>
		<view class="header-nav-content" :style="{top:customBar + 'px'}">
			<view class="items">
				<view v-for="(item,index) in navTabs" :key="index" class="item" @click="onTabs(index)" :class="{'active':navActive == index}">
					<uni-icon type="location-filled" size="14" color="#f92028" v-if="navActive == index"></uni-icon>
					<text>{{item}}</text>
				</view>
			</view>
			<!-- #ifdef APP-PLUS -->
			<view class="share" @tap="appShare"><text class="iconfont icon-share"></text></view>
			<!-- #endif -->
		</view>
		<scroll-view class="scrollList" scroll-y :scroll-into-view="scrollViewId" :style="{height:winHeight + 'px'}">
			<view class="goods-wrap" id="tab0">
				<view class="banner">
					<swiper indicator-dots="true">
						<swiper-item v-if="goodsInfo.goods_video">
							<view class="goods-img-first" @click="clickVideo">
								<image :src="gallerylList[0].img_url" class="imgbox" v-if="gallerylList"></image>
								<view class="playicon">
									<view class="iconfont icon-play"></view>
								</view>
							</view>
						</swiper-item>
						<block v-if="gallerylList.length > 0">
							<swiper-item v-for="(item,index) in gallerylList" :key="index">
								<image :src="item.img_url" class="imgbox"></image>
							</swiper-item>
						</block>
						<block v-else>
							<swiper-item><image :src="goodsInfo.goods_img" class="imgbox"></image></swiper-item>
						</block>
					</swiper>
				</view>
				<view class="goods-price">
					<text class="price-original">{{ goodsPriceManage }}</text>
					<text class="price-favour">{{ goodsPriceMarketManage }}</text>
					<!-- #ifdef MP-WEIXIN -->
					<view class="drp-share" v-if="goodsInfo.is_show_drp > 0 && goodsInfo.commission_money != 0 && goodsInfo.is_distribution == 1" @click="mpShare"><icon class="iconfont icon-share"></icon><text>分享赚{{goodsInfo.commission_money}}</text></view>
					<view class="drp-share" v-else @click="mpShare"><icon class="iconfont icon-share"></icon><text>分享</text></view>
					<!-- #endif -->
				</view>
<!-- 				<view class="price-box" v-if="goodsInfo.promote_end_date > 0 &&  goodsInfo.promote_start_date > 0">
					<view class="left">{{ regionGoodsPirceFormated ? regionGoodsPirceFormated : goodsPriceManage }}</view>
					<view class="right">
						<block v-if="goodsInfo.status">
							<text>距离结束还剩:</text>
						</block>
						<block v-else>
							<text>即将开始还剩:</text>
						</block>
						<view class="data">
							<block v-if="isTimeEnd">
								<uni-countdown fontColor="#FFFFFF" borderColor="#f23157" bgrColor="#f23157" :timer="dateTime" v-if="dateTime"></uni-countdown>
							</block>
							<block v-else>
								<text class="end">活动结束</text>
							</block>
						</view>
					</view>
				</view> -->
				<view class="price-box" v-if="goodsInfo.seckill_end_date > 0 &&  goodsInfo.seckill_begin_date > 0">
					<view class="left">{{ regionGoodsPirceFormated ? regionGoodsPirceFormated : goodsPriceManage }}</view>
					<view class="right">
						<block v-if="goodsInfo.isTimeEnd==0">
							<text>距离结束还剩:</text>
						</block>
						<block v-else-if="goodsInfo.isTimeEnd==2">
							<text>即将开始还剩:</text>
						</block>
						<block v-else>
							<text>即将开始还剩:</text>
						</block>
						<view class="data">
							<block>
								<uni-countdown fontColor="#FFFFFF" borderColor="#f23157" bgrColor="#f23157" :timer="sdateTime" v-if="sdateTime"></uni-countdown>
							</block>
						</view>
					</view>
				</view>
<!-- 				<view class="hig-vip" v-if="goodsInfo.is_drp && goodsInfo.drp_shop == 0">
					<view class="hig-vip-warp">
						<view class="text">
							<icon><image src="../../static/vip/icon-vip.png" mode="widthFix"></image></icon>
							<block v-if="goodsInfo.membership_card_discount_price > 0">高级VIP享超值优惠价{{goodsInfo.membership_card_discount_price_formated}}</block>
							<block v-else>高级VIP可享超值优惠价</block>
						</view>
						<view @click="$outerHref('/pagesA/drp/register/register',$isLogin())" class="vip-register">
							<text>立即开通</text>
							<uni-icon type="forward" size="18" color="#E3C49E"></uni-icon>
						</view>
					</view>
				</view> -->
				<view class="hig-vip" v-for="(item,index) in goodsInfo.placeorder" :key="index">
					<view class="hig-vip-warp">
						<view class="text">
							<icon><image :src="getico(item.user_picture)" mode="widthFix"></image></icon>
							<block>{{item.nick_name}}于{{item.add_date}}参与秒杀</block>
							<icon v-if="item.is_winner == 1"><image src="../../static/lucky.png" mode="widthFix" style="width: 80rpx;"></image></icon>
						</view>
					</view>
				</view>
				<view class="goods-title" :class="{'active':goodsInfo.promote_end_date > 0 &&  goodsInfo.promote_start_date > 0}">
					<view class="tit"><uni-tag text="自营" size="small" type="error" v-if="goodsInfo.user_id == 0"></uni-tag>{{ goodsInfo.goods_name }}</view>
					<view class="brief" v-if="goodsInfo.goods_brief">{{ goodsInfo.goods_brief }}</view>
				</view>
				<view class="goods_outer">
					<view class="text-left">销量 {{ goodsInfo.sales_volume }}</view>
					<view class="text-center">当前库存 {{ stock }}</view>
					<view class="text-right" v-if="goodsInfo.basic_info">
						<text v-if="goodsInfo.basic_info.province_name">{{ goodsInfo.basic_info.province_name }}</text>
						<text v-if="goodsInfo.basic_info.city_name">{{ goodsInfo.basic_info.city_name }}</text>
					</view>
				</view>
				<view class="uni-card uni-card-not" v-if="goodsInfo.coupon_count > 0 || (goodsInfo.goods_extend && (goodsInfo.goods_extend.is_reality || goodsInfo.goods_extend.is_return || goodsInfo.goods_extend.is_fast)) || (handlePromotion && handlePromotion.length > 0)">
					<view class="uni-list">
						<view class="uni-list-cell uni-cell-coupon" hover-class="uni-list-cell-hover" v-if="goodsInfo.coupon_count > 0" @click="handleCoupon">
							<view class="uni-list-cell-navigate uni-navigate-right">
								<text class="title">领券</text>
								<view class="value"><text class="iconfont icon-coupon"></text>领取优惠券({{ goodsInfo.coupon_count }})</view>
							</view>
						</view>
						<view class="uni-list-cell uni-cell-promotion" hover-class="uni-list-cell-hover" @click="handlePromotion" v-if="goods_promotion && goods_promotion.length > 0">
							<view class="uni-list-cell-navigate uni-navigate-right">
								<text class="title">促销</text>
								<view class="value promotion-list">
									<view class="promotion-item" v-for="(item,index) in goods_promotion" :key="index" v-if="index < 2">
										<uni-tag text="满赠" size="small" type="error" v-if="item.act_type == 0"></uni-tag>
										<uni-tag text="立减" size="small" type="error" v-if="item.act_type == 1"></uni-tag>
										<uni-tag text="折扣" size="small" type="error" v-if="item.act_type == 2"></uni-tag>
										<uni-tag text="团购" size="small" type="error" v-if="item.act_type == 3"></uni-tag>
										<uni-tag text="拍卖" size="small" type="error" v-if="item.act_type == 4"></uni-tag>
										<uni-tag text="满减" size="small" type="error" v-if="item.act_type == 5"></uni-tag>
										<text class="act_name">{{item.act_name}}</text>
									</view>
									<view class="promotion-item" v-if="goods_promotion && goods_promotion.length > 2">
										<view class="tag-item" v-for="(item,index) in goods_promotion" :key="index" v-if="index > 1">
											<uni-tag text="满赠" size="small" type="error" v-if="item.act_type == 0"></uni-tag>
											<uni-tag text="立减" size="small" type="error" v-if="item.act_type == 1"></uni-tag>
											<uni-tag text="折扣" size="small" type="error" v-if="item.act_type == 2"></uni-tag>
											<uni-tag text="团购" size="small" type="error" v-if="item.act_type == 3"></uni-tag>
											<uni-tag text="拍卖" size="small" type="error" v-if="item.act_type == 4"></uni-tag>
											<uni-tag text="满减" size="small" type="error" v-if="item.act_type == 5"></uni-tag>
										</view>
									</view>
								</view>
							</view>
						</view>
						<view class="uni-list-cell" v-if="goodsInfo.goods_extend && (goodsInfo.goods_extend.is_reality || goodsInfo.goods_extend.is_return || goodsInfo.goods_extend.is_fast)">
							<view class="uni-list-cell-navigate">
								<text class="title">服务</text>
								<view class="value">
									<text class="mr10" v-if="goodsInfo.goods_extend && goodsInfo.goods_extend.is_reality">正品保证</text>
									<text class="mr10" v-if="goodsInfo.goods_extend && goodsInfo.goods_extend.is_return">七天无理由退换</text>
									<text v-if="goodsInfo.goods_extend && goodsInfo.goods_extend.is_fast">闪速配送</text>
								</view>
							</view>
						</view>
					</view>
				</view>
				<view class="uni-card uni-card-not">
					<view class="uni-list">
						<view class="uni-list-cell uni-collapse">
							<view class="uni-list-cell-navigate" :class="[listshow ? 'uni-active' : '',attr.length > 0 ? 'uni-navigate-bottom' : '']" hover-class="uni-list-cell-hover" @click="trigerCollapse()">
								<text class="title">已选</text>
								<view class="value">{{ attr_name }}</view>
							</view>
							<view class="uni-list-cell-navigate items" :class="listshow ? 'uni-active' : ''">
								<block v-if="listshow">
									<view class="item" v-for="(item,index) in attr" :key="index">
										<text class="title">{{ item.attr_name }}</text>
										<view class="value">
											<view>
												<view class="sku-list" v-for="(option,listIndex) in item.attr_key" :key="listIndex" :class="{'active':goodsAttrInit[index] == option.goods_attr_id}" @click="attrChange(index,option.goods_attr_id)">{{ option.attr_value }}</view>
											</view>
										</view>
									</view>
								</block>
								<view class="item">
									<text class="title">数量</text>
									<view class="value"><uni-number-box :value="number" :min="goodsInfo.is_minimum > 0 ? goodsInfo.minimum : 1" :max="stock" @change="bindChange"></uni-number-box></view>
								</view>
							</view>
						</view>
					</view>
				</view>
				<view class="uni-card uni-card-not">
					<view class="uni-list">
						<view class="uni-list-cell not-cell-bot" hover-class="uni-list-cell-hover" @click="handleRegion">
							<view class="uni-list-cell-navigate uni-navigate-right">
								<text class="title">送至</text>
								<view class="value">{{ regionSplic }}</view>
							</view>
						</view>
						<view class="uni-list-cell" hover-class="uni-list-cell-hover" v-if="goodsInfo.goods_extend">
							<view class="uni-list-cell-navigate">
								<text class="title">运费</text>
								<view class="value uni-red">{{ freight }}</view>
							</view>
						</view>
						<view class="uni-list-cell" hover-class="uni-list-cell-hover" v-if="goodsInfo.cross_border">
							<view class="uni-list-cell-navigate">
								<text class="title">进口税</text>
								<view class="value uni-red">{{ importTax }}</view>
							</view>
						</view>
					</view>
				</view>
				<view class="uni-card uni-card-not" v-if="goodsInfo.store_count > 0">
					<view class="uni-list">
						<view class="uni-list-cell" hover-class="uni-list-cell-hover" @click="onStoreClicked">
							<view class="uni-list-cell-navigate uni-navigate-right">
								<text class="title">门店自提</text>
							</view>
						</view>
					</view>
				</view>
				<view class="uni-card uni-card-not" v-if="mpChecked">
					<view class="uni-list">
						<view class="uni-list-cell uni-list-cell-title" hover-class="uni-list-cell-hover" @click="$outerHref('/pages/discover/list/list?id='+goods_id,'app')">
							<view class="uni-list-cell-navigate uni-navigate-right">
								<text class="title">网友讨论圈</text>
								<view class="value">
									<text class="iconfont icon-ask"></text>
									<text>商品好不好，问问买过的人吧</text>
								</view>
							</view>
						</view>
					</view>
				</view>
				<dsc-shop-header :shopInfo="shopInfo" :shopIndex="shopIndex" :shopScore="shopScore" :shopCollect="shopCollect" v-if="goodsInfo.user_id && mpChecked"></dsc-shop-header>
			</view>
			<view class="goods-detail-guess" id="tab1" v-if="goodsGuessList">
				<view class="title"><text>猜你喜欢</text></view>
				<view class="product-list-lie">
					<dsc-product-list :list="goodsGuessList" :productOuter="productOuter" guessList="true"></dsc-product-list>
				</view>
			</view>
			<view class="goods-desc" id="tab2">
				<view class="uni-common-mt">
					<uni-segmented-control :current="current" :values="tabs" v-on:clickItem="onClickItem" styleType="text" activeColor="#f92028"></uni-segmented-control>
				</view>
				<view class="content">
					<view v-show="current === 0">
						<block v-if="goodsDesc">
							<rich-text :nodes="goodsDesc"></rich-text>
						</block>
						<block v-else>
							<dsc-not-content></dsc-not-content>
						</block>
					</view>
					<view v-show="current === 1">
						<block v-if="goodsInfo.attr_parameter">
							<view class="table">
								<view class="tr">
									<view class="td">商品编号</view>
									<view class="td">{{goodsInfo.goods_sn}}</view>
								</view>
								<view class="tr colspan">
									<view class="td">主体</view>
								</view>
								<view class="tr">
									<view class="td">品牌</view>
									<view class="td">{{ goodsInfo.brand_name }}</view>
								</view>
								<view class="tr">
									<view class="td">商品重量</view>
									<view class="td">{{ goodsInfo.goods_weight }}kg</view>
								</view>
								<view class="tr colspan">
									<view class="td">产品规格</view>
								</view>
								<view class="tr" v-for="(item,index) in goodsInfo.attr_parameter" :key="index">
									<view class="td">{{item.attr_name}}</view>
									<view class="td">{{item.attr_value}}</view>
								</view>
							</view>
						</block>
						<block v-else>
							<dsc-not-content></dsc-not-content>
						</block>
					</view>
				</view>
			</view>
		</scroll-view>
		<view class="btn-goods-action">
			<!-- #ifdef MP-WEIXIN -->
			<button open-type="contact" type="default" size="5" session-from="weapp" class="item btn-cantact">
				<view class="iconfont icon-service"></view>
				<text class="txt">客服</text>
			</button>
			<!-- #endif -->
			<!-- #ifdef APP-PLUS || H5 -->
			<view class="item" @click="onChat(goods_id,goodsInfo.user_id)">
				<view class="iconfont icon-service"></view>
				<text class="txt">客服</text>
			</view>
			<!-- #endif -->
			<view class="item" @click="collection">
				<block v-if="is_collect == 1"><view class="iconfont icon-collection-alt"></view></block>
				<block v-else><view class="iconfont icon-collection"></view></block>
				<text class="txt">收藏</text>
			</view>
			<view class="item pr" @click="onCart">
				<view class="iconfont icon-cart"><text class="icon">{{ cart_number }}</text></view>
				<text class="txt">购物车</text>
				<view class="add_num" :class="{'show':addCartClass == true}">+{{ num }}</view>
			</view>
			<!-- <view class="item" v-if="goodsInfo.user_id && mpChecked" @click="$outerHref('/pages/shop/shopHome/shopHome?ru_id='+goodsInfo.user_id,'app')">
				<view class="iconfont icon-shop"></view>
				<text class="txt">店铺</text>
			</view> -->
			<view class="btn-bar">
				<block v-if="is_on_sale">
					<view class="btn btn-disabled">商品已下架</view>
				</block>
				<block v-else>
					<block v-if="stock > 0">
						<block v-if="goodsInfo.membership_card_id && goodsInfo.membership_card_id > 0"></block>
						<view class="btn btn-red" @click="onAddCartClicked(0)" v-else>加入购物车</view>
						
                        <!-- 立即购买 -->
                        <block v-if="goodsInfo.is_show_drp > 0 && goodsInfo.drp_shop > 0 && goodsInfo.is_distribution == 1 && goodsInfo.membership_card_id == 0"></block>
                        <block v-else>
                            <view class="btn btn-org" @click="onAddCartClicked(10)">立即购买</view>
                        </block>
                        
					</block>
					<block v-else>
						<view class="btn btn-disabled">库存不足</view>
					</block>
				</block>
			</view>
		</view>

		<!-- <dsc-common-nav></dsc-common-nav> -->

		<dsc-loading :dscLoading="dscLoading"></dsc-loading>

		<!--优惠券-->
		<uni-popup :show="couponShow" type="bottom" v-on:hidePopup="handelClose('coupon')">
			<view class="title">
				<view class="txt">领取优惠券 ({{ goodsInfo.coupon_count }})</view>
				<uni-icon type="closeempty" size="36" color="#999999" @click="handelClose('coupon')"></uni-icon>
			</view>
			<view class="content">
				<scroll-view scroll-y style="height:300px;">
					<view class="items">
						<view class="item" v-for="(item,index) in goodsCouponList" :key="index">
							<view class="left">
								<view class="price">
									<view class="em">￥</view>
									<view class="strong-text">{{ item.cou_money }}</view>
									<view class="couons-text">满{{ item.cou_man }}元可用</view>
								</view>
								<view class="con">
									<view class="range-item">{{ item.cou_name }}</view>
									<view class="range-item">{{ item.cou_start_time }} 至 {{ item.cou_end_time }}<text class="uni-red">(每人限领{{ item.cou_user_num}}张)</text></view>
								</view>
								<image src="../../static/coupons-print.png" v-if="item.cou_is_receive == 1"></image>
							</view>
							<view class="right">
								<text v-if="item.cou_is_receive == 1 && isLogin">已领取</text>
								<text v-else @click="handelReceive(item.cou_id)">领取</text>
							</view>
						</view>
					</view>
				</scroll-view>
			</view>
		</uni-popup>

		<!--地区-->
		<uni-popup :show="regionShow" type="right" v-on:hidePopup="handelClose('region')">
			<view class="popup-right-show region-info-show">
				<view class="uni-card uni-card-not">
					<view class="uni-list">
						<view class="uni-list-cell uni-list-cell-right">
							<view class="uni-list-cell-navigate">
								<text class="title">地址</text>
								<view class="value">
									<block v-if="regionData.province.id">{{ regionData.province.name }}</block>
									<block v-if="regionData.city.id">{{ regionData.city.name }}</block>
									<block v-if="regionData.district.id">{{ regionData.district.name }}</block>
									<block v-if="regionData.street.id">{{ regionData.street.name }}</block>
								</view>
							</view>
						</view>
						<view class="uni-list-cell uni-list-cell-right">
							<view class="uni-list-cell-navigate">
								<text class="title">所在地区</text>
								<view class="value" @click="selectRegion('province')"><text class="uni-blue">{{ regionData.province.name }}</text></view>
							</view>
						</view>
						<view class="uni-list-cell uni-list-cell-right">
							<view class="uni-list-cell-navigate">
								<text class="title">市</text>
								<view class="value" @click="selectRegion('city')"><text class="uni-blue">{{ regionData.city.name }}</text></view>
							</view>
						</view>
						<view class="uni-list-cell uni-list-cell-right">
							<view class="uni-list-cell-navigate">
								<text class="title">区/县</text>
								<view class="value" @click="selectRegion('district')"><text class="uni-blue">{{ regionData.district.name }}</text></view>
							</view>
						</view>
						<view class="uni-list-cell uni-list-cell-right">
							<view class="uni-list-cell-navigate">
								<text class="title">乡镇/街道</text>
								<view class="value" @click="selectRegion('street')"><text class="uni-blue">{{ regionData.street.name }}</text></view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="btn-bar btn-bar-fixed">
				<view class="btn btn-white">
					<view class="uni-red" @click="handelClose('region')">关闭</view>
				</view>
				<view class="btn btn-btn">
					<view @click="submitRegion">保存</view>
				</view>
			</view>
		</uni-popup>

		<!--促销-->
		<uni-popup :show="promotionShow" type="bottom" v-on:hidePopup="handelClose('promotion')">
			<view class="promotion-popup">
				<view class="title">
					<view class="txt">促销</view>
					<uni-icon type="closeempty" size="36" color="#999999" @click="handelClose('promotion')"></uni-icon>
				</view>
				<view class="content">
					<scroll-view scroll-y style="height:300px;">
						<view class="promotion-list" v-if="goods_promotion && goods_promotion.length > 0">
							<view class="promotion-item" v-for="(item,index) in goods_promotion" :key="index" @click="promotionHref(item)">
								<uni-tag text="满赠" size="small" type="error" v-if="item.act_type == 0"></uni-tag>
								<uni-tag text="立减" size="small" type="error" v-if="item.act_type == 1"></uni-tag>
								<uni-tag text="折扣" size="small" type="error" v-if="item.act_type == 2"></uni-tag>
								<uni-tag text="团购" size="small" type="error" v-if="item.act_type == 3"></uni-tag>
								<uni-tag text="拍卖" size="small" type="error" v-if="item.act_type == 4"></uni-tag>
								<uni-tag text="满减" size="small" type="error" v-if="item.act_type == 5"></uni-tag>
								<text class="act_name">{{item.act_name}}</text>
								<uni-icon type="arrowright" size="20" color="#999999"></uni-icon>
							</view>
						</view>
					</scroll-view>
				</view>
			</view>
		</uni-popup>

		<!--视频-->
		<view class="videoShow" v-if="videoShow">
			<view class="playVideo">
				<video id="myVideo" :src="goodsInfo.goods_video" :poster="videoPoster" @error="videoErrorCallback"></video>
				<view class="close" @click="colseVideo"><image src="../../static/close1.png" mode="widthFix" class="img"></image></view>
			</view>
			<view class="videoMask" @click="colseVideo"></view>
		</view>

		<!--小程序分享-->
		<uni-popup :show="mpShareShow" type="bottom" v-on:hidePopup="handelClose('mpshare')">
			<view class="mp-share-warp">
				<view class="title">
					<text>分享</text>
					<uni-icon type="closeempty" size="30" color="#8f8f94" @click="handelClose('mpshare')"></uni-icon>
				</view>
				<view class="lists">
					<button class="list" open-type="share">
						<image src="../../static/sharemenu/weix.png" mode="widthFix"></image>
						<text>分享给好友</text>
					</button>
					<view class="list" @click="onGoodsShare">
						<image src="../../static/sharemenu/pengy.png" mode="widthFix"></image>
						<text>生成分享海报</text>
					</view>
				</view>
			</view>
		</uni-popup>

		<uni-popup :show="shareImgShow" type="bottom" animation="true" v-on:hidePopup="handelClose('mpshareImg')">
			<view class="mp-share-warp">
				<view class="title">
					<text>保存到相册</text>
					<uni-icon type="closeempty" size="30" color="#8f8f94" @click="handelClose('mpshareImg')"></uni-icon>
				</view>
				<view class="mp-share-img"><image :src="mpShareImg" mode="widthFix" class="img"></image></view>
				<view class="btn-bar btn-bar-radius">
					<button class="btn btn-red" @click="downloadImg">保存图片</button>
				</view>
			</view>
		</uni-popup>

		<mpvue-picker themeColor="#007AFF" ref="mpvuePicker" mode="selector" deepLength="1" :pickerValueDefault="pickerValueDefault"
		  @onConfirm="onConfirm($event,curRegion)" @onCancel="onCancel" :pickerValueArray="pickerValueArray"></mpvue-picker>
	</view>
</template>

<script>
	import { mapState } from 'vuex'

	import uniSegmentedControl from '@/components/uni-segmented-control.vue';
	import uniIcon from '@/components/uni-icon.vue';
	import uniPopup from '@/components/uni-popup.vue';
	import uniTag from "@/components/uni-tag.vue";
	import mpvuePicker from '@/components/mpvue-picker/mpvuePicker.vue';
	import uniNumberBox from '@/components/uni-number-box.vue';
	import uniCountdown from "@/components/uni-countdown.vue";
	import uniNavBar from '@/components/uni-nav-bar.vue';
	import dscShopHeader from '@/components/dsc-shop-header.vue';
	import dscProductList from '@/components/dsc-product-list.vue';
	import dscNotContent from '@/components/dsc-not-content.vue';
	import dscCommonNav from '@/components/dsc-common-nav.vue';
	import universal from '@/common/mixins/universal.js';

	export default {
		mixins:[universal],
		components:{
			uniIcon,
			uniSegmentedControl,
			uniTag,
			uniPopup,
			uniNumberBox,
			uniCountdown,
			uniNavBar,
			mpvuePicker,
			dscShopHeader,
			dscProductList,
			dscNotContent,
			dscCommonNav
		},
		data() {
			return {
				navTabs: ['商品', '推荐', '详情','评论'],
				scrollViewId:'',
				navActive:0,
				winHeight: 0,
				tabs: ['商品详情', '规格参数'],
				goods_id: 0,
				num:1,
				current: 0,
				couponShow:false,
				shopIndex:0,
				shopScore: true,
				shopCollect:false,
				productOuter:true,
				hasLocation: false,
				listshow:true,
				addCartClass:false,
				regionShow: false,
				pickerValueDefault: [0],
				pickerValueArray:[],
				regionData:{
					province:{
						id:'',
						name:'--请选择--'
					},
					city:{
						id:'',
						name:'--请选择--',
					},
					district:{
						id:'',
						name:'--请选择--',
					},
					street:{
						id:'',
						name:'--请选择--',
					},
					regionSplic:''
				},
				curRegion:'province',
				dscLoading:true,
				shareProvider:[],
				videoShow:false,
				storeBtn: false,
				promotionShow:false,
				mpShareShow:false,
				shareImgShow:false,
				mpShareImg:'',
				customBar:0,
				curpage:''
			};
		},
		onShareAppMessage(res){
			if (res.from === 'button') {// 来自页面内分享按钮
				return {
				  title: this.goodsInfo.goods_name,
				  path: '/pages/goodsDetail/goodsDetail?id=' + this.goodsInfo.goods_id
				}
			}else{
				return {
				  title: this.goodsInfo.goods_name,
				  path: '/pages/goodsDetail/goodsDetail?id=' + this.goodsInfo.goods_id
				}
			}
		},
		onBackPress() {
			//监听back键，关闭弹出菜单
			// if (this.shareObj.shareMenu.isVisible()) {
			// 	this.shareObj.shareMenu.hide();
			// 	this.shareObj.alphaBg.hide();
			// 	return true
			// }
		},
		computed:{
			...mapState({
				goodsInfo: state => state.goods.goodsInfo,	//商品基本信息
				goodsCouponList: state => state.goods.goodsCouponList,//优惠券信息
				shopDetail: state => state.shop.shopDetail,	//店铺信息
				goodsGuessList: state => state.shopping.goodsGuessList, //猜你喜欢
				shipping_fee: state => state.shopping.shipping_fee,//配送运费信息
				provinceData: state => state.common.region.provinceData,
				cityData: state => state.common.region.cityData,
				districtData: state => state.common.region.districtData,
				streetData: state => state.common.region.streetData,
				mpChecked: state => state.common.mpChecked,
			}),
			gallerylList() {
                return this.goodsInfo.gallery_list
            },
			videoPoster(){
				return this.goodsInfo.goods_video ? this.gallerylList[0].img_url : ''
			},
			attr() {
                return this.$store.state.goods.goodsInfo.attr
            },
            goodsAttrInit(){
				return this.$store.state.goods.goodsAttrInit
            },
            goodsAttrOper() {
                return this.$store.state.goods.goodsAttrOper
            },
			//此商品在购物车中数量
			cart_number: {
                get() {
                    return this.$store.state.goods.goodsInfo.cart_number
                },
                set(val) {
                    this.$store.state.goods.goodsInfo.cart_number = val
                }
            },
			//已选
			attr_name: {
				get() {
					return this.attr != '' ? this.$store.state.goods.goodsInfo.attr_name + ' ' + this.num + this.goodsInfo.goods_unit : this.num + this.goodsInfo.goods_unit
				},
				set(val) {
					this.$store.state.goods.goodsInfo.attr_name = val
				}
			},
			//库存
			stock() {
                return this.attr != '' ? this.goodsAttrOper.stock : this.goodsInfo.goods_number
            },
			//价格随属性变化
            goodsPriceManage(){
                let price = ''
                if(this.goodsAttrOper.goods_price_formated){
                    price = this.goodsAttrOper.goods_price_formated
                }else{
                    if(this.goodsInfo.promote_start_date > 0 && this.goodsInfo.promote_end_date > 0){
                        price = this.goodsInfo.promote_price_formated
                    }else{
                        price = this.goodsInfo.shop_price_formated
                    }
                }
                return price
            },
            goodsPriceMarketManage(){
                let price = ''
                if(this.goodsAttrOper.market_price_formated){
                    price = this.goodsAttrOper.market_price_formated
                }else{
                    price = this.goodsInfo.market_price_formated
                }
                return price
            },
			goods_promotion(){
				let goods_promotion = this.goodsInfo.goods_promotion
				let act_name = ''
				let act_type = ''
				let act_id = ''
				let arr = []
				let obj = {}

				if(goods_promotion && goods_promotion.length > 0){
					goods_promotion.forEach(v=>{
						if(v.type == 'favourable'){//优惠活动
							act_type = v.act_type
							act_name = v.act_name
						}else if(v.type == 'group_buy'){
							act_type = 3
							act_name = '团购'
						}else if(v.type == 'auction'){
							act_type = 4
							act_name = '拍卖'
						}

						obj = {
							act_type:act_type,
							act_name:act_name,
							act_id:v.act_id
						}
						arr.push(obj)
					})
				}

				if(this.goodsInfo.consumption && this.goodsInfo.consumption.length > 0){
					let consumption = ''
					let str = ''
					this.goodsInfo.consumption.forEach(v=>{
						str = '满' + v.cfull + '减' + v.creduce
						consumption += str + ','
					})

					obj = {
						act_type:5,
						act_name:consumption
					}

					arr.push(obj)
				}

				return arr
			},
			ru_id() {
                return this.$store.state.goods.goodsInfo.user_id
            },
			number:{
				get(){
					return this.goodsInfo.is_minimum > 0 ? this.goodsInfo.minimum : 1
				},
				set(val){
					this.num = val
				},
			},
			isTimeEnd(){
				return this.goodsInfo.promote_end_date > this.goodsInfo.current_time ? true : false
			},
			dateTime(){
				let dataTime = this.goodsInfo.promote_end_date
				if(dataTime != ''){
					return this.$formatDateTime(dataTime)
				}
			},
			sdateTime(){
				let sTime,status = this.goodsInfo.isTimeEnd
				if(status == 2){
					sTime = this.goodsInfo.seckill_begin_date
				}else if(status == 0){
					sTime = this.goodsInfo.seckill_end_date
				}else{
					sTime = this.goodsInfo.seckill_begin_date
				}
				if(sTime != ''){
					return this.$formatDateTime(sTime-28800)
				}
			},
			goodsDesc(){
				let result = this.goodsInfo.goods_desc;
				const reg = /style\s*=(['\"\s]?)[^'\"]*?\1/gi;
				const regex = new RegExp('<img', 'gi');
				const regex2 = new RegExp('<p', 'gi');

				if(result){
					result = result.replace(reg, '');
					result = result.replace(regex, '<img style="width: 100% !important; height:auto;vertical-align:top;"');
					result = result.replace(regex2, '<p style="margin:0;padding:0;"');
				}
				return result
			},
			//店铺是否关注
			is_collect_shop: {
                get() {
                    return this.shopDetail.is_collect_shop
                },
                set(val) {
                    this.shopDetail.is_collect_shop = val
                }
            },
			//店铺关注人数
            count_gaze: {
                get() {
                    return this.shopDetail.count_gaze
                },
                set(val) {
                    this.shopDetail.count_gaze = val
                }
            },
			//店铺信息
			shopInfo() {
                let arr = []

                arr[this.shopIndex] = {
                    shopName: this.shopDetail.shop_name,
                    logo: this.shopDetail.logo_thumb,
                    ru_id: this.shopDetail.ru_id,
                    commentdelivery: this.shopDetail.commentdelivery,
                    commentdelivery_font: this.shopDetail.commentdelivery_font,
                    commentrank: this.shopDetail.commentrank,
                    commentrank_font: this.shopDetail.commentrank_font,
                    commentserver: this.shopDetail.commentserver,
                    commentserver_font: this.shopDetail.commentserver_font,
                    count_gaze: this.count_gaze,
                    is_collect_shop: this.is_collect_shop,
                }

                return arr
            },
			//配送地区
			regionSplic(){
				return this.regionData.regionSplic
			},
			goodsCollectStatue() {
                return this.$store.state.user.goodsCollectStatue
            },
			//运费
			freight() {
                return this.shipping_fee != null && this.shipping_fee.is_shipping > 0 ? this.shipping_fee.shipping_fee_formated : '该地区不支持配送'
            },
			importTax() {
                return this.goodsInfo.goods_rate != null && this.goodsInfo.goods_rate > 0 ? this.goodsInfo.formated_goods_rate : '0'
            },
			is_on_sale() {
				return this.goodsInfo.is_on_sale == 0 ? true : false
			},
			is_collect: {
                get() {
                    return this.$store.state.goods.goodsInfo.is_collect
                },
                set(val) {
                    this.$store.state.goods.goodsInfo.is_collect = val
                }
            },
			isLogin(){
				return this.$isLogin()
			}
		},
		methods:{
			loadGoodsInfo(goods_id){
				this.$store.dispatch('setGoodsInfo', {
					goods_id: goods_id,
					warehouse_id: 0,
					area_id: 0,
					is_delete: 0,
					is_on_sale: 1,
					is_alone_sale: 1
				})
			},
			onAddCartClicked(type) {
                let newAttr = []
                this.addCartClass = false

                if (this.attr.length > 0) {
                    newAttr = this.goodsAttrInit
                }

                this.$store.dispatch('setAddCart', {
                    goods_id: this.goods_id,
                    num: this.num,
                    spec: newAttr,
                    warehouse_id:'0',
                    area_id:'0',
                    parent_id:'0',
                    rec_type: type
                }).then(res => {
                    if (res.data == true) {
                        if (type == 10) {
							if(this.$isLogin()){
								uni.navigateTo({
									url:'/pages/checkout/checkout?rec_type='+type
								});
							}else{
								uni.showModal({
									content:'请登录会员',
									success:(res)=>{
										if(res.confirm){
											uni.navigateTo({
												url:'/pages/login/login?delta=1'
											})
										}
									}
								})
							}
                        } else {
                            this.addCartClass = true

							uni.showToast({
								title:'已加入购物车',
								icon:'success',
								duration:1000
							})

                            this.cart_number = parseInt(this.cart_number) + this.num;
							
							//获取购物车数量
							this.$store.dispatch('setCommonCartNumber');
                        }
                    } else {
						uni.showToast({
							title:res.data.msg,
							icon:'none',
							duration:1000
						})
                    }
                })
            },
			onClickItem(index) {
				if (this.current !== index) {
					this.current = index;
				}
			},
			onTabs(index){
				if(index == 3){
					this.$outerHref(this.$websiteUrl+'goods/comment/'+this.goods_id)
				}else{
					this.navActive = index;
				}
			},
			//领取优惠券列表
            handleCoupon() {
                this.couponShow = true

                this.$store.dispatch('setGoodsCouponList', {
                    goods_id: this.goods_id,
                    ru_id: this.goodsInfo.user_id
                }).then(() => {
                    //this.conpouLoading = false
                })
            },
			//领取优惠券
			handelReceive(val) {
                this.$store.dispatch('setGoodsCouponReceive', {
                    cou_id: val
                }).then(({data:data}) => {
					uni.showToast({
						title:data.msg,
						icon:'none'
					})
                    this.$store.dispatch('setGoodsCouponList', {
                        goods_id: this.goods_id,
                        ru_id: this.goodsInfo.user_id
                    })
                })
            },
			handlePromotion(){
				this.promotionShow = true
			},
			//关闭Popup
			handelClose(val){
				if(val == 'coupon'){
                    this.couponShow = false
                }else if(val == 'promotion'){
                    this.promotionShow = false
                }else if(val == 'region'){
					this.regionShow = false
				}else if(val == 'mpshare'){
					this.mpShareShow = false
				}else if(val == 'mpshareImg'){
					this.shareImgShow = false
				}
			},
			promotionHref(item){
				if(item.act_type == 0 || item.act_type == 1 || item.act_type == 2){
					//跳转优惠活动
				}else if(item.act_type == 3){
					//跳转团购
				}else if(item.act_type == 4){
					//跳转拍卖
				}
			},
			clickVideo(){
				this.videoShow = true
				uni.createVideoContext('myVideo').play()
			},
			colseVideo(){
				this.videoShow = false
				uni.createVideoContext('myVideo').pause()
			},
			//视频播放错误
			videoErrorCallback(e) {
				uni.showModal({
					content: '视频播放异常',
					showCancel: false
				})
			},
			//关注店铺
            updateInfo(obj) {
                this.is_collect_shop = obj.is_collect_shop
                this.count_gaze = this.is_collect_shop == 1 ? this.count_gaze + 1 : this.count_gaze - 1
            },
			//猜你喜欢
            goodsGuessHandle(){
                this.$store.dispatch('setGoodsGuess',{
                    warehouse_id:0,
                    area_id:0
                })
            },
			//运费
			shippingFee(val) {
                this.$store.dispatch('setShippingFee', {
                    goods_id: this.goods_id,
                    position: JSON.stringify(val)
                })
            },
			historyAdd() {
                let time = (new Date()).getTime()
                let price = this.goodsInfo.shop_price_formated
                this.$store.dispatch('setHistoryAdd', {
                    id: this.goods_id,
                    name: this.goodsInfo.goods_name,
                    img: this.goodsInfo.goods_thumb,
                    price: price,
                    addtime: time,
                })
            },
			//收藏
			collection(){
				if(this.$isLogin()){
					this.$store.dispatch('setCollectGoods', {
						goods_id: this.goods_id,
						status: this.is_collect
					})
				}else{
					uni.showModal({
						content:'请登录后收藏该商品',
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
			changeAttr() {
                this.$store.dispatch('setGoodsAttrOper', {
                    goods_id: this.goods_id,
                    num: this.num,
                    attr_id: this.goodsAttrInit
                })
            },
			trigerCollapse(){
				this.listshow = this.listshow ? false : true
			},
			//属性切换
			attrChange(index,id){
				this.goodsAttrInit.splice(index,1,id);
			},
			bindChange(e){
				this.num = e
			},
			onCart(){
				uni.reLaunch({
					url: '/pages/cart/cart'
				});
			},
			handleRegion(){
				this.getRegionData();
				this.regionShow = true
			},
			onStoreClicked(){
				if(this.$isLogin()){
					uni.navigateTo({
						url:'/pages/store/store?id='+this.goods_id+"&attr_id="+this.goodsAttrInit+'&num='+this.num
					})
				}else{
					uni.showModal({
						content:'请登录会员在门店自提',
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
			selectRegion(val){
				this.$refs.mpvuePicker.show()
				this.curRegion = val
				if(val == 'province'){
					this.regionLoad(1,1)
				}else if(val == 'city'){
					this.regionLoad(this.regionData.province.id,2)
				}else if(val == 'district'){
					this.regionLoad(this.regionData.city.id,3)
				}else if(val == 'street'){
					this.regionLoad(this.regionData.district.id,4)
				}
			},
			regionLoad(val,level){
				this.$store.dispatch('setRegion',{
					region:val,
					level:level
				})
			},
			// 地区选框当前项弹出时默认选中
			pickDefaultIndex(level){
				let id = 0;
				if(level == 1){
					id = this.regionData.province.id
				}else if(level == 2){
					id = this.regionData.city.id
				}else if(level == 3){
					id = this.regionData.district.id
				}else if(level == 4){
					id = this.regionData.street.id
				}
				const array = Array.from(this.pickerValueArray);
				let flag = false;
				for(let i = 0; i < array.length; i++){
					if(array[i].id == id){
						this.pickerValueDefault = [i];
						flag = true
						break;
					}
				}
				if(!flag) this.pickerValueDefault = [0];
			},
			onConfirm(e,cur){
				let level = 0
				let arr = ['province','city','district','street']

				if(cur == 'province'){
					this.regionData.province.name = e.label
					this.regionData.province.id = e.value[0]
					level = 1
				}else if(cur == 'city'){
					this.regionData.city.name = e.label
					this.regionData.city.id = e.value[0]
					level = 2
				}else if(cur == 'district'){
					this.regionData.district.name = e.label
					this.regionData.district.id = e.value[0]
					level = 3
				}else if(cur == 'street'){
					this.regionData.street.name = e.label
					this.regionData.street.id = e.value[0]
					level = 4
				}

				arr.forEach((v,i)=>{
					if((i+1) > level){
						this.regionData[v].id = ''
						this.regionData[v].name = '请选择'
					}
				});
			},
			onCancel(){
				this.$refs.mpvuePicker.hide()
			},
			submitRegion(){
				this.regionData.regionSplic = this.regionData.province.name +' '+ this.regionData.city.name +' '+ this.regionData.district.name+' '+ (this.regionData.street.name != '请选择' ? this.regionData.street.name : '');

				//存本地缓存
				uni.setStorage({
					key:'regionData',
					data:this.regionData
				})

				if(!this.regionData.province.id > 0){
					uni.showToast({ title:'请选择地区', icon:'none' });
					return false
				}else if(!this.regionData.city.id > 0){
					uni.showToast({ title:'请选择城市', icon:'none' });
					return false
				}else if(!this.regionData.district.id > 0){
					uni.showToast({ title:'请选择区县', icon:'none' });
					return false
				}else if(!this.regionData.street.id > 0){
					uni.showToast({title:"街道不能为空", icon:"none"});
					return false
				}

				this.regionShow = false
			},
			appShare(){
				let shareInfo = {
					href:this.$websiteUrl + 'goods/' + this.goods_id + '?platform=APP',
					title:this.goodsInfo.goods_name,
					summary:this.goodsInfo.goods_brief,
					imageUrl:this.goodsInfo.goods_thumb
				};
				this.shareInfo(shareInfo)
			},
			mpShare(){
				this.mpShareShow = true
			},
			onGoodsShare(){
				if(this.$isLogin()){
					uni.showLoading({title:'加载中'});
					let price = this.goodsInfo.goods_price || this.goodsInfo.shop_price
					this.$store.dispatch('setGoodsShare',{
						goods_id:this.goods_id,
						price: price,
						share_type:this.goodsInfo.is_distribution
					}).then(res => {
						if(res.status == 'success'){
							this.mpShareImg = res.data
							this.shareImgShow = true
							uni.hideLoading();
						}
					})
				}else{
					uni.showModal({
						content:'请登录会员',
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
			downloadImg(){
				var that = this
				uni.downloadFile({
					url:that.mpShareImg,
					success: (res) => {
						uni.saveImageToPhotosAlbum({
							filePath:res.tempFilePath,
							success:function(){
								uni.showToast({
									title: '图片保存成功',
									icon: 'none',
									duration: 2000
								})
							}
						})
					}
				})
			},
			getRegionData(){
				//判断地区是否为空调用定位地区
				uni.getStorage({
					key:'regionData',
					success:(res)=>{
						let data = res.data;
						if(res.data){
							this.regionData.province.id = data.province ? data.province.id : ''
							this.regionData.province.name = data.province ?  data.province.name : ''
							this.regionData.city.id = data.city ? data.city.id : ''
							this.regionData.city.name = data.city ? data.city.name : ''
							this.regionData.district.id = data.district ? data.district.id : ''
							this.regionData.district.name = data.district ? data.district.name : ''
							this.regionData.street.id = data.street ? data.street.id : ''
							this.regionData.street.name = data.street ? data.street.name : ''

							this.regionData.regionSplic = this.regionData.province.name +' '+ this.regionData.city.name +' '+ this.regionData.district.name+' '+ (this.regionData.street.name != '请选择' ? this.regionData.street.name : '');
						}
					},
					fail: (res) => {
						//读取缓存
						uni.getStorage({
							key:'userRegion',
							success:(res)=>{
								let data = res.data;
								if(res.data){
									this.regionData.province.id = data.province ? data.province.id : ''
									this.regionData.province.name = data.province ?  data.province.name : ''
									this.regionData.city.id = data.city ? data.city.id : ''
									this.regionData.city.name = data.city ? data.city.name : ''
									this.regionData.district.id = data.district ? data.district.id : ''
									this.regionData.district.name = data.district ? data.district.name : ''
									this.regionData.street.id = data.street ? data.street.id : ''
									this.regionData.street.name = data.street ? data.street.name : '请选择'

									this.regionData.regionSplic = this.regionData.province.name +' '+ this.regionData.city.name +' '+ this.regionData.district.name+' '+ (this.regionData.street.name != '请选择' ? this.regionData.street.name : '');
								}
							}
						});
					}
				});
			},
			onDiscoverList(id){
				uni.navigateTo({
					url:'/pages/discover/list/list?id='+ id
				})
			},
			getico(ico){
				if(ico){
					return ico
				}else{
					return '../../static/user_default.png'
				}
			}
		},
		onLoad(e){
			let that = this
			let difHeight = 105

			that.goods_id = e.id;

			that.goodsGuessHandle(); //猜你喜欢

			that.$store.dispatch('setShopConfig',{goods:true}); //重新获取shopConfig

			that.getRegionData(); //根据缓存获取地区

			if(uni.getSystemInfoSync().model == 'Redmi Note 7'){
				difHeight = 26
			}

			uni.getSystemInfo({
				success:function(e){
					that.customBar = e.statusBarHeight

					// #ifndef MP
					if(e.platform == 'android') {
						that.customBar = e.statusBarHeight + 44
					}else {
						that.customBar = e.statusBarHeight + 44
					}
					// #endif

					// #ifdef MP-WEIXIN
					let custom = wx.getMenuButtonBoundingClientRect()
					that.customBar = custom.bottom + custom.top - e.statusBarHeight
					// #endif

					// #ifdef MP-ALIPAY
					that.customBar = e.statusBarHeight + e.titleBarHeight
					// #endif
				}
			})

			difHeight = difHeight + that.customBar
			
			that.winHeight = uni.getSystemInfoSync().windowHeight - difHeight;
		},
		onShow(){
			let pages = getCurrentPages()
			if(pages.length > 1){
				this.curpage = pages[pages.length - 2].route
			}
			this.loadGoodsInfo(this.goods_id);	//商品详情show
		},
		watch:{
			navActive(){
				this.scrollViewId = 'tab'+this.navActive
			},
			ru_id(){
				//店铺信息
                if (this.goodsInfo.user_id > 0) {
                    this.$store.dispatch('setShopDetail', {
                        ru_id: this.goodsInfo.user_id
                    })
                }
			},
			goodsInfo(){
				//秒杀id大于0 跳转到秒杀详情
				if(this.goodsInfo.seckill_id){
					uni.redirectTo({
						url:'/pagesA/seckill/detail/detail?id='+this.goodsInfo.seckill_id + '&tomorrow=0&delta=2'
					})
				}else{
					this.dscLoading = false
				}

				if (this.$isLogin()) {
                    this.historyAdd()
                }

				if(this.goodsInfo.is_minimum > 0){
					this.num = this.goodsInfo.minimum
				}
			},
			regionSplic(){
				let shipping_region = {
                    province_id: this.regionData.province.id,
                    city_id: this.regionData.city.id,
                    district_id: this.regionData.district.id,
                    street_id: this.regionData.street.id
                }

                //运费
                this.shippingFee(shipping_region)
			},
			goodsAttrInit(){
				this.changeAttr()
				this.storeBtn = true
			},
			goodsAttrOper() {
                if (this.goodsAttrOper) {
                    this.attr_name = this.goodsAttrOper.attr_name
                }
            },
			goodsCollectStatue() {
                this.goodsCollectStatue.forEach((v) => {
                    if (v.id == this.goods_id) {
                        this.is_collect = v.status
                    }
                })
            },
			provinceData(){
				this.pickerValueArray = this.provinceData
				this.pickDefaultIndex(1)
			},
			cityData(){
				this.pickerValueArray = this.cityData
				this.pickDefaultIndex(2)
			},
			districtData(){
				this.pickerValueArray = this.districtData
				this.pickDefaultIndex(3)
			},
			streetData(){
				this.pickerValueArray = this.streetData
				this.pickDefaultIndex(4)
			},
			couponShow(){
				this.scrollViewId = ''
			},
			regionShow(){
				this.scrollViewId = ''
			}
		}
	}
</script>

<style>
	.header-nav-content{ position: fixed; display: flex; flex-direction: row; justify-content: center; align-items: center; width: 100%; height: 50px; background-color: #FFFFFF; box-shadow: 0 6px 6px rgba(0,0,0,.1); top: 0; z-index: 99;}
	.header-nav-content .items{ flex: 1; display: flex; flex-direction: row; justify-content: center; align-items: center;}
	.header-nav-content .item{ width: 150upx; text-align: center;}
	.header-nav-content .item.active{ color: #f92028; }

	.share{ display: flex; justify-content: center; align-items:flex-end; padding: 6upx 50upx 0 0;}
	.share .iconfont{ font-size: 14px;}

	.scrollList{ margin-top: 55px; }

	.playicon{ position: absolute; top:300upx; left: 300upx; width:150upx; height: 150upx; border:1px solid #FFFFFF; border-radius: 50%; display: flex; text-align: center; justify-content: center; align-items: center; background: rgba(0,0,0,.1);}
	.playicon .iconfont{ color: #FFFFFF; }

	.goods-title{ padding: 0 20upx 10upx 20upx; color: #333333; background: #FFFFFF;}
	.goods-title .tit{ line-height: 42upx; }
	.goods-title .tit .uni-tag{ margin:0 10upx 0 0; float: left;}
	.goods-title .brief{ color: #f92028;}
	.goods-title.active{ padding-top: 20upx;}
	.goods-title.active .tit{ font-size: 30upx;}

	.uni-list-cell-navigate{ justify-content: flex-start; }
	.uni-list-cell-navigate .title{ min-width: 100upx; color: #999999; margin-right: 15upx;}
	.uni-list-cell .iconfont{ color: #f92028; margin-right: 10upx;}
	.uni-list-cell-title .uni-list-cell-navigate{ flex-direction: column; }
	.uni-list-cell-title .uni-list-cell-navigate.uni-navigate-right:after{ top: 35%;}
	.uni-list-cell-title .uni-list-cell-navigate .title{ width: 100%; color: #333333; font-weight: 600; font-size: 32upx; margin-bottom: 20upx;}
	.uni-list-cell-title .uni-list-cell-navigate .value{ display: flex; align-items: center; color: #999999;}

	/*促销*/
	.uni-cell-promotion:after{ left: 0; }
	.promotion-list .promotion-item{ display: flex; flex-direction: row; justify-content: flex-start; align-items: center; margin-bottom: 10upx;}
	.promotion-list .promotion-item:last-child{ margin-bottom: 0; }
	.promotion-list .promotion-item uni-tag{ margin-right: 10upx;}

	.container .promotion-popup .title{ border-bottom: 2upx solid #CCCCCC; padding: 10upx 20upx;}
	.container .promotion-popup .content{ background: #FFFFFF;}
	.container .promotion-popup .promotion-list{ padding: 20upx; }
	.container .promotion-popup .promotion-list .promotion-item{ padding: 10upx 0;}
	.container .promotion-popup .promotion-list .promotion-item .act_name{ flex: 1; text-align: left;}

	.goods-price .drp-share{ flex: 1; text-align: right; color: #999999;}
	.goods-price .drp-share .iconfont{ margin-right: 10upx; font-size: 14px;}

	.price-box{ display: flex; flex-direction: row; justify-content: center;}
	.price-box .left{ flex: 1; padding: 20upx; background: linear-gradient(90deg,#f22c8f,#f23256); color: #FFFFFF; font-size: 38upx;}
	.price-box .left view{ line-height: 1.2;}
	.price-box .left .price-weight{ font-size: 36upx; font-weight: 700;}
	.price-box .left .price-row{ display: flex; flex-direction: row; justify-content: flex-start;}
	.price-box .left .price-row .tag{ display: flex; flex-direction: row; overflow: hidden;}
	.price-box .left .price-row .tag-icon{ background: #FFFFFF; width: 50upx; border-radius: 20upx 0 0 20upx; display: flex; flex-direction: row; justify-content: center; align-items: center;}
	.price-box .left .price-row .tag-icon .iconfont{ color: #f23157; font-size: 24upx;}
	.price-box .left .price-row .tag-right-cont{ border: 1px solid #FFFFFF; padding: 0 20upx;}
	.price-box .left .price-row .sub{ display: flex; flex-direction: row; margin-left: 10upx; font-size: 25upx; align-items: center;}
	.price-box .left .price-row .sub .price-original{ font-size: 25upx; margin-left: 10upx;text-decoration:line-through;}
	.price-box .right{ display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 0 20upx; background: #ffeae9;}
	.price-box .right text{ color: #f23157;}

	.hig-vip{ padding: 0 20upx 20upx; background: #FFFFFF;}
	.hig-vip-warp{ display: flex; flex-direction: row; justify-content: space-between; align-items: center; padding: 10px; border-radius: 100upx; background: #F7F8FC;}
	.hig-vip-warp .text{ display: flex; flex-direction: row; justify-content: flex-start; align-items: center;}
	.hig-vip-warp .text icon{ margin-right: 10upx;}
	.hig-vip-warp .text image{ width: 40upx; height: 40upx;}
	.hig-vip-warp .vip-register{ background: #000000; border-radius: 30upx; padding: 5upx 15upx 5upx 20upx; display: flex; flex-direction: row; justify-content: center;align-items: center; position: relative; z-index: 33;}
	.hig-vip-warp .vip-register text{ color: #E3C49E; font-size: 25upx;}
	.hig-vip-warp .vip-register .uni-icon{ display: block;}

	/* 小程序分享 */
	.mp-share-warp .title{ display: flex; flex-direction: row; justify-content: space-between; align-items: center; background: #F7F8FC;}
	.mp-share-warp .title text{ color: #333; font-size: 28upx;}
	.mp-share-warp .lists{ display: flex; flex-direction: row; margin: 30upx 0;}
	.mp-share-warp .list{ width: 50%; display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 20upx 0; background: #FFFFFF;}
	.mp-share-warp .list image{ width: 100upx; height: 100upx;}
	.mp-share-warp .list text{ margin-top: 20upx; height: 30upx; line-height: 30upx; font-size: 28upx;}
	.mp-share-warp button.list::after{ border: none; border-radius: 0;}
	.mp-share-warp .mp-share-img{ width: 280px; box-shadow: 0 10upx 20upx 0px rgba(61,52,75,0.08); margin: 0 auto;}
	.mp-share-warp .btn-bar{ margin: 10px;}
	
	/*视频*/
	.videoShow{ width:100%;position: fixed; overflow: hidden; top:0; left: 0; right: 0; bottom:0; z-index: 9999999999; }
	.videoShow .playVideo{ width:80%; height: 245px; position: absolute; top:50%; left:50%; transform:translate(-50%,-50%); text-align: center; z-index:100; background: #000000;}
	
	.videoShow .playVideo video{ width: 100%; margin: 20px auto 0;}
	.videoShow .playVideo .close{ width: 60upx; height: 60upx; position: absolute; top: -20px; right: -15px; background: #FFFFFF; border-radius: 50%; line-height: 50%;}
	.videoShow .videoMask{ width:100%;position: fixed; overflow: hidden; top:0; left: 0; right: 0; bottom:0; z-index: 99; background:rgba(0,0,0,.3);}
</style>
