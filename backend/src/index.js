import 'dotenv/config'

import express from 'express'
import bodyParser from 'body-parser'
import { getStorageClient } from './storage.js'
import { listenForMintSuccess, prepareMint, updateSpace } from './api.js'
import cors from 'cors'

const app = express()

app.use(bodyParser.json({ limit: '50mb' }))
app.use(cors())

app.post('/prepare', async (req, res, err) => {
    try {
        const storageClient = await getStorageClient()
        const ipnsRecord = await prepareMint(storageClient, req.body)
        res.json({
            "ipns": ipnsRecord
        })
    } catch (e) {
        console.log(e)
        res.status(400).json({
            "message": e.toString()
        })
    }
})

app.post('/update/:id', async (req, res, err) => {
    try {
        const signatureData = req.body.signature
        const newSpaceData = req.body.spaceData
        const storageClient = await getStorageClient()
        await updateSpace(storageClient, signatureData, req.params.id, newSpaceData)

        res.json({ "message": "ok" })
    } catch (e) {
        console.log(e)
        res.status(400).json({
            "message": e.toString()
        })
    }
})
listenForMintSuccess()
app.listen(3000)