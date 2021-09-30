import { FireFly, FireFlyListenerWebsocket, FireFlyData, FireFlyDataCustom, FireFlyHeader, FireFlyTopicBroadcast } from "./firefly";

const TIMEOUT = 15 * 1000;

const dataValues = (data: FireFlyData[]) => data.map(d => d.value);
const dataValuesCustom = (data: FireFlyDataCustom[]) => data.map(d => d.value)

async function main() {
  const firefly1 = new FireFly(5000);
  const firefly2 = new FireFly(5001);
  const ws1 = new FireFlyListenerWebsocket(5000);
  const ws2 = new FireFlyListenerWebsocket(5001);
  await ws1.ready();
  await ws2.ready();

  // Send public broadcast
  await publicBroadcast(firefly1, firefly2, ws2);
  await publicTopicBroadcast(firefly1, firefly2, ws2);
  
  ws1.close();
  ws2.close();
}

async function publicTopicBroadcast(firefly1: FireFly, firefly2: FireFly, ws2: FireFlyListenerWebsocket) {
  // Create data to send
  // const sendData: FireFlyDataCustom[] = [
  //   {id: "widget_id_123", name: "superwidget"},
  //   {id: "widget_id_456", name: "basicwidget"}
  // ]

  const sendDataAny: FireFlyDataCustom[] =
  [
    {value: {id: "topic_A",name: "Some topic...A"}},
    {value: {id: "topic_B",name: "Some topic...B"}}
  ];

  // Initialize header with tag and topic
  const header: FireFlyHeader = {
    tag: "new_widget_created",
    topics: ["widget_id_12345"]
  }

  const broadcastMessage: FireFlyTopicBroadcast = {
    header: header,
    data: sendDataAny
  }

  console.log(`Broadcasting data values from firefly1: ${dataValuesCustom(sendDataAny)}`);
  await firefly1.sendBroadcastTopic(broadcastMessage);

  const receivedMessage = await ws2.firstMessageOfType('message_confirmed', TIMEOUT);
  if (receivedMessage === undefined) {
    throw new Error('No message received');
  }

  const receivedData = await firefly2.retrieveData(receivedMessage.message.data);
  console.log(`Received data value on firefly2: ${dataValues(receivedData)}`);
}

async function publicBroadcast(firefly1: FireFly, firefly2: FireFly, ws2: FireFlyListenerWebsocket) {
  const sendData: FireFlyData[] = [
    { value: 'Hello' },
    { value: 'World' },
  ];
  
  // Note: this is currently performing broadcast (not private transfer)
  // TODO: use private transfer
  console.log(`Broadcasting data values from firefly1: ${dataValues(sendData)}`);
  await firefly1.sendBroadcast(sendData);
  
  const receivedMessage = await ws2.firstMessageOfType('message_confirmed', TIMEOUT);
  if (receivedMessage === undefined) {
    throw new Error('No message received');
  }
  
  const receivedData = await firefly2.retrieveData(receivedMessage.message.data);
  console.log(`Received data value on firefly2: ${dataValues(receivedData)}`);
}

main().catch(err => {
  console.error(`Failed to run: ${err}`);
});
