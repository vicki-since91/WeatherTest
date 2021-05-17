const cypress = require('cypress')
const yargs = require('yargs')
const { merge } = require('mochawesome-merge')
const marge = require('mochawesome-report-generator')
const rm = require('rimraf')
const cypressConfig = require('./cypress.json')
const ls = require('ls')

const argv = yargs.options({
    'browser': {
        alias: 'b',
        describe: 'choose browser that you wanna run tests on',
        default: 'chrome',
        choices: ['chrome', 'firefox']
    },
    'spec': {
        alias: 's',
        describe: 'run test with specific spec file',
        default: 'cypress/integration/*.spec.js'
    }
}).help()
  .argv

const reportDir = cypressConfig.reporterOptions.reportDir
const reportFiles = `${reportDir}/*.json`
const reportHtml = `${reportDir}/*.html` 
// list all of existing report files
ls(reportFiles, { recurse: true }, file => console.log(`removing ${file.full}`))

// delete all existing report files
rm(reportFiles, (error) => {
    if (error) {
        console.error(`Error while removing existing report files: ${error}`)
        process.exit(1)
    }
    console.log('Removing all existing report files successfully!')
})

rm(reportHtml, (error) => {
    if (error) {
        console.error(`Error while removing existing report files: ${error}`)
        process.exit(1)
    }
    console.log('Removing all html report files successfully!')
})

cypress.run({
    browser: argv.browser,
    spec: argv.spec
}).then((_results) => {
    merge({
        files: ["cypress/report/mochawesome-report/*.json"],
    }).then((report) => {
        marge.create(report, {reportDir}).then(() => {
            console.log('Test Exited Successfully')
            process.exit(0)
        })
    })
}).catch((error) => {
    console.error('errors: ', error)
    process.exit(1)
})