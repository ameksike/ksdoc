# KsDoc Skeleton 

## Simple documentation structure
```
- MyDoc	
|	+ page/
|	|    - Introduction.html
|	|    - Demos1.twig
|	|    - Demos2.ejs
|	|    - README.md
```

## Common documentation structure
```
- MyDoc	
|	+ page/
|	|    - Introduction.html
|	|    - Demos1.twig
|	|    - Demos2.ejs
|	|    - README.md
|	+ core/
|	|    - config.json
|	|    + cache/
|	+ templates/
|	+ lang/
|	|    - es.json
|	|    - en.json
|	+ src/
|	+ api/
|	|    - config.json
|	|    - schemas.yml
|	|    - responses.yml
|	|    - parameters.yml
|	|    - examples.yml
```

## Core configuration 
FILE: ```core/config.json```
```json
{
  "metadata": {
    "name": "My Articles",
    "description": "This is a section of articles or tutorials, it also includes the documents of an API developed to learn.",
    "version": "1.7.0",
    "icon": "favicon-32x32.png",
    "image": "background.jpg",
    "group": "MyGroup",
    "date": "1706135685000"
  },
  "cfg": {
    "scope": "public",
    "auth": {
      "required": true
    },
    "menu": [
      { "name": "Introduction" },
      { "name": "Domain" },
      { "name": "Credential" },
      { "name": "Login" },
      { "name": "Logout" },
      { "name": "Refresh" },
      { "name": "Account" },
      { "name": "Alerts" },
      { "name": "Logs" },
      { "name": "Troubleshooting" },
      { "name": "FAQs" }
    ]
  },
  "path": {
    "api": "{root}/{schema}/api",
    "page": "{root}/{schema}/page",
    "lang": "{root}/{schema}/lang",
    "config": "{root}/{schema}/config",
    "resource": "{root}/{schema}/resource",
    "core": "{root}/{schema}/core",
    "cache": ""
  },
  "route": {
    "login": "{base}/{schema}/sec/login",
    "logout": "{base}/{schema}/sec/logout",
    "access": "{base}/{schema}/sec/access",
    "unauthorized": "{base}/{schema}/sec/access",
    "base": "{root}/{lang}",
    "public": "{resource}/{schema}",
    "home": "{base}/{schema}",
    "pag": "{base}/{schema}/{page}",
    "api": "{base}/{schema}/api",
    "src": "{base}/{schema}/src"
  },
  "template": {
    "layout": "{lib}/template/page.layout.html",
    "desc": "{lib}/template/fragment.des.migration.html"
  },
  "global": {
    "url": {
        "task": "https://jira.com/browse"
    }
  }
}
```

## API configuration with Swagger integration
FILE: ```api/config.json```
```json
{
  "swaggerDefinition": {
    "openapi": "3.0.1",
    "tags": [],
    "info": {
      "version": "1.0.1",
      "description": "My API Docs"
    },
    "basePath": "/api",
    "servers": [
      {
        "url": "https://my-dev-server.com",
        "description": "Public development server"
      },
      {
        "url": "https://my-stg-server.com",
        "description": "Public staging server for testing"
      },
      {
        "url": "http://{host}:{port}",
        "description": "Local development server",
        "variables": {
          "port": {
            "default": "4000"
          },
          "host": {
            "default": "localhost"
          }
        }
      }
    ]
  },
  "apis": [
    "{root}/**/*.yml", 
    "{root}/**/*.json", 
    "{root}/**/*.ts", 
    "{root}/**/*.js", 
    "{root}/../../../src/**/*.js", 
    "{root}/../../../src/**/*.ts"
  ],
  "js": [],
  "css": [],
  "topics": []
}
```
