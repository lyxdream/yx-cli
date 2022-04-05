const path = require('path');
const fse = require('fs-extra');
const Inquirer = require('inquirer');
const Creator = require('./Creator');

// eslint-disable-next-line func-names
module.exports = async function (projectName, options) {
  // 创建项目
  const cwd = process.cwd(); // 获取当前命令执行时的工作目录
  const targetDir = path.join(cwd, projectName); // 目标目录
  // 判断当前目录是否存在
  if (fse.existsSync(targetDir)) {
    if (options.force) {
      // 是否是强制创建，删除已有的
      await fse.remove(targetDir);
    } else {
      // 提示用户是否确定要覆盖  配置询问的方式
      const { action } = await Inquirer.prompt([
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
        await fse.remove(targetDir);
      }
    }
  }
  // 创建项目
  const creator = new Creator(projectName, targetDir);
  creator.create();
};
