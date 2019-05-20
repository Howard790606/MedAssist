const express = require('express')
const mongoose = require('mongoose')

const Message = require('./models/message')

// Create server to serve index.html
const app = express()
const http = require('http').Server(app)
const port = process.env.PORT || 3000

// Routing
app.use(express.static('public'))

// Socket.io serverSocket
const serverSocket = require('socket.io')(http)

// Start server listening process.
http.listen(port, () => {
    console.log(`Server listening on port ${port}.`)
})

// Connect to mongo
mongoose.connect('mongodb+srv://howard7966:8365589kk@cluster0-sut4m.mongodb.net/test?retryWrites=true', {
    useNewUrlParser: true
})
db = mongoose.connection

db.on('error', error => {
    console.log(error)
})
db.once('open', () => {
    console.log('MongoDB connected!')
    serverSocket.on('connection', socket => {
        const sendStatus = s => {
            socket.emit('status', s)
        }

        // First time running
        Message.find()
            .limit(100)
            .sort({ _id: 1 })
            .exec((err, res) => {
                if (err) throw err

                socket.emit('init', res)
            })

        socket.on('input', data => {
            let name = data.name
            let body = data.body

            // Check for name and message
            if (name == '' || body == '') {
                // Send error status
                sendStatus('Please enter a name and message')
            } else {
                // Insert message
                const message = new Message({ name, body })
                message.save(err => {
                    if (err) console.error(err)

                    serverSocket.emit('output', [data])

                    // Saved!
                    sendStatus({
                        message: 'Message sent',
                        clear: true
                    })
                })
            }
        })

        socket.on('clear', () => {
            // Remove all chats from collection
            Message.deleteMany({}, () => {
                // Emit cleared
                socket.broadcast.emit('cleared')
            })
        })
    })
})
