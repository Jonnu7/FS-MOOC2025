sequenceDiagram
	participant browser
	participant server

	Note right of browser: User writes new note and clicks the save button

	browser->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_note_spa
	activate server
	server-->>browser: 201 Created
	deactivate server

	Note right of browser: JavaScript updates the page dynamically without reloading
