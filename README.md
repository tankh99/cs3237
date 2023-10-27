### Archived code
const connectionString = process.env.CONNECTION_STRING;
    const deviceId = process.env.DEVICE_ID;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const registry = Registry.fromConnectionString(connectionString);
    const client = Client.fromConnectionString(connectionString);
    client.open((err) => {
      if (err) {
        console.error('Could not connect: ' + err.message);
      } else {
        console.log('Client connected to IoT Hub.');

        client.on('message', (message) => {
          console.log('Received message from device: ' + message.getData());
        });
      }
    });

    client.send(deviceId, 'Hello from the server', (err) => {
      if (err) {
        console.error('Error sending message:', err.toString());
      } else {
        console.log('Message sent successfully.');
      }
    });
    res.json(this.appService.getHello());