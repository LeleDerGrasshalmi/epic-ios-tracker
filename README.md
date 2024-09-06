# Epic IOS Tracker

Tracking the Epic IOS Altstore source for app versions & marketplace kit config.

## Installation

```bash
yarn
```

## Configuration

The project requires the following environment variables.

```bash
WEBHOOK_URL="https://discord.com/api/webhooks/123456789/webhook_secret"
```

Additionally for development purposes the following environment variables can be used aswell, they default to `false`.

```bash
GIT_DO_NOT_COMMIT="true"
GIT_DO_NOT_PUSH="true"
GIT_DO_NOT_SEND_WEBHOOK="true"
```

## Development

```bash
yarn dev
```
