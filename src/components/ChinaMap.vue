<template>
  <div>
    <span>当前选中了: {{ cityName || '-' }}</span>
    <ve-map :data="chartData" :settings="chartSettings" :events="chartEvents"></ve-map>
  </div>
</template>

<script>
import VCMap from 'v-charts/lib/map.common'
  export default {
    data () {
      return {
        cityName: '',
        chartData: {
            columns: ['name', 'value'],
          rows: [
            {name: '北京', value: 0},
                {name: '天津', value: 0},
                {name: '上海', value: 0},
                {name: '重庆', value: 0},
                {name: '河北', value: 0},
                {name: '河南', value: 0},
                {name: '云南', value: 0},
                {name: '辽宁', value: 0},
                {name: '黑龙江', value: 0},
                {name: '湖南', value: 0},
                {name: '安徽', value: 0},
                {name: '山东', value: 0},
                {name: '新疆', value: 0},
                {name: '江苏', value: 0},
                {name: '浙江', value: 0},
                {name: '江西', value: 0},
                {name: '湖北', value: 0},
                {name: '广西', value: 0},
                {name: '甘肃', value: 0},
                {name: '山西', value: 0},
                {name: '内蒙古', value: 0},
                {name: '陕西', value: 0},
                {name: '吉林', value: 0},
                {name: '福建', value: 0},
                {name: '贵州', value: 0},
                {name: '广东', value: 0},
                {name: '青海', value: 0},
                {name: '西藏', value: 0},
                {name: '四川', value: 0},
                {name: '宁夏', value: 0},
                {name: '海南', value: 0},
                {name: '台湾', value: 0},
                {name: '香港', value: 0},
                {name: '澳门', value: 0}
          ]
        },
        chartSettings: {
            position: 'china',
            // selectData: true,
            selectedMode: 'single',
            itemStyle: {
                normal: {
                    borderColor: this.$vuetify.theme.primary,
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
                this.chartSettings.position = 'province/' + v.name
                this.$emit('city-changed', v.name)
            }
        }
      }
    },
    components: {
        've-map': VCMap
    }
  }
</script>