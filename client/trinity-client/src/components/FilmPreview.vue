<template>
  <v-card v-if="film" class="ma-2">
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
            :half-increments="true" 
            readonly=true
            v-model="film.rating">
          </v-rating>
        </div>
        <v-divider />
        <v-card-actions>
          <v-btn color="indigo" class="white--text"><v-icon color="white">favorite</v-icon>Добавить в понравившиеся</v-btn>
          <v-btn color="indigo" :to="{ name: 'Film', params: { id: film._id } }"  class="white--text"><v-icon color="white">more_vert</v-icon>Подробнее</v-btn>
        </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: 'FilmPreview',
  props: [
    'film',
    'user'
  ],
  data() {
    return {

    }
  },
  methods: {

  },
  async mounted() {

  }
}
</script>

<style>

</style>
