const path = require('path');
const fs = require('fs-extra');
const inquirer = require('inquirer');
const Creator = require('./Creator');

// eslint-disable-next-line func-names
module.exports = async function (projectName, options) {
  // 创建项目
  const cwd = process.cwd(); // 获取当前命令执行时的工作目录
  const targetDir = path.join(cwd, projectName); // 目标目录
  // 判断当前目录是否存在
  if (fs.existsSync(targetDir)) {
    if (options.force) {
      // 是否是强制创建，删除已有的
      await fs.remove(targetDir);
    } else {
      // 提示用户是否确定要覆盖  配置询问的方式
      const { action } = await inquirer.prompt([
        {
          name: 'action', // 选择的结果
          type: 'list', // 展示方式
          message: 'Target directory already exists Pick an action',
          choices: [
            { name: 'Overwrite', value: 'overwrite' },
            { name: 'Cancel', value: false },
          ],
        },
      ]);
      if (!action) {
        return;
      } if (action === 'overwrite') {
        console.log('\r\nRemoveing....');
        await fs.remove(targetDir);
      }
    }
  }
  // 创建项目
  const creator = new Creator(projectName, targetDir);
  creator.create();
};
