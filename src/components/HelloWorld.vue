<template>
  <v-container fluid>
    <v-slide-y-transition mode="out-in">
      <v-layout column align-center>
        <img v-if="!lyric.picUrl" src="@/assets/logo.png" alt="Vuetify.js" class="mb-5">
        <img v-else :src="lyric.picUrl" :alt="lyric.name" class="mb-5">
        <blockquote>
          &#8220;Make me cum.&#8221;
          <div v-show="lyric.id">
            <p>{{lyric.jpLyric}}</p>
            <p>{{lyric.cnLyric}}</p>
            <p>{{lyric.at}} @ {{lyric.name}} - {{lyric.album}}</p>
            <v-btn color="accent" :href="encoreSite">GO!</v-btn>
          </div>

          <footer>
            <small>
              <em>&mdash;Van Darkholme</em>
              <router-link to="/diagnosis">That's good!</router-link>
            </small>
            <v-btn color="primary" @click="getLrc">
              <v-icon>refresh</v-icon>
            </v-btn>
          </footer>
        </blockquote>
      </v-layout>
    </v-slide-y-transition>
  </v-container>
</template>

<script>
import axios from '../utils/axios'
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  data() {
    return {
      lyric: {
        cnLyric: '',
        jpLyric: '',
        at: '',
        name: '',
        album: '',
        type: '',
        picUrl: '',
        id: 0
      }
    }
  },
  computed: {
    encoreSite () {
      return `https://encore.roselia.moe/#${this.lyric.type}/${this.lyric.id}${['st', 'nd', 'rd'][this.lyric.id - 1] || 'th'}`
    }
  },
  methods: {
    getLrc() {
      axios.get('https://roselia.moe/blog/api/roselia/lyric/random').then(data => {
        this.lyric = data
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
