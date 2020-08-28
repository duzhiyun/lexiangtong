import {Base64} from '@/common/base64'
import store from '../store'
import isLogin from '@/common/mixins/isLogin'

export default async function outerHref(url,built){
	let roles = await store.dispatch('setShopConfig',{type:true});
	let mpChecked = roles.data.mp_checked
	
	if(store.state.outerHrefType){
		return false
	}
	
	if(url === ''){
		return false
	}
	
	if(mpChecked){
		store.commit('toggleHrefType',true)
	}
	
	uni.setStorage({key:'configData',data:roles.data})
	
	if(built != undefined && built != 'undefined' && built != 'onback'){
		if(built == true || built == 'app'){
			let reg = RegExp(/index\/index|category\/category|search\/search|cart\/cart|jiaoyi\/shopjiaoyi|user\/user/);
			let isUrl = reg.test(url);
			if(isUrl){
				uni.reLaunch({
					url:url,
					success: (res) => {
						store.commit('toggleHrefType',false)
					}
				})
			}else{
				uni.navigateTo({
					url:url,
					success: (res) => {
						store.commit('toggleHrefType',false)
					}
				})
			}
		}else{
			uni.showModal({
				content: "您需要登录会员!",
				success:(res)=>{
					if(res.confirm){
						uni.navigateTo({
							url:'/pages/login/login?delta=1'
						})
					}
					
					store.commit('toggleHrefType',false)
				}
			})
		}
	}else{
		if(1){
			// #ifdef MP-WEIXIN
			//if(isLogin()){
				uni.navigateTo({
					url:"/pages/web-view/web-view?url="+ encodeURIComponent(url)
				});
			// }else{
			// 	uni.showModal({
			// 		content: "您需要登录会员!",
			// 		success:(res)=>{
			// 			if(res.confirm){
			// 				uni.navigateTo({
			// 					url:'/pages/login/login?delta=1'
			// 				})
			// 			}
			//			store.commit('toggleHrefType',false)
			// 		}
			// 	})
			// }
			// #endif
			
			// #ifdef APP-PLUS
			let like = ''
			if(built != 'onback'){
				like = "/pages/web-view/web-view?url="+ encodeURIComponent(url)
			}else{
				store.commit('toggleSplashType',false)
				
				like = "/pages/web-view/web-view?url="+ encodeURIComponent(url) + '&type=onback'
			}
			uni.navigateTo({
				url:like
			});
			// #endif
		}
	}
}