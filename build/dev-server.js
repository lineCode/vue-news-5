require('./check-versions')()

var config = require('../config')
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV)
}

var opn = require('opn')
var path = require('path')
var express = require('express')
var webpack = require('webpack')
var proxyMiddleware = require('http-proxy-middleware')
var webpackConfig = (process.env.NODE_ENV === 'testing' || process.env.NODE_ENV === 'production')
  ? require('./webpack.prod.conf')
  : require('./webpack.dev.conf')

  var axios = require('axios')

// default port where dev server listens for incoming traffic
var port = process.env.PORT || config.dev.port
// automatically open browser, if not set will be false
var autoOpenBrowser = !!config.dev.autoOpenBrowser
// Define HTTP proxies to your custom API backend
// https://github.com/chimurai/http-proxy-middleware
var proxyTable = config.dev.proxyTable

var app = express()
var compiler = webpack(webpackConfig)

var devMiddleware = require('webpack-dev-middleware')(compiler, {
  publicPath: webpackConfig.output.publicPath,
  quiet: true
})

var apiRouters = express.Router()
apiRouters.get('/getDiscList', function(req, res) {
  var url = 'https://www.toutiao.com/stream/widget/local_weather/data/'
  axios.get(url, {
    headers: {
      referer: 'https://www.toutiao.com/',
      host: 'www.toutiao.com'
    },
    params: req.query
  }).then((response) => {
    res.json(response.data)
  }).catch((e) => {
    console.log(e)
  })
})
apiRouters.get('/getNews', function(req, res) {
  var url = 'https://www.toutiao.com/api/pc/feed/'
  axios.get(url, {
    headers: {
      referer: 'https://www.toutiao.com/',
      host: 'www.toutiao.com'
    },
    params: req.query
  }).then((response) => {
    res.json(response.data)
  }).catch((e) => {
    console.log(e)
  })
})
apiRouters.get('/getVideo', function(req, res) {
  var url = 'http://www.365yg.com/api/pc/feed/'
  axios.get(url, {
    headers: {
      referer: 'http://www.365yg.com/',
      host: 'www.365yg.com'
    },
    params: req.query
  }).then((response) => {
    res.json(response.data)
  }).catch((e) => {
    console.log(e)
  })
})

apiRouters.get('/getHotWord', function(req, res) {
  var url = 'https://www.toutiao.com/hot_words/'
  axios.get(url, {
    headers: {
      referer: 'https://www.toutiao.com/ch/news_entertainment/',
      host: 'www.toutiao.com'
    },
    params: req.query
  }).then((response) => {
    res.json(response.data)
  }).catch((e) => {
    console.log(e)
  })
})

apiRouters.get('/getSearch', function(req, res) {
  var url = 'https://www.toutiao.com/search/sug/'
  axios.get(url, {
    headers: {
      referer: 'https://www.toutiao.com/ch/news_hot/',
      host: 'www.toutiao.com'
    },
    params: req.query
  }).then((response) => {
    res.json(response.data)
  }).catch((e) => {
    console.log(e)
  })
})

apiRouters.get('/getRealtimeNews', function(req, res) {
  var url = 'http://www.toutiao.com/api/pc/realtime_news/'
  axios.get(url, {
    headers: {
      referer: 'http://www.toutiao.com/',
      host: 'www.toutiao.com'
    },
    params: req.query
  }).then((response) => {
    res.json(response.data)
  }).catch((e) => {
    console.log(e)
  })
})

apiRouters.get('/getHotVideo', function(req, res) {
  var url = 'http://www.toutiao.com/api/pc/hot_video/'
  axios.get(url, {
    headers: {
      referer: 'http://www.toutiao.com/',
      host: 'www.toutiao.com'
    },
    params: req.query
  }).then((response) => {
    res.json(response.data)
  }).catch((e) => {
    console.log(e)
  })
})

apiRouters.get('/getHotPhoto', function(req, res) {
  var url = 'http://www.toutiao.com/api/pc/hot_gallery/'
  axios.get(url, {
    headers: {
      referer: 'http://www.toutiao.com/',
      host: 'www.toutiao.com'
    },
    params: req.query
  }).then((response) => {
    res.json(response.data)
  }).catch((e) => {
    console.log(e)
  })
})

apiRouters.get('/getMaxBehot', function(req, res) {
  var url = 'http://www.toutiao.com/api/pc/feed/'
  axios.get(url, {
    headers: {
      referer: 'http://www.toutiao.com/',
      host: 'www.toutiao.com'
    },
    params: req.query
  }).then((response) => {
    res.json(response.data)
  }).catch((e) => {
    console.log(e)
  })
})

app.use('/api', apiRouters)

var hotMiddleware = require('webpack-hot-middleware')(compiler, {
  log: false,
  heartbeat: 2000
})
// force page reload when html-webpack-plugin template changes
compiler.plugin('compilation', function (compilation) {
  compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
    hotMiddleware.publish({ action: 'reload' })
    cb()
  })
})

// proxy api requests
Object.keys(proxyTable).forEach(function (context) {
  var options = proxyTable[context]
  if (typeof options === 'string') {
    options = { target: options }
  }
  app.use(proxyMiddleware(options.filter || context, options))
})

// handle fallback for HTML5 history API
app.use(require('connect-history-api-fallback')())

// serve webpack bundle output
app.use(devMiddleware)

// enable hot-reload and state-preserving
// compilation error display
app.use(hotMiddleware)

// serve pure static assets
var staticPath = path.posix.join(config.dev.assetsPublicPath, config.dev.assetsSubDirectory)
app.use(staticPath, express.static('./static'))

var uri = 'http://localhost:' + port

var _resolve
var readyPromise = new Promise(resolve => {
  _resolve = resolve
})

console.log('> Starting dev server...')
devMiddleware.waitUntilValid(() => {
  console.log('> Listening at ' + uri + '\n')
  // when env is testing, don't need open it
  if (autoOpenBrowser && process.env.NODE_ENV !== 'testing') {
    opn(uri)
  }
  _resolve()
})

var server = app.listen(port)

module.exports = {
  ready: readyPromise,
  close: () => {
    server.close()
  }
}
