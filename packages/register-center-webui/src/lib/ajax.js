import axios from "axios";

axios.defaults.headers["Content-Type"] = "application/json";
axios.defaults.timeout = 5000;

class Ajax {
  constructor() {
    this.queue = {};
  }
  destroy(url) {
    delete this.queue[url];
  }
  interceptors(instance, url) {
    // ajax global exception process
    instance.interceptors.response.use(
      ({ data = {} }) => {
        // 提前销毁重复请求
        this.destroy(url);
        // 业务状态码及URL校验
        if (data.code !== 200) {
          let msg = data.message;
          if (!msg) {
            msg = "数据获取异常";
          }
        }
        return data;
      },
      error => {
        if (error.toString().indexOf("401") !== -1) {
          console.log("no login");
          window.location.href = "/auth/login";
        }
        console.error({
          content: "服务器异常"
        });
        return Promise.reject(error);
      }
    );
  }
  request(options) {
    let instance = axios.create();
    this.interceptors(instance);
    options = Object.assign({}, options);
    this.queue[options.url] = instance;
    return instance(options);
  }
}

export default new Ajax();
