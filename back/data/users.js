const api = require('./api.json')

const users = api.results.map(user => {
  return {
    avatar: user.picture.medium,
    fio: `${user.name.title} ${user.name.first} ${user.name.last}`,
    gender: user.gender,
    country: user.location.country,
    dob: user.dob.date,
    email: user.email,
    phone: user.phone
  }
})

const fields = {
  avatar: 'Аватар',
  fio: 'ФИО',
  gender: 'Пол',
  country: 'Страна',
  dob: 'День рождения',
  email: 'Адрес электронной почты',
  phone: 'Телефон'
}

module.exports = { users, fields }
