#!/usr/bin/env node
const path = require('path')
const download = require('download-git-repo')
const program = require('commander')
const inquirer = require('inquirer')
const chalk = require('chalk')
const ora = require('ora')
const rm = require('rimraf').sync
const exists = require('fs').existsSync
const logger = require('../lib/logger')

/**
 * Usage.
 */

 program
 .usage('<template-name> [project-name]')
 .option('-c, --clone', 'use git clone')
 .option('--offline', 'use cached template')

/**
* Help.
*/

program.on('--help', () => {
  console.log('  Examples:')
  console.log()
  console.log(chalk.gray('    # create a new project with an official template'))
  console.log('    $ sdy init wx my-project')
  console.log()
})

/**
 * Help.
 */

function help () {
  program.parse(process.argv)
  if (program.args.length < 1) return program.help()
}
help()

// 模板名字
/*template 模板名字*/ 
let template = program.args[0]
/*rawName 文件名字*/ 
const rawName = program.args[1]
const inPlace = !rawName || rawName === '.'
const name = inPlace ? path.relative('../', process.cwd()) : rawName
const to = path.resolve(rawName || '.')
const clone = program.clone || false

/**
 * Padding.
 */

console.log(template,rawName,inPlace,name,to)
process.on('exit', () => {
  console.log()
})



if (exists(to)) {
  inquirer.prompt([{
    type: 'confirm',
    message: inPlace
      ? 'Generate project in current directory?'
      : 'Target directory exists. Continue?',
    name: 'ok'
  }]).then(answers => {
    if (answers.ok) {
      run()
    }
  }).catch(logger.fatal)
} else {
  inquirer.prompt([{
    type: 'confirm',
    message:  'Generate project in current directory?',
    name: 'ok'
  }]).then(answers => {
    if (answers.ok) {
      run()
    }
  }).catch(logger.fatal)
}

function run () {
  const spinner = ora('downloading template')
  spinner.start()
  if (exists(to)) rm(to)
  const officialTemplate = 'Clbdgs/' + template
  download(officialTemplate, to, { clone }, err => {
    spinner.stop()
    if (err) logger.fatal('Failed to download repo ' + template + ': ' + err.message.trim())
    logger.success('Generated "%s".', name)
  })
  }