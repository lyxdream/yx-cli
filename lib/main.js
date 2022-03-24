// 1）配置可执行的命令
const program = require("commander");
const chalk = require("chalk");
const path = require("path");
const { version } = require("../utils/constants");

const actionsMap = {
  create: {
    // 创建模板
    command: "create <app-name>",
    alias: "cr",
    description: "create a new project",
    examples: [
      "yx-cli create <template-name>",
      "yx-cli create <template-name> --force", //万一重名了，强制创建模式
    ],
  },
  config: {
    // 配置配置文件
    command: "config [value]",
    alias: "c",
    description: "inspect and modify the config",
    examples: [
      "yx-cli config get <k>",
      "yx-cli config set <k> <v>",
      "yx-cli config delete <k>",
    ],
  },
  ui: {
    //ui界面 如：@vue/ui
    command: "ui",
    alias: "u",
    description: "start and open yx-cli ui",
    examples: ["yx-cli --port <port>"],
  },
  "*": {
    command: "*",
    alias: "",
    description: "command not found",
    examples: [],
  },
};
// 循环创建命令
Object.keys(actionsMap).forEach((action) => {
  program
    .command(actionsMap[action].command) // 命令的名称
    .alias(actionsMap[action].alias) // 命令的别名
    .description(actionsMap[action].description) // 命令的描述
    .action(() => {
      // 动作
      if (action === "*") {
        // 如果动作没匹配到说明输入有误
        console.log(acitonMap[action].description);
      } else {
        // 引用对应的动作文件 将参数传入
        require(path.resolve(__dirname, action))(...process.argv.slice(3));
      }
    });
});

program.on("--help", () => {
  console.log("Examples:");
  Object.keys(actionsMap).forEach((action) => {
    (actionsMap[action].examples || []).forEach((example) => {
      console.log(`   ${chalk.cyan(`${example}`)}`);
    });
  });
});

//设置版本 修改帮助信息的首行提示 解析用户执行命令时传入的参数
program
  .version(`yx-cli@${version}`)
  .usage(`<command> [option]`)
  .parse(process.argv);
