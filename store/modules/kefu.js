import {
	KEFU_SINGLE_CHAT_LIST,
	KEFU_LOGIN
} from '../mutation-type.js'

import { apiKefu } from '@/config'

const state = {
	kefuChatListData:[],
	kefuLoginData:[],  
	
}

const mutations = {
	// 进入聊天页面
	[KEFU_LOGIN](state, o) {
	    state.kefuLoginData = o.data
	},
	
	// 聊天历史记录
    [KEFU_SINGLE_CHAT_LIST](state, o) {
        state.kefuChatListData = o.data
    },
}

const actions = {		
	// 进入聊天页面
	setKefuLogin({ commit }, o) {
	    apiKefu.getKefuLogin(o).then(res => {			
	        commit(KEFU_LOGIN, res)
	    })
	},
    // 聊天历史记录
    setKefuSingleChatList({ commit }, o) {
        apiKefu.getKefuSingleChatList(o).then(res => {			
            commit(KEFU_SINGLE_CHAT_LIST, res)
        })
    },
	// 发送消息
	setTransMessage({ commit }, o){
		return apiKefu.getTransMessage(o)
	},
	// 发送图片
	setSendImage({ commit }, o){
		return apiKefu.getSendImage(o)
	},
}

export default{
	state,
	mutations,
	actions
}