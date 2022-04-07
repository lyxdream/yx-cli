const ora = require('ora');
const download = require('download-git-repo');

async function sleep(n) {
  return new Promise((resolve) => {
    setTimeout(resolve, n);
  });
}

// 等待的loading
async function wrapLoading(fn, message, ...args) {
  const spinner = ora(message);
  spinner.start(); // 开启加载
  try {
    const repos = await fn(...args);
    spinner.succeed();
    return repos;
  } catch (e) {
    spinner.fail('request failed ,refetch...');
    await sleep(1000);
    return wrapLoading(fn, message, ...args);
  }
}

async function loadRemote(repository, target, options = { clone: true }) {
  return new Promise((resolve, reject) => {
    // eslint-disable-next-line consistent-return
    download(repository, target, options, (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
}

// 获取仓库名称和github用户名
function repoInfo(url) {
  const regUrl = /^https(.*)\.com(\/.+)(\/.+)/g;
  const list = regUrl.exec(url);
  return {
    templateUrl: url,
    userName: list[2].slice(1),
    repoName: list[3].slice(1),
  };
}

module.exports = {
  wrapLoading,
  loadRemote,
  repoInfo,
};
