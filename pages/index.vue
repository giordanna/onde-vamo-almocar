<template>
  <div class="container">
    <div class="modal" :class="{ 'is-active': loginActive }">
      <div class="modal-background"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">Login</p>
          <button
            aria-label="close"
            class="delete"
            @click="loginActive = false"
          ></button>
        </header>
        <section class="modal-card-body">
          <div class="field">
            <div class="control">
              <input
                v-model="user.email"
                class="input"
                type="text"
                placeholder="Email"
              />
            </div>
          </div>
          <div class="field">
            <div class="control">
              <input
                v-model="user.password"
                class="input"
                type="password"
                placeholder="Senha"
              />
            </div>
          </div>
        </section>
        <footer class="modal-card-foot">
          <button
            class="button is-success"
            type="submit"
            @click.prevent="tryLogin"
          >
            Save changes
          </button>
          <button class="button" @click="loginActive = false">Cancel</button>
        </footer>
      </div>
    </div>
    <div>
      <div class="floating">
        <NLink to="/view" class="button--green">
          Visualizar dados
        </NLink>
        <div v-if="logged" class="button--green" @click="tryLogout">
          Logout
        </div>
        <div v-if="!logged" class="button--green" @click="loginActive = true">
          Login
        </div>
      </div>
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
        <div class="button--grey" @click="findLunchPlace">
          Eai, onde?
        </div>
      </div>
      <div v-if="hasChosenYet && !noMorePlaces && !hasDecided">
        <p>
          Partiu
          <strong>{{ choosenPlace }}</strong>
          hoje?
        </p>
        <div class="links">
          <div class="button--green" @click="acceptPlace">Boaa</div>
          <div class="button--red" @click="rejectPlace">Ah não véi</div>
        </div>
      </div>
      <div v-if="noMorePlaces">
        <p>Cabô os lugar pra escolher :/ Ce é chato demais pqp</p>
        <div class="links">
          <div class="button--red" @click="refresh">
            Dá refresh aí então man kkkk
          </div>
        </div>
      </div>
      <div v-if="hasDecided">
        <p>
          Partiu
          <strong>{{ choosenPlace }}</strong>
          então!!
        </p>
        <div class="links">
          <div class="button--red" @click="refresh">
            ...refresh?
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
      user: {
        email: '',
        password: ''
      },
      loginActive: false,
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
      ]
    }
  },
  computed: {
    ...mapState(['places', 'logged', 'error']),
    weekday() {
      return this.dayNames[this.weekdayNumber]
    },
    choosenPlace() {
      return this.places[this.choosenLunchIndex].name
    }
  },
  mounted() {
    this.$store.commit('getPlaces')
    this.$store.commit('checkUser')
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
      this.$store.commit('acceptPlace', {
        choosenLunchIndex: this.choosenLunchIndex,
        weekdayNumber: this.weekdayNumber
      })
      if (this.logged) {
        this.$store.commit('savePlaces')
      }
      this.hasDecided = true
    },
    rejectPlace() {
      this.$store.commit('rejectPlace', {
        choosenLunchIndex: this.choosenLunchIndex,
        weekdayNumber: this.weekdayNumber
      })
      if (this.logged) {
        this.$store.commit('savePlaces')
      }
      this.findLunchPlace()
    },
    refresh() {
      this.hasDecided = false
      this.hasChosenYet = false
      this.choosenLunchIndex = -1
      this.noMorePlaces = false
      this.$store.commit('reset')
    },
    tryLogin() {
      this.$store.commit('login', this.user)
      this.loginActive = false
    },
    tryLogout() {
      this.$store.commit('logout')
    }
  }
}
</script>

<style scoped>
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
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
  padding: 0 0.5em;
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
  padding-top: 15px;
}

.floating {
  position: fixed;
  top: 1em;
  right: 1em;
}
</style>
