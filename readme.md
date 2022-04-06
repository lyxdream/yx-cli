
# 前端脚手架命令行工具

通过 http git clone web-template 的方式，自动在当前目录生成脚手架文件。

## 安装

```bash
npm i yx-cli -g
```
## 使用

在当前目录下，新增项目目录， project-name 为项目名，除了项目名称还会提示输入 kubesphere 项目名称（kubesphere 中的工程名称）然后会 git clone web-template 的代码，默认会执行 npm i 拉取依赖，

```bash
yx init project-name
cd  project-name
npm install
npm start
```






