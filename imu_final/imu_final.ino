#include <cstdlib>
#include <string.h>
#include <time.h>
#include <WiFi.h>
#include <mqtt_client.h>
#include <Wire.h>
#include <az_core.h>
#include <az_iot.h>
#include <azure_ca.h>
#include "AzIoTSasToken.h"
#include "SerialLogger.h"
#include "iot_configs.h"
#include "cJSON.h"

#include <Adafruit_Sensor.h>
#include <Adafruit_ADXL345_U.h>



#define AZURE_SDK_CLIENT_USER_AGENT "c%2F" AZ_SDK_VERSION_STRING "(ard;esp32)"

#define sizeofarray(a) (sizeof(a) / sizeof(a[0]))
#define NTP_SERVERS "pool.ntp.org", "time.nist.gov"
#define MQTT_QOS1 1
#define DO_NOT_RETAIN_MSG 0
#define SAS_TOKEN_DURATION_IN_MINUTES 60
#define UNIX_TIME_NOV_13_2017 1510592825

#define PST_TIME_ZONE -8
#define PST_TIME_ZONE_DAYLIGHT_SAVINGS_DIFF 1

#define GMT_OFFSET_SECS (PST_TIME_ZONE * 3600)
#define GMT_OFFSET_SECS_DST ((PST_TIME_ZONE + PST_TIME_ZONE_DAYLIGHT_SAVINGS_DIFF) * 3600)

#define MIC_PIN A0

//--- Accelerometer Register Addresses
#define Power_Register 0x2D
#define X_Axis_Register_DATAX0 0x32 
#define X_Axis_Register_DATAX1 0x33 
#define Y_Axis_Register_DATAY0 0x34
#define Y_Axis_Register_DATAY1 0x35
#define Z_Axis_Register_DATAZ0 0x36
#define Z_Axis_Register_DATAZ1 0x37

int ADXAddress = 0x53;  //Device address
static int X0, X1, X_out;
static int Y0, Y1, Y_out;
static int Z1, Z0, Z_out;
static float Xa, Ya, Za;

Adafruit_ADXL345_Unified accel = Adafruit_ADXL345_Unified(0x53);

static float x_data[200];
static float y_data[200];
static float z_data[200];
static int pos = 0;


// Translate iot_configs.h defines into variables used by the sample
static const char* ssid = IOT_CONFIG_WIFI_SSID;
static const char* password = IOT_CONFIG_WIFI_PASSWORD;
static const char* host = IOT_CONFIG_IOTHUB_FQDN;
static const char* mqtt_broker_uri = "mqtts://" IOT_CONFIG_IOTHUB_FQDN;
static const char* device_id = IOT_CONFIG_DEVICE_ID;
static const int mqtt_port = AZ_IOT_DEFAULT_MQTT_CONNECT_PORT;

// Memory allocated for the sample's variables and structures.
static esp_mqtt_client_handle_t mqtt_client;
static az_iot_hub_client client;

static char mqtt_client_id[128];
static char mqtt_username[128];
static char mqtt_password[200];
static uint8_t sas_signature_buffer[256];
static unsigned long next_telemetry_send_time_ms = 0;
static unsigned long next_collection_time_ms = 0;
static char telemetry_topic[128];

#define INCOMING_DATA_BUFFER_SIZE 128
static char incoming_data[INCOMING_DATA_BUFFER_SIZE];

// Auxiliary functions
#ifndef IOT_CONFIG_USE_X509_CERT
static AzIoTSasToken sasToken(
    &client,
    AZ_SPAN_FROM_STR(IOT_CONFIG_DEVICE_KEY),
    AZ_SPAN_FROM_BUFFER(sas_signature_buffer),
    AZ_SPAN_FROM_BUFFER(mqtt_password));
#endif // IOT_CONFIG_USE_X509_CERT

static void connectToWiFi()
{
  Logger.Info("Connecting to WIFI SSID " + String(ssid));

  WiFi.mode(WIFI_STA);
  WiFi.disconnect();
  delay(100);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED)
  {
    delay(500);
    Serial.print(".");
  }

  Serial.println("");

  Logger.Info("WiFi connected, IP address: " + WiFi.localIP().toString());
}

static void initializeTime()
{
  Logger.Info("Setting time using SNTP");

  configTime(GMT_OFFSET_SECS, GMT_OFFSET_SECS_DST, NTP_SERVERS);
  time_t now = time(NULL);
  while (now < UNIX_TIME_NOV_13_2017)
  {
    delay(500);
    Serial.print(".");
    now = time(nullptr);
  }
  Serial.println("");
  Logger.Info("Time initialized!");
}

static void initializeIoTHubClient()
{
  az_iot_hub_client_options options = az_iot_hub_client_options_default();
  options.user_agent = AZ_SPAN_FROM_STR(AZURE_SDK_CLIENT_USER_AGENT);

  if (az_result_failed(az_iot_hub_client_init(
          &client,
          az_span_create((uint8_t*)host, strlen(host)),
          az_span_create((uint8_t*)device_id, strlen(device_id)),
          &options)))
  {
    Logger.Error("Failed initializing Azure IoT Hub client");
    return;
  }

  size_t client_id_length;
  if (az_result_failed(az_iot_hub_client_get_client_id(
          &client, mqtt_client_id, sizeof(mqtt_client_id) - 1, &client_id_length)))
  {
    Logger.Error("Failed getting client id");
    return;
  }

  if (az_result_failed(az_iot_hub_client_get_user_name(
          &client, mqtt_username, sizeofarray(mqtt_username), NULL)))
  {
    Logger.Error("Failed to get MQTT clientId, return code");
    return;
  }

  Logger.Info("Client ID: " + String(mqtt_client_id));
  Logger.Info("Username: " + String(mqtt_username));
}

static int initializeMqttClient()
{
#ifndef IOT_CONFIG_USE_X509_CERT
  if (sasToken.Generate(SAS_TOKEN_DURATION_IN_MINUTES) != 0)
  {
    Logger.Error("Failed generating SAS token");
    return 1;
  }
#endif

  esp_mqtt_client_config_t mqtt_config;
  memset(&mqtt_config, 0, sizeof(mqtt_config));
  mqtt_config.uri = mqtt_broker_uri;
  mqtt_config.port = mqtt_port;
  mqtt_config.client_id = mqtt_client_id;
  mqtt_config.username = mqtt_username;


#ifdef IOT_CONFIG_USE_X509_CERT
  Logger.Info("MQTT client using X509 Certificate authentication");
  mqtt_config.client_cert_pem = IOT_CONFIG_DEVICE_CERT;
  mqtt_config.client_key_pem = IOT_CONFIG_DEVICE_CERT_PRIVATE_KEY;
#else // Using SAS key
  mqtt_config.password = (const char*)az_span_ptr(sasToken.Get());
#endif

  mqtt_config.keepalive = 30;
  mqtt_config.disable_clean_session = 0;
  mqtt_config.disable_auto_reconnect = false;
  mqtt_config.user_context = NULL;
  mqtt_config.cert_pem = (const char*)ca_pem;

  mqtt_client = esp_mqtt_client_init(&mqtt_config);

  if (mqtt_client == NULL)
  {
    Logger.Error("Failed creating mqtt client");
    return 1;
  }

  esp_err_t start_result = esp_mqtt_client_start(mqtt_client);

  if (start_result != ESP_OK)
  {
    Logger.Error("Could not start mqtt client; error code:" + start_result);
    return 1;
  }
  else
  {
    Logger.Info("MQTT client started");
    return 0;
  }
}

/*
 * @brief           Gets the number of seconds since UNIX epoch until now.
 * @return uint32_t Number of seconds.
 */
static uint32_t getEpochTimeInSecs() { return (uint32_t)time(NULL); }

static void establishConnection()
{
  connectToWiFi();
  initializeTime();
  initializeIoTHubClient();
  (void)initializeMqttClient();
}

int MAX = 256;
int THRESHOLD = 255; // 512 seems to be the upper limit
static void collateData() {
  sensors_event_t event;
  accel.getEvent(&event);

  float Xa = event.acceleration.x;  // Raw X-axis acceleration value
  float Ya = event.acceleration.y;  // Raw Y-axis acceleration value
  float Za = event.acceleration.z;  // Raw Z-axis acceleration value

  // Apply scaling factor (adjust according to your sensor specifications)
  // float scalingFactor = 9.8 / 256.0;  // Example scaling factor for ADXL345, gravity divide by 256
  // Xa *= scalingFactor;
  // Ya *= scalingFactor;
  // Za *= scalingFactor;

  x_data[pos] = Xa;
  y_data[pos] = Ya;
  z_data[pos] = Za;
  Serial.print(Xa);
  Serial.print(" ");
  Serial.print(Ya);
  Serial.print(" ");
  Serial.print(Za);
  Serial.println();
  pos += 1;
}

static const char* generateTelemetryPayload()
{
  cJSON *root = cJSON_CreateObject();
  cJSON *tele_data = cJSON_CreateArray();
  cJSON_AddStringToObject(root, "key", "imu_1");
  
  for (int i = 0; i < pos; i++) {
    cJSON *one_data = cJSON_CreateObject();
    cJSON_AddNumberToObject(one_data, "x", x_data[i]);
    cJSON_AddNumberToObject(one_data, "y", y_data[i]);
    cJSON_AddNumberToObject(one_data, "z", z_data[i]);
    cJSON_AddItemToArray(tele_data, one_data);
  }

  cJSON_AddItemToObject(root, "data", tele_data);
  Serial.println("generating ");
  Serial.println(String(pos));
  pos = 0;
  const char* telemetry_payload = cJSON_Print(root);
  cJSON_Delete(root);
  return telemetry_payload;
}

static void sendTelemetry()
{
  Logger.Info("Sending telemetry ...");

  // The topic could be obtained just once during setup,
  // however if properties are used the topic need to be generated again to reflect the
  // current values of the properties.
  if (az_result_failed(az_iot_hub_client_telemetry_get_publish_topic(
          &client, NULL, telemetry_topic, sizeof(telemetry_topic), NULL)))
  {
    Logger.Error("Failed az_iot_hub_client_telemetry_get_publish_topic");
    return;
  }

  const char* message = generateTelemetryPayload();

  if (esp_mqtt_client_publish(
          mqtt_client,
          telemetry_topic,
          message,
          strlen(message),
          MQTT_QOS1,
          DO_NOT_RETAIN_MSG)
      == 0)
  {
    Logger.Error("Failed publishing");
  }
  else
  {
    Logger.Info("Message published successfully");
  }

  free((void*)message);
}

// Arduino setup and loop main functions.

void setup() { 
  Serial.begin(115200);
  establishConnection(); 
  // Wire.begin();  // Initiate the Wire library
  // delay(100);

  // Wire.beginTransmission(ADXAddress);
  // Wire.write(Power_Register);  // Power_CTL Register
  // Wire.write(8);  // Bit D3 High for measuring enable (0000 1000)
  // Wire.endTransmission();

  if(!accel.begin())
  {
    Serial.println("Could not find a valid ADXL345 sensor, check wiring!");
    while(1);
  }
  
  // Serial.printf("%.6f %.6f %.6f", accelerationX, accelerationY, accelerationZ);
}

void loop()
{
  if (WiFi.status() != WL_CONNECTED)
  {
    connectToWiFi();
  }
#ifndef IOT_CONFIG_USE_X509_CERT
  else if (sasToken.IsExpired())
  {
    Logger.Info("SAS token expired; reconnecting with a new one.");
    (void)esp_mqtt_client_destroy(mqtt_client);
    initializeMqttClient();
  }
#endif
  else if (millis() > next_collection_time_ms) {
    collateData();
    next_collection_time_ms = millis() + 29;
  }
  else if (millis() > next_telemetry_send_time_ms)
  {
    sendTelemetry();
    next_telemetry_send_time_ms = millis() + TELEMETRY_FREQUENCY_MILLISECS;
    checkFreeMemory(); // fault tolerance in case of stack overflow
  }
}

void checkFreeMemory() {
    size_t freeHeap = esp_get_free_heap_size();
    printf("Free heap memory: %u bytes\n", freeHeap);
    if (freeHeap <= 8000) {
      ESP.restart();
    }
}
