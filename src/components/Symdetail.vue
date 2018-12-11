<template>
  <!-- 哒哒哒 -->
 <v-container  fill-height grid-list-md justify-space-between >
   <v-layout column  fill-height justify-space-round>
     <v-flex md10>
      <v-timeline dense align-top> <!-- 展示区 -->
        <v-timeline-item fill-dot color="purple">
          <v-flex md10 sm10 xs10>
            <div >
              <p class='display-3' id='tit001'>
                <p class="display-3 digest">{{ result[0].name }}</p>
                <v-chip color="symchip1" text-color="white" @click="backfirst">
                  {{result[0].firstDepartment}}</v-chip>
                  <router-link to="symlist">
                    <v-chip color="symchip2" text-color="white" @click="backsecond">
                      {{result[0].secondDepartment}}</v-chip>
                  </router-link>
                  <v-btn flat icon color="red" @click="flipBookmark">
                    <v-icon>favorite{{ isBookMarked ? "" : "_border"}}</v-icon>
                  </v-btn>

              </p>
              <v-spacer></v-spacer>
              <p class='display-1 digest' id='tit002'>病症简介</p>
              <v-card dark color="purple">
                <v-card-text class="ctext"> {{  result[0].introduction  }} </v-card-text>
              </v-card>
            </div>
          </v-flex>
          </v-timeline-item>

        <v-timeline-item fill-dot color="green">
          <v-flex md10 sm10 xs10>
            <div>
              <v-spacer></v-spacer>
              <p class='display-1 digest' id='tit003'>发病症状</p>
              <v-card dark color="green">
                <v-card-text><p :key="i" v-for="(i,j) in result[0].symptoms">{{j+1}}. {{  i  }}</p> </v-card-text>
              </v-card>
            </div>
          </v-flex>
        </v-timeline-item>

        <v-timeline-item fill-dot color="pink">
          <v-flex md10 sm10 xs10>
            <div>
              <v-spacer></v-spacer>
              <p class='display-1 digest' id="tit004">并发症</p>
              <v-card dark color="pink">
                <v-card-text class="ctext"> {{  result[0].complication }}</v-card-text>
              </v-card>
            </div>
          </v-flex>
        </v-timeline-item>

        <v-timeline-item fill-dot color="grey">
          <v-flex md10 sm10 xs10>
            <div>
              <v-spacer></v-spacer>
              <p class='display-1 digest' id="tit005">诱因</p>
              <v-card dark color="grey">
                <v-card-text class="ctext"> {{  result[0].cause }} </v-card-text>
              </v-card>
            </div>
          </v-flex>
        </v-timeline-item>

        <v-timeline-item fill-dot color="blue">
          <v-flex md10 sm10 xs10>
            <div>
              <v-spacer></v-spacer>
              <p class='display-1 digest' id='tit006'>治疗手段</p>
              <v-card dark color="blue">
                <v-card-text class="ctext"> {{  result[0].content }} </v-card-text>
              </v-card>
            </div>
          </v-flex>
        </v-timeline-item>

        <v-timeline-item fill-dot color="red" v-if="result[0].prevention">
          <v-flex md10  sm10 xs10>
            <div>
              <v-spacer></v-spacer>
              <p class='display-1 digest' id='tit007'>预防措施</p>
              <v-card dark color="red">
                <v-card-text class="ctext"> {{  result[0].prevention }} </v-card-text>
              </v-card>
            </div>
          </v-flex>
        </v-timeline-item>

        <v-timeline-item fill-dot color="warning" v-if="result[0].nursing">
          <v-flex md10 sm10 xs10>
            <div>
              <v-spacer></v-spacer>
              <p class='display-1 digest' id="tit008">护理方法</p>
              <v-card dark color="warning">
                <v-card-text class="ctext"> {{  result[0].nursing }} </v-card-text>
              </v-card>
            </div>
          </v-flex>
        </v-timeline-item>

        <v-timeline-item fill-dot color="secondary" v-if="result[0].inspect">
          <v-flex md10 sm10 xs10>
            <div>
              <v-spacer></v-spacer>
              <p class='display-1 digest' id='tit009'>诊断方法</p>
              <v-card dark color="secondary">
                <v-card-text class="ctext"> {{  result[0].inspect }} </v-card-text>
              </v-card>
            </div>
          </v-flex>

      </v-timeline-item>
      </v-timeline>
     </v-flex>
   </v-layout>

   <!-- 导航栏 -->
     <v-flex md2 fluid>
       <!-- <v-card class="d-inline-block elevation-12"
            flat>
         <v-navigation-drawer
         class="red lighten-2 hidden-sm-and-down"
         dark
         permanent
         floating
         stateless
         value="true"
         >
           <v-list dense>
             <v-list-tile
               v-for="item in items"
               :key="item.title"
               @click="$vuetify.goTo(item.position,options)"
             >
             <! - v-if="result[0].item.content" - >
               <v-list-tile-action>
                 <v-icon>{{ item.icon }}</v-icon>
               </v-list-tile-action>

               <v-list-tile-content>
                 <v-list-tile-title>{{ item.title }}</v-list-tile-title>
               </v-list-tile-content>
             </v-list-tile>
           </v-list>
         </v-navigation-drawer>
       </v-card> -->
       <digest-nav :items="digests" offset="500" threshold="500"></digest-nav>
     </v-flex>







</v-container>
</template>

<script>

    import axios from '../utils/axios'
    import {BookmarkManager} from '../utils/bookmark'
    const bookmark = new BookmarkManager('diseaseBookmark')
    import digestNav from './BlogDigestNav'

    export default {
        name: "Symdetail",
        components: {
          digestNav
        },

        data(){
          return{
            windows: 0,
            length: 9,
            blank:"  ",
            result: [] ,
            tSymptoms: '',
            items: [ //导航栏项目
              { title: '病症名称', icon: 'dashboard' ,position:'#tit001',content:'name'},
              { title: '简介', icon: 'question_answer',position:'#tit002',content:'introduction' },
              { title: '发病症状', icon: 'sms_failed',position:'#tit003',content:'symptoms' },
              { title: '并发症', icon: 'mood_bad',position:'#tit004',content:'complication' },
              { title: '诱因', icon: 'flash_on',position:'#tit005' ,content:'cause'},
              { title: '治疗手段', icon: 'person_add' ,position:'#tit006',content:'content'},
              { title: '预防措施', icon: 'verified_user' ,position:'#tit007',content:'prevention'},
              { title: '护理方法', icon: 'add_box' ,position:'#tit008',content:'nursin1'},
              { title: '诊断方法', icon: 'remove_red_eye' ,position:'#tit009',content:'inspect'},
        ],
        digests: [],
        isBookMarked: false,
        right: null
          }
        },

        created(){
            this.getRouterData();
        //     this.getData();
        },
        mounted() {
          this.isBookMarked = this.checkBookMarked()
          this.setDigest()
        },

        methods:{
          getRouterData(){
            if(this.$route.params.sdetail){
                this.result = this.$route.params.sdetail
                sessionStorage.setItem('sdetail',JSON.stringify(this.result))
                console.log(this.result)
            }
            else{
                this.result = JSON.parse(sessionStorage.getItem('sdetail'))
                console.log(this.result)
            }
          },
          flipBookmark() {
            const disease = this.result[0]
            const name = disease.name
            bookmark.hasKey(name) ? bookmark.deleteItem(name) : bookmark.setItem(name, disease)
            this.isBookMarked = this.checkBookMarked()
          },
          checkBookMarked () {
            if(!this.result) return false
            return bookmark.hasKey(this.result[0].name)
          },
          setDigest () {
            this.digests = Array.from(document.querySelectorAll('.digest')).map((e, idx) => {
              e.classList.add('scrollspy')
              e.classList.add('section')
              e.id = e.id || `section-${idx}`
              return {
                hash: e.id,
                title: e.innerText,
                element: e
              }
            })
          },
          backsecond(){
            this.$router.push({
                name: 'symlab',
                params: {
                    secondDep: this.result[0].secondDepartment
                }
            })
          },
          backfirst(){
            this.$router.push({
                name: 'symlab',
                params: {
                    firstDep: this.result[0].firstDepartment
                }
            })
          },
               // getData(){
               //   // this.length = Object.getOwnPropertyNames(this.result[0]).length
               //   this.complication = this.result[0].complication
               //   this.symptoms = this.result[0].symptoms
               //   this.introduction = this.result[0].introduction
               //   this.cause = this.result[0].cause
               //   this.prevention = this.result[0].prevention
               //   this.nursing = this.result[0].nursing
               //   this.inspect = this.result[0].inspect
               //   this.content = this.result[0].content
               //   this.tSymptoms = this.result[0].tSymptoms
               //   this.symptom = this.result[0].symptom
               // }
            },
            computed: {
              target () {
                const value = this[this.type]
                if (!isNaN(value)) return Number(value)
                else return value
              },
              options(){  //链接样式
                return{
                  duration:500,
                  offset:-70,
                  easing:'easeInOutCubic'
                }
              }
         }

    }
</script>

<style scoped>
.ctext{
  text-indent: 2em;
}
/* .vdrawer{
  position: absolute;
  z-index:-999;
} */
</style>
