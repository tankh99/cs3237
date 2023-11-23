// Copyright (c) Microsoft Corporation. All rights reserved.
// SPDX-License-Identifier: MIT

// Wifi
#define IOT_CONFIG_WIFI_SSID "<WIFI NAME>"
#define IOT_CONFIG_WIFI_PASSWORD "<WIFI PASSWORD>"

// Azure IoT
#define IOT_CONFIG_IOTHUB_FQDN "<IotHub Name>.azure-devices.net"
#define IOT_CONFIG_DEVICE_ID "ESP32-Joy"

// Use device key if not using certificates
#ifndef IOT_CONFIG_USE_X509_CERT
#define IOT_CONFIG_DEVICE_KEY "<Device Primary Key>"
#endif // IOT_CONFIG_USE_X509_CERT