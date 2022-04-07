/*
  通过axios来拉取结果 https://api.github.com

  拉取当前用户下的所有仓库  https://api.github.com/users/用户名/repos
  根据仓库拉去当前仓库的tag  https://api.github.com/repos/lyxdream/${repo}/tags
  根据仓库拉去当前仓库的分支 https://api.github.com/repos/lyxdream/${repo}/branches

   (https://api.github.com/repos/lyxdream/${repo}/branches //根据仓库拉去当前仓库的分支)
*/
const axios = require('axios');
const config = require('./config');
const { BASE_REQUEST_URL } = require('../utils/constants');
const { repoInfo } = require('../utils/index');

const repoConfig = config('get', 'repo');

const { userName, repoName, templateUrl } = repoInfo(repoConfig);

axios.interceptors.response.use((res) => res.data);
async function fetchRepoList() {
  // 可以通过配置文件拉取不同的仓库
  return axios.get(`${BASE_REQUEST_URL}/users/${userName}/repos`); // 个人所有repo
}

async function fetchBranchList(repo) {
  // 可以通过配置文件拉取不同的分支
  return axios.get(`${BASE_REQUEST_URL}/repos/${userName}/${repo}/branches`);
}

module.exports = {
  fetchRepoList,
  fetchBranchList,
  repoName,
  templateUrl,
};
