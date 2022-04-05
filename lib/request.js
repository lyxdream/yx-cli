/*
  通过axios来拉取结果 https://api.github.com
  拉取当前用户下的所有仓库  https://api.github.com/repos/用户名/仓库名
  根据仓库拉去当前仓库的tag  https://api.github.com/repos/lyxdream/${repo}/tags
  根据仓库拉去当前仓库的分支 https://api.github.com/repos/lyxdream/${repo}/branches
*/

const axios = require('axios');

axios.interceptors.response.use((res) => res.data);
async function fetchRepoList() {
  // 可以通过配置文件拉取不同的仓库
  return axios.get('https://api.github.com/users/lyxdream/repos'); // 个人所有repo
}
async function fetchBranchList(repo) {
  // 可以通过配置文件拉取不同的分支
  return axios.get(`https://api.github.com/repos/lyxdream/${repo}/branches`);
}

module.exports = {
  fetchRepoList,
  fetchBranchList,
};
