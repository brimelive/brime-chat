const mqtt = require('mqtt')
const connectUrl = `wss://chat.brime.tv/ws`
const channel = {
    xid: '1FfzbPSZsWkSfH8cGKbZ',
    slug: 'geekendev'
}
const chatLang = 'en-us'

// Test Creds
const username = 'uPt0y2GrNzZsA1zFHuX9'
const password = 'uPt0y2GrNzZsA1zFHuX9'

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
    this.client.subscribe(`channel/chat/receive/${channel.xid}/${chatLang}`, err => {
        if (err) console.error(err)
    })
    
    // Listen for all chat messages (all langs)
    // this.client.subscribe(`channel/chat/receive/${channel.xid}`, err => {
    //  if (err) console.error(err)
    // })

    // Listen for platform channel messages
    this.client.subscribe(`channel/${channel.xid}`, err => {
        if (err) console.error(err)
    })

    // Listen for platform messages directed to the user
    this.client.subscribe(`private/${channel.xid}`, err => {
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
this.client.publish(`channel/chat/send/${channel.xid}`, Buffer.from(JSON.stringify(msg)))
//
// this.client.publish('topic', 'message')
// Topic: should be set to channel/chat/send/channel.xid
// Message: should be a JSON string of the message object or a buffer of the stringified message object