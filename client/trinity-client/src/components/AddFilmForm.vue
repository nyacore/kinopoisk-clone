<template>
  <v-layout wrap align-space-around justify-center fill-height row>
    <v-flex xs6>
      <div class="display-1">Добавление нового фильма</div>
      <v-form ref="form" @submit.prevent="validate" v-model="valid" lazy-validation>
        <v-text-field v-model="title" :counter="32" :rules="notEmptyRules" label="Название фильма" required></v-text-field>
        <v-textarea
            :rules="notEmptyRules"
            outline
            name="description"
            label="Описание"
            v-model="description"
            hint="Описание фильма"
          ></v-textarea>
        <v-text-field v-model="director" :counter="32" :rules="notEmptyRules" label="Режиссер" required></v-text-field>
        <v-text-field v-model="poster_url" :counter="128" :rules="notEmptyRules" label="Ссылка на изображение" required></v-text-field>
        <v-date-picker v-model="release_date" :landscape=true :reactive=false></v-date-picker>
        <v-text-field v-model="genre" :counter="128" :rules="notEmptyRules" label="Жанр(ы)" required></v-text-field>

        <v-btn :disabled="!valid" flat color="indigo" type="submit">Добавить</v-btn>
      </v-form>
    </v-flex>
  </v-layout>
</template>

<script>
// import { log } from "util";
export default {
  data () {
    return {
      valid: true,
      title: '',
      description: '',
      director: '',
      notEmptyRules: [value => !!value || 'Поле не может быть пустым'],
      release_date: new Date().toISOString().substr(0, 10),
      genre: '',
      poster_url: ''
    }
  },
  methods: {
    validate () {
      if (this.$refs.form.validate()) {
        this.snackbar = true
        this.submitForm()
      }
    },
    submitForm () {
      fetch('http://localhost:3001/api/films', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + window.localStorage.getItem('token')
        },
        body: JSON.stringify({
          title: this.title,
          description: this.description,
          director: this.director,
          poster: this.poster_url,
          genre: this.genre,
          release_date: this.release_date
        })
      })
        .then(r => r.json())
        .then(result => {
          console.log(result)
          // this.$router.push({ name: 'Main' })
        })
        .catch() // Do nothing
    }
  }
}
</script>

<style>
</style>
