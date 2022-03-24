

let { fetchRepoList, fetchBranchList } = require("./utils/request")
const { wrapLoading, loadRemote } = require('./utils/index')
const Inquirer = require('inquirer')
const downLoadGitRepo = require('download-git-repo')   //不支持promise
const util = require('util')
const path = require('path')
class Creator {
    constructor(projectName, targetDir) {  //new的时候会跳用构造函数
        this.name = projectName;
        this.target = targetDir
        //此时这个方法就是一个promise
        this.downLoadRepo = util.promisify(downLoadGitRepo)
    }
    // 先去拉取当前组织下的模版
    async fetchRepo() {
        //失败重新拉取
        let repos = await wrapLoading(fetchRepoList, 'waiting fetch template')
        if (!repos) return
        repos = repos.map(item => item.name)
        let { repo } = await Inquirer.prompt({
            name: 'repo',
            type: 'list',
            choices: repos,
            message: 'please choose a tempalte to create project'
        })
        return repo
    }

    // 再通过模版找到版本号
    async fetchTag(repo) {
        let branchs = await wrapLoading(fetchBranchList, 'waiting fetch tag', repo)
        if (!branchs) return
        branchs = branchs.map(item => item.name)
        let { branch } = await Inquirer.prompt({
            name: 'branch',
            type: 'list',
            choices: branchs,
            message: 'please choose a tag to create project'
        })
        return branch
    }
    // 下载
    async downLoad(repo, branch) {
        //(1)需要拼接出一个下载路径来
        //lyxdream/vue3-template#vue3-simple-template
        let requestUrl = `direct:https://github.com/lyxdream/${repo}${branch ? '#' + branch : ''}`
        // const requestUrl = `direct:https://github.com/lyxdream/vue3-template#vue3-simple-template`
        //(2)把资源下载到某个路径上（后续可以增加缓存功能,原则上吓到系统目录中，稍后再使用ejs handlerbar去渲染模板，最后生成结果，再写入）
        try {
            // await this.downLoadRepo(requestUrl, path.resolve(process.cwd(), `${this.name}`))
            await loadRemote(requestUrl, path.resolve(process.cwd(), `${this.name}`))
            return branch
        } catch (e) {
            console.log(e)
        }
    }
    async create() {
        //真实开始创建了
        // 采用远程拉取的方式 github
        // 1)先去拉取当前组织下的模版
        let repo = await this.fetchRepo()
        // console.log(repo,'--repo')
        // 2） 再通过模版找到版本号或者分支
        let branch = await this.fetchTag(repo)
        // console.log(repo,branch)
        // 3）下载
        let downUrl = await this.downLoad(repo, branch)
        // 4)编译模版
    }
}

module.exports = Creator