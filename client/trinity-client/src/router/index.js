import Vue from 'vue'
import Router from 'vue-router'

import Main from '@/components/Main'
import Film from '@/components/Film'
import AuthForm from '@/components/AuthForm'
import SignUpForm from '@/components/SignUpForm'
import User from '@/components/User'
import AddFilmForm from '@/components/AddFilmForm'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Main',
      component: Main
    },
    {
      path: '/films/:id',
      name: 'Film',
      component: Film
    },
    {
      path: '/auth',
      name: 'Auth',
      component: AuthForm
    },
    {
      path: '/signup',
      name: 'SignUp',
      component: SignUpForm
    },
    {
      path: '/users/:id',
      name: 'User',
      component: User
    },
    {
      path: '/admin/add_film',
      name: 'AddFilm',
      component: AddFilmForm
    }
  ]
})
