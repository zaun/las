module.exports = {
  chainWebpack: config => {
    config.plugin('define').tap(args => {
      let v = JSON.stringify(require('./package.json'));
      args[0]['process.env']['PACKAGE'] = v;
      return args;
    })
  }
}