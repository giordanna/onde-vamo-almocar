<template>
  <div class="container">
    <div>
      <h1 class="title">Onde vamo almoçar?</h1>
      <h2 class="subtitle">App pra decidir isso por nós, porque né</h2>
      <p>
        Hoje é
        <strong>{{ weekday }}</strong>
      </p>
      <p v-if="!hasChosenYet && !noMorePlaces && !hasDecided">
        To varado de fome :/
      </p>
      <div v-if="!hasChosenYet && !noMorePlaces && !hasDecided" class="links">
        <button class="button--grey" @click="findLunchPlace">
          Eai, onde?
        </button>
      </div>
      <div v-if="hasChosenYet && !noMorePlaces && !hasDecided">
        <p>
          Partiu
          <strong>{{ choosenPlace }}</strong>
          hoje?
        </p>
        <div class="links">
          <button class="button--green" @click="acceptPlace">Boaa</button>
          <button class="button--red" @click="rejectPlace">Ah não véi</button>
        </div>
      </div>
      <div v-if="noMorePlaces">
        <p>Cabô os lugar pra escolher :/ Ce é chato demais pqp</p>
        <div class="links">
          <button class="button--red" @click="refresh">
            Dá refresh aí então man kkkk
          </button>
        </div>
      </div>
      <div v-if="hasDecided">
        <p>
          Partiu
          <strong>{{ choosenPlace }}</strong>
          então!!
        </p>
        <div class="links">
          <button class="button--red" @click="refresh">
            ...refresh?
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      weekdayNumber: new Date().getDay(),
      hasChosenYet: false,
      hasDecided: false,
      choosenLunchIndex: -1,
      noMorePlaces: false,
      dayNames: [
        'domingo',
        'segunda-feira',
        'terça-feira',
        'quarta-feira',
        'quinta-feira',
        'sexta-feira',
        'sábado'
      ],
      places: [
        {
          name: 'Vermelhinho',
          weights: [5, 5, 5, 5, 5, 5, 5],
          rejected: false
        },
        {
          name: 'Brazuca',
          weights: [5, 5, 5, 5, 5, 5, 5],
          rejected: false
        },
        {
          name: 'Vila Butantan',
          weights: [5, 5, 5, 5, 5, 5, 5],
          rejected: false
        },
        {
          name: 'Rei das batidas',
          weights: [5, 5, 5, 5, 5, 5, 5],
          rejected: false
        },
        {
          name: 'Savana',
          weights: [5, 5, 5, 5, 5, 5, 5],
          rejected: false
        },
        {
          name: 'Panificadora Estrela',
          weights: [5, 5, 5, 5, 5, 5, 5],
          rejected: false
        }
      ]
    }
  },
  computed: {
    weekday() {
      return this.dayNames[this.weekdayNumber]
    },
    choosenPlace() {
      return this.places[this.choosenLunchIndex].name
    }
  },
  methods: {
    findLunchPlace() {
      this.hasChosenYet = false
      this.choosenLunchIndex = -1

      let totalWeight = 0
      let randomWeight = 0

      this.places.map((place) => {
        if (!place.rejected) {
          totalWeight += place.weights[this.weekdayNumber]
        }
      })

      randomWeight = 1 + Math.random() * (totalWeight - 1)

      for (let i = 0; i < this.places.length; i++) {
        if (!this.places[i].rejected) {
          randomWeight -= this.places[i].weights[this.weekdayNumber]
          if (randomWeight <= 0) {
            this.choosenLunchIndex = i
            break
          }
        }
      }

      if (this.choosenLunchIndex === -1) {
        this.noMorePlaces = true
        return
      }

      this.hasChosenYet = true
    },
    acceptPlace() {
      this.places[this.choosenLunchIndex].weights[this.weekdayNumber] += 1
      if (
        this.places[this.choosenLunchIndex].weights[this.weekdayNumber] > 10
      ) {
        this.places[this.choosenLunchIndex].weights[this.weekdayNumber] = 10
      }
      this.hasDecided = true
    },
    rejectPlace() {
      this.places[this.choosenLunchIndex].rejected = true
      this.places[this.choosenLunchIndex].weights[this.weekdayNumber] -= 1
      if (this.places[this.choosenLunchIndex].weights[this.weekdayNumber] < 1) {
        this.places[this.choosenLunchIndex].weights[this.weekdayNumber] = 1
      }
      this.findLunchPlace()
    },
    refresh() {
      this.hasDecided = false
      this.hasChosenYet = false
      this.choosenLunchIndex = -1
      this.noMorePlaces = false
      this.places.map((place) => {
        place.weights = [5, 5, 5, 5, 5, 5, 5]
        place.rejected = false
      })
    }
  }
}
</script>

<style>
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.title {
  font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 9vw;
  color: #35495e;
  padding: 0 0.5em;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 5vw;
  color: #526488;
  word-spacing: 5px;
  padding: 0 0.5em;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}
</style>
