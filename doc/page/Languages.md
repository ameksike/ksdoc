# KsDoc Language options 

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
|	|    |    + es/
|	|    |    |    - Introduction.html
|	|    |    + en/
|	|    |    |    - Introduction.html
|	+ templates/
|	+ lang/
|	|    - es.json
|	|    - en.json
```

## Common language file
FILE: ```lang/en.json```
```json
{
  "title": "My Articles",
  "description": "This is a section of articles or tutorials, it also includes the documents of an API developed to learn.",

  "404": {
    "title": "Something was wrong.",
    "message": "The resource you are trying to access no longer exists."
  },
  "access": {
    "title": "Authentication is required to access the documentation.",
    "subtitle": "Please enter your user account.",
	"password": "Password",
	"username": "Username"
  },
  "btn": {
    "login": "Login",
    "exit": "Exit"
  },
  "msg": {
	  "error_invalid_user": "Invalid user to get access this section, please perform the login action"
  },
  "main": {
	  "roadmap": "Roadmap",
	  "version": "Version",
	  "environment": "Environment",
	  "build_number": "Build Number",
	  "migration_number": "Migration Number",
	  "warning": "Warning",
	  "last_available": "LAST AVAILABLE",
	  "current": "CURRENT",
	  "faq": "FAQs",
	  "docref": "the complete documentation here",
	  "further_info": "For more information on this topic consult ",
	  "quick_guide": "If you need to consult a quick guide to solving and understanding problems, it is recommended to review the topic known as"
  },
  "layout": {
	  "welcome": "Welcome",
	  "home": "Home",
	  "api": "API Docs",
	  "src": "SRC Docs"
  }
}
```
