

let {fetchRepoList} = require('./request')
const Inquirer = require('inquirer')

class Creator{
    constructor(projectName,targetDir){  //new的时候会跳用构造函数
        this.name = projectName;
        this.target = targetDir
    }
    async fetchRepo(){
        //失败重新拉取
       let repos = await fetchRepoList()
       console.log(repos)
       if(!repos) return
       repos = repos.map(item=>item.name)
      let {repo} =  await Inquirer.prompt({
            name:'repo',
            type:'list',
            choices:repos,
            message:'please choose a tempalte to create project'
       })
       console.log(repo)
    }
    async fetchTag(){

    }
    async downLoad(){

    }
    async create(){ 
        //真实开始创建了
        // 采用远程拉取的方式 github
        // 1)先去拉取当前组织下的模版
        let repo = await this.fetchRepo()
        // 2） 再通过模版找到版本号
        let tag = await this.fetchTag(repo)
        // 3）下载
        let downUrl = await this.downLoad(repo,tag)
        // 4)编译模版

     


    }
}

module.exports = Creator