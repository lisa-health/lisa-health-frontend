<template>
  <v-container fluid>
    <!-- 阿达 -->
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
            <div>
              <v-btn color="primary" round to="/diagnosis">
                <div class="iconfont">&#xe617;</div>
              </v-btn>
              <v-btn color="primary" round to="/aids">
                <div class="iconfont">&#xe62d;</div>
              </v-btn>
              <v-btn color="primary" round to="/symlab">
                <div class="iconfont">&#xe626;</div>
              </v-btn>
              <v-btn color="primary" round to="/hospital-search">
                <div class="iconfont">&#xe619;</div>
              </v-btn>
            </div>
            <div v-if="bookmarks.length">
              <h1>我的收藏</h1>
              <v-btn color="info" v-for="bm in bookmarks" :key="bm.name" @click="showDetails(bm)">
                {{bm.name}}
              </v-btn>
            </div>
            <!-- <v-btn color="primary" @click="getLrc">
              <v-icon>refresh</v-icon>
            </v-btn> -->
          </footer>
        </blockquote>
      </v-layout>
    </v-slide-y-transition>
  </v-container>
</template>

<script>
import axios from '../utils/axios'
import {BookmarkManager} from '../utils/bookmark'
const bookmark = new BookmarkManager('diseaseBookmark')
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
      },
      bookmarks: []
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
    },
    showDetails(detail) {
      this.$router.push({
        name: 'symdetail',
        params: {
            sdetail: [detail],
        }
      })
    }
  },
  created() {
    this.bookmarks = bookmark.items()
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
