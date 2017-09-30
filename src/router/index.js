import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/components/index/index'
import Book from '@/components/book/book'

Vue.use(Router)

export default new Router({
  mode: 'history', // 去除#号
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Index
    },
    {
      path: '/book',
      name: 'Book',
      component: Book
    }
  ]
})
