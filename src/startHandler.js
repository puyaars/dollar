const Composer = require('telegraf/composer')
const queue = require('./queue')
const config = require('./config')
const hears = require('./hear')
const helpers = require('./helpers')
const User = require('./model/User'),
{
    enter
} = require('telegraf/stage')

const handler = new Composer()

handler.use(Composer.drop(helpers.isGroup))
handler.use(async (ctx,next) => {
    if (ctx.user.stage == 'justJoined') {
        await ctx.reply(config.welcomeMessage)
        next()
    } else if (ctx.user.stage != 'completed') {
        next()
    } else {
        console.log('send main menu')
        hears.sendMainMenu(ctx)
    }
})

handler.hears(/^\/start [a-zA-Z1-90]+$/, async (ctx, next) => {
    var referer = await User.findOne({referId: ctx.match[0].split(' ')[1]})
    if(referer != undefined)
        ctx.user.refers.referer = referer.userId
    next()
})

handler.hears('/start',enter('singnupScene'))

module.exports = handler