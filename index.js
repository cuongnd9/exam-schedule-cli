#!/usr/bin/env node

const axios = require('axios')
const ora = require('ora')
const chalk = require('chalk')
const Table = require('cli-table')

const args = process.argv
const log = console.log

const studentId = args[2]
const url = `https://uesc.foxfizz.com/api/v1/daa/uesc.json?student_id=${studentId}`

const handleData = data =>
  data.map(item => 
    [item.date, item.day, item.shift, item.name, item.id_number, item.room]  
  )

const createTable = data => {
  const table = new Table({
    head: ['Date', 'Day', 'Shift', 'Name', 'Number ID', 'Room'], 
    colWidths: [15, 6, 8, 50, 12, 12]
  })

  const tableData = handleData(data)
  for (const tinyData of tableData) {
    table.push(tinyData)
  }

  log(table.toString())
}

const app = async () => {
  const spinner = ora('Loading your exam schedule...').start()
  try {
    const { data } = await axios.get(url)

    const name = '🎓 ' + data.name
    const id = '🆔 ' + studentId

    const message = `
      ${chalk.yellowBright(name)}
      ${chalk.greenBright(id)}
    `

    spinner.succeed('Done')
    log(message)
    createTable(data.es)
  } catch(err) {
    spinner.fail('Coundn\'t load your exam schedule.\nPlease try again!')
  }
}

app()