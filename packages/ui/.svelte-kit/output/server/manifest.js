export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["fonts/PortadaLt.ttf","fonts/PortadaLt.woff","fonts/PortadaLt.woff2","fonts/hello-headline.woff2"]),
	mimeTypes: {".ttf":"font/ttf",".woff":"font/woff",".woff2":"font/woff2"},
	_: {
		client: {start:"_app/immutable/entry/start.CDqk8Ka1.js",app:"_app/immutable/entry/app.CjrBKuES.js",imports:["_app/immutable/entry/start.CDqk8Ka1.js","_app/immutable/chunks/Cr0jIF5S.js","_app/immutable/chunks/CCKMOwuf.js","_app/immutable/chunks/C_lHB0qW.js","_app/immutable/entry/app.CjrBKuES.js","_app/immutable/chunks/C_lHB0qW.js","_app/immutable/chunks/CCKMOwuf.js","_app/immutable/chunks/DsnmJJEf.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
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
