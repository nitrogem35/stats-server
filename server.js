//nitrojs go brr
const fetch = require('node-fetch');
const parser = require('node-html-parser');
const WebSocket = require('ws')
const wss = new WebSocket.Server({ port: 8080 })

var clients = [];


wss.on('connection', ws => {
  clients.push(ws)
  ws.on('message', message => {
    fetchData(message, ws)
  })
  console.log('Cilent Connected ', clients.length)
  ws.onclose = function(){
    clients.splice(clients.indexOf(ws), 1)
  }
})


function fetchData(stat,client){
  let lbArray;
  let lbType;
  fetch(`https://stats.takepoint.io/stat/${stat}`)
  .then(res => res.text())
  .then(text => {
    lbArray = [];
    let html = parser.parse(text);
    html.querySelector("tbody").childNodes.forEach(childNode => {
      if(childNode.text.length > 10) {
        lbArray.push(childNode.text.replace(/\n/g, "").replace(/\t/g, " ").replace(/\s+/g,' ').trim().split(" "));
      }
    });
    lbType = html.querySelector("h2").text

    let lbAsString = ''
    lbArray.forEach(player => {
      player.forEach(item => {
        lbAsString += item + " "
      })
    })
    client.send(lbAsString)
    client.send(lbType)
  })

 }
