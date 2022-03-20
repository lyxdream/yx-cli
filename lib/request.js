//通过axios来拉取结果

const axios = require('axios');
axios.interceptors.response.use(res=>res.data)
async function fetchRepoList(){
    //可以通过配置文件拉取不同的仓库
    return axios.get('https://api.github.com/orgs/zhu-cli/repos')
}
module.exports = {
    fetchRepoList
}