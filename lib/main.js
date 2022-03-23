// 1）配置可执行的命令
const  program = require('commander');
const chalk = require('chalk')

// - 核心功能  1. 创建项目  2. 更改配置文件  3. ui界面 @vue/ui
//   万一重名了，强制创建模式
const cleanArgs = (cmd)=>{
    const args = {};
    cmd.options.forEach(o => {
        const key = o.long.slice(2);
        if(cmd[key]) args[key] = cmd[key]
    });
    return args
}

program
.command('create <app-name>')
.description('create a new project')
.option('-f,--force','overwrite target directory if exists')
.action((name,cmd)=>{
    // console.log(name,cmd)
    //调用create模块去创建
    require('./create')(name,cmd)
})


//vue config --get a 
//vue config --set a 1  //配置文件
program
.command('config [value]')
.description('inspect and modify the config')
.option('-g,--get <path>','get value from option')
.option('-s,--set <path> <value>')
.option('-d,--delete <path>','delete option from config')
.action((value,cmd)=>{
    // console.log(value,cmd)
})

program
.command('ui')
.description('start and open yx-cli ui')
.option('-p,--port <port>','port used for this ui server')
.action((cmd)=>{
    console.log(cmd)
})
// 通过这两个选项可以修改帮助信息的首行提示，name属性也可以从参h数中推导出来。例如：
//设置版本
program
.version(`yx-cli@${require('../package.json').version}`)
.usage(`<command> [option]`)

program.on('--help',function(){
    console.log();
    console.log(`Run ${chalk.cyan(`yx-cli <command> --help`)} show details`)
    console.log();
})

//解析用户执行命令时传入的参数
program.parse(process.argv)






// 2）命令行交互的功能 inquirer
// 3) 将模版下载下来  download-git-repo
// 4）根据用户的选择动态的生成功能  metalsmith