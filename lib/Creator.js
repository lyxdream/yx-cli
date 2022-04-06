/* eslint-disable import/order */
/* eslint-disable consistent-return */
/* eslint-disable class-methods-use-this */
// const downLoadGitRepo = require("download-git-repo"); //不支持promise
const path = require('path');
const fs = require('fs-extra');
let ncp = require('ncp');
const chalk = require('chalk');
const symbols = require('log-symbols');
const inquirer = require('inquirer');
const { promisify } = require('util');
let { render } = require('consolidate').ejs;// 渲染模版

const { wrapLoading, loadRemote } = require('../utils/index');
const { downLoadDirectory, BASE_TEMPLATE_URL } = require('../utils/constants');

const metalsmith = require('metalsmith'); // 遍历文件夹，找需不需要渲染
const { fetchRepoList, fetchBranchList, userName } = require('./request');

render = promisify(render); // 包装渲染方法
ncp = promisify(ncp);

class Creator {
  // new的时候会跳用构造函数
  constructor(projectName, targetDir) {
    this.name = projectName;
    this.target = targetDir;
    // 此时这个方法就是一个promise
    // this.downLoadRepo = util.promisify(downLoadGitRepo);
  }

  // 先去拉取当前组织下的模版
  async fetchRepo() {
    // 失败重新拉取
    let repos = await wrapLoading(fetchRepoList, 'waiting fetch template');
    if (!repos) return;
    repos = repos.map((item) => item.name);
    const { repo } = await inquirer.prompt({
      name: 'repo',
      type: 'list',
      choices: repos,
      message: 'please choose a tempalte to create project',
    });
    // eslint-disable-next-line consistent-return
    return repo;
  }

  // 再通过模版找到版本号
  async fetchBranch(repo) {
    let branchs = await wrapLoading(fetchBranchList, 'waiting fetch branch', repo);
    if (!branchs) return;
    branchs = branchs.map((item) => item.name);
    const { branch } = await inquirer.prompt({
      name: 'branch',
      type: 'list',
      choices: branchs,
      message: 'please choose a tag to create project',
    });
    return branch;
  }

  /**
   * @description 下载
    (1)需要拼接出一个下载路径来
    (2)把资源下载到某个路径上（后续可以增加缓存功能,原则上吓到系统目录中，
       稍后再使用ejs handlerbar去渲染模板，最后生成结果，再写入）
   */
  async downLoad1(repo, branch) {
    try {
      const requestUrl = `direct:${BASE_TEMPLATE_URL}/${userName}/${repo}${branch ? `#${branch}` : ''}`;
      const dest = path.resolve(process.cwd(), `${repo}`); // 将模板下载到对应的目录中
      await loadRemote(requestUrl, dest);
      return dest;
    } catch (e) {
      console.log(e);
    }
  }

  async downLoad(repo, branch) {
    try {
      // window 的是 \  mac是/ 都转换成/
      const requestUrl = `direct:${BASE_TEMPLATE_URL}/${userName}/${repo}${branch ? `#${branch}` : ''}`;
      const dest = path.resolve(downLoadDirectory, `${repo}`); // 将模板下载到对应的目录中
      await loadRemote(requestUrl, dest);
      return dest; // 返回下载目录
    } catch (e) {
      console.log(e);
    }
  }

  // 有的时候用户可以定制下载模板中的内容，拿package.json文件为例，用户可以根据提示给项目命名、
  async renderTemplate(target) {
    try {
      // 没有ask文件说明不需要编译
    // /Users/yinxia/Desktop/架构学习/yx-cli/vue3-template
      if (!fs.existsSync(path.join(target, 'ask.json'))) {
      // 将下载的文件拷贝到当前执行命令的目录下
        await ncp(target, path.join(path.resolve(), this.name));
      } else {
      // 复杂的模板,把git上的项目下载下来，如果有ask文件就是一个复杂的模板，我们需要用户选择，选择后编译模板
        await new Promise((resovle, reject) => {
          metalsmith(__dirname) // 如果你传入路径，默认遍历当前路径下的src文件夹
            .source(target) // 遍历下载的目录
            .destination(path.join(path.resolve(), this.name)) // 输出渲染后的结果
            .use(async (files, metal, done) => {
            // 弹框询问用户
              const result = await inquirer.prompt(require(path.join(target, 'ask.json')));
              const data = metal.metadata();
              Object.assign(data, result); // 将询问的结果放到metadata中保证在下一个中间件中可以获取到
              delete files['ask.json'];
              done();
            })
            .use((files, metal, done) => {
              Reflect.ownKeys(files).forEach(async (file) => {
                let content = files[file].contents.toString(); // 获取文件中的内容
                if (file.includes('.js') || file.includes('.json')) { // 如果是js或者json才有可能是模板
                  if (content.includes('<%')) { // 文件中用<% 我才需要编译
                    content = await render(content, metal.metadata()); // 用数据渲染模板
                    files[file].contents = Buffer.from(content); // 渲染好的结果替换即可
                  }
                }
              });
              done();
            })
            .build((err) => {
              if (err) {
                reject();
              } else {
                resovle();
              }
            });
        });
      }
      console.log(symbols.success, chalk.green('模版下载成功'));
      console.log(`🎉  Successfully created project ${chalk.yellow(this.name)}.`);
      console.log(
        `👉  Get started with the following commands:\n\n${chalk.cyan(`cd ${this.name}\n`)}${chalk.cyan('npm install\n')}${chalk.cyan('npm run serve')}`,
      );
      fs.remove(target);// 删除系统目录下的模版文件夹
    } catch (e) {
      console.log(symbols.fail, chalk.green('模版下载失败'));
      console.log(e);
    }
  }

  /**
   * @description 创建项目 采用远程拉取的方式 github
    1)先去拉取当前组织下的模版
    2）再通过模版找到版本号或者分支
    3）下载
    4)编译模版
   */
  async create() {
    const repo = await this.fetchRepo();
    const branch = await this.fetchBranch(repo);
    // // 把模板放到一个临时目录里存好，以备后期使用
    const temTarget = await wrapLoading(
      this.downLoad.bind(this),
      'download template...',
      repo,
      branch,
    );
    // console.log(temTarget);// 下载的目录
    // const temTarget = '/Users/yinxia/Desktop/架构学习/yx-cli/hello3';
    // const temTarget = path.resolve(process.cwd(), 'hello1');
    console.log(temTarget, '---');
    await this.renderTemplate(temTarget); // 编译模版
  }
}

module.exports = Creator;
