sequenceDiagram
	participant browser
	participant server

	Note right of browser: User presses the save button to submit new note

	browser->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_note
	activate server
	server-->>browser: 302 Found
	deactivate server

	Note right of browser: Browser reloads the page after after receiving a 302 redirect response

	browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/notes
	activate server
	server-->>browser: HTML document
	deactivate server

	browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/main.css
	activate server
	server-->>browser: the CSS file
	deactivate server

	browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/main.js
	activate server
	server-->>browser: the JavaScript file
	deactivate server

	Note right of browser: The browser executes JavaScript that fetches JSON data

	browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/data.json
	activate server
	server-->>browser: the JSON data
	deactivate server

	Note right of browser: Callback function is executed to render notes on the page
