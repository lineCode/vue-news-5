<template>
  <div class="content">
    <div class="content_center">
      <div class="nav_left">
        <img src="//s3.pstatp.com/toutiao/resource/ntoutiao_web/static/image/logo_201f80d.png" alt="">
        <ul>
          <li 
            :class="{'active': index === ind}"
            v-for ="(list, index) of contentText" 
            @click="chooseLi(index, list.id)">{{list.value}}</li>
        </ul>
      </div>
      <div class="content_list">
        <ul>
          <li v-for="(list ,index) of newsContent">
            <div class="inner_list">
              <img :src="list.image_url" alt="">
              <div class="inner_inner">
                <p class="news_title">{{list.title}}</p>
                <p class="news_content">
                  <span class="media_avatar"><img :src="list.media_avatar_url" alt=""></span>
                  <span>{{list.source}}.{{list.comments_count}}评论.{{list.behot_time}}</span>
                </p>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  import fromtDate from '@/common/js/formtDate'
  export default {
    data () {
      return {
        contentText: [{
          value: '推荐',
          id: '1'
        }, {
          value: '热门',
          id: 'news_hot'
        }, {
          value: '视频',
          id: 'video'
        }, {
          value: '社会',
          id: 'news_society'
        }, {
          value: '娱乐',
          id: 'news_entertainment'
        }, {
          value: '游戏',
          id: 'news_game'
        }, {
          value: '体育',
          id: 'news_sports'
        }, {
          value: '汽车',
          id: 'news_car'
        }, {
          value: '财经',
          id: 'news_finance'
        }, {
          value: '搞笑',
          id: 'funny'
        }],
        ind: 0,
        newsContent: []
      }
    },
    created () {
      this._getNews()
    },
    methods: {
      _getNews (argment, id) {
        let arg = {
          min_behot_time: 0,
          category: '__all__',
          utm_source: 'toutiao',
          widen: 1,
          tadrequire: true
        }
        if (argment) {
          arg = argment
        }
        axios.get('/api/getNews', {
          params: arg
        }).then(res => {
          this.newsContent = res.data.data
          for (let list of this.newsContent) {
            list.behot_time = fromtDate(list.behot_time)
          }
        })
      },
      chooseLi (index, id) {
        this.ind = index
        console.log(id)
        let argment = {}
        if (id === '1') {
          argment = {
            min_behot_time: 0,
            category: '__all__',
            utm_source: 'toutiao',
            widen: 1,
            tadrequire: true
          }
        } else {
          argment = {
            category: id,
            utm_source: 'toutiao',
            widen: 1,
            max_behot_time: 0,
            max_behot_time_tmp: 0,
            tadrequire: true
          }
        }
        this._getNews(argment, id)
      }
    }
  }
</script>

<style lang="less" scoped>
  .content{
    height: 100px;
    width:100%;
    margin: 0 auto;
    padding-top: 40px;
    .content_center{
      width: 1200px;
      height:300px;
      margin: 0 auto;
      display:flex;
      padding-top:20px;
      .nav_left{
        width: 110px;
        height: 600px;
        padding-right: 30px;
        background-color: #fff;
        position: fixed;
        img{
          width: 108px;
          height: 27px;
          margin-bottom: 16px;
        }
        ul {
          li{
            width: 110px;
            height: 40px;
            line-height: 40px;
            text-align: center;
            color: #444;
            border-radius: 4px;
            margin-bottom: 2px;
          }
          li:hover{
            background:#ed4040;
            color:#fff;
          }
          .active{
            background:#ed4040;
            color:#fff;
          }
        }
      }
      .content_list{
        width:660px;
        background:#fff;
        margin-left:140px;
        ul{
          li{
            height:123px;
            .inner_list{
              padding: 10px 0;
              border-bottom: 1px solid #e8e8e8;
              display:flex;
              justify-content: space-between;
              img{
                width: 156px;
                height: 100px;
              }
              .inner_inner{
                height: 102px;
                width: 480px;
                .news_title{
                  color:#222;
                  font-weight: bold;
                  overflow: hidden;
                }
                .news_content{
                  display: flex;
                  align-items: center;
                  font-size: 14px;
                  .media_avatar{
                    display:inline-block;
                    margin-right: 2px;
                    width: 18px;
                    height: 18px;
                    line-height: 17px;
                    text-align: center;
                    font-size: 12px;
                    border-radius: 50%;
                    background-color: #eee;
                    overflow: hidden;
                    margin-right:5px;
                    img{
                      height:100%;
                      width:100%;
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
</style>