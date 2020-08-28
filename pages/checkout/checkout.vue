<template>
	<view class="container fixed-bottom-padding" v-if="checkoutDisplay">
		<view class="flow-checkout-adr" @click="checkoutAddress" v-if="store_id == 0">
			<view class="adr-content">
				<view class="title" v-if="checkoutInfo.consignee">
					<text class="name">{{ checkoutInfo.consignee.consignee }}</text>
					<text class="mobile">{{ checkoutInfo.consignee.mobile }}</text>
				</view>
				<view class="address">{{ consignee_address }}</view>
			</view>
			<uni-icon type="forward" size="18" color="#999999"></uni-icon>
		</view>
		<view class="flow-checkout-adr flow-store-adr" v-else>
			<uni-icon type="location" size="28" color="#999999"></uni-icon>
			<view class="store-content">
				<view class="tit">{{ storeInfo.stores_name }}</view>
				<text>服务电话: {{ storeInfo.stores_tel }}</text>
				<text>营业时间: {{ storeInfo.stores_opening_hours }}</text>
				<text>门店地址: [{{ storeInfo.address }}] {{ storeInfo.stores_address }}</text>
			</view>
		</view>
		<view class="checkout-goods-list" v-for="(item,index) in checkoutInfo.goods_list" :key="index">
			<view class="section-list">
				<view class="title">{{ item.shop_name }}</view>
				<view class="product-list product-list-max" v-if="listShow[index]">
					<view class="product-items">
						<view class="item" v-for="(goodsItem,goodsIndex) in item.goods" :key="goodsIndex" @click="productLink(goodsItem)">
							<view class="product-img">
								<image :src="goodsItem.goods_thumb" v-if="goodsItem.goods_thumb"></image>
								<image src="../../static/gift-icon.png" class="icon" v-if="goodsItem.is_gift > 0"></image>
							</view>
						</view>
					</view>
					<view class="product-more">
						<text>共 {{ item.goods_count }} 件</text>
						<uni-icon type="forward" size="18" color="#999999" @click="onListShow(index)"></uni-icon>
					</view>
				</view>
				<view class="product-list" v-else>
					<view class="product-items">
						<view v-for="(goodsItem,goodsIndex) in item.goods" :key="goodsIndex" @click="productLink(goodsItem)">
							<view class="item">
								<view class="product-img">
									<image :src="goodsItem.goods_thumb" v-if="goodsItem.goods_thumb"></image>
									<image src="../../static/gift-icon.png" class="icon" v-if="goodsItem.is_gift > 0"></image>
								</view>
								<view class="product-info">
									<view class="product-name twolist-hidden">
										<uni-tag text="团购" size="small" type="error" v-if="rec_type == 1"></uni-tag>
										<uni-tag text="拍卖" size="small" type="error" v-if="rec_type == 2"></uni-tag>
										<uni-tag text="积分" size="small" type="error" v-if="rec_type == 4"></uni-tag>
										<uni-tag text="预售" size="small" type="error" v-if="rec_type == 5"></uni-tag>
										<uni-tag text="秒杀" size="small" type="error" v-if="rec_type == 6"></uni-tag>
										<uni-tag text="拼团" size="small" type="error" v-if="rec_type == 7"></uni-tag>
										<uni-tag text="砍价" size="small" type="error" v-if="rec_type == 8"></uni-tag>
										<uni-tag text="礼包" size="small" type="error" v-if="rec_type == 11"></uni-tag>
										<text>{{ goodsItem.goods_name }}</text>
									</view>
									<view class="product-row">
										<view class="price">{{ goodsItem.goods_price_format }}</view>
										<view class="number">x{{ goodsItem.goods_number }}</view>
									</view>
									<view class="product-attr">{{ goodsItem.goods_attr }}</view>
								</view>
							</view>
							<view class="lie-list" v-if="goodsItem.membership_card_id > 0">
								<view class="left"><uni-tag text="赠送" size="small" type="error"></uni-tag>送[{{goodsItem.membership_card_name}}] 一张</view>
								<view class="right" @click="drpApplyHref(goodsItem.membership_card_id)">去看看</view>
							</view>
						</view>
					</view>
					<view class="product-more" v-if="item.goods.length > 1"><uni-icon type="arrowdown" size="18" color="#999999" @click="onListShow(index)"></uni-icon></view>
				</view>
			</view>
			<view class="uni-card uni-card-not">
				<view class="uni-list">
					<view class="uni-list-cell" hover-class="uni-list-cell-hover" v-if="store_id == 0 && total.real_goods_count > 0">
						<view class="uni-list-cell-navigate uni-navigate-right uni-navigate-badge">
							<text class="title">配送方式</text>
							<view class="value">
								<text @click="feeHandle(index,item.shipping.default_shipping.shipping_id)" v-if="item.shipping.default_shipping">
									<text class="mr10">{{ shipping_name[index] }}</text><text class="uni-red">{{ format_shipping_fee[index] }}</text>
								</text>
								<text class="uni-red" v-else>不支持配送</text>
							</view>
						</view>
					</view>
					<view class="uni-list-cell">
						<view class="uni-list-cell-navigate justify-content-fs">
							<text class="title">买家留言</text>
							<view class="value">
								<input placeholder="选填（50）" v-model="postscriptValue[index]" />
							</view>
						</view>
					</view>
					<view class="uni-list-cell">
						<view class="uni-list-cell-navigate justify-content-fe">
							<view class="value">共 {{ item.goods_count }} 件商品，合计：<text class="uni-red">{{ item.amount }}</text></view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="uni-card uni-card-not">
			<view class="uni-list">
				<view class="uni-list-cell" hover-class="uni-list-cell-hover" @click="paymentSelect">
					<view class="uni-list-cell-navigate uni-navigate-right uni-navigate-badge">
						<text class="title">支付方式</text>
						<view class="value">{{ pay_name }}</view>
					</view>
				</view>
				<view class="uni-list-cell" hover-class="uni-list-cell-hover" @click="invoiceSelect" v-if="rec_type != 4">
					<view class="uni-list-cell-navigate uni-navigate-right uni-navigate-badge">
						<text class="title">发票信息</text>
						<view class="value">
							<view class="receipt-title" v-if="!invoice.invoiceType">
								<text v-if="!invoice.company">{{ invoice.invoiceTitle }}</text>
								<text v-else>{{ invoice.company_name }}</text>
							</view>
							<view class="receipt-title" v-else>增值税发票</view>
							<view class="receipt-name" v-if="!invoice.invoiceType">{{ invoice.invoiceConent }}</view>
						</view>
					</view>
				</view>
				<view class="uni-list-cell" hover-class="uni-list-cell-hover" v-if="bonusList.length>0" @click="popupHandle('bonus')">
					<view class="uni-list-cell-navigate uni-navigate-right uni-navigate-badge">
						<text class="title">红包({{bonusList.length}}张)</text>
						<view class="value">{{ bonusObject.bonusContent }}</view>
					</view>
				</view>
				<view class="uni-list-cell" hover-class="uni-list-cell-hover" v-if="couponsList.length>0" @click="popupHandle('coupon')">
					<view class="uni-list-cell-navigate uni-navigate-right uni-navigate-badge">
						<text class="title">优惠券({{couponsList.length}}张)</text>
						<view class="value">{{ couponsObject.couponsContent }}</view>
					</view>
				</view>
				<view class="uni-list-cell" hover-class="uni-list-cell-hover" v-if="valueCard.length>0" @click="popupHandle('valueCard')">
					<view class="uni-list-cell-navigate uni-navigate-right uni-navigate-badge">
						<text class="title">储值卡({{valueCard.length}}张)</text>
						<view class="value">{{ valueCardObject.valueCardContent }}</view>
					</view>
				</view>
			</view>
		</view>
		<view class="uni-card uni-card-not" v-if="checkoutInfo.cross_border">
			<view class="uni-list">
				<view class="uni-list-cell uni-list-cell-title">
					<view class="uni-list-cell-navigate">
						<text class="title">实名认证</text>
					</view>
				</view>
				<view class="uni-list-cell">
					<view class="uni-list-cell-navigate justify-content-fs">
						<text class="title">真实姓名</text>
						<view class="value uni-cell-input">
							<input placeholder="请填写真实姓名" v-model="checkout_real_name" />
						</view>
					</view>
				</view>
				<view class="uni-list-cell">
					<view class="uni-list-cell-navigate justify-content-fs">
						<text class="title">身份证号</text>
						<view class="value uni-cell-input">
							<input placeholder="请填写身份证号" v-model="checkout_real_id" />
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="uni-card uni-card-not" v-if="pay_code == 'onlinepay'">
			<view class="uni-list">
				<view class="uni-list-cell uni-list-cell-title">
					<view class="uni-list-cell-navigate">
						<text class="title">是否使用余额</text>
						<view class="value"><switch :checked="surplusSelf" @change="surplusSelfHandle" /></view>
					</view>
				</view>
				<view class="uni-list-cell uni-list-cell-title" v-if="checkoutInfo.use_price > 0">
					<view class="uni-list-cell-navigate" v-if="use_price_val == 0">
						<view class="title">可使用<text class="uni-red">{{ checkoutInfo.use_price }}</text>乐券抵扣<text class="uni-red">￥{{checkoutInfo.use_price}}</text></view>
						<view class="value"><switch :checked="priceSelf" @change="priceSelfHandle" /></view>
					</view>
					<view class="uni-list-cell-navigate" v-else>
						<view class="title">可使用<text class="uni-red">{{ myprice }}</text>乐券抵扣<text class="uni-red">￥{{myprice}}</text></view>
						<view class="value"><switch :checked="priceSelf" @change="priceSelfHandle" /></view>
					</view>
				</view>
				<view class="uni-list-cell uni-list-cell-title" v-if="checkoutInfo.integral.length > 0">
					<view class="uni-list-cell-navigate">
						<view class="title">可使用<text class="uni-red">{{ myintegral }}</text>积分抵扣<text class="uni-red">￥{{myintegral}}</text></view>
						<view class="value"><switch :checked="integralSelf" @change="integralSelfHandle" /></view>
					</view>
				</view>
			</view>
		</view>
		
		<view class="uni-card uni-card-not" v-if="checkoutInfo.use_membership_card > 0">
			<view class="uni-list">
				<view class="uni-list-cell uni-list-cell-title">
					<view class="uni-list-cell-navigate">
						<view  class="title">
							<view class="vip-zk">
								<view class="vip-img"><image src="../../static/vip/icon-vip.png"></image></view>
								<view class="vip-zk-info">
									<view class="tit">开通高级会员，再减<text>{{ vipCard.membership_card_discount_price_formated }}</text>元 <view  class="iconfont icon-asks" @click="quanyiClick"></view></view>
									<view class="subtit">开通即享专属权益</view>
								</view>
							</view>
						</view>
						<view class="value">
							<view class="vip-zk-price" :class="{'active':vipReceiveState}" @click="vipReceive">
								<text class="price" :class="{'mf':!vipCard.membership_card_buy_money > 0}">{{ vipCard.membership_card_buy_money > 0 ? vipCard.membership_card_buy_money_formated : '免费领取' }}</text>
								<icon class="iconfont icon-gouxuan"></icon>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		
		<view class="uni-card uni-card-not">
			<view class="uni-list">
				<view class="uni-list-cell uni-list-cell-title">
					<view class="uni-list-cell-navigate">
						<text class="title">商品总计</text>
						<view class="value uni-red">{{ total.goods_price_formated }}</view>
					</view>
				</view>
				<view class="uni-list-cell" v-if="rateFee > 0">
					<view class="uni-list-cell-navigate">
						<text class="title">税费</text>
						<view class="value uni-red">+ ¥{{ rateFee }}</view>
					</view>
				</view>
				<view class="uni-list-cell" v-if="shippingFee > 0 && store_id == 0 && total.real_goods_count > 0">
					<view class="uni-list-cell-navigate">
						<text class="title">配送费用</text>
						<view class="value uni-red">+ ¥{{ shippingFee }}</view>
					</view>
				</view>
				<view class="uni-list-cell" v-if="total.discount > 0">
					<view class="uni-list-cell-navigate">
						<text class="title">折扣</text>
						<view class="value uni-red">-{{ total.discount_formated }}</view>
					</view>
				</view>
				<view class="uni-list-cell" v-if="total.integral_money > 0">
					<view class="uni-list-cell-navigate">
						<text class="title">积分</text>
						<view class="value uni-red">-{{ total.integral_money_formated }}</view>
					</view>
				</view>
				<view class="uni-list-cell" v-if="bonusObject.bonusMoney > 0">
					<view class="uni-list-cell-navigate">
						<text class="title">红包</text>
						<view class="value uni-red">-{{ total.bonus_money_formated }}</view>
					</view>
				</view>
				<block v-if="total.cou_type != 5">
					<view class="uni-list-cell" v-if="couponsObject.couponsMoney > 0">
						<view class="uni-list-cell-navigate">
							<text class="title">优惠券</text>
							<view class="value uni-red" v-if="total.coupons_money_formated">-{{ total.coupons_money_formated }}</view>
						</view>
					</view>
				</block>
				<view class="uni-list-cell" v-else>
					<view class="uni-list-cell-navigate">
						<text class="title">优惠券</text>
						<view class="value uni-red">-{{ total.shopping_fee_formated }}</view>
					</view>
				</view>
				<view class="uni-list-cell" v-if="valueCardObject.valueCardMoney > 0">
					<view class="uni-list-cell-navigate">
						<text class="title">储值卡</text>
						<view class="value uni-red">-{{ total.card_money_formated }}</view>
					</view>
				</view>
				<view class="uni-list-cell" v-if="valueCardObject.vc_dis > 0 && valueCardObject.vc_dis < 10">
					<view class="uni-list-cell-navigate">
						<text class="title">储值卡折扣</text>
						<view class="value uni-red">{{ valueCardObject.vc_dis }}折</view>
					</view>
				</view>
				<view class="uni-list-cell" v-if="total.surplus > 0">
					<view class="uni-list-cell-navigate">
						<text class="title">余额</text>
						<view class="value uni-red">-{{ total.surplus_formated }}</view>
					</view>
				</view>
				<view class="uni-list-cell" v-if="vipCard.order_membership_card_id > 0 && vipReceiveState  && vipCard.membership_card_buy_money > 0">
					<view class="uni-list-cell-navigate">
						<text class="title">购买权益卡金额</text>
						<view class="value uni-red">+{{ vipCard.membership_card_buy_money_formated }}</view>
					</view>
				</view>
				<view class="uni-list-cell" v-if="vipCard.order_membership_card_id > 0 && vipReceiveState && vipCard.membership_card_discount_price > 0">
					<view class="uni-list-cell-navigate">
						<text class="title">购买权益卡折扣</text>
						<view class="value uni-red">-{{ vipCard.membership_card_discount_price_formated }}</view>
					</view>
				</view>
			</view>
		</view>
		
		<view class="btn-goods-action">
			<view class="submit-bar-text">
				<text>{{ label_text }}</text>
				<view class="submit-bar-price" v-if="rec_type == 4">{{ amountPrice }}积分<block v-if="shippingFee > 0"> + ¥{{ shippingFee }}</block></view>
				<view class="submit-bar-price" v-else>{{ currency }}{{ amountPriceFormated }}</view>
			</view>
			<view class="btn-bar">
				<button class="btn" :class="[disabled ? 'btn-disabled' : 'btn-red']" :disabled="disabled" :loading="loading" @click="onSubmit">立即付款</button>
			</view>
		</view>
		
		<!--支付方式-->
		<uni-popup :show="paymentShow" type="bottom" mode="fixed" v-on:hidePopup="handelClose('payment')">
			<view class="activity-popup">
				<view class="title">
					<view class="txt">支付方式</view>
					<uni-icon type="closeempty" size="36" color="#999999" @click="handelClose('payment')"></uni-icon>
				</view>
				<view class="not-content">
					<scroll-view :scroll-y="true" class="select-list">
						<view class="select-item" v-for="(item,index) in payment_method" :key="index" :class="{'active':pay_id == item.pay_id}" @click="payment_method_select(item.pay_id,item.pay_name,item.pay_code)">
							<view class="txt">{{ item.pay_name }}</view>
							<view class="iconfont icon-ok"></view>
						</view>
					</scroll-view>
				</view>
			</view>
		</uni-popup>
		
		<!--配送方式-->
		<uni-popup :show="feeShow" type="bottom" mode="fixed" v-on:hidePopup="handelClose('fee')">
			<view class="activity-popup">
				<view class="title">
					<view class="txt">配送方式</view>
					<uni-icon type="closeempty" size="36" color="#999999" @click="handelClose('fee')"></uni-icon>
				</view>
				<view class="not-content">
					<scroll-view :scroll-y="true" class="select-list">
						<view class="select-item" v-for="(item,index) in shippingList" :key="index" :class="{'active':shipping_id[shipping_active_id] == item.shipping_id}" @click="shipping_select(item)">
							<view class="txt">{{ item.shipping_name }}</view>
							<view class="iconfont icon-ok"></view>
						</view>
					</scroll-view>
				</view>
			</view>
		</uni-popup>
		
		<!--发票-->
		<uni-popup :show="showBase" type="right" v-on:hidePopup="handelClose('inv')">
			<view class="popup-right-show invoice-show">
				<view class="invoice-warp-box">
					<view class="header-title">发票类型</view>
					<view class="selects">
						<view class="select" :class="{'active':invoice.invoiceType == false}" @click="incrementHandle(1)">普通发票</view>
						<view class="select" :class="{'active':invoice.invoiceType == true,'btn-box':!invoice.increment}" @click="incrementHandle(2)">增值发票</view>
					</view>
					<view class="tips">电子发票是税务局认可的有效凭证，其法律效力、基本用途及使用规定</view>
				</view>
				<view class="invoice-cont-box" v-if="!invoice.invoiceType">
					<view class="selects">
						<view class="select" :class="{'active':invoice.company == false}" @click="invTab(1)">个人</view>
						<view class="select" :class="{'active':invoice.company == true}" @click="invTab(2)">单位</view>
					</view>
					<view class="item-inputs" v-if="invoice.company">
						<view class="item-input">
							<label>单位名称：</label>
							<input placeholder="可填写单位名称" v-model="invoice.company_name">
						</view>
						<view class="item-input">
							<label>纳税人识别号：</label>
							<input placeholder="纳税人识别号" v-model="invoice.company_tid">
						</view>
					</view>
					<view class="invoice-cont uni-card-not">
						<view class="header-title">发票内容</view>
						<view class="uni-list">
							<radio-group @change="invValueRadioHandle">
								<label class="uni-list-cell uni-list-cell-not" v-for="(item,index) in invoice.invoiceValue" :key="index">
									<view>
										<radio :value="item.id" :checked="item.checked" color="#f92028" />
									</view>
									<view>{{item.name}}</view>
								</label>
							</radio-group>
						</view>
					</view>
				</view>
				<view class="btn-bar">
					<view class="btn btn-red" @click="invoiceConfirm">确定</view>
				</view>
			</view>
		</uni-popup>
		
		<!--红包-->
		<uni-popup :show="bonusObject.bonusBase" type="right" v-on:hidePopup="handelClose('bonus')">
			<view class="popup-right-show popup-con-filter">
				<view class="bonus-items">
					<view class="bonus-item" v-for="(item,index) in bonusList" :key="index" :class="{'active':bonusObject.bonusId == item.bonus_id}" @click="bonusActive(item.bonus_id)">
						<view class="cont">
							<view class="bonus-left">
								<view class="bonus-money">¥{{item.type_money}}</view>
							</view>
							<view class="bonus-right">
								<view class="bonus-tit">{{item.type_name}}</view>
							</view>
						</view>
						<view class="time">使用期限：{{item.use_start_date}} 至 {{item.use_end_date}}</view>
						<view class="new-store-radio-box">
							<text class="iconfont icon-ok"></text>
						</view>
					</view>
				</view>
				<view class="btn-bar filterlayer-bottom-button">
					<view class="btn btn-white" @click="handelClose('bonus')">关闭</view>
					<view class="btn btn-red" @click="submitBonus">确认</view>
				</view>
			</view>
		</uni-popup>
		
		<!--优惠券-->
		<uni-popup :show="couponsObject.couponsBase" type="right" v-on:hidePopup="handelClose('coupon')">
			<view class="popup-right-show popup-con-filter">
				<view class="coupon-items">
					<view class="coupon-item" :class="{'active':couponsObject.couponsId == item.uc_id}" v-for="(item,index) in couponsList" :key="index" @click="couponsActive(item.uc_id)">
						<view class="coupon-item-con">
							<view class="q-type">
                                <view class="b-r-a-price">
                                    <text class="coupons-yan">¥</text>
                                    <text class="coupons-money">{{ item.cou_money }}</text>
                                    <view class="couons-text">
										<text>满{{ item.cou_man }}元</text>
                                    </view>
                                </view>
                                <view class="b-r-a-con">
                                    <view class="range-item">{{ item.shop_name }}</view>
                                    <view class="range-item">范围：[{{item.cou_type_name}}][{{item.cou_goods_name}}]</view>
                                    <view class="range-item">有效期至{{ item.cou_end_time }}</view>
                                </view>
                            </view>
						</view>
						<view class="new-store-radio-box">
							<text class="iconfont icon-ok"></text>
						</view> 
					</view>
				</view>
				<view class="btn-bar filterlayer-bottom-button">
					<view class="btn btn-white" @click="handelClose('coupon')">关闭</view>
					<view class="btn btn-red" @click="submitCoupons">确认</view>
				</view>
			</view>
		</uni-popup>
		
		<!-- 储值卡 -->
		<uni-popup :show="valueCardObject.valueCardBase" type="right" v-on:hidePopup="handelClose('valueCard')">
			<view class="popup-right-show popup-con-filter">
				<view class="value-card-items">
					<view class="value-card-item" :class="{'active':valueCardObject.valueCardId == item.vc_id}" v-for="(item,index) in valueCard"
                        :key="index" @click="valueCardActive(item.vc_id)">
						<view class="valuecard-top" :style="{'background':'url('+ valuecardBg +') no-repeat','background-size':'cover'}">
							<view class="user-col">
								<text class="user-sn">NO.{{item.value_card_sn}}</text>
								<label class="user-tag-box">已激活</label>
							</view>
							<view class="card-money">
								<text>金额:</text>
								<view class="price">¥{{ item.card_money }}</view>
							</view>
						</view>
						<view class="user-card-num">
							<view class="time">过期时间:{{item.end_time}}</view>
							<view class="valuecard-num">面值:¥{{ item.card_money}}</view>
						</view>
						<view class="new-store-radio-box">
							<text class="iconfont icon-ok"></text>
						</view> 
					</view>
				</view>
			</view>
			<view class="btn-bar filterlayer-bottom-button">
				<view class="btn btn-white" @click="handelClose('valueCard')">关闭</view>
				<view class="btn btn-red" @click="submitValuecard">确认</view>
			</view>
		</uni-popup>
		
		<!-- 权益卡 -->
		<view class="quanyiShow">
			<uni-popup :show="quanyiShow" v-on:hidePopup="handelClose('quanyi')">
				<view class="quanyi-top">
					<view class="icon-vip"><image src="../../static/vip/icon-vip.png" class="img"></image></view>
					<view class="name">{{ vipCard.name }}</view>
					<view class="iconfont icon-close" @click="handelClose('quanyi')"></view>
				</view>
				<view class="quanyi-xian"><text>可享受以下权益</text></view>
				<view class="quanyi-list">
					<view class="item" v-for="(item,index) in vipCard.user_membership_card_rights_list" :key="index">
						<view class="icon"><image :src="item.icon" class="img"></image></view>
						<view class="txt">{{item.name}}</view>
					</view>
				</view>
			</uni-popup>
		</view>
	</view>
</template>

<script>
	import { mapState } from 'vuex'
	import uniIcon from "@/components/uni-icon.vue";
	import uniTag from "@/components/uni-tag.vue";
	import uniPopup from '@/components/uni-popup.vue';
	import universal from '@/common/mixins/universal.js';
	import * as localConfig from '@/config/local/config';
	const webUrl = localConfig.websiteUrl
	export default {
		mixins:[universal],
		components: {
			uniIcon,
			uniPopup,
			uniTag
		},
		data() {
			return {
				loading:true,
				disabled:true,
				checkoutDisplay: false,
				postscriptValue: [],
				showBase: false,
                overlay: true,
				invoice: {
                    company: false,
                    company_name: '',
                    company_tid: '',
                    increment: false,
                    invoiceType: false,
                    invoiceTitle: '个人',
                    invoiceConent: '不开发票',
                    tax_id: 0,
                    invoiceValue: [
                        {
                            id: 1,
                            name: '不开发票',
							checked: true
                        }, {
                            id: 2,
                            name: '明细',
							checked: false
                        }, {
                            id: 3,
                            name: '办公用品',
							checked: false
                        }, {
                            id: 4,
                            name: '电脑耗材',
							checked: false
                        }, {
                            id: 5,
                            name: '耗材',
							checked: false
                        },
                    ]
                },
				bonusObject: {
                    bonusContent: '不使用红包',
                    bonusBase: false,
                    bonusId: 0,
                    bonusMoney: 0,
                    bonusSn: 0
                },
                couponsObject: {
                    couponsContent: '不使用优惠券',
                    couponsBase: false,
                    couponsId: 0,
                    couponsMoney: 0
                },
                valueCardObject: {
                    valueCardContent: '不使用储值卡',
                    valueCardBase: false,
                    valueCardId: 0,
                    valueCardMoney: 0,
                    vc_dis: 0
                },
				rec_type:0,
				type_id:0,
				store_id:0,
				feeShow: false,
                paymentShow: false,
				pay_code:'',
                pay_id: null,
                pay_name: '',
                use_surplus_val: 0,
                use_integral_val: 0,
				use_price_val: 0,
				price: 0,
				myprice: 0,
				myintegral:0,
				aprice:0,
				aintegral:0,
				currency:'¥',
				label_text:'应付总额：',
				shippingList: [],
				shipping_active_id: 0,
				shipping_id:[],
                shipping_code:[],
                shipping_type:[],
                shipping_name:[],
                format_shipping_fee:[],
                shipping_fee:[],
				rate_price:[],
				bs_id: 0,
                team_id: 0,
                t_id:0,
                extension_id:0,       //扩展活动id
				checkout_real_name:'',
                checkout_real_id:'',
				surplus:0,
				timer:'',
				vipReceiveState:false,
				quanyiShow:false
			};
		},
		computed:{
			...mapState({
                checkoutInfo: state => state.shopping.checkoutInfo,
                checkout_done: state => state.shopping.checkout_done
            }),
            consignee_address() {
                if (this.checkoutInfo.consignee) {
                    return this.checkoutInfo.consignee.province_name + this.checkoutInfo.consignee.city_name + this.checkoutInfo.consignee.district_name + this.checkoutInfo.consignee.address
                } else {
                    return ''
                }
            },
			address_id(){
                if (this.checkoutInfo.consignee) {
                    return this.checkoutInfo.consignee.address_id ? this.checkoutInfo.consignee.address_id : ''
                } else {
                    return ''
                }
            },
			cart_id() {
			    let rec_ids = []
				if(this.checkoutInfo.goods_list){
					this.checkoutInfo.goods_list.forEach((v) => {
						v.goods.forEach((res) => {
							rec_ids.push(res.rec_id)
						})
					})
				}
			    return rec_ids
			},
			bonusList() {
                return this.checkoutInfo.bonus_list ? this.checkoutInfo.bonus_list : 0
            },
            couponsList() {
                return this.checkoutInfo.coupons_list ? this.checkoutInfo.coupons_list : 0
            },
            valueCard() {
                return this.checkoutInfo.value_card ? this.checkoutInfo.value_card : 0
            },
			payment_method() {
                return this.checkoutInfo.payment_list ? this.checkoutInfo.payment_list : ''
            },
			surpluss:{
				get(){
					let that = this
					that.surplus = this.checkoutInfo.user_money
					return this.checkoutInfo.user_money ? this.checkoutInfo.user_money : ''
				},
				set(val){
					this.surpluss = val
				}
			},
			total:{
				get(){
					return this.checkoutInfo.total ? this.checkoutInfo.total : ''
				},
				set(val){
				}
            },
			integral:{
				get(){ 
					if(this.checkoutInfo.integral){
						if(this.checkoutInfo.integral.length>0){
							let that = this
							that.myintegral = this.checkoutInfo.integral[0]['integral']
							return this.checkoutInfo.integral[0]['integral'] ? this.checkoutInfo.integral[0]['integral'] : ''
						}
					}else{
						return ''
					}
				},
				set(val){
					this.myintegral = val
				}
			},
			amountPrice: {
                get() {
					let that = this
                    let priceStr = ''
					if(that.total){
						if(that.rec_type == 4){
							//积分兑换
							that.price = that.total.exchange_integral;
							that.currency = '';

							return that.price
						}else{  
							//普通商品价格
							//if (that.price == 0) {
								that.price = that.total.amount
							//}
							
							if(this.surplusSelf && this.surplus > 0){
								priceStr = this.total.amount
							}else{
								if (that.shippingFee && that.total.real_goods_count > 0 && this.total.cou_type != 5) {
									priceStr = that.price + that.shippingFee
								}else{
									priceStr = that.price
								}
							}
							return Number(priceStr)
						}
					}
                },
                set(val) {
                    this.price = val
                }
            },
			amountPriceFormated(){
				//保留两位小数
				if(this.amountPrice > 0){
					return this.amountPrice.toFixed(2)
				}else{
					return '0.00'
				}
			},
            shipping() {
                let arr = []
                if (this.checkoutInfo.goods_list) {
                    this.checkoutInfo.goods_list.forEach((v) => {
                        arr.push(v.shipping.default_shipping)
                    })
                }
                return arr
            },
            shippingFee() {
                let shippingFeePrice = 0
				
                if(this.shipping_fee && this.store_id == 0){
                    this.shipping_fee.forEach(v=>{
                        shippingFeePrice += Number(v)
                    })
                }
				
                return shippingFeePrice
            },
			rateFee() {
				let ratePrice = 0
				if(this.rate_price && this.store_id == 0){
					this.rate_price.forEach(v=>{
						ratePrice += Number(v)    
					})
				}
				return ratePrice
			},
			surplusSelf: {
				get() {
					return this.use_surplus_val == 0 ? false : true
				},
				set(val) {
					this.use_surplus_val = val == true ? 1 : 0
				}
			},
            integralSelf(){
				return this.use_integral_val == 0 ? false : true
            },
            priceSelf(){
				return this.use_price_val == 0 ? false : true
            },
            storeInfo() {
                return this.checkoutInfo.store
            },
            listShow(){
                return this.$store.state.shopping.listShow
            },
			valuecardBg(){
				return this.websiteUrl + '/img/ka_bg.jpg'
			},
			use_paypwd(){
                return this.checkoutInfo.use_paypwd ? this.checkoutInfo.use_paypwd : 0
            },
			paypwdValue:{
				get(){
					return this.$store.state.common.trade_pwd
				},
				set(val){
					this.$store.state.common.trade_pwd = val
				}
			},
			vipCard(){
				return this.checkoutInfo.use_membership_card > 0  ? this.checkoutInfo.membership_card_info : ''
			}
		},
		methods:{
			//默认加载
			checkoutDefault() {
				uni.showLoading({title: '加载中'});
				if(this.store_id > 0){
					this.$store.dispatch('setShoppingCheckout', {
						rec_type: this.rec_type,
						store_id: this.store_id
					})
				}else{
					this.$store.dispatch('setShoppingCheckout', {
						rec_type: this.rec_type
					})
				}
            },
			//选择收货地址
			checkoutAddress(){
				uni.navigateTo({
					url:'/pagesB/address/address?type=checkout'
				})
			},
			//发票展开
			invoiceSelect() {
				if(this.checkoutInfo.cross_border){
					return false
				}

                this.showBase = true
				uni.request({
					url:this.websiteUrl + '/api/v4/invoice',
					method:'GET',
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token'),
						'X-Client-Hash':uni.getStorageSync('client_hash')
					},
					success: (res) => {
						let data = res.data.data;
						if (data.user_vat_invoice == '') {
							this.invoice.increment = false
						} else {
							this.invoice.increment = true
							this.invoice.tax_id = res.data.data.id
						}
					}
				})
            },
			//普通发票 -> 个人单位切换
			invTab(val) {
                if (val == 1) {
                    this.invoice.company = false
                    this.invoice.company_name = ''
                    this.invoice.company_tid = ''
                } else {
                    this.invoice.company = true
                }
            },
			//普通发票 增值税发票切换
            incrementHandle(val) {
                if (val == 1) {
                    this.invoice.invoiceType = false
                } else {
                    if (this.invoice.increment == true) {
                        this.invoice.invoiceType = true
                    } else {
						uni.showModal({
							content:'去申请增值税发票',
							success:function(res){
								if(res.confirm){
									uni.navigateTo({
										url:'/pagesB/invoice/invoice'
									})
								}
							}
						})
                    }
                }
            },
			//发票内容
			invValueRadioHandle(e){
				this.invoice.invoiceValue.forEach((v) => {
                    if (v.id == e.detail.value) {
						v.checked = true
                        this.invoice.invoiceConent = v.name
                    }else{
						v.checked = false
					}
                })
			},
			//发票确认
			invoiceConfirm(){
				if(this.invoice.company && this.invoice.invoiceType == false){
					if(this.invoice.company_name == ''){
						uni.showToast({
							title:'请填写单位名称',
							icon:'none'
						})
					}else if(this.invoice.company_tid == ''){
						uni.showToast({
							title:'请填写纳税人识别号',
							icon:'none'
						})
					}else{
                        this.showBase = false
                    }
				}else{
					this.showBase = false
				}
			},
			//红包选择
			bonusActive(id) {
                if (this.bonusObject.bonusId != id) {
                    this.bonusObject.bonusId = id
                } else {
                    this.bonusObject.bonusId = 0
                }
            },
			//红包确认
			submitBonus() {
				uni.request({
					url:this.websiteUrl + '/api/v4/trade/changebon',
					method:'POST',
					data:{
						bonus_id: this.bonusObject.bonusId,
						total: this.total
					},
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token'),
						'X-Client-Hash':uni.getStorageSync('client_hash')
					},
					success: ({data: {data}}) => {
						this.$store.dispatch('setCheckoutTotal', data)
						if (data.bonus_money > 0) {
							this.bonusObject.bonusContent = data.bonus_money_formated
						} else {
							this.bonusObject.bonusContent = '不使用红包'
						}
						this.total.bonus_money = data.bonus_money
						this.amountPrice = data.amount
						this.valueCardObject.valueCardMoney = data.card_money
						this.bonusObject.bonusMoney = data.bonus_money
					}
				})
				this.bonusObject.bonusBase = false
			},
			//优惠券选择
			couponsActive(id) {
                if (this.couponsObject.couponsId != id) {
                    this.couponsObject.couponsId = id
                } else {
                    this.couponsObject.couponsId = 0
                }
            },
			//优惠券确定
			submitCoupons(){
				uni.request({
					url:this.websiteUrl + '/api/v4/trade/changecou',
					method:'POST',
					data:{
						uc_id: this.couponsObject.couponsId,
						total: this.total
					},
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token'),
						'X-Client-Hash':uni.getStorageSync('client_hash')
					},
					success: ({data: {data}}) => {
						this.$store.dispatch('setCheckoutTotal', data)
						if (data.coupons_money > 0) {
							this.couponsObject.couponsContent = data.coupons_money_formated
						} else {
							if(data.cou_type == 5){
								this.couponsObject.couponsContent = '免邮券';
							}else{
								this.couponsObject.couponsContent = '不使用优惠券'
							}
						}
						this.total.coupons_money = data.coupons_money
						this.couponsObject.couponsMoney = data.coupons_money
						this.valueCardObject.valueCardMoney = data.card_money
						this.amountPrice = data.amount
					}
				})
				this.couponsObject.couponsBase = false
			},
			//储值卡选择
			valueCardActive(id) {
                if (this.valueCardObject.valueCardId != id) {
                    this.valueCardObject.valueCardId = id
                } else {
                    this.valueCardObject.valueCardId = 0
                }
            },
			//储值卡确认
			submitValuecard() {
				uni.request({
					url:this.websiteUrl + '/api/v4/trade/changecard',
					method:'POST',
					data:{
						vid: this.valueCardObject.valueCardId,
						total: this.total
					},
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token'),
						'X-Client-Hash':uni.getStorageSync('client_hash')
					},
					success: ({data: {data}}) => {
						this.$store.dispatch('setCheckoutTotal', data)

						if (data.card_money > 0) {
							this.valueCardObject.valueCardContent = data.card_formated
						} else {
							this.valueCardObject.valueCardContent = '不使用储值卡'
						}

                        this.valueCardObject.vc_dis = data.vc_dis

						this.amountPrice = data.amount
						this.valueCardObject.valueCardMoney = data.card_money
						this.total.card_money = data.card_money
					}
				})

				this.valueCardObject.valueCardBase = false
			},
			//运费展开
			feeHandle(val, id) {
                let ru_id = 0
                let rec_ids = ''
                let flow_type = this.checkoutInfo.flow_type
                let shipping_region = {
                    country: 1,
                    province: this.checkoutInfo.consignee.province,
                    city: this.checkoutInfo.consignee.city,
                    district: this.checkoutInfo.consignee.district,
                    street: this.checkoutInfo.consignee.street
                }

                this.feeShow = true
                this.shipping_active_id = val
                this.checkoutInfo.goods_list[val].goods.forEach((v) => {
                    rec_ids += v.rec_id + ','
                    ru_id = v.ru_id
                })

                rec_ids = rec_ids.substr(0, rec_ids.length - 1)

                this.$store.dispatch('setShipping', {
                    rec_ids: rec_ids,
                    ru_id: ru_id,
                    consignee: JSON.stringify(shipping_region),
                    flow_type: flow_type
                }).then(({data:data}) => {
                    if (data.shipping) {
                        this.shippingList = data.shipping
                    }
                })
            },
			//选择配送方式
			shipping_select(item) {
                this.shipping_id.splice(this.shipping_active_id,1,item.shipping_id)
                this.shipping_code.splice(this.shipping_active_id,1,item.shipping_code)
                this.shipping_name.splice(this.shipping_active_id,1,item.shipping_name)
                this.shipping_fee.splice(this.shipping_active_id,1,item.shipping_fee)
                this.format_shipping_fee.splice(this.shipping_active_id,1,item.format_shipping_fee)
				this.rate_price.splice(this.shipping_active_id, 1, item.rate_price)
				console.log(this.shipping_fee)
            },
			//展开支付方式
			paymentSelect() {
                this.paymentShow = true
            },
			//选择支付方式
            payment_method_select(id, name,code) {
                this.pay_id = id
                this.pay_name = name
				this.pay_code = code
            },
			//是否使用余额
			surplusSelfHandle(e){
				this.use_surplus_val = e.detail.value == true ? 1 : 0
			},
			//检查钱包是否正确
			checkmoney(type){
				uni.showLoading({title:"加载中"});
				let price,integral
				if(this.use_price_val == 1){
					price = this.myprice
				}else{
					price = 0
				}
				if(this.use_integral_val == 1){
					integral = this.myintegral
				}else{
					integral = 0
				}
				let o = {
					price:price,
					pay_points:integral
				}
				uni.request({
					url: webUrl + '/api/v4/trade/changemoney',  
					data: o,
					method:'POST',
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token')
					},
					success: (res) => {
						if(res.data.status == 'success'){
							uni.hideLoading();
						}else{
							uni.showToast({
								title: res.data.errors.message,
								icon: "none"
							});
							if(type == 1){
								this.use_price_val = 0;
							}
							else if(type == 3){
								this.use_integral_val = 0;
							}
							uni.hideLoading();
						}
					},error:(res)=>{
						console.log(JSON.stringify(res))
						uni.hideLoading();
					}
				});
			},
			//使用余额
			surplusvValHandle(e) {
				clearTimeout(this.timer);
				this.timer = setTimeout(()=>{
					uni.request({
						url:this.websiteUrl + '/api/v4/trade/changesurplus',
						method:'POST',
						data:{
							total: this.total,
							surplus: this.surplus,
							shopping_fee: this.shippingFee
						},
						header: {
							'Content-Type': 'application/json',
							'token': uni.getStorageSync('token'),
							'X-Client-Hash':uni.getStorageSync('client_hash')
						},
						success: (res) => {
							let data = res.data.data
							this.$store.dispatch('setCheckoutTotal', data)

							if (data.card_money > 0) {
								this.valueCardObject.valueCardContent = data.card_formated
								this.valueCardObject.vc_dis = data.vc_dis
							} else {
								this.valueCardObject.valueCardContent = '不使用储值卡'
							}

							this.amountPrice = data.amount
							this.valueCardObject.valueCardMoney = data.card_money
							this.total.card_money = data.card_money
							this.total.surplus = data.surplus
							this.total.surplus_formated = data.surplus_formated
							this.surplus = data.surplus
					   },
					   fail: (res) => {
							console.log(JSON.stringify(res))
							uni.hideLoading();
					   }
				   })
			   },1000)
			},
			//是否使用乐券
			priceSelfHandle(e) {
				this.use_price_val = e.detail.value == true ? 1 : 0
				if(this.use_price_val == 1){
					this.myprice = this.checkoutInfo.use_price;
				}
                if(this.use_price_val == 1 && this.total.amount == 0){
					uni.showToast({
						title:'您已选择了其他积分来购买该产品',
						icon:'none'
					})
					this.use_price_val = 0
				}
				else if(this.use_price_val == 0 && this.aprice == 0){
					
				}
				else if(this.use_price_val == 0 && this.aprice == 1){
					this.total.amount = Number(this.total.amount) + Number(this.myprice)
					let data = {
						amount:this.total.amount,
						amount_formated:'¥'+this.total.amount
					};
					this.$store.dispatch('setCheckoutTotal', data)
					this.aprice = 0
				}
				else if(this.total.amount > this.myprice){
					this.total.amount = Number(this.total.amount) - Number(this.myprice)
					let data = {
						amount:this.total.amount,
						amount_formated:'¥'+this.total.amount
					};
					this.$store.dispatch('setCheckoutTotal', data)
					this.aprice = 1
				}
				else if(this.total.amount < this.myprice){
					this.myprice = Number(this.total.amount)
					this.total.amount = 0
					let data = {
						amount:this.total.amount,
						amount_formated:'¥'+this.total.amount
					};
					this.$store.dispatch('setCheckoutTotal', data)
					this.aprice = 1
				}
				else{
					this.total.amount = 0
					this.myprice = this.checkoutInfo.use_price
					let data = {
						amount:this.total.amount,
						amount_formated:'¥'+this.total.amount
					};
					this.$store.dispatch('setCheckoutTotal', data)
					this.aprice = 1
				}
				if(this.use_price_val == 1){
					this.checkmoney(1);
				}
            },
			//是否使用积分
			integralSelfHandle(e) {
				this.use_integral_val = e.detail.value == true ? 1 : 0
				if(this.use_integral_val == 0 && this.aintegral == 1){
					this.total.amount = Number(this.total.amount) + Number(this.myintegral)
					let data = {
						amount:this.total.amount,
						amount_formated:'¥'+this.total.amount
					};
					this.$store.dispatch('setCheckoutTotal', data)
					this.aintegral = 0
				}
				else if(this.total.amount == 0){
					uni.showToast({
						title:'您已选择了其他积分来购买该产品',
						icon:'none'
					})
					this.use_integral_val = 0
				}
				else if(this.total.amount > this.myintegral){
					this.total.amount = Number(this.total.amount) - Number(this.myintegral)
					let data = {
						amount:this.total.amount,
						amount_formated:'¥'+this.total.amount
					};
					this.$store.dispatch('setCheckoutTotal', data)
					this.aintegral = 1
				}
				else if(this.total.amount < this.integral){
					this.integral = Number(this.total.amount)
					this.total.amount = 0
					let data = {
						amount:this.total.amount,
						amount_formated:'¥'+this.total.amount
					};
					this.$store.dispatch('setCheckoutTotal', data)
					this.aintegral = 1
				}
				else{
					this.total.amount = 0
					this.integral = this.checkoutInfo.integral[0]['integral']
					let data = {
						amount:this.total.amount,
						amount_formated:'¥'+this.total.amount
					};
					this.$store.dispatch('setCheckoutTotal', data)
					this.aintegral = 1
				}
				if(this.use_integral_val == 1){
					this.checkmoney(3);
				}
			},
			//展开收起订单商品
			onListShow(index){
                let cur = this.listShow[index] ? false : true
                this.listShow.splice(index,1,cur)
            },
			//展开弹出层
			popupHandle(val){
				if(val == 'bonus'){
					this.bonusObject.bonusBase = true
				}else if(val == 'coupon'){
					this.couponsObject.couponsBase = true
				}else if(val == 'valueCard'){
					this.valueCardObject.valueCardBase = true
				}
				this.surplusSelf = false
			},
			//关闭弹出层
			handelClose(val){
				if(val == 'payment'){
					this.paymentShow = false
				}else if(val == 'fee'){
					this.feeShow = false
				}else if(val == 'bonus'){
					this.bonusObject.bonusBase = false
				}else if(val == 'coupon'){
					this.couponsObject.couponsBase = false
				}else if(val == 'valueCard'){
					this.valueCardObject.valueCardBase = false
				}else if(val == 'inv'){
					this.showBase = false
				}else if(val == 'quanyi'){
					this.quanyiShow = false
				}
			},
			onSubmit() {
                let shop_id = []

				//点击立即付款
				this.disabled = true
				this.loading = true
				
                this.checkoutInfo.goods_list.forEach((v)=>{
                    shop_id.push(v.ru_id)
                })

                /* 根据活动rec_type值判断type_id 是什么活动id*/
                if (this.rec_type == 1 || this.rec_type == 2 || this.rec_type == 5 || this.rec_type == 6) {
                    this.extension_id = this.type_id
                } else if (this.rec_type == 7) {
                    this.t_id = this.type_id
					if(this.pay_code == 'cod' && this.use_surplus_val == 0){
						uni.showToast({
							title:"拼团活动不支持货到付款"
						})
						return false
					}
                } else if (this.rec_type == 8) {
                    this.bs_id = this.type_id
                }
				
				//支付密码
				if((this.use_surplus_val > 0 || this.valueCardObject.valueCardId > 0) && this.use_paypwd > 0 && this.paypwdValue.length < 6){
                    uni.navigateTo({
                    	url:'/pages/paypwd/paypwd'
                    });
                    return false
                }

				if(this.checkoutInfo.cross_border){
                    if(this.checkout_real_name == ''){
						uni.showToast({ title:'真实姓名不能为空', icon:'none' });
                        return false
                    }else if(this.checkout_real_id == ''){
						uni.showToast({ title:'身份证号不能为空', icon:'none' });
                        return false
                    }
                }
				
				if(Number(this.surplus) > Number(this.checkoutInfo.user_money)){
					uni.showToast({ title:'使用余额超出可用余额', icon:'none' });
					return false
				}

                //发票
                let inv_payee = this.invoice.company ? this.invoice.company_name : this.invoice.invoiceTitle
                let tax_id = this.invoice.invoiceType ? this.invoice.tax_id : this.invoice.company_tid
				let isRecId = this.checkoutInfo.isshipping_list.length > 0 ? this.checkoutInfo.isshipping_list : this.cart_id
				
				//来源
				let referer = uni.getStorageSync('platform').toLowerCase()
				if(uni.getStorageSync('platform') == 'MP-WEIXIN'){
					referer = 'wxapp'
				}
				let o = {
					cart_value: isRecId,										//购物车id
					flow_type: this.checkoutInfo.flow_type,						//购物类型
					store_id: this.store_id,									//门店id
					store_type: '',												//门店类型、自营/商家
					store_mobile: this.store_mobile,					        //门店电话
					take_time: this.take_time,							        //门店提货时间
					pay_type: 1,												//支付方式类型
					pay_id: this.pay_id,										//支付方式id
					ru_id: shop_id,												//商家id
					shipping: this.shipping_id,									//配送方式
					shipping_code: this.shipping_code,                          //配送方式code
					shipping_type: this.shipping_type,                          //是否是上门自取
					point_id: 0,												//自提编号
					shipping_dateStr: 0, 										//自提时间
					is_surplus: this.use_surplus_val,							//是否使用余额
					surplus: this.surpluss,													//使用余额值
					use_integral: this.use_integral_val,					    //是否使用积分
					integral: this.myintegral,									//本单可使用积分
					use_price: this.use_price_val,					            //是否乐券
					price: this.myprice,									//本单可使用乐券
					bonus_id: this.bonusObject.bonusId,							//红包id
					bonus: this.bonusObject.bonusMoney,							//红包金额
					bonus_sn: this.bonusObject.bonusSn, 						//红包编号
					uc_id: this.couponsObject.couponsId,						//优惠券id
					coupons: this.couponsObject.couponsMoney,					//优惠券金额
					vc_id: this.valueCardObject.valueCardId,					//储值卡id
					use_value_card: this.valueCardObject.valueCardMoney,		//储值卡金额
					goods_amount: this.amountPrice,								//商品总价
					discount: 0,												//优惠金额
					how_oos: 0,													//缺货处理
					postscript: this.postscriptValue,							//订单留言
					invoice: 0,
					inv_type: this.invoice.invoiceType ? 1 : 0,					//发票类型
					inv_payee: inv_payee,						                //发票类别、个人/公司
					tax_id: tax_id,								                //纳税人识别码或者增值税发票id
					inv_content: this.invoice.invoiceConent,					//发票内容
					need_inv: 0,
					card_message: '',											//贺卡信息
					tax: 0,														//税
					pack: 0,
					card: 0,
					vat_id: 0,
					need_insure: 0,
					bs_id: this.bs_id,                   						//砍价id
					t_id: this.t_id,                                            //拼团活动id
					team_id: this.team_id,                 						//拼团开团活动id
					extension_id: this.extension_id,		  				    //扩展活动id
					rel_name:this.checkout_real_name,							//身份证姓名
                    id_num:this.checkout_real_id,								//身份证号
					address_id:this.address_id,                                 //收货地址id
					pay_pwd:this.paypwdValue,                                   //支付密码
					referer:referer,											//订单来源
					order_membership_card_id:this.vipReceiveState ? this.vipCard.order_membership_card_id : 0, //权益卡id
                    membership_card_discount_price:this.vipCard.membership_card_discount_price //购买权益卡折扣
				}
				if (this.store_id == 0){
					if (this.checkoutInfo.noshipping_list.length > 0) {
						uni.showModal({
							title:'提示',
							content:'有不支持配送商品,是否继续提交',
							success:(data)=>{
								if(data.confirm){
									// 支付后支付密码清空
									this.paypwdValue = '';
									
									this.$store.dispatch('setCheckoutSubmit', o).then((res) => {
										if (res.data) {
											uni.reLaunch({
												url:'/pages/done/done?order_sn='+res.data
											})
										}
										
										//点击立即付款
										this.disabled = false
										this.loading = false
									})
								}else if(data.cancel) {
									uni.switchTab({
										url:'/pages/cart/cart'
									})
									
									//点击立即付款
									this.disabled = false
									this.loading = false
								}
							}
						})
					} else if (this.checkoutInfo.isshipping_list.length > 0) {
						// 支付后支付密码清空
						this.paypwdValue = '';
						this.$store.dispatch('setCheckoutSubmit', o).then((res) => {
							if (res.data) {
								uni.reLaunch({
									url:'/pages/done/done?order_sn='+res.data
								})
							}
							
							//点击立即付款
							this.disabled = false
							this.loading = false
						})
					}
				}else{
					// 支付后支付密码清空
					this.paypwdValue = '';
					this.$store.dispatch('setCheckoutSubmit', o).then((res) => {
						if (res.data) {
							uni.reLaunch({
								url:'/pages/done/done?order_sn='+res.data
							})
						}
						
						//点击立即付款
						this.disabled = false
						this.loading = false
					})
				}
            },
			productLink(item){
				if(this.rec_type == 0 && item.extension_code != 'package_buy'){
					uni.navigateTo({
						url:"/pages/goodsDetail/goodsDetail?id="+item.goods_id
					})
				}else if(this.rec_type == 1){
					this.$outerHref(host + 'groupbuy/detail/' + this.type_id)
				}else if(this.rec_type == 2){
					this.$outerHref(host + 'auction/detail/' + this.type_id)
				}else if(this.rec_type == 4){
					this.$outerHref(host + 'exchange/detail/' + this.type_id)
				}else if(this.rec_type == 5){
					this.$outerHref(host + 'presale/detail/' + this.type_id)
				}else if(this.rec_type == 6){
					uni.navigateTo({
						url:"/pages/seckill/detail/detail?id=" + this.type_id +'&tomorrow=0'
					})
				}else if(this.rec_type == 7){
					uni.navigateTo({
						url:"pagesA/team/detail/detail?goods_id=" + item.goods_id
					})
				}else if(this.rec_type == 8){
					uni.navigateTo({
						url:"pagesA/bargain/detail/detail?team_id=" + this.type_id +'&goods_id='+item.goods_id
					})
				}else if(item.extension_code == 'package_buy'){
					this.$outerHref(host + 'package')
				}
			},
			//分销会员卡
			drpApplyHref(id){
				uni.navigateTo({
					url:'/pagesA/drp/apply/apply?card_id='+id
				})
			},
			//vip优惠领取
			vipReceive(){
				this.vipReceiveState = !this.vipReceiveState;
				uni.showLoading({title:"加载中"})
				uni.request({
					url:this.websiteUrl + '/api/v4/trade/change_membership_card',
					method:'POST',
					data:{
						total: this.total,
						order_membership_card_id:this.vipReceiveState ? this.vipCard.order_membership_card_id : 0,
						membership_card_discount_price:this.vipCard.membership_card_discount_price
					},
					header: {
						'Content-Type': 'application/json',
						'token': uni.getStorageSync('token'),
						'X-Client-Hash':uni.getStorageSync('client_hash')
					},
					success: (res) => {
						let data = res.data.data
						this.$store.dispatch('setCheckoutTotal', data)

						this.amountPrice = data.amount
						this.ratePrice = data.rate_price

                        this.total.membership_card_buy_money = data.membership_card_buy_money
                        this.total.membership_card_buy_money_formated = data.membership_card_buy_money_formated
                        this.total.membership_card_discount_price = data.membership_card_discount_price
                        this.total.membership_card_discount_price_formated = data.membership_card_discount_price_formated

						this.vipCard.membership_card_buy_money = data.membership_card_buy_money
						this.vipCard.membership_card_buy_money_formated = data.membership_card_buy_money_formated
						this.vipCard.membership_card_discount_price = data.membership_card_discount_price
						this.vipCard.membership_card_discount_price_formated = data.membership_card_discount_price_formated

						uni.hideLoading();
				   },
				   fail: (res) => {
						uni.hideLoading();
				   }
				})
			},
			quanyiClick(){
				this.quanyiShow = true
			}
		},
		onLoad(e){
			this.rec_type = e.rec_type ? e.rec_type : 0;
			this.type_id = e.type_id ? e.type_id : 0;
			this.team_id = e.team_id ? e.team_id : 0;
			this.store_id = e.store_id ? e.store_id : 0;
			
			// 支付密码默认清空
			this.paypwdValue = '';
		},
		onShow(){
			let pages = getCurrentPages();
			let currPage = pages[pages.length-1];
			//判断是否是从支付密码也返回来的
			// #ifdef APP-PLUS
			if(currPage.$vm.hope){
				uni.showLoading({
				    title: '加载中'
				});
				
				this.onSubmit();
				
				currPage.$vm.hope = ""
			}else{
				this.checkoutDefault(this.rec_type);
			}
			// #endif
			// #ifdef H5										
			   this.checkoutDefault(this.rec_type);							
			// #endif
			
			this.bonusObject = {
				bonusContent: '不使用红包',
				bonusBase: false,
				bonusId: 0,
				bonusMoney: 0,
				bonusSn: 0
			}
			this.couponsObject = {
				couponsContent: '不使用优惠券',
				couponsBase: false,
				couponsId: 0,
				couponsMoney: 0
			}
			this.valueCardObject= {
				valueCardContent: '不使用储值卡',
				valueCardBase: false,
				valueCardId: 0,
				valueCardMoney: 0,
				vc_dis: 0
			}
			
			this.use_integral_val = 0
			this.use_surplus_val = 0
		},
		watch:{
			checkoutInfo(){
				if (this.checkoutInfo.length == 0) {
					uni.reLaunch({
						url: '/pages/cart/cart'
					})
                    return false
                }
				
				if(this.checkoutInfo != 'address'){
					this.checkoutDisplay = true
					
					//默认选中在线支付
					if(this.pay_name == ''){
						this.payment_method.forEach(v=>{
							if(v.pay_code == 'onlinepay'){
								this.pay_name = v.pay_name
								this.pay_id = v.pay_id
								this.pay_code = v.pay_code
							}
						})
					}
					
					//跨境身份证信息
					if(this.checkoutInfo.consignee){
						this.checkout_real_id = this.checkoutInfo.consignee.id_num
						this.checkout_real_name = this.checkoutInfo.consignee.rel_name
					}
				}else{
					this.checkoutDisplay = false
				}
				
				//立即付款可以点击
				this.disabled = false
				this.loading = false
			},
			payment_method(){
                if(this.payment_method == ''){
					uni.showToast({
						title:'未安装支付方式',
						icon:'none'
					})
                    return false
                }
            },
			shipping(){
				this.shipping_id = [];
				this.shipping_code = [];
				this.shipping_name = [];
				this.format_shipping_fee = [];
				this.shipping_fee = [];
				this.shipping_type = [];
				this.rate_price = [];
				
                //获取默认配送放id,code,type
                this.shipping.forEach((v) => {
                    if(v == undefined && this.store_id == 0){
						this.shipping_name.push('')
						uni.showToast({
							title:'有不支持配送商品',
							icon:'none'
						})
                        return false
                    }

                    this.shipping_id.push(v.shipping_id)
                    this.shipping_code.push(v.shipping_code)
                    this.shipping_name.push(v.shipping_name)
                    this.format_shipping_fee.push(v.format_shipping_fee)
                    this.shipping_fee.push(v.shipping_fee)
                    this.shipping_type.push(0)
					this.rate_price.push(v.rate_price)
                })
            },
			address_id(){
                //跨境身份证信息
                this.checkout_real_id = this.checkoutInfo.consignee.id_num
                this.checkout_real_name = this.checkoutInfo.consignee.rel_name
            },
			surplusSelf(){
				if(!this.surplusSelf){
					clearTimeout(this.timer);
					uni.showLoading({title: '加载中'});
					this.timer = setTimeout(()=>{
						uni.request({
							url:this.websiteUrl + '/api/v4/trade/changesurplus',
							method:'POST',
							data:{
								total: this.total,
								surplus: 0,
								shopping_fee: this.shippingFee
							},
							header: {
								'Content-Type': 'application/json',
								'token': uni.getStorageSync('token'),
								'X-Client-Hash':uni.getStorageSync('client_hash')
							},
							success: (res) => {
								let data = res.data.data
								this.$store.dispatch('setCheckoutTotal', data)
								
								if (data.card_money > 0) {
									this.valueCardObject.valueCardContent = data.card_formated
									this.valueCardObject.vc_dis = data.vc_dis
								} else {
									this.valueCardObject.valueCardContent = '不使用储值卡'
								}
						   
								this.amountPrice = data.amount
								this.valueCardObject.valueCardMoney = data.card_money
								this.total.card_money = data.card_money
								this.total.surplus = data.surplus
								this.total.surplus_formated = data.surplus_formated
								this.surplus = data.surplus
								
								uni.hideLoading()
						   },
						   fail: (res) => {
								console.log(JSON.stringify(res))
								uni.hideLoading();
						   }
						})
					},1000)
				}
			}
		}
	}
</script>

<style>
.uni-list-cell-navigate .title{ margin-right: 20upx; }
.uni-list-cell-title .uni-list-cell-navigate .title{ color: #000000; font-size: 30upx; flex: 1;}
.uni-list-cell-title .uni-list-cell-navigate .value{ font-size: 30upx; }

/*发票*/
.invoice-show .header-title{ font-size: 32upx;padding-bottom: 20upx; color: #000000;}
.invoice-show .btn-bar{ margin: 40upx 30upx 0;}

.invoice-warp-box{ padding: 20upx 30upx; }
.invoice-warp-box{ border-bottom: 1px solid #f6f6f9; background: #FFFFFF;}
.invoice-warp-box .tips{ font-size:26upx; color: #999999; line-height: 1.5; margin-top: 20upx;}
.invoice-cont-box .selects{ padding: 20upx 30upx; margin-bottom: 20upx; background: #FFFFFF;}
.invoice-cont-box .selects .select{ padding: 10upx 40upx;}

.invoice-cont{ background: #FFFFFF; margin-top: 20upx; padding: 20upx 30upx;}
.invoice-cont .uni-list-cell{ justify-content: flex-start; padding-bottom: 20upx;align-items: center;}

.uni-popup-right{ width: 80%;}

.btn-goods-action .submit-bar-text{ width: 480upx; }

.cell-value-flex{ display: flex; flex-direction: row; justify-content: space-between;}
.cell-value-flex .input-bor{ margin-right: 10upx;}
.cell-value-flex text{ font-size: 25upx;}

.lie-list{ display: flex; flex-direction: row; justify-content: space-between; padding: 20upx 0 0; border-top: 1px solid #e5e5e5; color: #999;}
.lie-list .left .uni-tag{ margin-right: 10upx;}

.vip-zk{ display: flex; flex-direction: row; align-items: center; justify-content: flex-start; }
.vip-zk .vip-img image{ width: 60upx; height: 60upx; }
.vip-zk .vip-zk-info{ margin-left: 20upx; }
.vip-zk .vip-zk-info .tit{ font-size: 28upx; color: #333; display: flex;}
.vip-zk .vip-zk-info .tit text{ margin: 0 10upx; color: #f92028; }
.vip-zk .vip-zk-info .tit .iconfont{ margin-left: 10upx; height: 50upx; line-height: 50upx; }
.vip-zk .vip-zk-info .subtit{ font-size: 25upx; color: #999; }

.vip-zk-price{ height: 100%; display: flex; flex-direction: row; justify-content: flex-end; align-items: center; }
.vip-zk-price .price{ font-size: 28upx; margin-right: 10upx; color: #f92028; }
.vip-zk-price .mf{ font-size: 25upx; }
.vip-zk-price .iconfont{ color: #999; margin-top: 5upx; }
.vip-zk-price.active .iconfont{ color: #f92028; }

.quanyiShow .uni-popup-middle{ width: 70%; border-radius: 20upx; padding: 20upx; height: auto;}
.quanyiShow .quanyi-top { text-align: center; margin: 20upx 0 0; position: relative; width: 100%;}
.quanyiShow .quanyi-top .icon-vip{ width: 80upx; height: 80upx; display: inline-block;}
.quanyiShow .quanyi-top .name{ font-size: 28upx; font-weight: bold; margin-top: 20upx;}
.quanyiShow .quanyi-top .icon-close{ position: absolute; top:-18upx; right: 15upx;}
.quanyiShow .quanyi-xian{ width: 100%; text-align: center; position: relative; margin: 30upx 0;}
.quanyiShow .quanyi-xian text{ display: inline-block; padding: 0 20upx; background: #fff; overflow: hidden; font-size: 25upx; color: #999; line-height: 40upx; height: 40upx; position: relative; z-index: 3;}
.quanyiShow .quanyi-xian:after{ content: " "; width: 100%; height: 1px; background: #f0f0f0; position: absolute; top: 20upx; left: 0; right: 0; z-index: 2 }
.quanyiShow .quanyi-list{ overflow: hidden; display: flex; flex-direction: row; flex-wrap: wrap;}
.quanyiShow .quanyi-list .item{ width: 33.3%; display: flex; flex-direction: column; justify-content: center; align-items: center; margin: 20upx 0;}
.quanyiShow .quanyi-list .item .icon{ width: 100upx; height: 100upx; border-radius: 50%; overflow: hidden; }
.quanyiShow .quanyi-list .item .txt{ font-size: 25upx; color: #666; margin-top: 20upx;}
</style>
