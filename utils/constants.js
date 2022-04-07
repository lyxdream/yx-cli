/**
 *
这里我们将文件下载到当前用户下的.template文件中,
由于系统的不同目录获取方式不一样,process.platform 在windows下获取的是 win32 我这里是mac 所有获取的值是 darwin,在根据对应的环境变量获取到用户目录
'aix' 'darwin'  'freebsd' 'linux' 'openbsd' 'sunos' 'win32'
 */
const slash = require('slash');
const { name, version } = require('../package.json');

const DEFAULT_CONFIG = {
  repo: 'https://github.com/lyxdream/vue3-template',
};

const HOME = process.env[process.platform === 'darwin' ? 'HOME' : 'USERPROFILE'];
const downLoadDirectory = slash(`${HOME}\\.template`);// 存储模板的位置 下载前先找临时目录存放下载的文件
const CONFIG_FILE = slash(`${HOME}/.yxclirc`); // 配置文件的存储位置
const BASE_REQUEST_URL = 'https://api.github.com';
module.exports = {
  name,
  version,
  downLoadDirectory,
  CONFIG_FILE, // 配置文件的存储位置
  DEFAULT_CONFIG, // 默认配置
  BASE_REQUEST_URL, // 默认拉取远程api地址
};
