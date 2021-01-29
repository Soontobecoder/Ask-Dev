import axios from 'axios'

// const instance = axios.create({
//   baseURL: 'https://ask-dev-server.herokuapp.com'
// })

const instance = axios.create({
  baseURL: 'http://localhost:3005'
})

export default instance
