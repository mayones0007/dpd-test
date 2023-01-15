<template>
  <div class="app">
    <div class="input-group mb-3 search">
      <input type="text" class="form-control" placeholder="Ваш запрос" v-model.trim="filter">
      <div class="input-group-append">
        <button class="btn btn-outline-success" @click="setFilter">Поиск</button>
        <button class="btn btn-outline-danger" @click="resetFilter">Сбросить</button>
      </div>
    </div>
    <table v-if="users" class="table table-striped">
      <thead>
        <tr>
          <th v-for="(field, index) in fields" :key="field" class="column__name">
            <div @click="sortFunc(index)">
              {{field}}
              <img class="icon__caret"
                :class="{'icon__caret--active': sorted === index, 'icon__caret--reverse': reverse}"
                src="icons/caret.svg"
              >
            </div>
          </th> 
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.id">
          <td v-for="field in Object.keys(user)" :key="field">
            <img v-if="field === 'avatar'" :src="user.avatar">
            <div v-else-if="field === 'dob'">{{timePrepare(user.dob)}}</div>
            <div v-else>{{user[field]}}</div>
          </td>
        </tr> 
      </tbody>
    </table>
    <div v-if="pagesCount" class="navigation">
      <nav>
        <ul class="pagination">
          <li class="page-item" :class="{'disabled': page < 2}">
            <a class="page-link" @click="changePage(-1)">&laquo;</a>
          </li>
          <li v-for="pageNum in pagesCount" :key="pageNum" class="page-item" :class="{'active': pageNum === page}">
            <a class="page-link" @click="setPage(pageNum)">{{pageNum}}</a>
          </li>
          <li class="page-item" :class="{'disabled': page  >= pagesCount}">
            <a class="page-link" @click="changePage(1)">&raquo;</a>
          </li>
        </ul>
      </nav>
      <div class="input-group mb-3 count-on-page">
        <label class="input-group-text" for="value">На странице</label>
        <select class="form-select" id="value" v-model="limit" @change="setFilter">
          <option v-for="value in 2" :key="value" :value="value * 10">{{value * 10}}</option>
        </select>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { useStore } from 'vuex'
import { router } from './router'
import moment from 'moment'
const store = useStore()

const page = ref(Number(router.currentRoute.value.query.page) || 1)
const limit = ref(Number(router.currentRoute.value.query.limit) || 20)
const filter = ref(router.currentRoute.value.query.filter || '')
const reverse = ref(router.currentRoute.value.query.reverse === 'true' ? true : false)
const sorted = ref(router.currentRoute.value.query.sorted || '')

const users = computed(() => {
  return store.state.users.results
})

const fields = computed(() => {
  return store.state.users.fields
})

const pagesCount = computed(() => {
  return Math.ceil(store.state.users.count / limit.value)
})

const setPage = (n) => {
  page.value = n
  getUsers()
}

const changePage = (n) => {
  page.value = page.value + n
  getUsers()
}

const resetFilter = () => {
  filter.value = ''
  getUsers()
}

const setFilter = () => {
  page.value = 1
  getUsers()
}

const timePrepare = (date) => {
  return moment(date).format('L')
}

const sortFunc = (column) => {
  if (column !== 'avatar') {
    if (sorted.value === column) {
      reverse.value = !reverse.value
    } else {
      sorted.value = column
      reverse.value = false
    }
  }
  page.value = 1
  getUsers()
}

const getUsers = () => {
  store.dispatch('getUsers', 
    {
      page: page.value, 
      limit: limit.value, 
      filter: filter.value,
      sorted: sorted.value,
      reverse: reverse.value,
    }
  )
}

onMounted(() => {
  getUsers()
})
</script>

<style scoped>
.app {
  padding: 20px;
}
.search {
  max-width: 500px;
}
.navigation {
  display: grid;
  grid-auto-flow: column;
  align-items: center;
  justify-content: space-between;
  user-select: none;
}
.icon__caret{
  visibility: hidden;
}
.icon__caret--active{
  visibility: visible;
}
.icon__caret--reverse{
  transform: rotate(180deg);
}
.column__name {
  cursor: pointer;
  user-select: none;
}
</style>
