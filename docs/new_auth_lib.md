# Instruction about Auth lib

1. tc-auth/index.js

	This file will append tcUser object to request object. Then add a permission check middleware to the app.
	
2. tc-auth/checkPath.js

	It contains a permission check middleware. Firstly, the middleware will compare the req info with each item in config's pathOverrides array. 
	
	If a item matched, the middleware will confirm whether tcUser has permission to access the endpoint.
	
	If no item matched, the middleware will use defalut auth setting.
	
	If user has the permission, the flow will pass this middleware.
	
	If not, the middleware will reponse an error immediately.