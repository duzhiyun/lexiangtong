import * as localConfig from '../local/config'
import request from '@/common/request.js'

const webUrl = localConfig.websiteUrl

function getGoodsInfo(o){
	return new Promise((reslove, reject) => {
		request.post(webUrl + '/api/v4/goods/show',o).then(res=>{
			reslove(res)
		})
	})
}

function getGoodsCouponList(o){
	return new Promise((reslove, reject) => {
		request.get(webUrl + '/api/v4/coupon/goods',o).then(res=>{
			reslove(res)
		})
	})
}

function getGoodsCouponReceive(o){
	return new Promise((reslove, reject) => {
		request.post(webUrl + '/api/v4/coupon/receive',o).then(res=>{
			reslove(res)
		})
	})
}

function getGoodsAttrOper(o){
	return new Promise((reslove, reject) => {
		request.post(webUrl + '/api/v4/goods/attrprice',o).then(res=>{
			reslove(res)
		})
	})
}

function getGoodsComment(o){
	return new Promise((reslove, reject) => {
		request.post(webUrl + '/api/v4/comment/goods',o).then(res=>{
			reslove(res)
		})
	})
}

/* 分享生成分享图片 */
function getGoodsShare(o){
	return new Promise((reslove, reject) => {
		request.post(webUrl + '/api/v4/goods/shareposter',o).then(res=>{
			reslove(res)
		})
	})
}

/* 商品组合购买，配件列表 */
function getFitting(o){
	
}

/* 组合套餐价格 */
function getFittingPrice(o){
	
}

/* 选中配件 */
function getAddToCartCombo(o){
	
}

/* 取消配件 */
function getDelInCartCombo(o){
	
}

/* 配件加入购物车 */
function getAddToCartGroup(o){
	
}


export default {
	getGoodsInfo,
	getGoodsCouponList,
	getGoodsCouponReceive,
	getGoodsAttrOper,
	getGoodsComment,
	getGoodsShare,
	getFitting,
	getFittingPrice,
	getAddToCartCombo,
	getDelInCartCombo,
	getAddToCartGroup
}