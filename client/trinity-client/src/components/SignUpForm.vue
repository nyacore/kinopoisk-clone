<template>
  <v-layout wrap align-space-around justify-center fill-height row>
    <v-flex xs6>
      <v-alert
        transition="slide-x-transition"
        :value="errorMessage.length > 0"
        type="error"
      >{{ errorMessage }}</v-alert>
      <v-form ref="form" @submit.prevent="validate" v-model="valid" lazy-validation>
        <v-text-field v-model="login" :counter="32" :rules="notEmptyRules" label="Имя пользователя" required></v-text-field>
        <v-text-field
          type="password"
          v-model="password"
          :counter="32"
          :rules="notEmptyRules"
          label="Пароль"
          required
        ></v-text-field>

        <v-btn :disabled="!valid" flat color="indigo" type="submit">Зарегистрироваться</v-btn>
      </v-form>
    </v-flex>
  </v-layout>
</template>

<script>
// import { log } from 'util'
export default {
  data () {
    return {
      errorMessage: '',
      valid: true,
      login: '',
      password: '',
      notEmptyRules: [value => !!value || 'Поле не может быть пустым']
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
      fetch('http://localhost:3001/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          login: this.login,
          password: this.password
        })
      })
        .then(r => r.json())
        .then(result => {
          window.localStorage.setItem('token', result.token)
          this.$router.push({ name: 'Main' })
        })
        .catch() // Do nothing
    }
  }
}
</script>

<style>
</style>
