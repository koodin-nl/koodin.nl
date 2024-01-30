require('dotenv/config')

require('@remix-run/node').installGlobals()

if (process.env.NODE_ENV === 'production') {
	require('./server-build')
} else {
	require('./server')
}
