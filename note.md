

# 手撸一个自己的前端脚手架

## 脚手架

- 需求背景：

 目前已有vue-cli 、 create-react-app 、 dva-cli 等非常优秀的脚手架，但是未必符合我们实际应用，很多时候我们开发时需要新建项目，把已有的项目代码复制一遍，保留基础能力，这个过程繁琐又耗时间，我们可以自己定制化模板，实现一个脚手架提升自己的开发效率。

- 脚手架的作用

  - 减少重复性的工作，不需要复制其他项目再删除无关代码，或者从零创建一个项目和文件。
  - 可以根据交互动态生成项目结构和配置文件。
  - 规范公司代码规范

## 需要的第三方包

  - commander ：参数解析 --help其实就借助了他~
  - inquirer ：交互式命令行工具，有他就可以实现命令行的选择功能
  - download-git-repo ：在git中下载模板
  - chalk ：粉笔帮我们在控制台中画出各种各样的颜色
  - metalsmith ：读取所有文件,实现模板渲染
  - consolidate ：统一模板引擎

## 实现的功能及其效果如下：

  根据模板初始化项目 yx-cli create project-name

  初始化配置文件 yx-cli config set repo repo-name

## 1. 搭建环境

1. 创建一个空的目录(yx-cli),使用npm init 初始化

```bash
npm init -y # 初始化package.json
npm install eslint husky --save-dev # eslint是负责代码校验工作,husky提供了git钩子功能
npx eslint --init # 初始化eslint配置文件

```

 2. 目录结构

```
├── bin
│   └── yx  // 全局命令执行的根文件
├── package.json
├── lib
│   ├── main.js // 入口文件
│   ├── create.js // 创建命令
│   ├── Creator   // Creator类
│   ├── request.js // 存放请求
│   └── utils   // 存放工具方法
```

3. yx命令

node.js 内置了对命令行操作的支持，package.json 中的 bin 字段可以定义命令名和关联的执行文件。

设置在命令行执行yx-cli或者yx时调用bin目录下的yx文件(配置packge.json 中的bin字段)

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
yx文件中使用main作为入口文件，并且以node环境执行此文件(创建可执行的脚本)

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

## 处理命令行(commander)

主要实现以下三个核心功能：
  -  创建项目
  -  更改配置文件
  -  ui界面 @vue/ui

### 配置可执行的命令
1. 使用commander

```bash
npm install commander
```
2. 入口文件main.js引入commander

```js
const  program = require('commander')
```
3. 解析用户执行命令时传入的参数

```js
program.parse(process.argv) // process.argv就是用户在命令行中传入的参数
```

- 执行命令yx --help 可以看到已经有了提示

```
Usage: yx [options]

Options: 
  -h, --help     display help for command     
```
- 修改帮助信息的首行提示

 ```js
  program.usage(`<command> [option]`)
 ```
 执行yx --help可以看到

 ```
Usage: yx <command> [option]

Options: 
  -h, --help                   display help for command    
 ```

4. 版本号

> .version()方法可以设置版本，其默认选项为-V和--version，设置了版本后，命令行会输出当前的版本号。

```js
program
.version(`yx-cli@${require('../package.json').version}`)
.usage(`<command> [option]`)
```
执行yx --version可以看到

```
 yx-cli@1.0.0
```

执行yx --help 可以看到：

```
Usage: yx <command> [option]

Options:
  -V, --version                output the version number
  -h, --help                   display help for command
```

### 创建项目














