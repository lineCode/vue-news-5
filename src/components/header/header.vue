<template>
  <div class="homepage">
    <div class="top_bar">
      <div class="top_bar_left">
        <span class="download">下载APP</span>
        <span class="weather_tool">{{weather.city}}</span>
        <span>{{dat_condition}}</span>
        <span>{{dat_high_temperature}}℃ / {{dat_low_temperature}}℃</span>
        <span>{{current_time}}</span>
      </div>
      <div class="top_bar_right">
        <span>登陆</span>
        <span>反馈</span>
        <span>侵权投诉</span>
        <span>头条产品</span>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
const ERR_OK = 200
export default {
  name: 'hello',
  data () {
    return {
      weather: {},
      current_time: '',
      dat_condition: '',
      dat_high_temperature: '',
      dat_low_temperature: ''
    }
  },
  created () {
    this._getData()
  },
  methods: {
    _getData () {
      axios.get('/api/getDiscList').then(res => {
        if (res.status === ERR_OK) {
          this.weather = res.data.data
          this.current_time = this.weather.weather.update_time.slice(0, 10)
          this.dat_condition = this.weather.weather.dat_condition
          this.dat_high_temperature = this.weather.weather.dat_high_temperature
          this.dat_low_temperature = this.weather.weather.dat_low_temperature
        }
      })
    },
    toRouter () {
      this.$router.push({
        path: `/index`
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.top_bar{
  display:flex;
  position: fixed;
  z-index:1000;
  justify-content: space-between;
  background: #444444;
  color:#fff;
  height:40px;
  width:100%;
  min-width:1200px;
  align-items: center;
  .top_bar_left{
    .download{
      margin-left:10px;
      padding-right:10px;
      border-right:1px solid #222;
    }
    .weather_tool{}
  }
}
</style>
