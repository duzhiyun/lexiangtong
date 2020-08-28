import * as localConfig from '../local/config'
import request from '@/common/request.js'

const webUrl = localConfig.websiteUrl

/* scopeApp - session */
function scopeAppSession(o){
	return new Promise((reslove, reject) => {
		request.post(webUrl + '/api/v4/user/wxapp/session',o).then(res=>{
			reslove(res)
		})
	})
}

/* scopeApp - mobile */
function scopeAppDecrypt(o){
	return new Promise((reslove, reject) => {
		request.post(webUrl + '/api/v4/user/wxapp/decrypt',o).then(res=>{
			reslove(res)
		})
	})
}

/* scopeApp - login */
function scopeAppLogin(o){
	return new Promise((reslove, reject) => {
		request.post(webUrl + '/api/v4/user/wxapp/login',o).then(res=>{
			if(o.delta){
				reslove({
					data:res,
					delta:o.delta
				})
			}else{
				reslove({
					data:res
				})
			}
		})
	})
}


/* 客服 */
function getChat(o){
	return new Promise((reslove, reject) => {
		request.get(webUrl + '/api/v4/chat',o).then(res=>{
			reslove(res)
		})
	})
}

/* 获取定位 */
function setLocation(){
	return new Promise((reslove, reject) => {
		uni.getLocation({
			type: 'wgs84',
			success: function(res){
				let lat = res.latitude;
				let lng = res.longitude;
				
				request.get(webUrl + '/api/v4/misc/position',{
					lat:lat,
					lng:lng
				}).then(res=>{
					let data = res.data;
					let itemsBak;
					if(data){
						itemsBak = {
							province:{
								id:data.province_id,
								name:data.province
							},
							city:{
								id:data.city_id,
								name:data.city
							},
							district:{
								id:data.district_id,
								name:data.district
							},
							postion:{
								lat:lat,
								lng:lng
							}
						}
					}
					
					reslove({
						data:itemsBak
					})
				})
			}
		})
	})
}

/* 地区 */
function getRegion(o){
	return new Promise((reslove, reject) => {
		request.get(webUrl + '/api/v4/misc/region',o).then(res=>{
			if(res.length > 0){
			    reslove({
			        id:o.region,
			        level:o.level,
			        data:res,
			        status:false
			    })
			}else{
			    reslove({
			        status:true
			    })
			}
		})
	})
}

/* 图片验证码 */
function getImgVerify(o){
	return new Promise((reslove, reject) => {
		request.get(webUrl + '/api/v4/misc/captcha',o).then(res=>{
			reslove(res)
		})
	})
}

/* 发送短信验证码 */
function getSendVerify(o){
	return new Promise((reslove, reject) => {
		request.post(webUrl + '/api/v4/misc/sms/send',o).then(res=>{
			if(res.status == 'success'){
			    reslove(res.data.status)
			}else{
				uni.showToast({ title: res.errors.message, icon: "none" });
			}
		})
	})
}

/* 验证填写的短信验证码是否正确 */
function getSmsVerify(o){
	return new Promise((reslove, reject) => {
		request.post(webUrl + '/api/v4/misc/sms/verify',o).then(res=>{
			reslove(res)
		})
	})
}

/* 获取后台设置shopcofig */
function getShopConfig(){
	return new Promise((reslove, reject) => {
		request.get(webUrl + '/api/v4/shop/config').then(res=>{
			reslove(res)
		})
	})
}

function getSplashAdPosition(){
	return new Promise((reslove, reject) => {
		request.get(webUrl + '/api/v4/app/ad_position').then(res=>{
			reslove(res)
		})
	})
}

/* 购物车公共数量 */
function getCommonCartNumber(){
	return new Promise((reslove, reject) => {
		request.get(webUrl + '/api/v4/cart/cartNum').then(res=>{
			reslove(res)
		})
	})
}

export default{
	scopeAppSession,
	scopeAppDecrypt,
	scopeAppLogin,
	setLocation,
	getChat,
	getRegion,
    getImgVerify,
    getSendVerify,
    getSmsVerify,
	getShopConfig,
	getSplashAdPosition,
	getCommonCartNumber
}