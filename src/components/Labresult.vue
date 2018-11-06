<template>

    <v-container fluid >
      <v-layout align-center justify-center>
        <v-flex xs12 sm6>
          <v-btn :to="{name: 'index'}"
          small
          round
          color="primary">
              <v-icon>arrow_back</v-icon>
          </v-btn>

          <v-text-field
          label="想要了解?"
          v-model="searchMsg"
          @keyup.enter="Search"
          hint="你可以试试这些？"
          ></v-text-field>

          <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn :disabled="!searchMsg"
              @click="Search"
              round
              color="accent"
              :loading="loading"
              dark>
                  <v-icon>search</v-icon>
              </v-btn>
          </v-card-actions>

          <v-expansion-panel>
            <v-expansion-panel-content v-for="(s_result,i) in results"  :key="i">
              <div slot="header"> {{ s_result.name }} </div>
              <v-card :to="{name: 'index'}">
                  <v-card-text>
                      第一科室:{{s_result.firstDepartment}}{{"  第二科室:"+ s_result.secondDepartment }}<br>
                      {{s_result.introduction}}
                  </v-card-text>
              </v-card>

            </v-expansion-panel-content>
          </v-expansion-panel>

        </v-flex>
      </v-layout>

    </v-container>

</template>

<script>

import axios from "../utils/axios";
export default {
  name: "Symlab",
  data() {
    return {
      searchMsg: "",
      results: [],
      loading: false,
      currentPage: 1,
      nextPage: 2,
    };
  },
  methods: {
    Search: function() {
      const reg1 = /^[A-z]+$/;
      const reg2 = /^[\u4e00-\u9fa5]+$/;
      const reg3 = /\d/;
      const reg4 = /[~'!@#￥$%^&*()-+_=:\.]/;
        axios
          .get(
            "https://health.lisa.moe/api/wiki/search/?name=" + this.searchMsg
          )
          .then(result => {
            this.results = result.data;
          });
    },
    mounted(){
        let self = this
        
            self.searchMsg = data
        
    }
  }
}
</script>

<style>
</style>
