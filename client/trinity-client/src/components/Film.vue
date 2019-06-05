<template>
  <div>
    <v-layout wrap class="mb-5" justify-start>
      <v-flex lg5 xs12 sm12>
          <v-img
            :src="film.poster"
            aspect-ratio="1"
            max-height="700"
            min-width="400"
            contain>
          </v-img>
      </v-flex>
      <v-flex lg6 xs12 sm12>
        <div>
          <div class="mb-2 display-3 font-weight-bold">{{ film.title }}</div>
          <div class="mb-2 display-1">Режиссёр: {{ film.director }}</div>
          <div class="mb-2 display-1">Жанр: {{ film.genre }}</div>
          <div class="mb-2 display-1">Дата выхода: {{ film.release_date.split('-')[0] }}</div>
          <div>
            <p class="mb-2 display-1">Оценка:
            <v-rating
              style="display: inline"
              :hover=true
              :half-increments="true"
              :readonly="!isRatable"
              v-model="film.rating">
            </v-rating>
            {{ film.rating }}
            </p>
            <p v-if="token != ''" class="title">
               <v-btn v-if="isRatable" class="white--text" @click="rate" color="indigo"><v-icon>star</v-icon>Оценить</v-btn>
               <v-alert class="mt-2 mb-2" type="info" :value="!isRatable">Вы уже оценивали этот фильм</v-alert>
               <v-btn v-if="isLikeable" class="white--text" @click="like" color="indigo"><v-icon>favorite</v-icon>  Добавить в понравившиеся</v-btn>
               <v-alert class="mt-2 mb-2" type="info" :value="!isLikeable">Фильм находится в вашем списке понравившихся</v-alert>
            </p>
          </div>
          <div class="display-1">Описание: {{ film.description }}</div>
        </div>
      </v-flex>
    </v-layout>
    <v-layout row wrap justify-start>
      <div class="display-2 text-weight-bold">Рецензии</div>
      <!-- <v-layout wrap align-space-around justify-center fill-height row> -->
        <v-flex xs12>
          <v-form v-if="token != ''" ref="form" @submit.prevent="validate" v-model="valid" lazy-validation>
              <v-label for="add-review">Добавить новую рецензию</v-label>
              <v-textarea
                :rules="notEmptyRules"
                outline
                name="add-review"
                label="Новая рецензия"
                v-model="text"
                hint="Текст рецензии"
              ></v-textarea>
            <v-btn :disabled="!valid" class="white--text" color="indigo" type="submit">Отправить</v-btn>
          </v-form>
        </v-flex>
      </v-layout>
       <div class="reviews-holder" v-for="review in reviews" :key="review._id">
        <v-alert class="headline" type="info" :value=true>Автор: {{ user.login }}</v-alert>
        <div class="headline">{{ review.text }}</div>
      </div>
  </div>
</template>

<script>
import { getFilm, rateFilm, getUser, likeFilm, getReviews } from '../api'

export default {
  data () {
    return {
      // Initializing empty object to not face any
      // error on page load
      film: {
        release_date: ''
      },
      token: '',
      user: {},
      reviews: [],
      isRatable: false,
      isLikeable: false,
      text: '',
      valid: false,
      notEmptyRules: [value => !!value || 'Поле не может быть пустым']
    }
  },
  async mounted () {
    this.film = await getFilm(this.$route.params.id)
    this.reviews = await getReviews(this.film._id)
    if (window.localStorage.getItem('token')) {
      this.token = window.localStorage.getItem('token')
    }
    if (this.token) {
      this.user = await getUser(this.token)
      this.isFilmRatable()
      this.isFilmLikeable()
    } else {
      this.isRatable = false
      this.isLikeable = false
    }
  },
  methods: {
    async rate () {
      if (this.token !== '') {
        await rateFilm(this.token, this.film._id, this.film.rating)
        this.isFilmRatable()
        this.$router.go(this.$router.currentRoute)
      }
    },
    isFilmRatable () {
      if (this.user.rated_films.find(({ _id }) => {
        return _id === this.film._id
      })) {
        this.isRatable = false
      } else {
        this.isRatable = true
      }
    },
    isFilmLikeable () {
      if (this.user.liked_films.find(({_id}) => {
        return _id === this.film._id
      })) {
        this.isLikeable = false
      } else {
        this.isLikeable = true
      }
    },
    async like () {
      await likeFilm(this.film._id, this.token)
      this.isFilmLikeable()
      this.$router.go(this.$router.currentRoute)
    },
    validate () {
      if (this.$refs.form.validate()) {
        this.snackbar = true
        this.submitForm()
      }
    },
    submitForm () {
      fetch(`http://localhost:3001/api/films/${this.film._id}/review`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.token}`
        },
        body: JSON.stringify({
          text: this.text
        })
      })
        .then(r => r.json())
        .then(result => {
          this.$router.go(this.$router.currentRoute)
        })
        .catch() // Do nothing
    }
  }
}
</script>

<style>

</style>
