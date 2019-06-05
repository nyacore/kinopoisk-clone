<template>
  <v-app id="inspire">
    <v-navigation-drawer
      v-model="drawer"
      fixed
      app
    >
      <v-list dense>
        <v-list-tile to="/" exact>
          <v-list-tile-action>
            <v-icon>home</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Главная</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile :to="{ name: 'AddFilm' }" v-if="user.role == 'Admin'">
          <v-list-tile-action>
            <v-icon>plus_one</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Добавить фильм</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar color="indigo lighten-2" dark fixed app>
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title>Kinosearch</v-toolbar-title>
      <v-spacer></v-spacer>
      <div v-if="!isTokenPresent" class="auth-buttons">
        <v-btn exact :to="{ name: 'Auth' }" color="indigo"><v-icon>face</v-icon> Войти</v-btn>
        <v-btn exact :to="{ name: 'SignUp' }" color="indigo"><v-icon>group_add</v-icon>Зарегистрироваться</v-btn>
      </div>
      <div v-if="isTokenPresent" class="logout-button">
        <span class="title">Вы вошли как {{ user.login }} </span>
        <v-btn color="indigo" :to="{ name: 'User', params: { id: user._id }}"><v-icon>mood</v-icon>Мой профиль</v-btn>
        <v-btn @click=logOut color="indigo"><v-icon>close</v-icon>Выйти</v-btn>
      </div>
    </v-toolbar>
    <v-content>
      <v-container>
        <router-view/>
      </v-container>
    </v-content>
    <v-footer color="indigo lighten-2" app>
      <span class="white--text">Maxim Gasai &copy; 2019</span>
    </v-footer>
  </v-app>
</template>

<script>
import { getUser } from './api'

export default {
  name: 'App',
  async beforeRouteUpdate (to, from, next) {
    console.log('123')
    this.updateToken()
    if (this.token) {
      this.user = await getUser(this.token)
    }
  },
  data () {
    return {
      drawer: false,
      isTokenPresent: false,
      token: '',
      user: {}
    }
  },
  watch: {
    $route: 'updateToken',
    isTokenPresent: async () => {
      this.user = await getUser(this.token)
    }
  },
  async mounted () {
    this.updateToken()
    if (this.isTokenPresent) {
      this.user = await getUser(this.token)
    }
  },
  methods: {
    updateToken () {
      if (window.localStorage.getItem('token')) {
        this.token = window.localStorage.getItem('token')
        this.isTokenPresent = true
      } else {
        this.token = ''
        this.isTokenPresent = false
      }
    },
    logOut () {
      window.localStorage.removeItem('token')
      this.updateToken()
      this.$router.go(this.$router.currentRoute)
    }
  }
}
</script>
