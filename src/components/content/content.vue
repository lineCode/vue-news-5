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
      <div class="content_right">
      <!--热门搜索-->
        <div class="search_hot">
          <input type="text" @input="_searchWord" @blur="bluript" @focus="focusipt" v-model="keyword">
          <span>搜索</span>
        </div>
        <div class="hot_list" v-show="horWordState">
          <ul>
            <li v-for="(list, index) of hotWord"><span>{{index+1}}</span>{{list}}</li>
          </ul>
        </div>
       <!--24小时热闻--> 
       <div class="hot_news">
          <div class="new_head">
            24小时热闻
          </div>
          <div class="hot_news_list">
            <ul>
              <li v-for="(list, index) of realNews">
                <img :src="list.image_url" alt="">
                <P class="nes_title">{{list.title}}</P>
              </li>
            </ul>
          </div>
       </div>
       <!--热门视频-->
       <div class="hot_video">
          <div class="video_head">
            热门视频
          </div>
          <div class="hot_video_list">
            <ul>
              <li v-for="(list, index) of hotVideo">
                <div class="vide_message">
                  <p class="title_video">{{list.title}}</p>
                  <p class="video_count">
                    <span>{{list.video_play_count}}万次播放</span>
                    <span>.</span>
                    <span>{{list.video_duration}}评论</span>
                  </p>
                </div>
                <div class="video_url">
                  <img :src="list.pc_image_url" alt="">
                  <span>{{list.video_duration_format}}</span>
                </div>
              </li>
            </ul>
          </div>
       </div>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  import fromtDate from '@/common/js/formtDate'
  const ERR_OK = 200
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
        newsContent: [],
        hotWord: [],
        keyword: '',
        history: [],
        realNews: [],
        hotVideo: [],
        horWordState: false
      }
    },
    created () {
      this._getNews()
      this._getHotWord()
      this._getRealTimeNews()
      this._getHotVideo()
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
      bluript () {
        this.horWordState = false
      },
      focusipt () {
        this.horWordState = true
      },
      _getHotWord () {
        axios.get('/api/getHotWord').then(res => {
          if (res.status === ERR_OK) {
            this.hotWord = res.data
            this.history = res.data
          }
        })
      },
      _searchWord () {
        axios.get('/api/getSearch', {
          params: {
            keyword: this.keyword
          }
        }).then(res => {
          if (res.status === ERR_OK) {
            this.hotWord = res.data.data
            if (this.hotWord.length === 0) {
              this.hotWord = this.history
            }
          }
        })
      },
      _getRealTimeNews () {
        axios.get('/api/getRealtimeNews').then(res => {
          if (res.status === ERR_OK) {
            this.realNews = res.data.data.slice(0, 4)
            for (let list of this.realNews) {
              list.video_play_count = (list.video_play_count / 10000).toFixed(1)
            }
            // console.log(res)
          }
        })
      },
      _getHotVideo () {
        // 获取热门视频
        axios.get('/api/getHotVideo', {
          params: {
            widen: 1
          }
        }).then(res => {
          if (res.status === ERR_OK) {
            this.hotVideo = res.data.data
            for (let list of this.hotVideo) {
              list.video_play_count = (list.video_play_count / 10000).toFixed(1)
            }
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
      .content_right{
        width: 347px;
        min-height: 600px;
        margin-left:30PX;
        position: relative;
        .search_hot{
          border-color: rgb(232, 232, 232);
          position: relative;
          border: 1px solid #e8e8e8;
          padding: 0 14px;
          background-color: #f5f6f7;
          border-radius: 4px;
          input{
            border: 0;
            color: #444;
            font-size: 14px;
            line-height: 20px;
            width: 280px;
            padding: 0;
            outline: 0;
            padding: 9px 10px 9px 0;
            background: #f5f6f7;
            -moz-box-sizing: border-box;
            box-sizing: border-box;
          }
        }
        .hot_list{
          position: absolute;
          left: 0;
          right: 0;
          background: #fff;
          font-size: 14px;
          z-index: 22;
          border: 1px solid #e8e8e8;
          border-radius: 4px;
          box-shadow: 0 2px 4px 0 rgba(0,0,0,.12);
          ul{
            li{
              height: 40px;
              line-height: 40px;
              padding-right: 16px;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              color: #444;
              padding-left:15px;
              span{
                display:inline-block;
                width:15px;
                margin-right:10px;
                text-align:right;
                color:#999;
                font-style: italic;
              }
            }
            li:hover{
              background:#f4f5f6;
            }
            li:nth-child(1) {
              span{
                color:#f85959;
              }
            }
            li:nth-child(2) {
              span{
                color:#ff7800;
              }
            }
            li:nth-child(3) {
              span{
                color:#ffba00;
              }
            }
          }
        }
        .hot_news{
          width: 347px;
          margin-top:30px;
          border-top: 2px solid #ed4040;
          background-color: #f4f5f6;
          margin-bottom: 16px;
          padding: 15px 0px 20px;
          .new_head{
            color: #222;
            padding: 0;
            margin-bottom: 15px;
            font-size: 18px;
            font-weight: 700;
          }
          .hot_news_list{
            height: 335px;
            overflow: hidden;
            ul{
              li{
                display:flex;
                align-items: center;
                padding: 8px 0;
                border-bottom: 1px solid #e8e8e8;
                img{
                  padding-left:20px;
                  width:60px;
                  height:60px;
                  margin-right: 12px;
                }
                p{
                  padding-right:20px;
                  width:270px;
                  overflow: hidden;
                  height:40px;
                  text-overflow: ellipsis;
                  font-size:14px;
                }
              }
            }
          }
        }
        .hot_video{
          width: 347px;
          margin-top:30px;
          border-top: 2px solid #ed4040;
          background-color: #f4f5f6;
          margin-bottom: 16px;
          padding: 15px 0px 20px;
          .video_head{
            color: #222;
            padding: 0;
            margin-bottom: 15px;
            font-size: 18px;
            font-weight: 700;
          }
          .hot_video_list{
            // height: 470px;
            // overflow: hidden;
            ul{
              li{
                display:flex;
                align-items: center;
                padding: 8px 0;
                border-bottom: 1px solid #e8e8e8;
                justify-content: space-between;
                .vide_message{
                  padding-left:20px;
                  width:150px;
                  .title_video{
                    font-size: 14px;
                    line-height: 20px;
                    max-height: 40px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                  }
                  .video_count{
                    overflow: hidden;
                    text-overflow: ellipsis;
                    font-size: 11px;
                  }
                }
                .video_url{
                  padding-right:20px;
                  position: relative;
                  img{
                    width:118px;
                    height:68px;
                  }
                  span{
                    position: absolute;
                    display:inline-block;
                    top:26px;
                    left:37px;
                    padding: 0 6px;
                    border-radius: 10px;
                    background: #000;
                    background: rgba(0,0,0,.7);
                    color: #fff;
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