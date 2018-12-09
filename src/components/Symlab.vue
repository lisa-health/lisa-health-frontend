<template>
    <v-container fluid fill-height>
        <v-layout align-center justify-center>
            <v-flex xs12 sm6>
                <v-text-field
                        label="你是想找尿频还是肾亏呢^_^"
                        v-model="symmsg"
                        @keyup.enter="getresult"
                        hint="你想查些什么呢^_^"
                ></v-text-field>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn :disabled="!symmsg" @click="getresult" round color="accent" :loading="loading" dark>
                        <v-icon>search</v-icon>
                    </v-btn>
                </v-card-actions>

                <v-card>
                    <v-card-title class="subheading font-italic font-weight-regular justify-space-between ">
                        <span style="color:#fa7298">{{ currentTitle }}</span>
                    </v-card-title>
                    <v-window v-model="step">
                        <!--window  1-->
                        <v-window-item :value="1">
                            <v-container fluid>
                                <v-layout row wrap>
                                    <v-flex v-for="(i,index) in icons" :key="index" xs4 justify-center align-self-center
                                            @click="toSecond(index)">
                                        <v-btn block flat large disabled>
                                            <svg class="icon" aria-hidden="true" font-size="36px">
                                                <use :xlink:href='"#icon-"+i.bn'></use>
                                            </svg>
                                        </v-btn>
                                        <p class="text-xs-center">{{i.name}}</p>
                                        <v-divider v-if="index<12"></v-divider>

                                    </v-flex>
                                </v-layout>
                            </v-container>
                        </v-window-item>

                        <!--window-item 2-->
                        <v-window-item :value="2">
                            <v-container fluid>
                                <v-layout row wrap>
                                    <v-flex v-for="(s,i) in deIcons[first]" :key="i" xs4 justify-center
                                            align-self-center
                                            @click="toSymList(secondDepartment[i])">
                                        <v-btn block flat large disabled>
                                            <svg class="icon" aria-hidden="true" font-size="36px">
                                                <use :xlink:href='"#"+s'></use>
                                            </svg>
                                        </v-btn>
                                        <p class="text-xs-center">{{secondDepartment[i]}}</p>
                                    </v-flex>
                                </v-layout>
                            </v-container>
                        </v-window-item>
                    </v-window>
                    <v-divider></v-divider>

                    <v-card-actions>
                        <v-btn
                                :disabled="step === 1"
                                flat
                                fab
                                color="primary"
                                @click="step--"
                                small
                        >
                            <v-icon>keyboard_arrow_left</v-icon>
                        </v-btn>
                        <v-spacer></v-spacer>
                        <v-btn
                                :disabled="step === 2 || secondDepartment==''"
                                color="primary"
                                flat
                                fab
                                @click="step++"
                                small
                        >
                            <v-icon>keyboard_arrow_right</v-icon>
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    import axios from '../utils/axios'

    export default {
        data() {
            return {
                step: 1,
                symmsg: '',
                loading: false,
                result: [],
                icons: [{bn: "neike", name: "内科"},
                    {bn: "color1", name: "外科"},
                    {bn: "fuchanke", name: "妇产科"},
                    {bn: "erke1", name: "儿科"},
                    {bn: "nanke", name: "男科"},
                    {bn: "pifuxingbingke", name: "皮肤性病科"},
                    {bn: "tumour", name: "肿瘤科"},
                    {bn: "chuanranke", name: "传染科"},
                    {bn: "jingshenxinlike", name: "心理科"},
                    {bn: "jingshenke", name: "精神科"},
                    {bn: "zhengxingmeirongke", name: "整形外科"},
                    {bn: "yanke1", name: "眼科"},
                    {bn: "erbihouke", name: "耳鼻喉科"},
                    {bn: "color2", name: "口腔科"},
                ],
                deIcons: [["icon-yajiankang_iconx-copy", "icon-xiaohuaneike", "icon-huxineike", "icon-neifenmike", "icon-shenjingneike-", "icon-xieyeke", "icon-fengshigushang", "icon-neike1", "icon-nephrology"],
                    ["icon-guwaike", "icon-pifu_icon", "icon-shenjingwaike-K", "icon-icon-test", "icon-cardiology", "icon-xiaochang", "icon-gandanwaike", "icon-ruxianke", "icon-miniaowaike", "icon-waike", "icon-xiongwaike"],
                    ["icon-fuke", "icon-fuchanke1", "icon-chanke"],
                    ["icon-ertong", "icon-erke", "icon-xiaoerneike", "icon-xiaoerganmao"],
                    ["icon-nankeyongyao"],
                    ["icon-pifuke", "icon-color", "icon-manxingbing"],
                    ["icon-tumor_treatment", "icon-zhongliuke1", "icon-zhongliuke", "icon-zhongliu", "icon-zhongliujifangzhike"],
                    ["icon-chuanranke1"],
                    ["icon-xinlijiankang"],
                    ["icon-jingshenke1"],
                    ["icon-weiyizhengxing-chunbuzhengxing-", "icon-weiyizhengxing-zhengxingwaikezhongxin-01", "icon-weiyizhengxing-boniaosuantianchongsuxing-"],
                    ["icon-yanke", "icon-chakanyanditu", "icon-huahui-"],
                    ["icon-erbihouke1", "icon-bizi", "icon-yanhouke-manxingyanyan"],
                    ["icon-kouqiangke1", "icon-kouqianghemianke", "icon-icon_kouqiangguanli"]],
                first: '',
                secondDepartment: [],
                //second: []
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
        /* created() {
             for (var i = 0; i < this.icons.length; i++) {
                 axios.get('https://health.lisa.moe/api/wiki/disease/?firstDepartment=' + this.icons[i].name + '&brief=true')
                     .then(res => {
                         //console.log(Second.data)
                         this.secondDepartment[this.secondDepartment.length] = Array.from(new Set(res.data.map(x => x.secondDepartment)))
                         console.log(this.secondDepartment)
                     }).catch(error => {
                     console.log(error)
                 })
             }
         },*/
        methods: {
            getresult() {
                this.loading = true
                axios.get('https://health.lisa.moe/api/wiki/search/?name=' + this.symmsg)
                    .then(result => {
                        this.result = result.data
                        this.loading = false

                        this.$router.push({
                            name: 'symlist',

                            params: {
                                result: this.result,
                                symmsg: this.symmsg
                            }
                            // or query
                        })

                    }).catch(error => {
                    console.log(error)
                    this.loading = false
                })
            },
            toSecond(index) {
                axios.get('https://health.lisa.moe/api/wiki/disease/?firstDepartment=' + this.icons[index].name + '&brief=true')
                    .then(res => {
                        this.secondDepartment = Array.from(new Set(res.data.map(x => x.secondDepartment)))
                        console.log(this.secondDepartment)
                    }).catch(error => {
                    console.log(error)
                })
                this.first = index
                this.step++
            },
            toSymList(s) {
                axios.get('https://health.lisa.moe/api/wiki/disease/?secondDepartment=' + s + '&brief=true')
                    .then(detail => {
                        this.result = detail.data
                        this.symmsg = s
                        this.$router.push({
                            name: 'symlist',

                            params: {
                                result: this.result,
                                symmsg: this.symmsg
                            }
                            // or query
                        })

                    }).catch(error => {
                    console.log(error)
                    this.loading = false
                })
            }
        },
        computed: {
            currentTitle() {
                switch (this.step) {
                    case 1:
                        return '第一科室'
                    default:
                        return this.icons[this.first].name + ' ->第二科室'
                }
            }
        }
    }
</script>

<style>

</style>
