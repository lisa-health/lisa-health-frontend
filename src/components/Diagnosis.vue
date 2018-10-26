<template>
    <v-flex xs12 sm6>
          <v-text-field
            label="What's up?"
            v-model="symptom"
            @keyup.enter="getDiagnosis"
            hint="For example, flowers or used cars"
          ></v-text-field>
          <v-btn @click="getDiagnosis" round color="primary" :loading="loading" dark>
              <v-icon>local_hospital</v-icon>
          </v-btn>
          <v-expansion-panel>
            <v-expansion-panel-content
              v-for="(result,i) in results"
              :key="i"
              >
              <div slot="header">{{ result.name }} ({{ result.probability }}%)</div>
              <v-card>
                  <v-card-text>{{ result.detailSymptom }}</v-card-text>
              </v-card>
            </v-expansion-panel-content>
          </v-expansion-panel>
          <div v-if="shouldFuckYou">
            Fuck you!
          </div>
          <router-link to="/">Index</router-link>
        </v-flex>
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
          this.results = data.disease.filter(x => x.probability > 5)
          this.loading = false
        }).catch(error => {
          console.log(error)
          this.loading = false
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
