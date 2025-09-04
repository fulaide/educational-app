export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["fonts/hello-headline.woff2"]),
	mimeTypes: {".woff2":"font/woff2"},
	_: {
		client: {start:"_app/immutable/entry/start.B-WoirmO.js",app:"_app/immutable/entry/app.Bhvh1oNu.js",imports:["_app/immutable/entry/start.B-WoirmO.js","_app/immutable/chunks/B-AhSswU.js","_app/immutable/chunks/CCKMOwuf.js","_app/immutable/chunks/C_lHB0qW.js","_app/immutable/entry/app.Bhvh1oNu.js","_app/immutable/chunks/C_lHB0qW.js","_app/immutable/chunks/CCKMOwuf.js","_app/immutable/chunks/DsnmJJEf.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js'))
		],
		remotes: {
			
		},
		routes: [
			
		],
		prerendered_routes: new Set([]),
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();
