<template>
<v-container fluid fill-height>
  <v-layout align-center justify-center>
    <v-flex xs12 sm6>
      <!-- <v-btn :to="{name: 'index'}" small round color="primary">
        <v-icon>arrow_back</v-icon>
      </v-btn> -->
      <v-text-field
        label="What's up?"
        v-model="symptom"
        @keyup.enter="getDiagnosis"
        hint="Describe your fellings"
      ></v-text-field>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn :disabled="!symptom" @click="getDiagnosis" round color="accent" :loading="loading" dark>
            <v-icon>local_hospital</v-icon>
        </v-btn>
      </v-card-actions>
      <v-expansion-panel>
        <v-expansion-panel-content
          v-for="(result,i) in results"
          :key="i"
          >
          <div slot="header">{{ result.name }} ({{ result.probability }}%)</div>
          <v-card>
              <v-card-text>
                该疾病可能还有以下症状：
                <v-chip color="warning" v-for="(relate, i) in result.relateSymptoms" :key="i">{{relate}}</v-chip>
              </v-card-text>
              <v-card-text>{{ result.detailSymptom }}</v-card-text>
              <v-btn dark color="button2" round @click="showDetailOf(result.alterName)">详情</v-btn>
          </v-card>
        </v-expansion-panel-content>
      </v-expansion-panel>
      <!-- <div v-if="shouldFuckYou">
        Fuck you!
      </div> -->
    </v-flex>
  </v-layout>
</v-container>
    
</template>
<script>
import axios from '../utils/axios'
export default {
    data() {
        return {
            symptom: '',
            results: [],
            example: {
                alterName: '',
                detailSymptom: '',
                name: '',
                probability: 0,
                relatedSymptoms: ['']
            },
            loading: false,
            hasInputed: false
        }
    },
    methods: {
      getDiagnosis () {
        this.loading = true
        this.hasInputed = true
        axios.get('https://health.lisa.moe/api/diagnosis/predict/?symptom='+this.symptom)
        .then(data => {
          this.results = data.disease //.filter(x => x.probability > 5)
          this.loading = false
        }).catch(error => {
          console.log(error)
          this.loading = false
        })
      },
      showDetailOf(name) {
        axios.get(`https://health.lisa.moe/api/wiki/disease/?name=${name}`).then(d => d.data).then(data => {
          this.$router.push({
            name: 'symdetail',
            params: {
                sdetail: data,
            }
          })
        })
      }
    },
    computed: {
      shouldFuckYou() {
        return this.symptom && !this.results.length && this.hasInputed
      }
    },
    watch: {
      symptom(val) {
        if(!val) this.hasInputed = false
      }
    }
}
</script>
<style>

</style>
