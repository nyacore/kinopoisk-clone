<template>
  <div>
     <v-layout>
      <h3 class="display-2">В нашей базе</h3>
    </v-layout>
    <v-layout wrap flex-child class="mb-4">
      <v-flex xs6 sm3>
        <v-card color="red lighten-3" class="ma-1">
          <v-card-title class="white--text">
            <div>
              <h3 class="headline mb-0"><v-icon size="30">ondemand_video</v-icon> Фильмов: <span id="films-counter"> {{ filmsCount }}</span></h3>
            </div>
          </v-card-title>
        </v-card>
      </v-flex>
      <v-flex xs6 sm3>
        <v-card color="blue lighten-3" class="ma-1">
          <v-card-title class="white--text">
            <div>
              <h3 class="headline mb-0"><v-icon size="30">personal_video</v-icon> Сериалов: <span id="tvseries-counter">0</span></h3>
            </div>
          </v-card-title>
        </v-card>
      </v-flex>
      <v-flex xxs6 sm3>
        <v-card color="green lighten-3" class="ma-1">
          <v-card-title class="white--text">
            <div>
              <h3 class="headline mb-0"><v-icon size="30">group</v-icon> Пользователей: <span id="users-counter">{{ usersCount }}</span></h3>
            </div>
          </v-card-title>
        </v-card>
      </v-flex>
      <v-flex xs6 sm3>
        <v-card color="orange lighten-3" class="ma-1">
          <v-card-title class="white--text">
            <div>
              <h3 class="headline mb-0"><v-icon size="30">message</v-icon> Рецензий: <span id="users-counter">{{ reviewsCount }}</span></h3>
            </div>
          </v-card-title>
        </v-card>
      </v-flex>
    </v-layout>

    <v-layout>
      <h3 class="display-2">Фильмы</h3>
      <v-spacer></v-spacer>
      <v-btn color="indigo" class="white--text ">Посмотреть все</v-btn>
    </v-layout>
    <v-layout>
      <v-flex class="mb-5" xs12 sm12 lg6 xl4 v-for="i in 3" shrink :key="i">
      <v-card v-if="films[i - 1]" class="ma-2">
        <v-img
          :src="films[i-1].poster"
          aspect-ratio="2.75"
        ></v-img>

        <v-card-title class="pa-4">
            <div class="title mb-2">{{ films[i-1].title }}</div>
        </v-card-title>
        <v-divider />
        <div class="pa-4">
          <div class="body-2 mb-1">Режиссёр: {{ films[i - 1].director }}</div>
          <div class="body-2 mb-1">Дата выхода: {{ films[i - 1].release_date.split('-')[0] }}</div>
          <div class="body-2 mb-1 text-truncate">Жанр: {{ films[i - 1].genre }}</div>
          <div class="body-2 mb-1 text-truncate">Описание: {{ films[i - 1].description }}</div>
        </div>
        <v-divider />
        <div class="pa-4">
          <p class="body-2">Оценка:</p>
          <v-rating
            :half-increments=true
            :readonly=true
            v-model="films[i-1].rating">
          </v-rating>
        </div>
        <v-divider />
        <v-card-actions>
          <v-btn color="indigo" :to="{ name: 'Film', params: { id: films[i-1]._id } }"  class="white--text"><v-icon color="white">more_vert</v-icon>Подробнее</v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
    </v-layout>

    <v-layout>
    <h3 class="display-2">Сериалы</h3>
    <v-spacer />
    <v-btn color="indigo" class="white--text ">Посмотреть все</v-btn>
    </v-layout>

    <v-layout>
      <v-flex class="mb-5" xs12 sm4 v-for="i in 3" shrink :key="i">
      <v-card v-if="tvseries[i - 1]" class="ma-2">
        <v-img
          :src="tvseries[i-1].poster"
          aspect-ratio="2.75"
        ></v-img>

        <v-card-title>
            <div class="title mb-2">{{ tvseries[i-1].title }}</div>
        </v-card-title>
        <v-divider />
        <div class="pa-4">
          <div class="body-2 mb-1">Режиссёр: {{ tvseries[i - 1].director }}</div>
          <div class="body-2 mb-1">Дата выхода: {{ tvseries[i - 1].release_date.split('-')[0] }}</div>
          <div class="body-2 mb-1 text-truncate">Описание: {{ tvseries[i - 1].description }}</div>
        </div>
        <v-divider />
        <div class="pa-4">
          <v-rating
            :half-increments=true
            :readonly=true
            v-model="tvseries[i-1].rating">
          </v-rating>
        </div>
        <v-divider />
        <v-card-actions>
          <v-btn color="indigo" class="white--text"><v-icon color="white">more_vert</v-icon>Подробнее</v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
    </v-layout>
  </div>
</template>

<script>
import { getFilms, getReviewsCount, getFilmsCount, getUsersCount, likeFilm } from '../api'
// import { FilmPreview } from './FilmPreview'

export default {
  beforeRouteUpdate (to, from, next) {
    console.log('234')
    this.updateToken()
  },
  name: 'Main',
  data () {
    return {
      reviewsCount: 0,
      filmsCount: 0,
      usersCount: 0,
      films: [],
      tvseries: [],
      isUserTokenPresent: false,
      token: ''
    }
  },
  async mounted () {
    this.updateToken()
    this.reviewsCount = await getReviewsCount()
    this.filmsCount = await getFilmsCount()
    this.usersCount = await getUsersCount()
    const allFilms = await getFilms()
    this.films = allFilms.filter((f) => {
      return f.type === 'Movie'
    })
    this.tvseries = allFilms.filter((t) => {
      return t.type === 'TV-Series'
    })
  },
  watch: {
    $route: 'updateToken'
  },
  methods: {
    updateToken () {
      if (window.localStorage.getItem('token')) {
        this.token = window.localStorage.getItem('token')
        this.isUserTokenPresent = true
      } else {
        this.token = ''
        this.isUserTokenPresent = false
      }
    },
    async like (filmId, token) {
      await likeFilm(filmId, token)
      this.$router.go(this.$router.currentRoute)
    }
  }
}
</script>
