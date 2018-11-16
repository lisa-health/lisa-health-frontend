<template>
  <div>
    <v-btn @click="goBack" fab small color="accent"><v-icon>arrow_back</v-icon></v-btn>
    <span>当前选中了: {{ cityName || '-' }}</span>
    <v-progress-circular v-if="loading" indeterminate color="primary"></v-progress-circular>
    <v-layout wrap row>
        <v-flex md8 xs12>
            <ve-map class="hidden-sm-and-down" :data="chartData" :settings="chartSettings" :events="chartEvents"></ve-map>
        </v-flex>
        <v-flex md4 xs12>
            <v-card>
                <v-card-title>
                    {{cityName}}
                    <v-spacer></v-spacer>
                    <v-text-field
                        v-model="search"
                        append-icon="search"
                        label="搜索"
                        single-line
                        hide-details
                        @keyup.delete="search || goBack()"
                        @keyup.enter="uniqueSearchResult && chartClicked(uniqueSearchResult.id), search || commitSearch()"
                    ></v-text-field>
                </v-card-title>
                <v-data-table
                :items="childrenDistrict"
                :search="search"
                :headers="[{
                        text: '城市名称',
                        align: 'left',
                        sortable: true,
                        value: 'name'
                    }]"
                :custom-filter="pinyinFilter"
                hide-headers
                >
                    <template slot="items" slot-scope="props">
                        <v-list-tile
                            ripple
                            :key="props.item.name"
                            @click="chartClicked(props.item.id)"
                        >

                            <v-list-tile-content>
                                <v-list-tile-title>
                                    <td>{{ props.item.name }}{{ props.item.suffix }}</td>
                                </v-list-tile-title>
                            </v-list-tile-content>
                        </v-list-tile>
                    </template>
                    <v-alert slot="no-results" :value="true" color="error" icon="warning">
                        竟然找不到 "{{ search }}" 了？
                    </v-alert>
                </v-data-table>
            </v-card>
                
            
        </v-flex>
    </v-layout>
    
  </div>
</template>

<script>
import VCMap from 'v-charts/lib/map.common'
  export default {
    data () {
      return {
        cityName: '',
        selectId: 0,
        lastId: 0,
        search: '',
        uniqueSearchResult: undefined,
        chartData: {
            columns: ['name', 'value'],
          rows: [
            
          ]
        },
        chartSettings: {
            position: 'china',
            roam: true,
            // selectData: true,
            selectedMode: 'single',
            itemStyle: {
                normal: {
                    borderColor: this.$vuetify.theme.secondary,
                    areaColor: this.$vuetify.theme.primary
                },
                emphasis:{
                    areaColor: null,
                    shadowOffsetX: 0,
                    shadowOffsetY: 0,
                    shadowBlur: 20,
                    borderWidth: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            },
        },
        chartEvents: {
            click: (v) => {
                this.cityName = v.name
                const {id, pinyin} = this.districtMapping[v.name]
                this.chartClicked(id)
            }
        },
        loading: true,
        districtMapping: {},
        districtRelation: {}
      }
    },
    methods: {
        backToIndex() {
            this.chartSettings.position = 'china'
            this.$emit('city-changed', '')
            this.cityName = ''
            this.selectId = 0
        },
        goBack() {
            this.lastId ? this.chartClicked(this.lastId) : this.backToIndex()
        },
        loadRows () {
            const keys = Object.keys(this.districtMapping)
            this.chartData.rows = keys.map(k => ({name: k, value: 0}))
        },
        chartClicked (id) {
            const city = this.districtRelation[id]
            this.cityName = city.name
            const name = city.pinyin
            this.selectId = id
            this.lastId = city.parent_id
            this.search = ''
            this.uniqueSearchResult = undefined
            if (name) {
                this.chartSettings.position = id ? ('province/' + name) : "china"
                this.$emit('city-changed', name)
            }
        },
        createSelector (sel) {
            return () => this.chartClicked(sel)
        },
        pinyinFilter (items, search, filter, headers) {
            search = search.toString().replace(/'/g, '').toLowerCase().trim()
            if (search === '') return items
            if (search === ',' || search === '，') {
                this.search = ''
                this.goBack()
            }
            const props = ['name', 'pinyin']
            const result = items.filter(item => props.some(prop => filter(item[prop], search)) || item.name + item.suffix === search)
            this.uniqueSearchResult = result.length === 1 && result[0]
            return result
        },
        commitSearch () {
            this.$emit('commit-search')
        }
    },
    components: {
        've-map': VCMap
    },
    mounted() {
        import('../json/citiesRelation.json').then(d => {
            d = d.default
            this.districtRelation = d
            this.loading = false
            const mapping = {}
            Object.values(d).map(v => {
                mapping[v.name] = mapping[v.name + v.suffix] = mapping[v.name] || {
                    pinyin: v.pinyin,
                    id: v.id
                }
            })
            this.districtMapping = mapping
            this.loadRows()
        })
    },
    computed: {
        childrenDistrict () {
            if (!this.selectId) return Object.values(this.districtRelation).filter(x => !x.parent_id)
            const city = this.districtRelation[this.selectId]
            if (!city) return []
            return city.children.map(x => this.districtRelation[x])
        }
    }
  }
</script>