import dotenv from 'dotenv'
import  { ServiceBusClient, delay,  } from  '@azure/service-bus'

dotenv.config()

const connectionString = process.env.PRIMARY_CONNECTION_STRING
const topicName = process.env.TOPIC_NAME
const subscriptionName = process.env.SUBSCRIPTION_NAME

function setPaymentAmount(receivedMessage){
    const paymentAmount =  receivedMessage.body.area * 150
    console.log('Payment amount set to: ', paymentAmount)
}

async function handleMessage(receivedMessage){
    console.log('Received message: ', receivedMessage.body)
    setPaymentAmount(receivedMessage)
}

async function handleMessageError(error){
    console.error('Error receiving message: ', error)
}

async function getMessageFromTopic(topic, subscription){
    // connects to the service bus using the connection string
    const serviceBusClient = new ServiceBusClient(connectionString)
    // receives messages from the topic or queue
    const receiver = serviceBusClient.createReceiver(topic, subscription)

   // subscribe and specify the handlers for messages and errors
   receiver.subscribe({
    processMessage: handleMessage,
    processError: handleMessageError
   })

    // wait for a while to receive messages
    await delay (5000)

    await receiver.close()
    await serviceBusClient.close()
}

try {
    await getMessageFromTopic(topicName, subscriptionName)
} catch (error) {
    console.error('Error occurred while receiving messages: ', error)
}
