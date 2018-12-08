<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-center>
      <v-flex xs12 sm6>
        <v-text-field
          label="What's wrong?"
          v-model="symmsg"
          @keyup.enter="getresult"
          hint="Describe your symptom message"
        ></v-text-field>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            :disabled="!symmsg"
            @click="getresult"
            round
            color="accent"
            :loading="loading"
            dark
          >
            <v-icon>search</v-icon>
          </v-btn>
        </v-card-actions>
        <v-alert :value="warning" type="error" dismissible>{{alert_message}}</v-alert>
        <v-expansion-panel v-if="isMessage">
          <v-expansion-panel-content>
            <div slot="header">注意事项:{{ result.tips }}</div>
            <v-card>
              <v-card-text>处理:{{ result.funcs }}</v-card-text>
            </v-card>
          </v-expansion-panel-content>
        </v-expansion-panel>

        <v-expansion-panel inset>
          <v-expansion-panel-content v-for="(item,i) in array" :key="i" expand-icon=none  @click="getmessage(item)"> 
            <div slot="header" @click="getmessage(item)" align="center" >
              {{item}}
                   <!--  <a href="" @click.prevent="getmessage(item)" >{{item}}</a> -->
            </div>
            <v-card>
              <v-card-text v-if="list.tips">注意事项：{{list.tips }}</v-card-text>
              <v-card-text v-if="list.funcs">处理：{{list.funcs }}</v-card-text>
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
  data() {
    return {
      result: [],
      loading: false,
      symmsg: "",
      isMessage: false,
      warning: false,
      alert_message: "",
      array: [],
      list: []
    };
  },
  mounted() {
    axios.get("https://health.lisa.moe/api/tool/aid/all").then(outcome => {
      this.array = outcome.result;
      /* console.log(this.array) */
    });
  },
  methods: {
    getmessage(name) {
      this.list=[];
      axios
        .get("https://health.lisa.moe/api/tool/aid/?name=" + name)
        .then(message => {
          this.list = message.result;
        });
    },
    getresult() {
      this.loading = true;
      if (!this.symmsg.trim()) {
        this.alert_message = "行行好，输点东西吧";
        this.warning = true;
        return;
      }
      axios
        .get("https://health.lisa.moe/api/tool/aid/?name=" + this.symmsg)
        .then(data => {
          if (data.result) {
            this.result = data.result;
            this.loading = false;
            this.isMessage = true;
            this.warning = false;
          } else {
            this.loading = false;
            this.isMessage = false;
            this.warning = true;
            this.alert_message = "怎么没有结果啊！！！";
          }
        })
        .catch(error => {
          console.log(error);
          this.loading = false;
          this.warning = true;
          this.isMessage = false;
          this.alert_message = "出错了啊";
        });
    }
  },
  watch: {
    symmsg() {
      this.result = [];
      this.isMessage = false;
      this.warning = false;
    }
  }
};
</script>

<style>
</style>
