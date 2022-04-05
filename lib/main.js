// 1）配置可执行的命令
const program = require('commander');
const chalk = require('chalk');
// const path = require('path');
const { version } = require('../utils/constants');

program
  .command('create <app-name>')
  .description('create a new project')
  .option('-f,--force', 'overwrite target directory if exists')
  .action((name, cmd) => {
    // 调用create模块去创建
    require('./create')(name, cmd);
  });

// vue config --get a
// vue config --set a 1  //配置文件
program
  .command('config [value]')
  .description('inspect and modify the config')
  .option('-g,--get <path>', 'get value from option')
  .option('-s,--set <path> <value>')
  .option('-d,--delete <path>', 'delete option from config')
  .action((value, cmd) => {
    console.log(value, cmd);
  });

program
  .command('ui')
  .description('start and open yx-cli ui')
  .option('-p,--port <port>', 'port used for this ui server')
  .action((cmd) => {
    console.log(cmd);
  });

program.on('--help', () => {
  console.log();
  console.log(`Run ${chalk.cyan('yx-cli <command> --help')} show details`);
  console.log();
});

// 设置版本 修改帮助信息的首行提示 解析用户执行命令时传入的参数
program
  .version(`yx-cli@${version}`)
  .usage('<command> [option]')
  .parse(process.argv);
