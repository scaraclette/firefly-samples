import { FireFly, FireFlyListener, FireFlyData } from "./firefly";
// const TIMEOUT = 15 * 1000;
const TIMEOUT = 15 * 10000;
const dataValues = (data: FireFlyData[]) => data.map(d => d.value);

async function main() {
  const firefly1 = new FireFly(5000);
  const firefly2 = new FireFly(5001);
  const ws1 = new FireFlyListener(5000);
  const ws2 = new FireFlyListener(5001);
  await ws1.ready();
  await ws2.ready();

  console.log("-----------DEPRECATED TEST BROADCAST MESSAGE-----------");
  console.log("note: deprecated broadcast route");
  await broadcast_send_deprecated(firefly1, firefly2, ws2);

  console.log("-----------TEST BROADCAST MESSAGE NEW ROUTE-----------");
  await broadcast_send(firefly1, firefly2, ws2);

  ws1.close();
  ws2.close();
}

async function broadcast_send(f1: FireFly, f2: FireFly, ws2: FireFlyListener) {
  const sendData: FireFlyData[] = [
    {value: 'Deno'},
    {value: 'Orange Cat Deno'}
  ]

  console.log(`Broadcasting data values from firefly1: ${dataValues(sendData)}`);

  // Let firefly1 send broadcast
  await f1.sendBroadcast(sendData);

  const receivedMessage = await ws2.firstMessageOfType('message_confirmed', TIMEOUT);
  console.log(`receivedMessage: ${JSON.stringify(receivedMessage, null, 2)}`);
  if (receivedMessage === undefined) {
    throw new Error('No message received');
  }

  const receivedData = await f2.retrieveData(receivedMessage.message.data);
  console.log(`Received data value on firefly2: ${dataValues(receivedData)}`);
}

async function broadcast_send_deprecated(f1: FireFly, f2: FireFly, ws2: FireFlyListener) {
  const sendData: FireFlyData[] = [
    {value: '[DEPRECATED] m1'},
    {value: '[DEPRECATED] m2'}
  ]

  console.log(`Broadcasting data values from firefly1: ${dataValues(sendData)}`);

  // Let firefly1 send broadcast
  await f1.sendBroadcastDeprecated(sendData);
  
  // TODO: what are different message types? We are currently using message confirmed
  const receivedMessage = await ws2.firstMessageOfType('message_confirmed', TIMEOUT);
  console.log(`receivedMessage: ${JSON.stringify(receivedMessage, null, 2)}`);
  if (receivedMessage === undefined) {
    throw new Error('No message received');
  }

  const receivedData = await f2.retrieveData(receivedMessage.message.data);
  console.log(`Received data value on firefly2: ${dataValues(receivedData)}`);
}

main().catch(err => {
  console.error(`Failed to run: ${err}`);
});
