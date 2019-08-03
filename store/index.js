import firebase from 'firebase/app'
import { firebaseConfig } from '../env/environment.json'
import 'firebase/firestore'
import 'firebase/auth'
export const strict = false

firebase.initializeApp(firebaseConfig)

const db = firebase.firestore()

export const state = () => ({
  logged: false,
  places: [],
  error: null
})

export const mutations = {
  checkUser(state) {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        state.logged = true
      }
    })
  },
  login(state, { email, password }) {
    if (
      firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .catch((error) => {
          console.error(error.message)
          state.error = {
            type: 'login',
            message: 'Login incorreto'
          }
        })
    ) {
      state.logged = true
    } else {
      state.logged = false
      state.error = {
        type: 'connection',
        message: 'Sem conexão com a internet pra logar ):'
      }
    }
  },
  logout() {
    firebase
      .auth()
      .signOut()
      .then(() => {
        state.logged = false
      })
      .catch(() => {
        state.error = {
          type: 'connection',
          message: 'Sem conexão com a internet pra deslogar ):'
        }
      })
  },
  getPlaces(state) {
    const newPlaces = []
    db.collection('places')
      .get()
      .then((snapshot) => {
        snapshot.docs.map((doc) => {
          newPlaces.push({
            id: doc.id,
            ...doc.data(),
            rejected: false
          })
        })

        state.places = newPlaces.slice()
        localStorage.setItem('places', JSON.stringify(state.places))
      })
      .catch((error) => {
        console.error(error)
        if (
          localStorage.setItem('places') !== null &&
          localStorage.setItem('places') !== undefined
        ) {
          state.places = JSON.parse(localStorage.setItem('places'))
        } else {
          state.error =
            'Sem conexão com a internet e sem nada salvo localmente ):'
        }
      })
  },
  savePlaces(state) {
    const batch = db.batch()

    state.places.map((place) => {
      let placeRef

      if (place.id !== null && place.id !== undefined && place.id !== '') {
        placeRef = db.collection('places').doc(place.id)
      } else {
        placeRef = db.collection('places').doc()
      }
      batch.set(placeRef, {
        name: place.name,
        weights: place.weights
      })
    })

    batch
      .commit()
      .then(() => {})
      .catch((error) => {
        state.error = error
      })
  },
  acceptPlace(state, { choosenLunchIndex, weekdayNumber }) {
    state.places[choosenLunchIndex].weights[weekdayNumber] += 1
    if (state.places[choosenLunchIndex].weights[weekdayNumber] > 10) {
      state.places[choosenLunchIndex].weights[weekdayNumber] = 10
    }
  },
  rejectPlace(state, { choosenLunchIndex, weekdayNumber }) {
    state.places[choosenLunchIndex].rejected = true
    state.places[choosenLunchIndex].weights[weekdayNumber] -= 1
    if (state.places[choosenLunchIndex].weights[weekdayNumber] < 1) {
      state.places[choosenLunchIndex].weights[weekdayNumber] = 1
    }
  },
  reset(state) {
    state.places.map((place) => {
      place.rejected = false
    })
  },
  hardReset() {
    state.places.map((place) => {
      place.weights = [5, 5, 5, 5, 5, 5, 5]
      place.rejected = false
    })
  }
}
