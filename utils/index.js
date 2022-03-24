const ora = require("ora");
const download = require("download-git-repo");
async function sleep(n) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, n);
  });
}

//等待的loading
async function wrapLoading(fn, message, ...args) {
  const spinner = ora(message);
  spinner.start(); //开启加载
  try {
    let repos = await fn(...args);
    spinner.succeed();
    return repos;
  } catch (e) {
    spinner.fail("request failed ,refetch...");
    await sleep(1000);
    return wrapLoading(fn, message, ...args);
  }
}

async function loadRemote(repository, target, options = { clone: true }) {
  return new Promise((resolve, reject) => {
    download(repository, target, options, (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
}

module.exports = {
  wrapLoading,
  loadRemote,
};
