/* eslint-disable no-empty-function */

const fs = require('fs-extra');
const chalk = require('chalk');
const { encode, decode } = require('ini');
const { CONFIG_FILE, DEFAULT_CONFIG } = require('../utils/constants');

function get(obj, k) {
  return (obj[k] || DEFAULT_CONFIG[k]);
}
function set(obj, k, v) {
  obj[k] = v;
  const allConfig = { ...DEFAULT_CONFIG, ...obj };
  fs.writeFileSync(CONFIG_FILE, encode(allConfig), 'utf8');
}
function remove(obj, k) {
  if (obj[k]) {
    delete obj[k];
    fs.writeFileSync(CONFIG_FILE, encode(obj), 'utf8');
  }
}
function getAll(obj) {
  const allConfig = { ...DEFAULT_CONFIG, ...obj };
  console.log(`${chalk.green(JSON.stringify(allConfig, null, 2))}`);
  return allConfig;
}
const actionTypes = {
  get,
  set,
  delete: remove,
  getAll,
};
module.exports = (action, k, v) => {
  // 专门管理.yxclirc文件(当前的用户目录下) yx-cli config set key value
  const hasConfigFile = fs.existsSync(CONFIG_FILE);
  const obj = {};
  if (hasConfigFile) { // 配置文件存在
    const content = fs.readFileSync(CONFIG_FILE, 'utf8');
    const configContent = decode(content); // 将文件解析成对象
    Object.assign(obj, configContent);
  }
  return actionTypes[action](obj, k, v);
};
