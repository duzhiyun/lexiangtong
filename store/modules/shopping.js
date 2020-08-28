import {
	GOODS_CART_LIST,
	GOODS_GUESS_LIST,
	STORE_ALL,
	SHIPPING,
	SHIPPING_FEE,
	CHECKOUT,
	CHECKOUT_TOTAL,
	DONEINFO,
	PAYLIST,
	CART_COUPONS_LIST,
	COUDAN_GOODS_LIST,
	COUDAN_INFO
} from '../mutation-type.js'

import { apiShopping } from '@/config'
import isLogin from '@/common/mixins/isLogin'

const state = {
	goodsCartList:[],
	goodsGuessList:[],
	checkedGoods:[],
	allGoodsListId:[],
	checkedShop:[],
	shipping_fee:'',
	checkoutInfo:'',
	listShow:[],
	cartCheckedVlaue:[],
	pay_list:[],
	pay_id:'',
	doneinfo:'',
	cartCouponsList:[],
	coudanGoodsList:[],
	coudanInfo:''
}

const mutations = {
	[GOODS_CART_LIST](state,o){
		state.checkedShop = []
		state.goodsCartList = o.data
		
	    state.goodsCartList.forEach((v,index)=>{
	    	state.checkedGoods[index] = []
			state.allGoodsListId[index] = []
			
	    	v.new_list.forEach((act,actIndex)=>{
	    		act.act_goods_list.forEach((g,gIndex)=>{
					state.allGoodsListId[index].push(g.rec_id)
	    			if(g.is_checked){
	    				state.checkedGoods[index].push(g.rec_id)
	    			}
	    		})
	    	})
	    	state.checkedShop.push(v.checked)
	    })
	},
	[STORE_ALL](state,o){
		for(let i = 0; i<state.goodsCartList.length; i++){
			state.goodsCartList[i].checked = o.type
		}
	},
	[SHIPPING](state,o){
	},
	[SHIPPING_FEE](state,o){
		state.shipping_fee = o.data
	},
	[CHECKOUT](state,o){
		if(!o.error){
			state.checkoutInfo = o
			if(o.goods_list && o.goods_list.length>0){
				o.goods_list.forEach((v)=>{
					if(v.goods.length > 1){
						state.listShow.push(true)
					}else{
						state.listShow.push(false)
					}
				})
			}
		}else{
			state.checkoutInfo = o.error
			
			if(uni.getStorageSync('token') != ''){
				if(o.error == 'address'){
					uni.showModal({
						content: "您暂无收货地址，是否去添加收货地址？",
						success:(res)=>{
							if(res.confirm){
								uni.navigateTo({
									url:'/pagesB/address/address?statetype=true'
								})
							}else if(res.cancel){
								uni.reLaunch({
									url:'/pages/cart/cart'
								})
							}
						}
					})
				}
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
		}
		uni.hideLoading();
	},
	[CHECKOUT_TOTAL](state,o){
		state.checkoutInfo.total = o
	},
	[DONEINFO](state,o){
		state.doneinfo = o
	},
	[PAYLIST](state,o){
		state.pay_list = o
		state.pay_id = ''
		state.pay_list.forEach((v)=>{
			if(v.selected){
				state.pay_id = v.pay_id
			}
		})
	},
	[GOODS_GUESS_LIST](state,o){
		state.goodsGuessList = o.data
	},
	[CART_COUPONS_LIST](state,o){
		state.cartCouponsList = o.data
	},
	[COUDAN_GOODS_LIST](state,o){
		if(o.page == 1){
			state.coudanGoodsList = o.data
		}else{
			if(o.data.length != 0){
				for(let i= 0;i<o.data.length;i++){
					state.coudanGoodsList.push(o.data[i])
				}
			}
		}
	},
	[COUDAN_INFO](state,o){
		state.coudanInfo = o.data
	}
}

const actions = {
	async setAddCart({ commit }, o){
		return apiShopping.getAddCart(o)
	},
	async setGoodsCart({ commit }, o){
		apiShopping.getCartList(o).then(res=>{
			commit(GOODS_CART_LIST,res)
		})
	},
	setUpdateNumber({ commit }, o){
		return apiShopping.getUpdateNumber(o)
	},
	setGiftList({ commit }, o){
		return apiShopping.getGiftList(o)
	},
	setGiftChecked({ commit }, o){
		return apiShopping.getGiftChecked(o)
	},
	setFavourable({ commit }, o){
		return apiShopping.getFavourable(o)
	},
	setChangefav({ commit }, o){
		return apiShopping.getChangefav(o)
	},
	setCoupons({ commit }, o){
		apiShopping.getCoupons(o).then(res=>{
			commit(CART_COUPONS_LIST,res)
		})
	},
	setCoudanGoodsList({ commit }, o){
		apiShopping.getCoudanGoodsList(o).then(res=>{
			commit(COUDAN_GOODS_LIST,res)
		})
	},
	setCoudan({ commit },o){
		apiShopping.getCoudan(o).then(res=>{
			commit(COUDAN_INFO,res)
		})
	},
	setCartGoodsDelete({ commit }, o){
		return apiShopping.getCartGoodsDelete(o)
	},
	setCartBatchDelete({ commit }, o){
		return apiShopping.getCartBatchDelete(o)
	},
	setShippingFee({ commit }, o){
		apiShopping.getShippingFee(o).then(res=>{
			commit(SHIPPING_FEE,res)
		})
	},
	setShipping({ commit }, o){
		return apiShopping.getShipping(o)
	},
	setCartChecked({ commit }, o){
		return apiShopping.getCartChecked(o)
	},
	setCartDefault({ commit }, o){
		return apiShopping.getCartDefault(o)
	},
	setStoresCart({ commit }, o){
		return apiShopping.getStoresCart(o)
	},
	storeAll({ commit }, o){
		commit(STORE_ALL, o)
	},
	setShoppingCheckout({ commit }, o){
		apiShopping.getShoppingCheckout(o).then(res=>{
			commit(CHECKOUT, res)
		})
	},
	setCheckoutTotal({ commit }, o){
		commit(CHECKOUT_TOTAL,o)
	},
	setCheckoutSubmit({ commit }, o){
		return apiShopping.getCheckoutSubmit(o)
	},
	setDoneInfo({ commit }, o){
		apiShopping.getDoneInfo(o).then(res=>{
			commit(DONEINFO,res)
		})
	},
	setDoneInfoBalance({ commit }, o){
		apiShopping.getDoneInfoBalance(o).then(res=>{
			commit(DONEINFO,res)
		})
	},
	setPayList({ commit }, o){
		apiShopping.getPayList(o).then(res=>{
			commit(PAYLIST, res)
		})
	},
	setPayTab({ commit }, o){
		return apiShopping.getPayTab(o)
	},
	setGoodsGuess({ commit }, o){
		apiShopping.getGoodsGuess(o).then(res =>{
			commit(GOODS_GUESS_LIST,res)
		})
	},
	setAddPackageCart({ commit }, o){
		return apiShopping.getAddPackageCart(o)
	}
}

export default{
	state,
	mutations,
	actions
}