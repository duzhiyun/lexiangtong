import * as localConfig from '../local/config'
import request from '@/common/request.js'

const webUrl = localConfig.websiteUrl

// 进入聊天页面
function getKefuLogin(o){
	return new Promise((reslove, reject) => {
		request.post(webUrl + '/kefu/index', o).then(res=>{	
			reslove({
				data:res
			})
		})
	})
}

// 客户页面聊天历史记录
function getKefuSingleChatList(o){
	return new Promise((reslove, reject) => {
		request.get(webUrl + '/kefu/index/single_chat_list', o).then(res=>{	
			if (res.error == 1) {
				uni.showToast({
					title:'没有历史记录了',
					icon:'none'
				})
				return false
			}
			reslove({
				data:res
			})
		})
	})
}
// 发送消息 
function getTransMessage(o){
	return new Promise((reslove, reject) => {
		request.post(webUrl + '/kefu/admin/trans_message', o).then(res=>{
			
			reslove(res) 
		})
	})
}

// 发送图片
function getSendImage(o){
	return new Promise((reslove, reject) => {
		request.post(webUrl + '/kefu/index/send_image', o).then(res=>{			
			reslove(res) 
		})
	})
}


export default {
	getKefuLogin,
	getKefuSingleChatList,
	getTransMessage,
	getSendImage
}