<template>
    <v-container fluid fill-height >
        <v-slide-y-transition>
            <v-layout id="layoutCss" align-center justify-center>
                <v-flex xs12 sm6>
                    <v-btn :to="{name: 'index'}" small round color="primary">
                        <v-icon>arrow_back</v-icon>
                    </v-btn>
                    <v-text-field
                            label="请输入城市拼音或输入特定医院名字"
                            v-model="spelling"
                            @keyup.enter="Search"
                            hint="For example, HK or beijing "
                    ></v-text-field>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn :disabled="!spelling" @click="Search"  round color="accent" :loading="loading" dark>
                            <v-icon>search</v-icon>
                        </v-btn>
                    </v-card-actions>
                    <v-expansion-panel>
                        <v-expansion-panel-content v-for="(result,i) in results"  :key="i" >
                            <div slot="header">{{ result.NAME }}({{result.HOSPITAL_GRADE}}) </div>
                            <v-card>
                                <v-card-text>
                                    医院类型：{{result.HOSPITAL_TYPE}}<br/>{{"地址："+ result.STREET }}
                                </v-card-text>
                            </v-card>
                    </v-expansion-panel-content>
                        <div v-observe-visibility="visibilityChanged">
                            <v-btn small v-if="hasNextPage" @click="loadNextPage" block color="secondary" dark>
                                <v-icon>keyboard_arrow_down</v-icon>
                            </v-btn>
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
    export default {
        name: "HospitalSearch",
        data(){
            return{
                spelling:'',
                results:[],
                loading: false,
                currentPage: 1,
                nextPage: 2,
                searchParams: 'search_name'
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
                    alert('搜索内容不能为空')
                    return
                }
                if(reg3.test(this.spelling.trim()) || reg4.test(this.spelling.trim())){
                    alert('请输入合法值')
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
                            this.loading = false
                        }).catch(error => {
                        console.log(error)
                        this.loading = false
                        alert('搜索失败，请输入有效值')
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
                            this.loading = false
                        }).catch(error => {
                        console.log(error)
                        this.loading = false
                        alert('搜索失败，请输入有效值')
                    })
                }
            },
            loadNextPage () {
                if (!this.hasNextPage) return
                this.loading = true
                this.currentPage = this.nextPage
                axios.get(this.requestPath).then(data => {
                    this.results = this.results.concat(data.result.hospitalList)
                    this.nextPage = data.result.pageTurn.nextPage
                    this.loading = false
                })
            },
            visibilityChanged (visible) {
                visible && this.loadNextPage()
            }
        },
        watch: {
            spelling () {
                this.results = []
                this.currentPage = 1
                this.hasNextPage = false
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