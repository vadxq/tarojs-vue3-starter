const path = require('path');
const argv = require('minimist')(process.argv.slice(2));
const fs = require('fs');
const shell = require('shelljs');
const appDirectory = fs.realpathSync(process.cwd());
const pjson = require('../package.json');

const logPath = path.resolve(appDirectory, './out.log');

const qr = require('qr-image');
const md5File = require('md5-file')
const axios = require('axios');

let resultMsg = 'fail'

const previewPath = path.resolve(appDirectory, './preview.jpg');

// buildTT 字节小程序
const buildTT = () => {
  shell.exec('yarn global add @tarojs/cli')
  shell.exec(`${argv.e === 'prod' ? 'yarn build:tt' : 'yarn test:tt'}`)
  shell.exec('yarn global add tt-ide-cli')
  shell.exec('ls dist/tt -la')
  shell.exec(`npx tma login-e ${argv.u} ${argv.p}`)
  shell.exec(`npx tma upload -v ${pjson.version} -c "${pjson.description}-${pjson.changelog}" ./dist/tt | cat > ${logPath}`)
}

// buildSwan 百度小程序
const buildSwan = () => {
  shell.exec('yarn global add swan-toolkit')
  shell.exec(`${argv.e === 'prod' ? 'yarn build:tt' : 'yarn test:tt'}`)
  shell.exec('yarn global add tt-ide-cli')
  shell.exec('ls dist/tt -la')
  shell.exec(`npx tma login-e ${argv.u} ${argv.p}`)
  shell.exec(`npx tma upload -v ${pjson.version} -c "${pjson.description}-${pjson.changelog}" ./dist/tt | cat > ${logPath}`)
}

// notice
const readFiles = function (filePath) {
  if (fs.existsSync(filePath)) { // 判断是否存在该文件
    try {
      let result = fs.readFileSync(logPath);
      return result.toString();
    } catch (e) {
      console.error(e);
      process.exit(1);
    }
  }
}

const sendQrCode = async () => {
  console.log(previewPath);
  try {
    fs.readFile(previewPath, async (err, data) => {
      if (err) {
        console.log(err);
      } else {
        console.log(data);
        const hash = await md5File.sync(previewPath)
        const imageBase64 = await Buffer.from(data, 'binary').toString('base64');
        console.log('imageBase64', imageBase64, imageBase64 == false);
        await axios({
          headers: { "Content-Type": 'application/json' },
          method: 'post',
          url: argv.r,
          data: {
            "msgtype": "text",
            "text": {
              "content": `版本：v${pjson.version}\r\n更新内容：${pjson.changelog}\r\n打包结果:${resultMsg.trim()}打开${argv.t === 'tt' ? '抖音' : '快手'}扫一扫：`
            }
          }
        });
        await axios({
          headers: { "Content-Type": 'application/json' },
          method: 'post',
          url: argv.r,
          data: {
            "msgtype": "image",
            "image": {
              "base64": imageBase64,
              "md5": hash
            }
          }
        });
      }
    })
  } catch (err) {
    console.log(err);
  }
}

const generatorQrImage = async () => {
  const res = await readFiles(logPath)
  console.log(res);
  const reg = /(http:\/\/|https:\/\/)((\w|=|\?|\.|\/|&|-)+)/g
  const url = reg.exec(res)[0]
  const result = res.split('[')[0]
  resultMsg = result.split('WAIT  Compiling...')[1]
  console.log(resultMsg, url);
  const data = qr.image(url)
  await data.pipe(fs.createWriteStream(previewPath));
  setTimeout(() => {
    sendQrCode();
  }, 1000);
}

(async () => {
  try {
    if (argv.t === 'tt') {
      await buildTT()
      await generatorQrImage()
    } else if (argv.t === 'weapp') {
    }
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})()
