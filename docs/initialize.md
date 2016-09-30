1. sails new slims-beta
2. modify package.json

"sails-mysql": "^0.11.5"

https://github.com/postmanlabs/sails-mysql-transactions/issues/9
"scripts": {
	"debug": "node debug app.js",
	"start": "node app.js",
	"postinstall": "npm install sails-mysql-transactions", //don't work for windows
	"postinstall": "npm install https://github.com/bblpny/sails-mysql-transactions/tarball/f62774a3ce0e032306d4d12c1edb66a989cea31d"
},
"transaction-tarball":"true"

3. create bower.json
4. /tasks/config/copy.js
5. /tasks/register/compileAssets.js
6. /tasks/pipeline.js
7. /config/blueprints.js
8. /config/connections.js
9. /config/csrf.js
10. /config/local.js
11. /config/modules.js
#12. /config/policies.js
13. /config/routes.js
14. /views/layout.js