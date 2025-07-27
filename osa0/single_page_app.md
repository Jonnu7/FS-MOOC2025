sequenceDiagram
	participant browser
	participant server

	Note right of browser: SPA behavior: App is loaded once, then runs dynamically via JavaScript

	browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/spa
	activate server
	server-->>browser: the HTML document (SPA shell)
	deactivate server

	browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/main.css
	activate server
	server-->>browser: the CSS file
	deactivate server

	browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/main.js
	activate server
	server-->>browser: the JavaScript file
	deactivate server

	Note right of browser: JavaScript initializes the SPA and renders UI

	browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/data.json
	activate server
	server-->>browser: the JSON notes
	deactivate server
