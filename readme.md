
# 前端脚手架命令行工具

## 安装

```bash
npm i yx-cli -g
```

## 使用


```bash
yx create project-name
cd  project-name
npm install
npm start
```

## 介绍

**主要实现了create和config两个主要命令**

- create：通过命令行提示用户选择仓库和分支，拉取github的模版，通过 http git clone template-name 的方式，下载到系统目录下，用户可以根据提示给项目命名、设置描述，自动在当前目录生成脚手架文件.


在当前目录下，新增项目目录， project-name 为项目名

```
用法：yx create  <project-name>

选项：
  -f, --force                     覆写目标目录可能存在的配置
  -h, --help                      输出使用帮助信息
```

- config 在用户的 home 目录下有一个名为 .yxclirc 的 文件,config命令通过控制这个文件的读写，删除得操作，控制拉取的模版仓库名称和仓库类型


```
使用 yx config [value]

如：yx config --set a 1
输入之后会在home 目录下有一个名为 .yxclirc 多一个a=1

选项：
  -g,--get    <key>              获取key对应的值
  -s,--set    <key>  <val>       .yxclirc设置key=val
  -d,--delete <key>              .yxclirc删除key
  -gAll,--getAll                 获取.yxclirc对应的所有的值
```













