<template>
  <div class="container">
    <div>
      <div class="floating">
        <NLink to="/" class="button--green">
          Início
        </NLink>
      </div>
      <h1 class="title">Lugares para almoçar</h1>
      <div class="links">
        <div class="button--green" @click="changeWeekday">Mudar dia</div>
      </div>
      <div>
        <div class="columns">
          <div class="column">
            <p><strong>Nome do local</strong></p>
          </div>
          <div class="column">
            <p>
              <strong>Chance na {{ weekday }}</strong>
            </p>
          </div>
        </div>
        <div v-for="place in places" :key="place.name" class="columns">
          <div class="column">
            <p>{{ place.name }}</p>
          </div>
          <div class="column" style="position: relative">
            <div class="progress-wrapper">
              <progress
                class="progress is-primary is-large"
                :value="place.weights[weekdayNumber] * 10"
                max="100"
              >
                {{ place.weights[weekdayNumber] * 10 }} %
              </progress>
              <p class="progress-value has-text-white">
                {{ place.weights[weekdayNumber] * 10 }} %
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data() {
    return {
      weekdayNumber: new Date().getDay(),
      dayNames: [
        'domingo',
        'segunda-feira',
        'terça-feira',
        'quarta-feira',
        'quinta-feira',
        'sexta-feira',
        'sábado'
      ]
    }
  },
  computed: {
    ...mapState(['places', 'error']),
    weekday() {
      return this.dayNames[this.weekdayNumber]
    }
  },
  mounted() {
    this.$store.commit('getPlaces')
  },
  methods: {
    changeWeekday() {
      this.weekdayNumber += 1
      if (this.weekdayNumber >= this.dayNames.length) {
        this.weekdayNumber = 0
      }
    }
  }
}
</script>

<style>
.container {
  margin: 3em auto;
  max-width: 100%;
  width: 600px;
}

p {
  font-size: 15pt;
}

.title {
  font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 40pt;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 20pt;
  color: #526488;
  word-spacing: 5px;
  padding: 0 0.5em;
  padding-bottom: 15px;
}

.links {
  padding: 15px;
  text-align: center;
}

.floating {
  position: fixed;
  top: 1em;
  right: 1em;
}

.progress-wrapper {
  position: relative;
}

.progress-value {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  font-size: calc(1rem / 1.5);
  line-height: 1rem;
  font-weight: bold;
}

.progress.is-large + .progress-value {
  font-size: calc(1.5rem / 1.5);
  line-height: 1.5rem;
}
</style>
