module.exports = {
	globDirectory: 'public/',
	globPatterns: [
		'**/*.{ico,png,svg,json,js}'
	],
	ignoreURLParametersMatching: [
		/^utm_/,
		/^fbclid$/
	],
	swDest: 'public/sw.js'
};