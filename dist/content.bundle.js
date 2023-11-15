/*! For license information please see content.bundle.js.LICENSE.txt */
(()=>{"use strict";var e={d:(t,r)=>{for(var n in r)e.o(r,n)&&!e.o(t,n)&&Object.defineProperty(t,n,{enumerable:!0,get:r[n]})},o:(e,t)=>Object.prototype.hasOwnProperty.call(e,t),r:e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})}},t={};e.r(t),e.d(t,{APIConnectionError:()=>i,APIConnectionTimeoutError:()=>a,APIError:()=>s,APIUserAbortError:()=>o,AuthenticationError:()=>c,BadRequestError:()=>u,ConflictError:()=>d,InternalServerError:()=>y,NotFoundError:()=>h,OpenAIError:()=>n,PermissionDeniedError:()=>l,RateLimitError:()=>p,UnprocessableEntityError:()=>f});const r="4.12.1";class n extends Error{}class s extends n{constructor(e,t,r,n){super(`${e} ${s.makeMessage(t,r)}`),this.status=e,this.headers=n;const o=t;this.error=o,this.code=o?.code,this.param=o?.param,this.type=o?.type}static makeMessage(e,t){return e?.message?"string"==typeof e.message?e.message:JSON.stringify(e.message):e?JSON.stringify(e):t||"status code (no body)"}static generate(e,t,r,n){if(!e)return new i({cause:ie(t)});const o=t?.error;return 400===e?new u(e,o,r,n):401===e?new c(e,o,r,n):403===e?new l(e,o,r,n):404===e?new h(e,o,r,n):409===e?new d(e,o,r,n):422===e?new f(e,o,r,n):429===e?new p(e,o,r,n):e>=500?new y(e,o,r,n):new s(e,o,r,n)}}class o extends s{constructor({message:e}={}){super(void 0,void 0,e||"Request was aborted.",void 0),this.status=void 0}}class i extends s{constructor({message:e,cause:t}){super(void 0,void 0,e||"Connection error.",void 0),this.status=void 0,t&&(this.cause=t)}}class a extends i{constructor({message:e}={}){super({message:e??"Request timed out."})}}class u extends s{constructor(){super(...arguments),this.status=400}}class c extends s{constructor(){super(...arguments),this.status=401}}class l extends s{constructor(){super(...arguments),this.status=403}}class h extends s{constructor(){super(...arguments),this.status=404}}class d extends s{constructor(){super(...arguments),this.status=409}}class f extends s{constructor(){super(...arguments),this.status=422}}class p extends s{constructor(){super(...arguments),this.status=429}}class y extends s{}class m{constructor(e,t){this.response=e,this.controller=t,this.decoder=new g}async*iterMessages(){if(!this.response.body)throw this.controller.abort(),new n("Attempted to iterate over a response with no body");const e=new w,t=function(e){if(e[Symbol.asyncIterator])return e;const t=e.getReader();return{async next(){try{const e=await t.read();return e?.done&&t.releaseLock(),e}catch(e){throw t.releaseLock(),e}},async return(){const e=t.cancel();return t.releaseLock(),await e,{done:!0,value:void 0}},[Symbol.asyncIterator](){return this}}}(this.response.body);for await(const r of t)for(const t of e.decode(r)){const e=this.decoder.decode(t);e&&(yield e)}for(const t of e.flush()){const e=this.decoder.decode(t);e&&(yield e)}}async*[Symbol.asyncIterator](){let e=!1;try{for await(const t of this.iterMessages())if(!e)if(t.data.startsWith("[DONE]"))e=!0;else if(null===t.event)try{yield JSON.parse(t.data)}catch(e){throw console.error("Could not parse message into JSON:",t.data),console.error("From chunk:",t.raw),e}e=!0}catch(e){if(e instanceof Error&&"AbortError"===e.name)return;throw e}finally{e||this.controller.abort()}}}class g{constructor(){this.event=null,this.data=[],this.chunks=[]}decode(e){if(e.endsWith("\r")&&(e=e.substring(0,e.length-1)),!e){if(!this.event&&!this.data.length)return null;const e={event:this.event,data:this.data.join("\n"),raw:this.chunks};return this.event=null,this.data=[],this.chunks=[],e}if(this.chunks.push(e),e.startsWith(":"))return null;let[t,r,n]=function(e,t){const r=e.indexOf(":");return-1!==r?[e.substring(0,r),":",e.substring(r+1)]:[e,"",""]}(e);return n.startsWith(" ")&&(n=n.substring(1)),"event"===t?this.event=n:"data"===t&&this.data.push(n),null}}class w{constructor(){this.buffer=[],this.trailingCR=!1}decode(e){let t=this.decodeText(e);if(this.trailingCR&&(t="\r"+t,this.trailingCR=!1),t.endsWith("\r")&&(this.trailingCR=!0,t=t.slice(0,-1)),!t)return[];const r=w.NEWLINE_CHARS.has(t[t.length-1]||"");let n=t.split(w.NEWLINE_REGEXP);return 1!==n.length||r?(this.buffer.length>0&&(n=[this.buffer.join("")+n[0],...n.slice(1)],this.buffer=[]),r||(this.buffer=[n.pop()||""]),n):(this.buffer.push(n[0]),[])}decodeText(e){if(null==e)return"";if("string"==typeof e)return e;if("undefined"!=typeof Buffer){if(e instanceof Buffer)return e.toString();if(e instanceof Uint8Array)return Buffer.from(e).toString();throw new n(`Unexpected: received non-Uint8Array (${e.constructor.name}) stream chunk in an environment with a global "Buffer" defined, which this library assumes to be Node. Please report this error.`)}if("undefined"!=typeof TextDecoder){if(e instanceof Uint8Array||e instanceof ArrayBuffer)return this.textDecoder??(this.textDecoder=new TextDecoder("utf8")),this.textDecoder.decode(e);throw new n(`Unexpected: received non-Uint8Array/ArrayBuffer (${e.constructor.name}) in a web platform. Please report this error.`)}throw new n("Unexpected: neither Buffer nor TextDecoder are available as globals. Please report this error.")}flush(){if(!this.buffer.length&&!this.trailingCR)return[];const e=[this.buffer.join("")];return this.buffer=[],this.trailingCR=!1,e}}w.NEWLINE_CHARS=new Set(["\n","\r","\v","\f","","","","","\u2028","\u2029"]),w.NEWLINE_REGEXP=/\r\n|[\n\r\x0b\x0c\x1c\x1d\x1e\x85\u2028\u2029]/g;let b,v,x,E,P,S,R,A,I=!1,L=null,k=null,O=null,j=null;class T{constructor(e){this.body=e}get[Symbol.toStringTag](){return"MultipartBody"}}b||function(e,t={auto:!1}){if(I)throw new Error(`you must \`import 'openai/shims/${e.kind}'\` before importing anything else from openai`);if(b)throw new Error(`can't \`import 'openai/shims/${e.kind}'\` after \`import 'openai/shims/${b}'\``);I=t.auto,b=e.kind,v=e.fetch,L=e.Request,k=e.Response,O=e.Headers,x=e.FormData,j=e.Blob,E=e.File,P=e.getMultipartRequestOptions,S=e.getDefaultAgent,R=e.fileFromPath,A=e.isFsReadStream}(function({manuallyImported:e}={}){const t=e?"You may need to use polyfills":"Add one of these imports before your first `import … from 'openai'`:\n- `import 'openai/shims/node'` (if you're running on Node)\n- `import 'openai/shims/web'` (otherwise)\n";let r,n,s,o;try{r=fetch,n=Request,s=Response,o=Headers}catch(e){throw new Error(`this environment is missing the following Web Fetch API type: ${e.message}. ${t}`)}return{kind:"web",fetch:r,Request:n,Response:s,Headers:o,FormData:"undefined"!=typeof FormData?FormData:class{constructor(){throw new Error(`file uploads aren't supported in this environment yet as 'FormData' is undefined. ${t}`)}},Blob:"undefined"!=typeof Blob?Blob:class{constructor(){throw new Error(`file uploads aren't supported in this environment yet as 'Blob' is undefined. ${t}`)}},File:"undefined"!=typeof File?File:class{constructor(){throw new Error(`file uploads aren't supported in this environment yet as 'File' is undefined. ${t}`)}},getMultipartRequestOptions:async(e,t)=>({...t,body:new T(e)}),getDefaultAgent:e=>{},fileFromPath:()=>{throw new Error("The `fileFromPath` function is only supported in Node. See the README for more details: https://www.github.com/openai/openai-node#file-uploads")},isFsReadStream:e=>!1}}(),{auto:!0});const $=e=>null!=e&&"object"==typeof e&&"string"==typeof e.url&&"function"==typeof e.blob,q=e=>null!=e&&"object"==typeof e&&"number"==typeof e.size&&"string"==typeof e.type&&"function"==typeof e.text&&"function"==typeof e.slice&&"function"==typeof e.arrayBuffer;async function N(e,t,r={}){if(e=await e,$(e)){const n=await e.blob();return t||(t=new URL(e.url).pathname.split(/[\\/]/).pop()??"unknown_file"),new E([n],t,r)}const n=await async function(e){let t=[];if("string"==typeof e||ArrayBuffer.isView(e)||e instanceof ArrayBuffer)t.push(e);else if(q(e))t.push(await e.arrayBuffer());else{if(!F(e))throw new Error(`Unexpected data type: ${typeof e}; constructor: ${e?.constructor?.name}; props: ${function(e){return`[${Object.getOwnPropertyNames(e).map((e=>`"${e}"`)).join(", ")}]`}(e)}`);for await(const r of e)t.push(r)}return t}(e);if(t||(t=function(e){return C(e.name)||C(e.filename)||C(e.path)?.split(/[\\/]/).pop()}(e)??"unknown_file"),!r.type){const e=n[0]?.type;"string"==typeof e&&(r={...r,type:e})}return new E(n,t,r)}const C=e=>"string"==typeof e?e:"undefined"!=typeof Buffer&&e instanceof Buffer?String(e):void 0,F=e=>null!=e&&"object"==typeof e&&"function"==typeof e[Symbol.asyncIterator],_=e=>e&&"object"==typeof e&&e.body&&"MultipartBody"===e[Symbol.toStringTag],B=async e=>{const t=await U(e.body);return P(t,e)},U=async e=>{const t=new x;return await Promise.all(Object.entries(e||{}).map((([e,r])=>D(t,e,r)))),t},D=async(e,t,r)=>{if(void 0!==r){if(null==r)throw new TypeError(`Received null for "${t}"; to pass null in FormData, you must use the string 'null'`);if("string"==typeof r||"number"==typeof r||"boolean"==typeof r)e.append(t,String(r));else if((e=>(e=>null!=e&&"object"==typeof e&&"string"==typeof e.name&&"number"==typeof e.lastModified&&q(e))(e)||$(e)||A(e))(r)){const n=await N(r);e.append(t,n)}else if(Array.isArray(r))await Promise.all(r.map((r=>D(e,t+"[]",r))));else{if("object"!=typeof r)throw new TypeError(`Invalid value given to form, expected a string, number, boolean, object, Array, File or Blob but got ${r} instead`);await Promise.all(Object.entries(r).map((([r,n])=>D(e,`${t}[${r}]`,n))))}}};var X;async function M(e){const{response:t}=e;if(e.options.stream)return new m(t,e.controller);const r=t.headers.get("content-type");if(r?.includes("application/json")){const e=await t.json();return ce("response",t.status,t.url,t.headers,e),e}const n=await t.text();return ce("response",t.status,t.url,t.headers,n),n}class W extends Promise{constructor(e,t=M){super((e=>{e(null)})),this.responsePromise=e,this.parseResponse=t}_thenUnwrap(e){return new W(this.responsePromise,(async t=>e(await this.parseResponse(t))))}asResponse(){return this.responsePromise.then((e=>e.response))}async withResponse(){const[e,t]=await Promise.all([this.parse(),this.asResponse()]);return{data:e,response:t}}parse(){return this.parsedPromise||(this.parsedPromise=this.responsePromise.then(this.parseResponse)),this.parsedPromise}then(e,t){return this.parse().then(e,t)}catch(e){return this.parse().catch(e)}finally(e){return this.parse().finally(e)}}class H{constructor({baseURL:e,maxRetries:t,timeout:r=6e5,httpAgent:n,fetch:s}){this.baseURL=e,this.maxRetries=oe("maxRetries",t??2),this.timeout=oe("timeout",r),this.httpAgent=n,this.fetch=s??v}authHeaders(e){return{}}defaultHeaders(e){return{Accept:"application/json","Content-Type":"application/json","User-Agent":this.getUserAgent(),...ee(),...this.authHeaders(e)}}validateHeaders(e,t){}defaultIdempotencyKey(){return`stainless-node-retry-${le()}`}get(e,t){return this.methodRequest("get",e,t)}post(e,t){return this.methodRequest("post",e,t)}patch(e,t){return this.methodRequest("patch",e,t)}put(e,t){return this.methodRequest("put",e,t)}delete(e,t){return this.methodRequest("delete",e,t)}methodRequest(e,t,r){return this.request(Promise.resolve(r).then((r=>({method:e,path:t,...r}))))}getAPIList(e,t,r){return this.requestAPIList(t,{method:"get",path:e,...r})}calculateContentLength(e){if("string"==typeof e){if("undefined"!=typeof Buffer)return Buffer.byteLength(e,"utf8").toString();if("undefined"!=typeof TextEncoder)return(new TextEncoder).encode(e).length.toString()}return null}buildRequest(e){const{method:t,path:r,query:n,headers:s={}}=e,o=_(e.body)?e.body.body:e.body?JSON.stringify(e.body,null,2):null,i=this.calculateContentLength(o),a=this.buildURL(r,n);"timeout"in e&&oe("timeout",e.timeout);const u=e.timeout??this.timeout,c=e.httpAgent??this.httpAgent??S(a),l=u+1e3;"number"==typeof c?.options?.timeout&&l>(c.options.timeout??0)&&(c.options.timeout=l),this.idempotencyHeader&&"get"!==t&&(e.idempotencyKey||(e.idempotencyKey=this.defaultIdempotencyKey()),s[this.idempotencyHeader]=e.idempotencyKey);const h={...i&&{"Content-Length":i},...this.defaultHeaders(e),...s};_(e.body)&&"node"!==b&&delete h["Content-Type"],Object.keys(h).forEach((e=>null===h[e]&&delete h[e]));const d={method:t,...o&&{body:o},headers:h,...c&&{agent:c},signal:e.signal??null};return this.validateHeaders(h,s),{req:d,url:a,timeout:u}}async prepareRequest(e,{url:t,options:r}){}parseHeaders(e){return e?Symbol.iterator in e?Object.fromEntries(Array.from(e).map((e=>[...e]))):{...e}:{}}makeStatusError(e,t,r,n){return s.generate(e,t,r,n)}request(e,t=null){return new W(this.makeRequest(e,t))}async makeRequest(e,t){const r=await e;null==t&&(t=r.maxRetries??this.maxRetries);const{req:n,url:s,timeout:u}=this.buildRequest(r);if(await this.prepareRequest(n,{url:s,options:r}),ce("request",s,r,n.headers),r.signal?.aborted)throw new o;const c=new AbortController,l=await this.fetchWithTimeout(s,n,u,c).catch(ie);if(l instanceof Error){if(r.signal?.aborted)throw new o;if(t)return this.retryRequest(r,t);if("AbortError"===l.name)throw new a;throw new i({cause:l})}const h=V(l.headers);if(!l.ok){if(t&&this.shouldRetry(l))return this.retryRequest(r,t,h);const e=await l.text().catch((e=>ie(e).message)),n=te(e),o=n?void 0:e;throw ce("response",l.status,s,h,o),this.makeStatusError(l.status,n,o,h)}return{response:l,options:r,controller:c}}requestAPIList(e,t){const r=this.makeRequest(t,null);return new K(this,r,e)}buildURL(e,t){const r=ne(e)?new URL(e):new URL(this.baseURL+(this.baseURL.endsWith("/")&&e.startsWith("/")?e.slice(1):e)),n=this.defaultQuery();return ue(n)||(t={...n,...t}),t&&(r.search=this.stringifyQuery(t)),r.toString()}stringifyQuery(e){return Object.entries(e).filter((([e,t])=>void 0!==t)).map((([e,t])=>{if("string"==typeof t||"number"==typeof t||"boolean"==typeof t)return`${encodeURIComponent(e)}=${encodeURIComponent(t)}`;if(null===t)return`${encodeURIComponent(e)}=`;throw new n(`Cannot stringify type ${typeof t}; Expected string, number, boolean, or null. If you need to pass nested query parameters, you can manually encode them, e.g. { query: { 'foo[key1]': value1, 'foo[key2]': value2 } }, and please open a GitHub issue requesting better support for your use case.`)})).join("&")}async fetchWithTimeout(e,t,r,n){const{signal:s,...o}=t||{};s&&s.addEventListener("abort",(()=>n.abort()));const i=setTimeout((()=>n.abort()),r);return this.getRequestClient().fetch.call(void 0,e,{signal:n.signal,...o}).finally((()=>{clearTimeout(i)}))}getRequestClient(){return{fetch:this.fetch}}shouldRetry(e){const t=e.headers.get("x-should-retry");return"true"===t||"false"!==t&&(408===e.status||409===e.status||429===e.status||e.status>=500)}async retryRequest(e,t,r){let n;t-=1;const s=r?.["retry-after"];if(s){const e=parseInt(s);n=Number.isNaN(e)?Date.parse(s)-Date.now():1e3*e}if(!n||!Number.isInteger(n)||n<=0||n>6e4){const r=e.maxRetries??this.maxRetries;n=this.calculateDefaultRetryTimeoutMillis(t,r)}return await se(n),this.makeRequest(e,t)}calculateDefaultRetryTimeoutMillis(e,t){const r=t-e;return 1e3*(Math.min(.5*Math.pow(r-1,2),2)+(Math.random()-.5))}getUserAgent(){return`${this.constructor.name}/JS ${r}`}}class G{constructor(e,t,r,n){X.set(this,void 0),function(e,t,r,n,s){if("m"===n)throw new TypeError("Private method is not writable");if("a"===n&&!s)throw new TypeError("Private accessor was defined without a setter");if("function"==typeof t?e!==t||!s:!t.has(e))throw new TypeError("Cannot write private member to an object whose class did not declare it");"a"===n?s.call(e,r):s?s.value=r:t.set(e,r)}(this,X,e,"f"),this.options=n,this.response=t,this.body=r}hasNextPage(){return!!this.getPaginatedItems().length&&null!=this.nextPageInfo()}async getNextPage(){const e=this.nextPageInfo();if(!e)throw new n("No next page expected; please check `.hasNextPage()` before calling `.getNextPage()`.");const t={...this.options};if("params"in e)t.query={...t.query,...e.params};else if("url"in e){const r=[...Object.entries(t.query||{}),...e.url.searchParams.entries()];for(const[t,n]of r)e.url.searchParams.set(t,n);t.query=void 0,t.path=e.url.toString()}return await function(e,t,r,n){if("a"===r&&!n)throw new TypeError("Private accessor was defined without a getter");if("function"==typeof t?e!==t||!n:!t.has(e))throw new TypeError("Cannot read private member from an object whose class did not declare it");return"m"===r?n:"a"===r?n.call(e):n?n.value:t.get(e)}(this,X,"f").requestAPIList(this.constructor,t)}async*iterPages(){let e=this;for(yield e;e.hasNextPage();)e=await e.getNextPage(),yield e}async*[(X=new WeakMap,Symbol.asyncIterator)](){for await(const e of this.iterPages())for(const t of e.getPaginatedItems())yield t}}class K extends W{constructor(e,t,r){super(t,(async t=>new r(e,t.response,await M(t),t.options)))}async*[Symbol.asyncIterator](){const e=await(this);for await(const t of e)yield t}}const V=e=>new Proxy(Object.fromEntries(e.entries()),{get(e,t){const r=t.toString();return e[r.toLowerCase()]||e[r]}}),J={method:!0,path:!0,query:!0,body:!0,headers:!0,maxRetries:!0,stream:!0,timeout:!0,httpAgent:!0,signal:!0,idempotencyKey:!0},z=e=>"object"==typeof e&&null!==e&&!ue(e)&&Object.keys(e).every((e=>function(e,t){return Object.prototype.hasOwnProperty.call(e,t)}(J,e))),Y=e=>"x32"===e?"x32":"x86_64"===e||"x64"===e?"x64":"arm"===e?"arm":"aarch64"===e||"arm64"===e?"arm64":e?`other:${e}`:"unknown",Q=e=>(e=e.toLowerCase()).includes("ios")?"iOS":"android"===e?"Android":"darwin"===e?"MacOS":"win32"===e?"Windows":"freebsd"===e?"FreeBSD":"openbsd"===e?"OpenBSD":"linux"===e?"Linux":e?`Other:${e}`:"Unknown";let Z;const ee=()=>Z??(Z=(()=>{if("undefined"!=typeof Deno&&null!=Deno.build)return{"X-Stainless-Lang":"js","X-Stainless-Package-Version":r,"X-Stainless-OS":Q(Deno.build.os),"X-Stainless-Arch":Y(Deno.build.arch),"X-Stainless-Runtime":"deno","X-Stainless-Runtime-Version":Deno.version};if("undefined"!=typeof EdgeRuntime)return{"X-Stainless-Lang":"js","X-Stainless-Package-Version":r,"X-Stainless-OS":"Unknown","X-Stainless-Arch":`other:${EdgeRuntime}`,"X-Stainless-Runtime":"edge","X-Stainless-Runtime-Version":process.version};if("[object process]"===Object.prototype.toString.call("undefined"!=typeof process?process:0))return{"X-Stainless-Lang":"js","X-Stainless-Package-Version":r,"X-Stainless-OS":Q(process.platform),"X-Stainless-Arch":Y(process.arch),"X-Stainless-Runtime":"node","X-Stainless-Runtime-Version":process.version};const e=function(){if("undefined"==typeof navigator||!navigator)return null;const e=[{key:"edge",pattern:/Edge(?:\W+(\d+)\.(\d+)(?:\.(\d+))?)?/},{key:"ie",pattern:/MSIE(?:\W+(\d+)\.(\d+)(?:\.(\d+))?)?/},{key:"ie",pattern:/Trident(?:.*rv\:(\d+)\.(\d+)(?:\.(\d+))?)?/},{key:"chrome",pattern:/Chrome(?:\W+(\d+)\.(\d+)(?:\.(\d+))?)?/},{key:"firefox",pattern:/Firefox(?:\W+(\d+)\.(\d+)(?:\.(\d+))?)?/},{key:"safari",pattern:/(?:Version\W+(\d+)\.(\d+)(?:\.(\d+))?)?(?:\W+Mobile\S*)?\W+Safari/}];for(const{key:t,pattern:r}of e){const e=r.exec(navigator.userAgent);if(e)return{browser:t,version:`${e[1]||0}.${e[2]||0}.${e[3]||0}`}}return null}();return e?{"X-Stainless-Lang":"js","X-Stainless-Package-Version":r,"X-Stainless-OS":"Unknown","X-Stainless-Arch":"unknown","X-Stainless-Runtime":`browser:${e.browser}`,"X-Stainless-Runtime-Version":e.version}:{"X-Stainless-Lang":"js","X-Stainless-Package-Version":r,"X-Stainless-OS":"Unknown","X-Stainless-Arch":"unknown","X-Stainless-Runtime":"unknown","X-Stainless-Runtime-Version":"unknown"}})()),te=e=>{try{return JSON.parse(e)}catch(e){return}},re=new RegExp("^(?:[a-z]+:)?//","i"),ne=e=>re.test(e),se=e=>new Promise((t=>setTimeout(t,e))),oe=(e,t)=>{if("number"!=typeof t||!Number.isInteger(t))throw new n(`${e} must be an integer`);if(t<0)throw new n(`${e} must be a positive integer`);return t},ie=e=>e instanceof Error?e:new Error(e),ae=e=>"undefined"!=typeof process?"MISSING_ENV_VAR"?.[e]??void 0:"undefined"!=typeof Deno?Deno.env?.get?.(e):void 0;function ue(e){if(!e)return!0;for(const t in e)return!1;return!0}function ce(e,...t){"undefined"!=typeof process&&"true"==="MISSING_ENV_VAR".DEBUG&&console.log(`OpenAI:DEBUG:${e}`,...t)}const le=()=>"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,(e=>{const t=16*Math.random()|0;return("x"===e?t:3&t|8).toString(16)}));class he extends G{constructor(e,t,r,n){super(e,t,r,n),this.data=r.data,this.object=r.object}getPaginatedItems(){return this.data}nextPageParams(){return null}nextPageInfo(){return null}}class de extends G{constructor(e,t,r,n){super(e,t,r,n),this.data=r.data}getPaginatedItems(){return this.data}nextPageParams(){const e=this.nextPageInfo();if(!e)return null;if("params"in e)return e.params;const t=Object.fromEntries(e.url.searchParams);return Object.keys(t).length?t:null}nextPageInfo(){if(!this.data?.length)return null;const e=this.data[this.data.length-1]?.id;return e?{params:{after:e}}:null}}class fe{constructor(e){this.client=e,this.get=e.get.bind(e),this.post=e.post.bind(e),this.patch=e.patch.bind(e),this.put=e.put.bind(e),this.delete=e.delete.bind(e),this.getAPIList=e.getAPIList.bind(e)}}class pe extends fe{create(e,t){return this.post("/completions",{body:e,...t,stream:e.stream??!1})}}pe||(pe={});class ye extends fe{create(e,t){return this.post("/chat/completions",{body:e,...t,stream:e.stream??!1})}}ye||(ye={});class me extends fe{constructor(){super(...arguments),this.completions=new ye(this.client)}}!function(e){e.Completions=ye}(me||(me={}));class ge extends fe{create(e,t){return this.post("/edits",{body:e,...t})}}ge||(ge={});class we extends fe{create(e,t){return this.post("/embeddings",{body:e,...t})}}we||(we={});class be extends fe{create(e,t){return this.post("/files",B({body:e,...t}))}retrieve(e,t){return this.get(`/files/${e}`,t)}list(e){return this.getAPIList("/files",ve,e)}del(e,t){return this.delete(`/files/${e}`,t)}retrieveContent(e,t){return this.get(`/files/${e}/content`,{...t,headers:{Accept:"application/json",...t?.headers}})}async waitForProcessing(e,{pollInterval:t=5e3,maxWait:r=18e5}={}){const n=new Set(["processed","error","deleted"]),s=Date.now();let o=await this.retrieve(e);for(;!o.status||!n.has(o.status);)if(await se(t),o=await this.retrieve(e),Date.now()-s>r)throw new a({message:`Giving up on waiting for file ${e} to finish processing after ${r} milliseconds.`});return o}}class ve extends he{}!function(e){e.FileObjectsPage=ve}(be||(be={}));class xe extends fe{createVariation(e,t){return this.post("/images/variations",B({body:e,...t}))}edit(e,t){return this.post("/images/edits",B({body:e,...t}))}generate(e,t){return this.post("/images/generations",{body:e,...t})}}xe||(xe={});class Ee extends fe{create(e,t){return this.post("/audio/transcriptions",B({body:e,...t}))}}Ee||(Ee={});class Pe extends fe{create(e,t){return this.post("/audio/translations",B({body:e,...t}))}}Pe||(Pe={});class Se extends fe{constructor(){super(...arguments),this.transcriptions=new Ee(this.client),this.translations=new Pe(this.client)}}!function(e){e.Transcriptions=Ee,e.Translations=Pe}(Se||(Se={}));class Re extends fe{create(e,t){return this.post("/moderations",{body:e,...t})}}Re||(Re={});class Ae extends fe{retrieve(e,t){return this.get(`/models/${e}`,t)}list(e){return this.getAPIList("/models",Ie,e)}del(e,t){return this.delete(`/models/${e}`,t)}}class Ie extends he{}!function(e){e.ModelsPage=Ie}(Ae||(Ae={}));class Le extends fe{create(e,t){return this.post("/fine_tuning/jobs",{body:e,...t})}retrieve(e,t){return this.get(`/fine_tuning/jobs/${e}`,t)}list(e={},t){return z(e)?this.list({},e):this.getAPIList("/fine_tuning/jobs",ke,{query:e,...t})}cancel(e,t){return this.post(`/fine_tuning/jobs/${e}/cancel`,t)}listEvents(e,t={},r){return z(t)?this.listEvents(e,{},t):this.getAPIList(`/fine_tuning/jobs/${e}/events`,Oe,{query:t,...r})}}class ke extends de{}class Oe extends de{}!function(e){e.FineTuningJobsPage=ke,e.FineTuningJobEventsPage=Oe}(Le||(Le={}));class je extends fe{constructor(){super(...arguments),this.jobs=new Le(this.client)}}!function(e){e.Jobs=Le,e.FineTuningJobsPage=ke,e.FineTuningJobEventsPage=Oe}(je||(je={}));class Te extends fe{create(e,t){return this.post("/fine-tunes",{body:e,...t})}retrieve(e,t){return this.get(`/fine-tunes/${e}`,t)}list(e){return this.getAPIList("/fine-tunes",$e,e)}cancel(e,t){return this.post(`/fine-tunes/${e}/cancel`,t)}listEvents(e,t,r){return this.get(`/fine-tunes/${e}/events`,{query:t,timeout:864e5,...r,stream:t?.stream??!1})}}class $e extends he{}var qe;!function(e){e.FineTunesPage=$e}(Te||(Te={}));class Ne extends H{constructor({apiKey:e=ae("OPENAI_API_KEY"),organization:t=ae("OPENAI_ORG_ID")??null,...r}={}){if(void 0===e)throw new n("The OPENAI_API_KEY environment variable is missing or empty; either provide it, or instantiate the OpenAI client with an apiKey option, like new OpenAI({ apiKey: 'my apiKey' }).");const s={apiKey:e,organization:t,...r,baseURL:r.baseURL??"https://api.openai.com/v1"};if(!s.dangerouslyAllowBrowser&&"undefined"!=typeof window&&void 0!==window.document&&"undefined"!=typeof navigator)throw new n("It looks like you're running in a browser-like environment.\n\nThis is disabled by default, as it risks exposing your secret API credentials to attackers.\nIf you understand the risks and have appropriate mitigations in place,\nyou can set the `dangerouslyAllowBrowser` option to `true`, e.g.,\n\nnew OpenAI({ apiKey, dangerouslyAllowBrowser: true });\n\nhttps://help.openai.com/en/articles/5112595-best-practices-for-api-key-safety\n");super({baseURL:s.baseURL,timeout:s.timeout??6e5,httpAgent:s.httpAgent,maxRetries:s.maxRetries,fetch:s.fetch}),this.completions=new pe(this),this.chat=new me(this),this.edits=new ge(this),this.embeddings=new we(this),this.files=new be(this),this.images=new xe(this),this.audio=new Se(this),this.moderations=new Re(this),this.models=new Ae(this),this.fineTuning=new je(this),this.fineTunes=new Te(this),this._options=s,this.apiKey=e,this.organization=t}defaultQuery(){return this._options.defaultQuery}defaultHeaders(e){return{...super.defaultHeaders(e),"OpenAI-Organization":this.organization,...this._options.defaultHeaders}}authHeaders(e){return{Authorization:`Bearer ${this.apiKey}`}}}qe=Ne,Ne.OpenAI=qe,Ne.OpenAIError=n,Ne.APIError=s,Ne.APIConnectionError=i,Ne.APIConnectionTimeoutError=a,Ne.APIUserAbortError=o,Ne.NotFoundError=h,Ne.ConflictError=d,Ne.RateLimitError=p,Ne.BadRequestError=u,Ne.AuthenticationError=c,Ne.InternalServerError=y,Ne.PermissionDeniedError=l,Ne.UnprocessableEntityError=f;const{OpenAIError:Ce,APIError:Fe,APIConnectionError:_e,APIConnectionTimeoutError:Be,APIUserAbortError:Ue,NotFoundError:De,ConflictError:Xe,RateLimitError:Me,BadRequestError:We,AuthenticationError:He,InternalServerError:Ge,PermissionDeniedError:Ke,UnprocessableEntityError:Ve}=t;function Je(e){return Je="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},Je(e)}function ze(){ze=function(){return t};var e,t={},r=Object.prototype,n=r.hasOwnProperty,s=Object.defineProperty||function(e,t,r){e[t]=r.value},o="function"==typeof Symbol?Symbol:{},i=o.iterator||"@@iterator",a=o.asyncIterator||"@@asyncIterator",u=o.toStringTag||"@@toStringTag";function c(e,t,r){return Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}),e[t]}try{c({},"")}catch(e){c=function(e,t,r){return e[t]=r}}function l(e,t,r,n){var o=t&&t.prototype instanceof g?t:g,i=Object.create(o.prototype),a=new O(n||[]);return s(i,"_invoke",{value:A(e,r,a)}),i}function h(e,t,r){try{return{type:"normal",arg:e.call(t,r)}}catch(e){return{type:"throw",arg:e}}}t.wrap=l;var d="suspendedStart",f="suspendedYield",p="executing",y="completed",m={};function g(){}function w(){}function b(){}var v={};c(v,i,(function(){return this}));var x=Object.getPrototypeOf,E=x&&x(x(j([])));E&&E!==r&&n.call(E,i)&&(v=E);var P=b.prototype=g.prototype=Object.create(v);function S(e){["next","throw","return"].forEach((function(t){c(e,t,(function(e){return this._invoke(t,e)}))}))}function R(e,t){function r(s,o,i,a){var u=h(e[s],e,o);if("throw"!==u.type){var c=u.arg,l=c.value;return l&&"object"==Je(l)&&n.call(l,"__await")?t.resolve(l.__await).then((function(e){r("next",e,i,a)}),(function(e){r("throw",e,i,a)})):t.resolve(l).then((function(e){c.value=e,i(c)}),(function(e){return r("throw",e,i,a)}))}a(u.arg)}var o;s(this,"_invoke",{value:function(e,n){function s(){return new t((function(t,s){r(e,n,t,s)}))}return o=o?o.then(s,s):s()}})}function A(t,r,n){var s=d;return function(o,i){if(s===p)throw new Error("Generator is already running");if(s===y){if("throw"===o)throw i;return{value:e,done:!0}}for(n.method=o,n.arg=i;;){var a=n.delegate;if(a){var u=I(a,n);if(u){if(u===m)continue;return u}}if("next"===n.method)n.sent=n._sent=n.arg;else if("throw"===n.method){if(s===d)throw s=y,n.arg;n.dispatchException(n.arg)}else"return"===n.method&&n.abrupt("return",n.arg);s=p;var c=h(t,r,n);if("normal"===c.type){if(s=n.done?y:f,c.arg===m)continue;return{value:c.arg,done:n.done}}"throw"===c.type&&(s=y,n.method="throw",n.arg=c.arg)}}}function I(t,r){var n=r.method,s=t.iterator[n];if(s===e)return r.delegate=null,"throw"===n&&t.iterator.return&&(r.method="return",r.arg=e,I(t,r),"throw"===r.method)||"return"!==n&&(r.method="throw",r.arg=new TypeError("The iterator does not provide a '"+n+"' method")),m;var o=h(s,t.iterator,r.arg);if("throw"===o.type)return r.method="throw",r.arg=o.arg,r.delegate=null,m;var i=o.arg;return i?i.done?(r[t.resultName]=i.value,r.next=t.nextLoc,"return"!==r.method&&(r.method="next",r.arg=e),r.delegate=null,m):i:(r.method="throw",r.arg=new TypeError("iterator result is not an object"),r.delegate=null,m)}function L(e){var t={tryLoc:e[0]};1 in e&&(t.catchLoc=e[1]),2 in e&&(t.finallyLoc=e[2],t.afterLoc=e[3]),this.tryEntries.push(t)}function k(e){var t=e.completion||{};t.type="normal",delete t.arg,e.completion=t}function O(e){this.tryEntries=[{tryLoc:"root"}],e.forEach(L,this),this.reset(!0)}function j(t){if(t||""===t){var r=t[i];if(r)return r.call(t);if("function"==typeof t.next)return t;if(!isNaN(t.length)){var s=-1,o=function r(){for(;++s<t.length;)if(n.call(t,s))return r.value=t[s],r.done=!1,r;return r.value=e,r.done=!0,r};return o.next=o}}throw new TypeError(Je(t)+" is not iterable")}return w.prototype=b,s(P,"constructor",{value:b,configurable:!0}),s(b,"constructor",{value:w,configurable:!0}),w.displayName=c(b,u,"GeneratorFunction"),t.isGeneratorFunction=function(e){var t="function"==typeof e&&e.constructor;return!!t&&(t===w||"GeneratorFunction"===(t.displayName||t.name))},t.mark=function(e){return Object.setPrototypeOf?Object.setPrototypeOf(e,b):(e.__proto__=b,c(e,u,"GeneratorFunction")),e.prototype=Object.create(P),e},t.awrap=function(e){return{__await:e}},S(R.prototype),c(R.prototype,a,(function(){return this})),t.AsyncIterator=R,t.async=function(e,r,n,s,o){void 0===o&&(o=Promise);var i=new R(l(e,r,n,s),o);return t.isGeneratorFunction(r)?i:i.next().then((function(e){return e.done?e.value:i.next()}))},S(P),c(P,u,"Generator"),c(P,i,(function(){return this})),c(P,"toString",(function(){return"[object Generator]"})),t.keys=function(e){var t=Object(e),r=[];for(var n in t)r.push(n);return r.reverse(),function e(){for(;r.length;){var n=r.pop();if(n in t)return e.value=n,e.done=!1,e}return e.done=!0,e}},t.values=j,O.prototype={constructor:O,reset:function(t){if(this.prev=0,this.next=0,this.sent=this._sent=e,this.done=!1,this.delegate=null,this.method="next",this.arg=e,this.tryEntries.forEach(k),!t)for(var r in this)"t"===r.charAt(0)&&n.call(this,r)&&!isNaN(+r.slice(1))&&(this[r]=e)},stop:function(){this.done=!0;var e=this.tryEntries[0].completion;if("throw"===e.type)throw e.arg;return this.rval},dispatchException:function(t){if(this.done)throw t;var r=this;function s(n,s){return a.type="throw",a.arg=t,r.next=n,s&&(r.method="next",r.arg=e),!!s}for(var o=this.tryEntries.length-1;o>=0;--o){var i=this.tryEntries[o],a=i.completion;if("root"===i.tryLoc)return s("end");if(i.tryLoc<=this.prev){var u=n.call(i,"catchLoc"),c=n.call(i,"finallyLoc");if(u&&c){if(this.prev<i.catchLoc)return s(i.catchLoc,!0);if(this.prev<i.finallyLoc)return s(i.finallyLoc)}else if(u){if(this.prev<i.catchLoc)return s(i.catchLoc,!0)}else{if(!c)throw new Error("try statement without catch or finally");if(this.prev<i.finallyLoc)return s(i.finallyLoc)}}}},abrupt:function(e,t){for(var r=this.tryEntries.length-1;r>=0;--r){var s=this.tryEntries[r];if(s.tryLoc<=this.prev&&n.call(s,"finallyLoc")&&this.prev<s.finallyLoc){var o=s;break}}o&&("break"===e||"continue"===e)&&o.tryLoc<=t&&t<=o.finallyLoc&&(o=null);var i=o?o.completion:{};return i.type=e,i.arg=t,o?(this.method="next",this.next=o.finallyLoc,m):this.complete(i)},complete:function(e,t){if("throw"===e.type)throw e.arg;return"break"===e.type||"continue"===e.type?this.next=e.arg:"return"===e.type?(this.rval=this.arg=e.arg,this.method="return",this.next="end"):"normal"===e.type&&t&&(this.next=t),m},finish:function(e){for(var t=this.tryEntries.length-1;t>=0;--t){var r=this.tryEntries[t];if(r.finallyLoc===e)return this.complete(r.completion,r.afterLoc),k(r),m}},catch:function(e){for(var t=this.tryEntries.length-1;t>=0;--t){var r=this.tryEntries[t];if(r.tryLoc===e){var n=r.completion;if("throw"===n.type){var s=n.arg;k(r)}return s}}throw new Error("illegal catch attempt")},delegateYield:function(t,r,n){return this.delegate={iterator:j(t),resultName:r,nextLoc:n},"next"===this.method&&(this.arg=e),m}},t}function Ye(e,t,r,n,s,o,i){try{var a=e[o](i),u=a.value}catch(e){return void r(e)}a.done?t(u):Promise.resolve(u).then(n,s)}!function(e){e.toFile=N,e.fileFromPath=R,e.Page=he,e.CursorPage=de,e.Completions=pe,e.Chat=me,e.Edits=ge,e.Embeddings=we,e.Files=be,e.FileObjectsPage=ve,e.Images=xe,e.Audio=Se,e.Moderations=Re,e.Models=Ae,e.ModelsPage=Ie,e.FineTuning=je,e.FineTunes=Te,e.FineTunesPage=$e}(Ne||(Ne={}));var Qe=new Ne({apiKey:"",dangerouslyAllowBrowser:!0}),Ze=[];function et(){var e;return e=ze().mark((function e(t){var r,n,s;return ze().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,Qe.chat.completions.create({model:"gpt-4-1106-preview",messages:[{role:"system",content:"You are a helpful assistant."},{role:"user",content:t}],max_tokens:2e3});case 3:r=e.sent,console.log(r),r.hasOwnProperty("choices")&&r.choices.length>0?(n=r.choices[0].message.content,s=document.getElementById("summary"),console.log(n),s?s.textContent=n:console.error('Element with ID "summary" not found.')):r.hasOwnProperty("error")&&console.error("Error from OpenAI API:",r.error.message),e.next=11;break;case 8:e.prev=8,e.t0=e.catch(0),console.error("Error generating summary: ",e.t0);case 11:case"end":return e.stop()}}),e,null,[[0,8]])})),et=function(){var t=this,r=arguments;return new Promise((function(n,s){var o=e.apply(t,r);function i(e){Ye(o,n,s,i,a,"next",e)}function a(e){Ye(o,n,s,i,a,"throw",e)}i(void 0)}))},et.apply(this,arguments)}document.getElementById("myButton").addEventListener("click",(function(){chrome.tabs.query({active:!0,currentWindow:!0},(function(e){var t=e[0].url;fetch(t).then((function(e){return e.text()})).then((function(e){!function(e){(new DOMParser).parseFromString(e,"text/html").querySelectorAll("p, td, ul, h1, h2, h3").forEach((function(e){Ze.push(e.textContent)}));var t="Please provide a concise summary of the core information of the following, ignore any links provided you are acting as a summary tool in a browser extension: "+Ze.join("\n");if(t.split(" ").length>4096){var r=t.split(" ");t=r.slice(0,4096).join(" ")}console.log(t),function(e){et.apply(this,arguments)}(t)}(e)}))}))})),document.getElementById("x").addEventListener("click",(function(){document.getElementById("x").style.display="none",window.close()})),document.getElementById("copyButton").addEventListener("click",(function(){var e=document.getElementById("summary").innerText,t=document.createElement("textarea");t.value=e,document.body.appendChild(t),t.select(),document.execCommand("copy"),document.body.removeChild(t),alert("Text copied to clipboard!")}))})();
//# sourceMappingURL=content.bundle.js.map