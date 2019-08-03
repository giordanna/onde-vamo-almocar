import firebase from 'firebase/app'
import { firebaseConfig, credentials } from '../env/environment.json'
import 'firebase/firestore'
import 'firebase/auth'
export const strict = false

firebase.initializeApp(firebaseConfig)

firebase
  .auth()
  .signInWithEmailAndPassword(credentials.email, credentials.password)
  .catch((error) => {
    console.error(error.message)
  })

const db = firebase.firestore()

export const state = () => ({
  places: [],
  error: null
})

export const mutations = {
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
      })
      .catch((error) => {
        console.error(error)
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
