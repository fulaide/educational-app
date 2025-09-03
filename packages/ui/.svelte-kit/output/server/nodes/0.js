

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/layout.svelte.js')).default;
export const imports = ["_app/immutable/nodes/0.BTeiRoji.js","_app/immutable/chunks/DsnmJJEf.js","_app/immutable/chunks/C_lHB0qW.js"];
export const stylesheets = [];
export const fonts = [];
