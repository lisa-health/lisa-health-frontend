<template>
    <v-container fluid fill-height>
        <v-layout align-center justify-center>
            <v-flex xs12 sm6>
                <!-- <v-btn :to="{name: 'symlist'}" small round color="primary">
                  <v-icon>arrow_back</v-icon>
                </v-btn>-->
                <v-text-field
                        label="What's up?"
                        v-model="symmsg"
                        @keyup.enter="getresult"
                        hint="Describe your symptom message"
                ></v-text-field>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn :disabled="!symmsg"  @click="getresult"   round color="accent" :loading="loading" dark>
                        <v-icon>search</v-icon>
                        <!--:to="`/symlab/symlist/${result}`"-->
                       <!--//<router-link :to="`/symlab/symlist/${result}`">开始</router-link>-->
                    </v-btn>
                </v-card-actions>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
import axios from '../utils/axios'
export default {
    data(){
        return{
            symmsg:'',
            loading:false,
            result:[]
            // "https://health.lisa.moe/api/wiki/search/?name=" + this.searchMsg
            /*firstDepartment	string	第一科室
            secondDepartment	string	第二科室
            name	string	名称
                tSymptoms	[string]	症状（结构化）
            symptoms	[string]	症状
        sytmptom	string	症状（综述）
        complication	string	并发症
        introduction	string	简介
        nursing	string	护理
        inspect	string	诊断方法
        cause	string	病因
        prevention	string	预防方法
        content	string	疾病内容*/
        }
    },
    methods: {
        getresult () {
            this.loading = true
            axios.get('https://health.lisa.moe/api/wiki/search/?name=' + this.symmsg)
                .then(result => {
                    this.result = result.data
                    this.loading = false

                    this.$router.push({
                        name:'symlist',

                        params:{
                            result:this.result,
                            symmsg:this.symmsg
                        }
                        // or query
                    })

            }).catch(error => {
                console.log(error)
                this.loading = false
            })
        }
    },
}
</script>

<style>

</style>
