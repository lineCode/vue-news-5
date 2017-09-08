<template>
  <div class="homepage">
    <Top></Top>
    <Vcontent></Vcontent>
  </div>
</template>

<script>
import Top from '../header/header'
import content from '../content/content'
export default {
  name: 'hello',
  data () {
    return {}
  },
  created () {},
  methods: {},
  components: {
    Top,
    Vcontent: content
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
.top_bar{
  display:flex;
  justify-content: space-between;
  background: #444444;
  color:#fff;
  height:40px;
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
