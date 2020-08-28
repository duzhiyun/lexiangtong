import {
	LOCATION,
	REGION,
	IMG_VERIFY,
	SCOPE_APP_LOGIN,
	SHOP_CONFIG,
	SPLASH_AD_POSITION,
	COMMON_CART_NUMBER,
	UPDATE_TEXT
} from '../mutation-type.js'

import { apiCommon } from '@/config'
import store from '@/store'

const state = {
	region:{
		provinceData:[],
		cityData:[],
		districtData:[],
		streetData:[],
		status:false,
	},
	imgVerify:{
		captcha:'',
		client:''
	},
	phoneNumber:'',
	bonusData:'',
	shopConfig:'',
	mpChecked:false,
	splashList:[],
	trade_pwd:'',
	cartNumber:0
}

const mutations = {
	[SCOPE_APP_LOGIN](state,o){		
		let data = o.data
		if(data.status == "failed"){
			if(data.errors){
				uni.showToast({
					title:data.errors.message ? data.errors.message : '该手机号已被注册或绑定',
					icon:'none'
				})
				
				setTimeout(()=>{
					uni.reLaunch({
						url:'/pages/user/user'
					});
				},1000)
			}else{
				console.log(JSON.stringify(data))
			}
		}else{
			//存本地token
			uni.setStorage({
				key:'token',
				data:data.data,
				success: (res) => {
					if(o.delta){
						uni.navigateBack({
							delta:1
						});
					}else{
						uni.reLaunch({ 
							url:'/pages/user/user'
						});
					}
				}
			});
			
			//获取购物车数量
			store.dispatch('setCommonCartNumber');
		}
	},
	[LOCATION](state,o){
		//存本地缓存
		uni.setStorage({
			key:'userRegion',
			data:o.data
		})
	},
	[REGION](state,o){
        if(o.status != true){
            switch(o.level){
                case 1:
                    state.region.provinceData = o.data
                    break
                case 2:
                    state.region.cityData = o.data
                    break
                case 3:
                    state.region.districtData = o.data
                    break
                case 4:
                    state.region.streetData = o.data
                    break
                default:
                    break
            }
        }
        state.region.status = o.status
    },
    [IMG_VERIFY](state,o){
        state.imgVerify.captcha = o.data.captcha
        state.imgVerify.client = o.data.client
    },
	[SHOP_CONFIG](state,{res,o}){
		state.bonusData = res.data.bonus_ad
		state.mpChecked = res.data.mp_checked
		state.shopConfig = res.data
		
		uni.setStorage({
			key:'configData',
			data:res.data
		})
		
		if(res.data.bonus_ad && res.data.bonus_ad.open == 1 && o == undefined){
			uni.setStorage({
				key:'bonusShow',
				data:true
			})
		}
	},
	[SPLASH_AD_POSITION](state,o){
		state.splashList = o.data
	},
	[COMMON_CART_NUMBER](state,o){
		let cartNumber = Number(o.data.cart_number)
		state.cartNumber = cartNumber
		uni.setStorage({
			key:'cartNumber',
			data:cartNumber
		})
	},
	//公共方法修改text
	[UPDATE_TEXT](state, o){
		state[o.attrName] = o.newValue
	}
}

const actions = {
	//scopeApp
	getScopeAppSession({ commit },o){
		return apiCommon.scopeAppSession(o);
	},
	getScopeAppDecrypt({ commit }, o){
		return apiCommon.scopeAppDecrypt(o);
	},
	getScopeAppLogin({ commit }, o){
		apiCommon.scopeAppLogin(o).then(res=>{
			commit(SCOPE_APP_LOGIN,res)
		})
	},
	//定位
	getLocation({ commit } ,o){
		apiCommon.setLocation(o).then(res=>{
			commit(LOCATION,res)
		})
	},
	//客服
    setChat({ commit }, o){
        return apiCommon.getChat(o)
    },
	//地区
	setRegion({ commit }, o){
        apiCommon.getRegion(o).then(res=>{
            commit(REGION, res)
        })
    },
	//图像验证码
    setImgVerify({ commit }, o){
        apiCommon.getImgVerify(o).then(res=>{
            commit(IMG_VERIFY, res)
        })
    },
	//发送短信
    async setSendVerify({ commit }, o){
        return apiCommon.getSendVerify(o)
    },
	//短信验证码验证
    async setSmsVerify({ commit }, o){
        return apiCommon.getSmsVerify(o)
    },
	//获取shopconfig
	setShopConfig({ commit },o){
		if(o && o.type){
			return apiCommon.getShopConfig()
		}else{
			apiCommon.getShopConfig().then(res=>{
				commit(SHOP_CONFIG,{res,o})
			})
		}
	},
	//splash广告
	setSplashAdPosition({ commit }){
		apiCommon.getSplashAdPosition().then(res=>{
			commit(SPLASH_AD_POSITION,res)
		})
	},
	//公共方法修改text
	updateText({ commit }, o) {
        commit(UPDATE_TEXT, o);
    },
	//导航栏显示购物车数量
	setCommonCartNumber({ commit }, o){
		apiCommon.getCommonCartNumber().then(res=>{
			commit(COMMON_CART_NUMBER, res)
		})
	}
}

export default {
    state,
    mutations,
    actions,
}