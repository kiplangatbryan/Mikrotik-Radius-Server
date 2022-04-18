# External Radius Authentication Server
simple server running on nodejs for Authenticating clients who made payments prior to connecting to  Mikrotik Router Board

## How It Works

The server accepts requests and processes mobile payments via Mpesa. Then [Tinypesa](https://tinypesa.com) takes over and which processes payments via Mpesa's [Daraja API 2.0](https://developers.safaricom.co.ke).

