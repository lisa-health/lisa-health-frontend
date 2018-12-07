<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-center>
      <v-flex xs12 sm6>
        <!-- <v-btn :to="{name: 'symlist'}" small round color="primary">
                  <v-icon>arrow_back</v-icon>
        </v-btn>-->
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
        <v-expansion-panel v-if="isMessage" >
          <v-expansion-panel-content>
            <div slot="header">急救:{{ result.tips }}</div>
            <v-card>
              <v-card-text >处理:{{ result.funcs }}</v-card-text>
            </v-card>
          </v-expansion-panel-content>
        </v-expansion-panel>

        <v-data-table :headers="headers" :items="array" >
          <template slot="no-data">
            <v-alert :value="true" color="error" icon="warning">Sorry, nothing to display here :(</v-alert>
          </template>
          <template slot="items" slot-scope="props">
            <td align="center"  >{{ props.item }}</td>
          </template>
        </v-data-table>
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
      dataIterator: [
        {
          nextPage: 1,
          prevPage: 1,
          pageText: "",
          rowsPerPageText: ""
        }
      ],
      headers: [
        {
          text: "所有急救",
          align: "center",
          sortable: false,
          value: "array"
        }
      ],
      array: []
    };
  },
  beforeCreate() {
    axios.get("https://health.lisa.moe/api/tool/aid/all").then(outcome => {
      this.array.value = false;
      this.array = outcome.result;
      /*console.log(this.array) */
    });
  },
  methods: {
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
