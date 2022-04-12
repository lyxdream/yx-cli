# 前端脚手架命令行工具 lyx-web-cli贡献指南


## 开发设置

```bash
git clone https://github.com/lyxdream/yx-cli

npm install

npm link

lyx-web-cli create project-name

```

## 实现核心功能如下：

根据模板初始化项目 lyx-web-cli create project-name

初始化配置文件 lyx-web-cli config set repo template-url



## 目录结构

```
├── bin
│   └── yx  // 全局命令执行的根文件
├── package.json
├── lib
│   ├── main.js // 入口文件
│   ├── create.js // create命令
│   ├── Creator   // Creator类
│   ├── request.js // 存放请求
│   ├── config   // 存放配置
│   └── ui   // ui界面
├── utils
│   ├── constants.js // 常量
│   └── index   // 公用方法

```











