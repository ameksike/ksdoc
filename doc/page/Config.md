# KsDoc Configuration options 
KsDoc stands out as a valuable addition to the Ksike ecosystem, offering developers an efficient and unified solution for documentation needs across diverse application types. With support for CLI, web, and API documentation, seamless integration with Swagger and JSDoc, and an emphasis on intuitive processes, KsDoc empowers developers to create well-documented and user-friendly applications.

## Quick overview

- Server file:
```Js
const express = require("express");
const ksdocs = require("ksdocs");

const app = express();

ksdocs.inject({
    path: {
      ...ksdocs.path,
      root: __dirname + "/docs"
    },
}).init(app, express.static);

app.listen(5555);
```

Through the configuration file it is possible to redefine all the behavior of the library as: 
- **Paths:** The hierarchical path system to use, allowing to have access to the lib resource, local resource and schema resources.
- **Templates:** The template list to be used. 
- **Routes:** Public URLs to be used.
- **Scope:** It is only rendered public scope, by default it is public.
- Services and Controllers:
    * **languageService:** Defines how to get the language data to support multilanguage. 
    * **dataService:** Defines how to get the data content to fill the templates.
    * **menuService:** Defines how to load the main menu.
    * **tplService:** Defines the demplate engine management. By default it is an KsTpl instance.
    * **logger:** Log managements
    * **sessionService:** Defines how to maintain and store the user session required for authentication and security, if set to null there is no security
    * **authService:** Defines how to check the user which is trying to login and generate access token.
    * **apiController:** By default it use Swagger integration 


### Optional Config file in JSON format

File: ```<PATH_DOC>/<SCHEMA_NAME>/_/config.json ```
```Json
{
  "cfg": {
    "scope": "public",
    "menu": [
      { "name": "Introduction", "url": "{root}/{schema}/{page}" },
      { "name": "Onboarding" }
    ]
  },
  "path": {
    "api": "{root}/{schema}/api",
    "page": "{root}/{schema}/page",
    "lang": "{root}/{schema}/lang",
    "config": "{root}/{schema}/config",
    "resource": "{root}/{schema}/resource",
    "core": "{root}/{schema}/_",
    "cache": "{core}/cache"
  },
  "route": {
    "resource": "/resource",
    "login": "{root}/auth/login",
    "logout": "{root}/auth/logout",
    "access": "{root}/auth/access",
    "unauthorized": "{root}/auth/access",
    "public": "{resource}/{schema}",
    "home": "{root}/{schema}",
    "pag": "{root}/{schema}/{page}",
    "api": "{root}/{schema}/api",
    "src": "{root}/{schema}/src"
  },
  "template": {
	  "layout": "{lib}/template/page.layout.html"
  },
  "apiController": null
}
```


### Optional Config file in JavaScript format:

File: ```<PATH_DOC>/<SCHEMA_NAME>/_/config.js ```
```Js
module.exports = {
  "cfg": {
    "scope": "public"
  },
  "path": {
    "api": "{root}/{schema}/api",
    "page": "{root}/{schema}/page",
    "lang": "{root}/{schema}/lang",
    "config": "{root}/{schema}/config",
    "resource": "{root}/{schema}/resource",
    "core": "{root}/{schema}/_",
    "cache": "{core}/cache"
  },
  "route": {
    "resource": "/resource",
    "login": "{root}/auth/login",
    "logout": "{root}/auth/logout",
    "access": "{root}/auth/access",
    "unauthorized": "{root}/auth/access",
    "public": "{resource}/{schema}",
    "home": "{root}/{schema}",
    "pag": "{root}/{schema}/{page}",
    "api": "{root}/{schema}/api",
    "src": "{root}/{schema}/src"
  },
  "template": {
	 "layout": "{core}/template/page.layout.html"
  },
  apiController: null,
  languageService: {
    load: ({ path, idiom = "en" }) => Promise.resolve(require(path + "/" + idiom + ".json"))
  },
  logger: console
}
```
