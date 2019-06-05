export const getFilms = async () => {
  const films = await fetch('http://localhost:3001/api/films')
  const filmsJson = await films.json()
  return filmsJson
}

export const getFilm = async (filmId) => {
  const film = await fetch(`http://localhost:3001/api/films/${filmId}`)
  const filmJson = await film.json()
  return filmJson
}

export const getFilmsCount = async () => {
  const count = await fetch('http://localhost:3001/api/films_count')
  const countJson = await count.json()
  return countJson.count
}

export const getReviewsCount = async () => {
  const count = await fetch('http://localhost:3001/api/reviews_count')
  const countJson = await count.json()
  return countJson.count
}

export const getUsersCount = async () => {
  const count = await fetch('http://localhost:3001/api/users_count')
  const countJson = await count.json()
  return countJson.count
}

export const getUser = async (token) => {
  const user = await fetch(`http://localhost:3001/api/users/${token}`)
  const userJson = await user.json()
  return userJson
}

export const getUserById = async (id) => {
  const user = await fetch(`http://localhost:3001/api/users/id/${id}`)
  const userJson = await user.json()
  return userJson
}

export const rateFilm = async (token, filmId, rating) => {
  const response = await fetch(`http://localhost:3001/api/films/${filmId}/rate`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      mark: rating
    })
  })
  const responseJson = response.json()
  return responseJson
}

export const likeFilm = async (filmId, token) => {
  const response = await fetch(`http://localhost:3001/api/films/${filmId}/like`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      test: 'test'
    })
  })
  const responseJson = await response.json()
  return responseJson
}

export const getReviews = async (filmId) => {
  const response = await fetch(`http://localhost:3001/api/reviews/${filmId}`)
  const responseJson = await response.json()
  return responseJson
}
