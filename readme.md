
# 前端脚手架命令行工具


实现的功能如下：

根据模板初始化项目 yx-cli create project-name

初始化配置文件 yx-cli config set repo template-url


## 安装

```bash
npm i yx-cli -g
```

## 使用

### create 新建项目

在当前目录下，新增项目目录， project-name 为项目名

```
用法：yx create  <project-name>

选项：
  -f, --force                     是否强制覆盖已有的目标目录
  -h, --help                      输出使用帮助信息
```

### config 配置文件

如果配置自定义的模板，修改.yxclirc的配置文件

```
yx config --set repo <模板仓库地址>

```

如：yx config --set repo https://github.com/lyxdream/vue3-template

config命令其他选项：

```
使用 yx config [value]

选项：
  -g,--get    <key>              获取key对应的值
  -s,--set    <key>  <val>       .yxclirc设置key=val
  -d,--delete <key>              .yxclirc删除key
  -gAll,--getAll                 获取.yxclirc对应的所有的值
```

### help

yx --help

```
Usage: yx <command> [option]

Options:
  -V, --version                output the version number
  -h, --help                   display help for command 

Commands:
  create [options] <app-name>  create a new project
  config [options] [value]     inspect and modify the config
  ui [options]                 start and open yx-cli ui
  help [command]               display help for command

Run yx-cli <command> --help show details

```

## todo list
- ui命令









