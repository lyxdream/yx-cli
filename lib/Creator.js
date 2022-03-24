const util = require("util");
const path = require("path");
const Inquirer = require("inquirer");
// const downLoadGitRepo = require("download-git-repo"); //不支持promise
let { fetchRepoList, fetchBranchList } = require("./request");
const { wrapLoading, loadRemote } = require("../utils/index");
class Creator {
  //new的时候会跳用构造函数
  constructor(projectName, targetDir) {
    this.name = projectName;
    this.target = targetDir;
    //此时这个方法就是一个promise
    // this.downLoadRepo = util.promisify(downLoadGitRepo);
  }
  // 先去拉取当前组织下的模版
  async fetchRepo() {
    //失败重新拉取
    let repos = await wrapLoading(fetchRepoList, "waiting fetch template");
    if (!repos) return;
    repos = repos.map((item) => item.name);
    let { repo } = await Inquirer.prompt({
      name: "repo",
      type: "list",
      choices: repos,
      message: "please choose a tempalte to create project",
    });
    return repo;
  }

  // 再通过模版找到版本号
  async fetchTag(repo) {
    let branchs = await wrapLoading(fetchBranchList, "waiting fetch tag", repo);
    if (!branchs) return;
    branchs = branchs.map((item) => item.name);
    let { branch } = await Inquirer.prompt({
      name: "branch",
      type: "list",
      choices: branchs,
      message: "please choose a tag to create project",
    });
    return branch;
  }
  /**
   * @description 下载
    (1)需要拼接出一个下载路径来
    (2)把资源下载到某个路径上（后续可以增加缓存功能,原则上吓到系统目录中，
       稍后再使用ejs handlerbar去渲染模板，最后生成结果，再写入）
   */
  async downLoad(repo, branch) {
    try {
      let requestUrl = `direct:https://github.com/lyxdream/${repo}${branch ? "#" + branch : "" }`;
      await loadRemote(requestUrl, path.resolve(process.cwd(), `${this.name}`));
      return branch;
    } catch (e) {
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
    let repo = await this.fetchRepo();
    let branch = await this.fetchTag(repo);
    let downUrl = await this.downLoad(repo, branch);
    //编译模版
  }
}

module.exports = Creator;
