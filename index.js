const express = require("express")
const https = require("https")
const app = express()
const bodyParser = require("body-parser")

const baseUrl = `https://pokeapi.co/api/v2/pokemon`

let myCollection = {}

app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(bodyParser.json())

const portNumber = 4000
app.listen(portNumber, () => {
    console.log(`Listening on port ${portNumber}`)
})

app.get('/shinySprite', (req, res, next) => {
    const id = req.query.id
    if(!id){
        res.status(400).send({
            error: true,
            message: "ID not found"
        })
    }
    else{
        https.get(`${baseUrl}/${id}/`, (response) => {
            let buffer = []
            response.on('data', chunk => buffer.push(chunk))
            response.on('end', () => {
                let dataString = Buffer.concat(buffer).toString()
                let jsonData = JSON.parse(dataString)

                res.status(200).send({
                    sprite: jsonData.sprites.other.showdown.front_shiny
                })
            })
        }).on('error', (e) => { console.error(e)})
    }
})

app.post('/addPokemon', (req, res, next) => {
    const id = req.body.id
    if(!id){
        res.status(400).send({
            error: true,
            message: "ID not provided."
        })
    }
    else{
        https.get(`${baseUrl}/${id}/`, response => {
            let buffer = []
            response.on('data', chunk => buffer.push(chunk))
            response.on('end', () => {
                const data = JSON.parse(Buffer.concat(buffer).toString())
                const sprite = data.sprites.other.showdown.front_shiny
                myCollection[id] = sprite
                res.status(200).send({
                    message: `Pokemon sprite for ID ${id} added succesfully to the collection`,
                    collection: myCollection
                })
            })
        }).on('error', e => console.error(e))
    }
})