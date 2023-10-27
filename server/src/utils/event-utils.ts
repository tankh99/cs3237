import {
  Connection,
  ReceiverEvents,
  isAmqpError,
  parseConnectionString,
} from 'rhea-promise';
import crypto from 'crypto';
import { Buffer } from 'buffer';
import { EventHubConsumerClient } from '@azure/event-hubs';

// Copyright (c) Microsoft Corporation.
// Licensed under the MIT Licence.

export class EventHubReader {
  iotHubConnectionString: string;
  consumerGroup: string;
  receiveHandlers: any;
  consumerClient: any;

  constructor(iotHubConnectionString, consumerGroup) {
    this.iotHubConnectionString = iotHubConnectionString;
    this.consumerGroup = consumerGroup;
  }

  async startReadMessage(startReadMessageCallback) {
    try {
      const eventHubConnectionString =
        await convertIotHubToEventHubsConnectionString(
          this.iotHubConnectionString,
        );
      const consumerClient = new EventHubConsumerClient(
        this.consumerGroup,
        eventHubConnectionString,
      );
      console.log(
        'Successfully created the EventHubConsumerClient from IoT Hub event hub-compatible connection string.',
      );

      const partitionIds = await consumerClient.getPartitionIds();
      console.log('The partition ids are: ', partitionIds);

      consumerClient.subscribe({
        processEvents: async (events) => {
          for (let i = 0; i < events.length; ++i) {
            startReadMessageCallback(
              events[i].body,
              events[i].enqueuedTimeUtc,
              events[i].systemProperties['iothub-connection-device-id'],
            );
          }
        },
        processError: async (err) => {
          console.error(err.message || err);
        },
      });
    } catch (ex) {
      console.error(ex.message || ex);
    }
  }

  // Close connection to Event Hub.
  async stopReadMessage() {
    const disposeHandlers = [];
    this.receiveHandlers.forEach((receiveHandler) => {
      disposeHandlers.push(receiveHandler.stop());
    });
    await Promise.all(disposeHandlers);

    this.consumerClient.close();
  }
}

/*
    This sample was taken from https://github.com/Azure/azure-sdk-for-js/blob/master/sdk/eventhub/event-hubs/samples/javascript/iothubConnectionString.js
  */
// This code is modified from https://docs.microsoft.com/en-us/azure/iot-hub/iot-hub-devguide-security#security-tokens.
export function generateSasToken(
  resourceUri,
  signingKey,
  policyName,
  expiresInMins,
) {
  resourceUri = encodeURIComponent(resourceUri);

  const expiresInSeconds = Math.ceil(Date.now() / 1000 + expiresInMins * 60);
  const toSign = resourceUri + '\n' + expiresInSeconds;

  // Use the crypto module to create the hmac.
  const hmac = crypto.createHmac('sha256', Buffer.from(signingKey, 'base64'));
  hmac.update(toSign);
  const base64UriEncoded = encodeURIComponent(hmac.digest('base64'));

  // Construct authorization string.
  return `SharedAccessSignature sr=${resourceUri}&sig=${base64UriEncoded}&se=${expiresInSeconds}&skn=${policyName}`;
}

/**
 * Converts an IotHub Connection string into an Event Hubs-compatible connection string.
 * @param {string} connectionString An IotHub connection string in the format:
 * `"HostName=<your-iot-hub>.azure-devices.net;SharedAccessKeyName=<KeyName>;SharedAccessKey=<Key>"`
 * @returns {Promise<string>} An Event Hubs-compatible connection string in the format:
 * `"Endpoint=sb://<hostname>;EntityPath=<your-iot-hub>;SharedAccessKeyName=<KeyName>;SharedAccessKey=<Key>"`
 */
export async function convertIotHubToEventHubsConnectionString(
  connectionString,
): Promise<string> {
  const { HostName, SharedAccessKeyName, SharedAccessKey } =
    parseConnectionString<any>(connectionString);

  // Verify that the required info is in the connection string.
  if (!HostName || !SharedAccessKey || !SharedAccessKeyName) {
    throw new Error(`Invalid IotHub connection string.`);
  }

  //Extract the IotHub name from the hostname.
  const [iotHubName] = HostName.split('.');

  if (!iotHubName) {
    throw new Error(
      `Unable to extract the IotHub name from the connection string.`,
    );
  }

  // Generate a token to authenticate to the service.
  // The code for generateSasToken can be found at https://docs.microsoft.com/en-us/azure/iot-hub/iot-hub-devguide-security#security-tokens
  const token = this.generateSasToken(
    `${HostName}/messages/events`,
    SharedAccessKey,
    SharedAccessKeyName,
    5, // token expires in 5 minutes
  );
  const connectionOptions: any = {
    transport: 'tls',
    host: HostName,
    hostname: HostName,
    username: `${SharedAccessKeyName}@sas.root.${iotHubName}`,
    port: 5671,
    reconnect: false,
    password: token,
  };

  const connection = new Connection(connectionOptions);
  await connection.open();

  // Create the receiver that will trigger a redirect error.
  const receiver = await connection.createReceiver({
    source: { address: `amqps://${HostName}/messages/events/$management` },
  });

  return new Promise((resolve, reject) => {
    receiver.on(ReceiverEvents.receiverError, (context: any) => {
      const error = context.receiver && context.receiver.error;
      if (isAmqpError(error) && error.condition === 'amqp:link:redirect') {
        const hostname = error.info && error.info.hostname;
        const parsedAddress = error.info.address.match(
          /5671\/(.*)\/\$management/i,
        );

        if (!hostname) {
          reject(error);
        } else if (
          parsedAddress == undefined ||
          (parsedAddress && parsedAddress[1] == undefined)
        ) {
          const msg =
            `Cannot parse the EventHub name from the given address: ${error.info.address} in the error: ` +
            `${error.stack}\n${JSON.stringify(
              error.info,
            )}.\nThe parsed result is: ${JSON.stringify(parsedAddress)}.`;
          reject(Error(msg));
        } else {
          const entityPath = parsedAddress[1];
          resolve(
            `Endpoint=sb://${hostname}/;EntityPath=${entityPath};SharedAccessKeyName=${SharedAccessKeyName};SharedAccessKey=${SharedAccessKey}`,
          );
        }
      } else {
        reject(error);
      }
      connection.close().catch(() => {
        /* ignore error */
      });
    });
  });
}
