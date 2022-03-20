
## 搭建环境

### 初始化配置
1. 新建文件夹yx-cli

```bash
npm init -y # 初始化package.json
```
2. 创建文件夹

```
├── bin
│   └── yx  // 全局命令执行的根文件
├── package.json
├── src
│   ├── main.js // 入口文件
│   └── utils   // 存放工具方法
│── .huskyrc    // git hook
│── .eslintrc.json // 代码规范校验
```

3. 链接全局包

- 设置在命令下执行yx-cli时调用bin目录下的yx文件(配置packge.json 中的bin字段)

```bash
  "bin": "./bin/yx",
#   或：
  "bin": {
    "yx":"./bin/yx",
    "yx-cli":"./bin/yx"
  }
```
- yx文件中使用main作为入口文件，并且以node环境执行此文件(创建可执行的脚本)
```bash
 #! /user/bin/env node
```
- 链接包到全局下使用

```bash
npm link 
（npm link --force 强制覆盖之前的链接)
```


1）配置可执行命令 commander
const  program = require('commander')

- 解析用户执行命令时传入的参数

```
program.parse(process.argv)
```

- 通过这两个选项可以修改帮助信息的首行提示，name属性也可以从参数中推导出来。例如：

```bash
program
.usage(`<command> [option]`)
```
- 版本号

```bash
program
.version(`yx-cli@${require('../package.json').version}`)
.usage(`<command> [option]`)
```

- 核心功能
  1. 创建项目
  2. 更改配置文件
  3. ui界面 @vue/ui

  万一重名了，强制创建模式

  



2）命令行交互的功能 inquirer
3) 将模版下载下来  download-git-repo
4）根据用户的选择动态的生成功能  metalsmith




