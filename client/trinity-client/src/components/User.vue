<template>
  <v-layout row wrap>
    <v-flex sm12>
      <v-alert :value=true type="info" class="mb-2 display-1">Профиль пользователя <span class="font-weight-bold">{{ user.login }}</span></v-alert>
      <div class="mb-2 display-1">Понравившиеся фильмы</div>
      <v-flex class="mb-5" xs12 sm12 lg6 xl4 v-for="film in user.liked_films" :key="film._id">
        <v-card class="ma-2">
          <v-img
            :src="film.poster"
            aspect-ratio="2.75"
          ></v-img>

          <v-card-title class="pa-4">
              <div class="title mb-2">{{ film.title }}</div>
          </v-card-title>
          <v-divider />
          <div class="pa-4">
            <div class="body-2 mb-1">Режиссёр: {{ film.director }}</div>
            <div class="body-2 mb-1">Дата выхода: {{ film.release_date.split('-')[0] }}</div>
            <div class="body-2 mb-1 text-truncate">Жанр: {{ film.genre }}</div>
            <div class="body-2 mb-1 text-truncate">Описание: {{ film.description }}</div>
          </div>
          <v-divider />
          <div class="pa-4">
            <p class="body-2">Оценка:</p>
            <v-rating
              :half-increments=true
              :readonly=true
              v-model="film.rating">
            </v-rating>
          </div>
          <v-divider />
          <v-card-actions>
            <v-btn v-if="isUserTokenPresent" color="indigo" class="white--text"><v-icon color="white">favorite</v-icon>Добавить в понравившиеся</v-btn>
            <v-btn color="indigo" :to="{ name: 'Film', params: { id: film._id } }"  class="white--text"><v-icon color="white">more_vert</v-icon>Подробнее</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
      <div class="mb-2 display-1">Рецензии пользователя</div>
      <div class="reviews-holder" v-for="review in user.reviews" :key="review._id">
        <v-alert class="headline" type="info" :value=true>Автор: {{ user.login }}</v-alert>
        <div class="headline">{{ review.text }}</div>
      </div>
    </v-flex>
  </v-layout>
</template>

<script>
import { getUserById } from '../api'

export default {
  data () {
    return {
      user: {}
    }
  },
  async mounted () {
    this.user = await getUserById(this.$route.params.id)
  },
  methods: {

  }
}
</script>

<style>

</style>
