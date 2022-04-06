const mqtt = require('mqtt')
const connectUrl = `wss://chat.brime.tv/ws`
const channel = '1FfzbPSZsWkSfH8cGKbZ' // XID of the channel you wish to join
const chatLang = 'en-us' // Language of the chat.
// Brime Chat features native chat translation. 
// So you'll need to connect to the room in the language you want to receive messages in. 
// You can obtain the language code from here: https://brime.readme.io/reference/update-user-chat-language
// Make sure to use the lowercase version of the language code.


// Test Creds -- this is a working example. 
// For a real user, you'll need to obtain a JWT token for that user and replace the password.

const username = 'uPt0y2GrNzZsA1zFHuX9' // XID of the user connecting to the chat service
const password = 'uPt0y2GrNzZsA1zFHuX9' // JWT token of the user

this.client = mqtt.connect(connectUrl, {
    username,
    password,
    keepalive: 30,
    clean: true,
    reconnectPeriod: 4000,
    rejectUnauthorized: false
})

this.client.on('connect', () => {
    // Listen for chat messages on a specific language
    this.client.subscribe(`channel/chat/receive/${channel}/${chatLang}`, err => {
        if (err) console.error(err)
    })

    // Listen for all chat messages (all langs)
    // this.client.subscribe(`channel/chat/receive/${channel}`, err => {
    //  if (err) console.error(err)
    // })

    // Listen for platform channel messages
    this.client.subscribe(`channel/${channel}`, err => {
        if (err) console.error(err)
    })

    // Listen for platform messages directed to the user
    this.client.subscribe(`private/${channel}`, err => {
        if (err) console.error(err)
    })
})
// Catch Errors
this.client.on('error', error => {
    console.error(error)
})
// Process Messages
this.client.on('message', (topic, message) => {
    message = message.toString()
    console.log('NEW MESSAGE RECEIVED: Content Below')
    console.log(topic)
    console.log(JSON.parse(message))
})


// Send a sample message

// Construct the message
const msg = {
    content: 'Hello World', // <-- Required
    reply_target: false // <-- Not required, default is false. 
    //     This is set when you wish to reply to a specific message. 
    //     Set the message.xid value here of the message you wish to reply to.
}

// Publish the message
this.client.publish(`channel/chat/send/${channel}`, Buffer.from(JSON.stringify(msg)))
//
// this.client.publish('topic', 'message')
// Topic: should be set to channel/chat/send/{channel}
// Message: should be a JSON string of the message object or a buffer of the stringified message object