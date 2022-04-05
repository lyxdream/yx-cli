# 手撸一个自己的前端脚手架

## 脚手架

- 需求背景：

目前已有 vue-cli 、 create-react-app 、 dva-cli 等非常优秀的脚手架，但是未必符合我们实际应用，很多时候我们开发时需要新建项目，把已有的项目代码复制一遍，保留基础能力，这个过程繁琐又耗时间，我们可以自己定制化模板，实现一个脚手架提升自己的开发效率。

- 脚手架的作用

  - 减少重复性的工作，不需要复制其他项目再删除无关代码，或者从零创建一个项目和文件。
  - 可以根据交互动态生成项目结构和配置文件。
  - 规范公司代码规范

## 需要的第三方包

- commander ：参数解析 --help 其实就借助了他~
- inquirer ：交互式命令行工具，有他就可以实现命令行的选择功能
- download-git-repo ：在 git 中下载模板
- chalk ：粉笔帮我们在控制台中画出各种各样的颜色
- metalsmith ：读取所有文件,实现模板渲染
- consolidate ：统一模板引擎

## 实现的功能及其效果如下：

根据模板初始化项目 yx-cli create project-name

初始化配置文件 yx-cli config set repo repo-name

## 1. 搭建环境

1. 创建一个空的目录(yx-cli),使用 npm init 初始化

```bash
npm init -y # 初始化package.json
npm install eslint husky --save-dev # eslint是负责代码校验工作,husky提供了git钩子功能
npx eslint --init # 初始化eslint配置文件

```

2.  目录结构

```
├── bin
│   └── yx  // 全局命令执行的根文件
├── package.json
├── lib
│   ├── main.js // 入口文件
│   ├── create.js // 创建命令
│   ├── Creator   // Creator类
│   ├── request.js // 存放请求
│   ├── config   // 
│   └── ui   // 
├── utils
│   ├── constants.js // 常量
│   └── index   // 公用方法

```

3. yx 命令

node.js 内置了对命令行操作的支持，package.json 中的 bin 字段可以定义命令名和关联的执行文件。

设置在命令行执行 yx-cli 或者 yx 时调用 bin 目录下的 yx 文件(配置 packge.json 中的 bin 字段)

```json
{
  "name": "yx",
  "version": "1.0.0",
  "description": "脚手架",
  "main": "index.js",
  "bin": {
    "yx": "./bin/yx",
    "yx-cli": "./bin/yx"
  },
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "yx",
  "license": "ISC",
  "dependencies": {
    "axios": "^0.26.1",
    "chalk": "^4.1.2",
    "commander": "^9.1.0",
    "download-git-repo": "^3.0.2",
    "fs-extra": "^10.0.1",
    "inquirer": "^8.2.1",
    "ora": "^5.4.1"
  },
  "devDependencies": {
    "eslint": "^8.11.0"
  }
}
```

yx 文件中使用 main 作为入口文件，并且以 node 环境执行此文件(创建可执行的脚本)

```bash
 #! /user/bin/env node
 require('../lib/main.js');
```

4. 链接包到全局下使用

```bash
# link相当于将本地模块连接到npm目录下，这个npm目录可以直接访问，所以就相当于当前包可以直接访问了
npm link
（npm link --force 强制覆盖之前的链接)
```

## 2.处理命令行(commander)

主要实现以下三个核心功能：

- 创建项目
- 更改配置文件
- ui 界面 @vue/ui

### 配置可执行的命令

1. 使用 commander

```bash
npm install commander
```

```js
// 入口文件main.js引入commander
const program = require("commander");
```

2. 解析用户执行命令时传入的参数

```js
program.parse(process.argv); // process.argv就是用户在命令行中传入的参数
```

- 执行命令 yx --help 可以看到已经有了提示

```
Usage: yx [options]

Options:
  -h, --help     display help for command
```

- 修改帮助信息的首行提示

```js
program.usage(`<command> [option]`);
```

执行 yx --help 可以看到

```
Usage: yx <command> [option]

Options:
 -h, --help                   display help for command
```

3. 动态获取版本号

> .version()方法可以设置版本，其默认选项为-V 和--version，设置了版本后，命令行会输出当前的版本号。

```js
program
  .version(`yx-cli@${require("../package.json").version}`)
  .usage(`<command> [option]`);
```

执行 yx --version 可以看到

```
 yx-cli@1.0.0
```

执行 yx --help 可以看到：

```
Usage: yx <command> [option]

Options:
  -V, --version                output the version number
  -h, --help                   display help for command
```

### 配置指令命令

```js
const program = require("commander");
const chalk = require("chalk");
const { version } = require("../utils/constants");
//   万一重名了，强制创建模式
// const cleanArgs = (cmd)=>{
//     const args = {};
//     cmd.options.forEach(o => {
//         const key = o.long.slice(2);
//         if(cmd[key]) args[key] = cmd[key]
//     });
//     return args
// }

program
  .command("create <app-name>")
  .description("create a new project")
  .option("-f,--force", "overwrite target directory if exists")
  .action((name, cmd) => {
    //调用create模块去创建
    require("./create")(name, cmd);
  });

//vue config --get a
//vue config --set a 1  //配置文件
program
  .command("config [value]")
  .description("inspect and modify the config")
  .option("-g,--get <path>", "get value from option")
  .option("-s,--set <path> <value>")
  .option("-d,--delete <path>", "delete option from config")
  .action((value, cmd) => {
    // console.log(value,cmd)
  });

program
  .command("ui")
  .description("start and open yx-cli ui")
  .option("-p,--port <port>", "port used for this ui server")
  .action((cmd) => {
    console.log(cmd);
  });

//设置版本 解析用户执行命令时传入的参数
program
  .version(`yx-cli@${version}`)
  .usage(`<command> [option]`)
  .parse(process.argv);
```

### 编写 help 命令
> 监听help命令打印帮助信息
1. 自定义监听事件

```js
program.on("--help", function () {
  console.log();
  console.log("Run yx-cli <command> --help show details");
  console.log();
});
```

执行 help 指令，发现提示信息并不是很明显，下面我们使用 chalk 解决这个问题

2. 修改提示的字体颜色

```bash
npm install chalk
```

```js
const chalk = require("chalk");
program.on("--help", function () {
  console.log();
  console.log(`Run ${chalk.cyan(`yx-cli <command> --help`)} show details`);
  console.log();
});
```

效果如下：



为了让代码看着简洁一点，做下优化 根据我们想要实现的功能配置执行动作，遍历产生对应的命令

```js
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
    examples: ["yx-cli create <template-name>"],
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

```
效果如下：


## create命令

create命令的主要作用就是去git仓库中拉取模板并下载对应的版本到本地，如果有模板则根据用户填写的信息渲染好模板，生成到当前运行命令的目录下~

创建create.js

```js


```


metalsmith (用于遍历文件夹，判断是否需要进行模板渲染)
consolidate (统一所有的模板引擎)

与用户进行命令行交互后，将对应的内容动态注入到模板中，这里常用的模板引擎有ejs、handlebars等，consolidate将这里用到的引擎进行了统一，可以自由选择
onsolidate主要是对不同模板引擎的选择分发，这里挑选了最核心的几个功能函数