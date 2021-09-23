import { FireFly, FireFlyListener, FireFlyData } from "./firefly";
import util from 'util';
const TIMEOUT = 15 * 1000;
const dataValues = (data: FireFlyData[]) => data.map(d => d.value);

/**
 * Implementation TODOs:
 * 1. Broadcast [DONE]
 * 2. Send private message
 * 3. Send private blob
 * 4. Send broadcast blob
 */
async function main() {
  const firefly1 = new FireFly(5000);
  const firefly2 = new FireFly(5001);
  const ws1 = new FireFlyListener(5000);
  const ws2 = new FireFlyListener(5001);
  await ws1.ready();
  await ws2.ready();
  
  // Test simple hello world
  await broadcast_send(firefly1, firefly2, ws2, "hello");

  // Test multiple broadcast function
  // test_broadcast_send(firefly1, firefly2, ws2);

  // Test private message send

  ws1.close();
  ws2.close();
}

async function test_broadcast_send(firefly1: FireFly, firefly2: FireFly, ws2: FireFlyListener) {
  let total_time = 0;
  let total_elements = 0;
  for (let i = 0; i < 10; i++) {
    console.log(`-----------${i} TEST BROADCAST MESSAGE NEW ROUTE-----------`);
    total_time += await broadcast_send(firefly1, firefly2, ws2, i.toString());
    total_elements++;
  }
  console.log(`Average time to broadcast: ${total_time/total_elements}`);
}

/**
 * Function uses updated broadcast route: /namespaces/${this.ns}/messages/broadcast
 * @param f1 
 * @param f2 
 * @param ws2 
 * @param message 
 */
async function broadcast_send(f1: FireFly, f2: FireFly, ws2: FireFlyListener, message: String): Promise<number> {
  const sendData: FireFlyData[] = [
    {value: `A - ${message}`},
    {value: `B - ${message}`}
  ]

  console.log(`Broadcasting data values from firefly1: ${dataValues(sendData)}`);

  // Let firefly1 send broadcast
  await f1.sendBroadcast(sendData);

  const start = Date.now();
  const receivedMessage = await ws2.firstMessageOfType('message_confirmed', TIMEOUT);
  const stop = Date.now();
  const elapsedTime = (stop-start)/1000;
  console.log(`Elapsed time broadcast message to get received by ws2: ${elapsedTime} seconds`);
  console.log(`received message: ${util.inspect(receivedMessage, {depth: null})}`);
  if (receivedMessage === undefined) {
    throw new Error('No message received');
  }

  const receivedData = await f2.retrieveData(receivedMessage.message.data);
  console.log(`Received data value on firefly2: ${dataValues(receivedData)}`);

  return elapsedTime
}

/**
 * This function uses deprecated broadcast route
 * @param f1 
 * @param f2 
 * @param ws2 
 */
async function broadcast_send_deprecated(f1: FireFly, f2: FireFly, ws2: FireFlyListener) {
  const sendData: FireFlyData[] = [
    {value: '[DEPRECATED] deno cat m1'},
    {value: '[DEPRECATED] deno cat m2'}
  ]

  console.log(`Broadcasting data values from firefly1: ${dataValues(sendData)}`);

  await f1.sendBroadcastDeprecated(sendData);

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
