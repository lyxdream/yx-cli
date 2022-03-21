
const ora = require('ora')
async function sleep(n){
    return new Promise((resolve,reject)=>{
        setTimeout(resolve,n)
    })
}

//等待的loading
async function wrapLoading(fn,message){
    const spinner = ora(message);
    spinner.start();//开启加载
    try{
        let repos = await fn();
        spinner.succeed();
        return repos;
    }catch(e){
        spinner.fail('request failed ,refetch...')
        await sleep(1000);
        return wrapLoading(fn,message)
    }
}

module.exports = {
    wrapLoading
}