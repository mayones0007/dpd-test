import { createStore } from 'vuex'
import { axiosInstance } from './httpClient'
import { router } from './router'

export const store = createStore({
  state() {
    return {
      users: []
    }
  },
  actions: {
    async getUsers({ commit }, params) {
      try {
        const query = Object.keys(params).reduce((acc, key) => {
          return `${acc}${key}=${params[key]}&`
        },'')
        router.replace(`?${query}`)
        const response = await axiosInstance.get(`/`, { params })
        commit('setUsers', response.data)
      } catch (e) {
        console.log("Ошибка HTTP: " + e)
      }
    },
  },
  mutations: {
    setUsers(state, users) {
      state.users = users
    },
  }
})