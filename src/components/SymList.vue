<template>
    <div>
        <v-container fluid fill-height>
            <v-layout align-start justify-center>
                <v-flex xs12 sm6>
                     <v-btn :to="{name: 'symlab'}" small round color="primary">
                      <v-icon>arrow_back</v-icon>
                    </v-btn>
                    <v-text-field
                            label="What's up?"
                            v-model="symmsg"
                            @keyup.enter="getresult"
                            hint="Describe your your symptom message"
                    ></v-text-field>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn :disabled="!symmsg"  @click="getresult"   round color="accent" :loading="loading" dark>
                            <v-icon>search</v-icon>
                            <!--:to="`/symlab/symlist/${result}`"-->
                            <!--//<router-link :to="`/symlab/symlist/${result}`">开始</router-link>-->
                        </v-btn>
                    </v-card-actions>


                    <v-expansion-panel >
                        <v-expansion-panel-content  v-for="(results,index) in result" :key="index">
                              <div slot="header">{{ results.name}} </div>
                            <v-card>
                                <v-card-text>  第一科室:{{results.firstDepartment}} <br> {{"第二科室:"+ results.secondDepartment }}<br>
                                   简介：{{results.introduction}}</v-card-text>
                                <v-btn @click.native="getdetail(results.name)"  left  round small color="button2" :loading="loading2" dark >
                                      详情
                                </v-btn>
                            </v-card>
                        </v-expansion-panel-content>
                    </v-expansion-panel>
                </v-flex>
            </v-layout>
        </v-container>
    </div>
</template>

<script>
    import axios from '../utils/axios'
    export default {
        name: "SymList",
        data(){
            return{
              value:0,
              symmsg:'',
              //this.$route.params.symmsg,
              result:[],
              detail: [],
             loading:false,
             loading2:false,
            }
        },
        mounted(){
          this.getRouterData()
        },
       methods: {
           getRouterData() {
               if (this.$route.params.result) {
                   this.symmsg = this.$route.params.symmsg
                   this.result = this.$route.params.result
                   sessionStorage.setItem('result', JSON.stringify(this.result))
                   sessionStorage.setItem('symmsg', this.symmsg)
                   console.log(this.result)
                   console.log("aaaaaaaa")
               }
                else{
                   this.result = JSON.parse(sessionStorage.getItem('result'))
                   this.symmsg = sessionStorage.getItem('symmsg')
                   console.log("bbbbbb")
                   console.log(this.result)

               }

               /*console.log(sessionStorage.result)
                console.log(this.$route.params.result)*/
           },
           getresult() {
               this.loading = true
               axios.get('https://health.lisa.moe/api/wiki/search/?name=' + this.symmsg)
                   .then(result => {
                       this.result = result.data
                       sessionStorage.setItem('result', JSON.stringify(this.result))
                       sessionStorage.setItem('symmsg', this.symmsg)
                       this.loading = false
                   }).catch(error => {
                   console.log(error)
                   this.loading = false
               })
           },
           getdetail(name) {
               console.log(name)
               console.log(typeof (name))
               this.loading2 = true
               axios.get('https://health.lisa.moe/api/wiki/disease/?name=' + name)
                   .then(res => {
                       this.detail = res.data
                       sessionStorage.setItem('sdetail', JSON.stringify(this.detail))
                       this.loading = false
                       this.$router.push({
                           name: 'symdetail',
                           params: {
                               detail: this.detail,
                           }
                       })
                   }).catch(error => {
                   console.log(error)
                   this.loading2 = false
               })

           },
       },
    }
</script>

<style scoped>

</style>
