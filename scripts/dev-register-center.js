require('@babel/register') ({
    presets: [ '@babel/preset-env' ]
})

module.exports = require('../packages/register-center')