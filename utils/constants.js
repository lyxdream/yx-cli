/**
 *
这里我们将文件下载到当前用户下的.template文件中,
由于系统的不同目录获取方式不一样,process.platform 在windows下获取的是 win32 我这里是mac 所有获取的值是 darwin,在根据对应的环境变量获取到用户目录
'aix'
'darwin'
'freebsd'
'linux'
'openbsd'
'sunos'
'win32'
 */
const slash = require('slash');
const { name, version } = require('../package.json');

// 存储模板的位置 下载前先找临时目录存放下载的文件
const downLoadDirectory = slash(`${process.env[process.platform === 'darwin'
  ? 'HOME' : 'USERPROFILE']}\\.template`);

module.exports = {
  name,
  version,
  downLoadDirectory,
};
