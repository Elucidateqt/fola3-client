# FoLA3's client-application
## Overview
This is a client built with Vue 3 and Quasar that enables users to interact with FoLA3's server application


## Project setup

### List of environment variables:
 Name | Description | example 
 ---|---|---
VUE_APP_AUTH_API_URL | URL to auth server | https://auth.your-domain.com
VUE_APP_AUTH_API_PORT | port used for authorization requests | 1234
VUE_APP_BASE_API_URL | URL of the FoLA3 server application | https://api.your-domain.com
VUE_APP_BASE_API_PORT | port on which the FoLA3 server application is listening | 1234 
VUE_APP_SOCKET_URL | URL used by WebSockets during active play | https://socket.your-domain.com
VUE_APP_SOCKET_PORT | server-side port used for WebSocket connections | 1234

## Important commands

### Installs dependencies:
```
npm install
```



### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

