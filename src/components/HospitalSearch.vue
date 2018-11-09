<template>
    <v-container fluid fill-height >
        <v-slide-y-transition>
            <v-layout id="layoutCss" align-center justify-center>
                <v-flex xs12 sm6>

                    <!-- <v-btn :to="{name: 'index'}" small round color="primary">
                        <v-icon>arrow_back</v-icon>
                    </v-btn> -->

                    <v-text-field
                            label="请输入城市拼音或输入特定医院名字"
                            v-model="spelling"
                            @keyup.enter="Search"
                            hint="For example, 牙科 or beijing "
                    ></v-text-field>

                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn :disabled="!spelling"  @click="Search"  round color="accent" :loading="loading" dark>
                            <v-icon>search</v-icon>
                        </v-btn>
                    </v-card-actions>
                    <v-alert
                    v-model="onWarn"
                    type="error"
                    transition="scale-transition"
                    dismissible
                    >
                    {{tipMsg}}
                    </v-alert>
                    <china-map
                        @city-changed="changeSpelling"
                        @commit-search="Search"
                    ></china-map>




                    <v-expansion-panel>
                        <v-expansion-panel-content v-for="(result,i) in results"  :key="i" >
                          <!-- 在医院没有等级时，不显示括号 -->
                            <div slot="header"> {{ result.NAME }} <span v-if="result.HOSPITAL_GRADE">({{result.HOSPITAL_GRADE}})</span> </div>
                            <v-card>
                                <v-card-text>
                                    <div v-if="result.HOSPITAL_TAGS_NAME">
                                        <v-chip color="secondary" :key="tag" v-for="tag in result.HOSPITAL_TAGS_NAME.split('/')">{{tag}}</v-chip>
                                    </div>
                                    <div v-if="result.HOSPITAL_TYPE">
                                        医院类型：{{result.HOSPITAL_TYPE}}
                                    </div>
                                    <p>{{"地址："+ result.STREET }}</p>
                                </v-card-text>
                            </v-card>
                    </v-expansion-panel-content>
                        <div v-observe-visibility="visibilityChanged">
                            <div v-if="hasNextPage">
                                <v-btn :loading="loading" small @click="loadNextPage" block color="secondary" dark>
                                    <v-icon>keyboard_arrow_down</v-icon>
                                </v-btn>
                            </div>
                            <div v-else-if="loading">
                                <v-progress-circular indeterminate color="primary"></v-progress-circular>
                            </div>
                            <div v-else-if="results.length">
                                <v-divider></v-divider>
                                我也是有底线的
                            </div>
                            
                        </div>
                        <!-- <div v-else>Finale</div> -->
                    </v-expansion-panel>
                </v-flex>
            </v-layout>
        </v-slide-y-transition>
    </v-container>

</template>






<script>
    import axios from '../utils/axios'
    import ChinaMap from './ChinaMap'
    export default {
        name: "HospitalSearch",
        components: {
            'china-map': ChinaMap
        },
        data(){
            return{
                spelling:'',
                results:[],
                loading: false,
                currentPage: 1,
                nextPage: 1,
                searchParams: 'search_name',
                onWarn:false,
                tipMsg:''
            }
        },
        methods:{
            Search(){
                let layoutCss = document.getElementById("layoutCss")
                const reg1 = /^[A-z]+$/
                const reg2 = /^[\u4e00-\u9fa5]+$/
                const reg3 = /\d/
                const reg4 = /[~'!@#￥$%^&*()-+_=:\.]/
                if(!this.spelling.trim()){
                    //弹出一个带颜色的提示框
                    this.tipMsg = '你为什么不输入值啊？'
                    this.onWarn = true
                    // alert('搜索内容不能为空')
                    return
                }
                if(reg3.test(this.spelling.trim()) || reg4.test(this.spelling.trim())){
                    //弹出一个带颜色的提示框
                    // alert('请输入合法值')
                    this.tipMsg = '你输入的真烂！'
                    this.onWarn = true
                    return
                }
                this.currentPage = 1
                if(reg1.test(this.spelling.trim())){
                    this.loading = true
                    this.spelling = this.spelling.trim().toLowerCase()
                    this.searchParams = 'city_spelling'
                    axios.get('https://health.lisa.moe/api/tool/hospital/?city_spelling='+this.spelling)
                        .then(data => {
                            layoutCss.removeAttribute("align-center")
                            layoutCss.setAttribute("align-start","true")
                            this.results = data.result.hospitalList
                            this.nextPage = data.result.pageTurn.nextPage
                            this.results.length || this.tip('嗯？竟然没有结果？')
                            this.loading = false
                        }).catch(error => {
                        console.log(error)
                        this.loading = false
                        // alert('搜索失败，请输入有效值')
                        this.tipMsg = '搜索失败了！'
                        this.onWarn = true
                    })
                }
                if(reg2.test(this.spelling.trim())){
                    this.loading = true
                    this.spelling = this.spelling.trim()
                    this.searchParams = 'search_name'
                    axios.get('https://health.lisa.moe/api/tool/hospital/?search_name='+this.spelling)
                        .then(data => {
                            layoutCss.removeAttribute("align-center")
                            layoutCss.setAttribute("align-start","true")
                            this.results = data.result.hospitalList
                            this.nextPage = data.result.pageTurn.nextPage
                            this.results.length || this.tip('嗯？竟然没有结果？')
                            this.loading = false
                        }).catch(error => {
                        console.log(error)
                        this.loading = false
                        // alert('搜索失败，请输入有效值')
                        this.tipMsg = '搜索失败了！'
                        this.onWarn = true
                    })
                }
            },
            loadNextPage () {
                if (!this.hasNextPage) return this.loading = false
                this.loading = true
                this.currentPage = this.nextPage
                axios.get(this.requestPath).then(data => {
                    this.results = this.results.concat(data.result.hospitalList)
                    this.nextPage = data.result.pageTurn.nextPage
                    this.loading = false
                }).catch(error => {
                    console.error(error)
                    this.tip('搜索失败了，是不是网线被掐了？')
                    this.loading = false
                })
            },
            visibilityChanged (visible) {
                visible && this.loadNextPage()
            },
            tip(msg) {
                this.tipMsg = msg
                this.onWarn = true
            },
            changeSpelling(val) {
                this.spelling = val
            }
        },
        watch: {
            spelling () {
                this.results = []
                this.currentPage = 1
                this.nextPage = 1
                this.loading = false
                this.onWarn = false
            }
        },
        computed: {
            requestPath () {
                return `https://health.lisa.moe/api/tool/hospital/?${this.searchParams}=${this.spelling.trim()}&page_num=${this.currentPage}`
            },
            hasNextPage () {
                return this.nextPage > this.currentPage
            }
        }
    }
</script>

<style scoped>
#layoutCss {
    transition: top 2s ease-in-out;
}
</style>
