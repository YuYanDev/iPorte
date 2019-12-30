import axios from 'axios'

axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded'
axios.defaults.timeout = 10000

class Ajax {
  constructor () {
    this.queue = {}
  }
  destroy (url) {
    delete this.queue[url]
  }
  interceptors (instance, url) {
    // ajax global exception process
    instance.interceptors.response.use(
      ({ data = {} }) => {
        // 提前销毁重复请求
        this.destroy(url)
        console.log(data.code)
        // 业务状态码及URL校验
        if (data.code !== 200) {
          if(data.code === 401){
            window.location.href = '/auth/login'
          }
          let msg = data.message
          if (!msg) {
            msg = '数据获取异常'
          }

        }
        return data
      },
      error => {
       console.error({
          content: '服务器异常'
        })
        return Promise.reject(error)
      }
    )
  }
  request (options) {
    let instance = axios.create()
    this.interceptors(instance)
    options = Object.assign({}, options)
    this.queue[options.url] = instance
    return instance(options)
  }
}

export default new Ajax()