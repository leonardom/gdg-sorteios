const express = require('express')
const app = express()
const fs = require('fs')
const parse = require('csv-parse')
const utf8 = require('to-utf-8')
const bodyParser = require('body-parser');

app.use(express.static('public'))
app.use(bodyParser.json());

let sorteios = []
let people = []

app.listen(3000, () => {
  console.log('Server is running at localhost:3000...')
  load()
})

app.get('/sortear', (req, res) => {
  let data = sortear()
  res.writeHeader(200 , {"Content-Type" : "application/json; charset=utf-8"})
  res.end(JSON.stringify(data), 'utf-8')
})

app.get('/participantes', (req, res) => {
  res.writeHeader(200 , {"Content-Type" : "application/json; charset=utf-8"})
  res.end(JSON.stringify(people), 'utf-8')  
})

app.get('/sorteios', (req, res) => {
  res.writeHeader(200 , {"Content-Type" : "application/json; charset=utf-8"})

  readSorteios( (err, data) => {
    if (err) {
      data = "[]"
    }

    res.end(data, 'utf-8')
  })
})

app.post('/salvar', (req, res) => {
  fs.writeFile(__dirname + '/sorteios.json', JSON.stringify(req.body), (err) => {
    if (err) {
      throw err
    }

    sorteios = req.body

    res.writeHeader(200 , {"Content-Type" : "application/json; charset=utf-8"})
    res.end(JSON.stringify({ok: true}))
  })
})

function readSorteios(cb) {
    fs.readFile(__dirname + "/sorteios.json", 'utf8', (err, data) => {
    if (err) {
      data = "[]"
    }

    //console.log('Data: ', data)

    sorteios = JSON.parse(data)

    if (cb) cb(null, data)
  });
}

function sortear() {
  
  let n = -1

  //while (people[n] === undefined) {
  while (jahSorteado(people[n])) {
    n = Math.floor(Math.random() * people.length)
  }
  return people[n]
}

function load() {
  fs.createReadStream(__dirname + '/camplol.csv', {encoding: 'utf8'})
    .pipe(utf8())
    .pipe(parse({delimiter: ';'}))
    .on('data', function(csvrow) {
      people.push({
        senha: Number(csvrow[0]), 
        nome: csvrow[1],
        email: csvrow[2]
      })
    })
    .on('end',function() {
    })
}

function jahSorteado(people) {
  if (people === undefined) return true
  
  if (sorteios === null || sorteios.length === 0) {
    return false
  }

  sorteios.forEach((item) => {
    if (item.sorteado.senha == people.senha) {
      return true
    }
  })

  return false
}
