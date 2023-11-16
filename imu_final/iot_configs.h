// Copyright (c) Microsoft Corporation. All rights reserved.
// SPDX-License-Identifier: MIT

// Wifi
#define IOT_CONFIG_WIFI_SSID "JR"
#define IOT_CONFIG_WIFI_PASSWORD "esp32joy"

// Azure IoT
#define IOT_CONFIG_IOTHUB_FQDN "CS3237-IOTHub.azure-devices.net"
#define IOT_CONFIG_DEVICE_ID "ESP32-Joy"

// Use device key if not using certificates
#ifndef IOT_CONFIG_USE_X509_CERT
#define IOT_CONFIG_DEVICE_KEY "6jREUHxqCoskaQjN49hdyjrzPEafygcDgAIoTBFQ62E="
#endif // IOT_CONFIG_USE_X509_CERT

// Publish 1 message every 5 seconds
#define TELEMETRY_FREQUENCY_MILLISECS 5000
