"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[4758],{1318:function(n,e){e.Z={endpoint:function(n){return{title:"API URL",bash:{language:"bash",code:"".concat(n)},js:{language:"bash",code:"".concat(n)}}},install:function(){return{title:"Install",bash:null,js:{language:"bash",code:"npm install --save @supabase/supabase-js"}}},init:function(n){return{title:"Initializing",bash:{language:"bash",code:"# No client library required for Bash."},js:{language:"js",code:"\nimport { createClient } from '@supabase/supabase-js'\n\nconst supabaseUrl = '".concat(n,"'\nconst supabaseKey = process.env.SUPABASE_KEY\nconst supabase = createClient(supabaseUrl, supabaseKey)")},python:{language:"python",code:"\nimport os\nfrom supabase import create_client, Client\n\nurl: str = '".concat(n,'\'\nkey: str = os.environ.get("SUPABASE_KEY")\nsupabase: Client = create_client(url, key)\n')},dart:{language:"dart",code:"\nconst supabaseUrl = '".concat(n,"';\nconst supabaseKey = String.fromEnvironment('SUPABASE_KEY');\n\nFuture<void> main() async {\n  await Supabase.initialize(url: supabaseUrl, anonKey: supabaseKey);\n  runApp(MyApp());\n}")}}},authKey:function(n,e,a){return{title:"".concat(n),bash:{language:"bash",code:"".concat(a)},js:{language:"js",code:"const ".concat(e," = '").concat(a,"'")}}},authKeyExample:function(n,e,a){var t=a.keyName,o=a.showBearer,c=void 0===o||o;return{title:"Example usage",bash:{language:"bash",code:"\ncurl '".concat(e,"/rest/v1/' \\\n-H \"apikey: ").concat(n,'" ').concat(c?'\\\n-H "Authorization: Bearer '.concat(n,'"'):"","\n")},js:{language:"js",code:'\nconst SUPABASE_URL = "'.concat(e,'"\n\nconst supabase = createClient(SUPABASE_URL, process.env.').concat(t||"SUPABASE_KEY",");\n")}}},rpcSingle:function(n){var e=n.rpcName,a=n.rpcParams,t=n.endpoint,o=n.apiKey,c=n.showBearer,r=void 0===c||c,s=a.map((function(n){return'"'.concat(n.name,'": "value"')})).join(", "),u=!a.length,i=u?"":"\n-d '{ ".concat(s," }' \\"),l=u?"":", {".concat(a.length?a.map((function(n){return"\n    ".concat(n.name)})).join(", ").concat("\n  "):"","}");return{title:"Invoke function ",bash:{language:"bash",code:"\ncurl -X POST '".concat(t,"/rest/v1/rpc/").concat(e,"' \\").concat(i,'\n-H "Content-Type: application/json" \\\n-H "apikey: ').concat(o,'" ').concat(r?'\\\n-H "Authorization: Bearer '.concat(o,'"'):"","\n")},js:{language:"js",code:"\nlet { data, error } = await supabase\n  .rpc('".concat(e,"'").concat(l,")\n\nif (error) console.error(error)\nelse console.log(data)\n")}}},subscribeAll:function(n,e){return{title:"Subscribe to all events",bash:{language:"bash",code:"# Realtime streams are only supported by our client libraries"},js:{language:"js",code:"\nconst ".concat(n," = supabase.channel('custom-all-channel')\n  .on(\n    'postgres_changes',\n    { event: '*', schema: 'public', table: '").concat(e,"' },\n    (payload) => {\n      console.log('Change received!', payload)\n    }\n  )\n  .subscribe()")}}},subscribeInserts:function(n,e){return{title:"Subscribe to inserts",bash:{language:"bash",code:"# Realtime streams are only supported by our client libraries"},js:{language:"js",code:"\nconst ".concat(n," = supabase.channel('custom-insert-channel')\n  .on(\n    'postgres_changes',\n    { event: 'INSERT', schema: 'public', table: '").concat(e,"' },\n    (payload) => {\n      console.log('Change received!', payload)\n    }\n  )\n  .subscribe()")}}},subscribeUpdates:function(n,e){return{title:"Subscribe to updates",bash:{language:"bash",code:"# Realtime streams are only supported by our client libraries"},js:{language:"js",code:"\nconst ".concat(n," = supabase.channel('custom-update-channel')\n  .on(\n    'postgres_changes',\n    { event: 'UPDATE', schema: 'public', table: '").concat(e,"' },\n    (payload) => {\n      console.log('Change received!', payload)\n    }\n  )\n  .subscribe()")}}},subscribeDeletes:function(n,e){return{title:"Subscribe to deletes",bash:{language:"bash",code:"# Realtime streams are only supported by our client libraries"},js:{language:"js",code:"\nconst ".concat(n," = supabase.channel('custom-delete-channel')\n  .on(\n    'postgres_changes',\n    { event: 'DELETE', schema: 'public', table: '").concat(e,"' },\n    (payload) => {\n      console.log('Change received!', payload)\n    }\n  )\n  .subscribe()")}}},subscribeEq:function(n,e,a,t){return{title:"Subscribe to specific rows",bash:{language:"bash",code:"# Realtime streams are only supported by our client libraries"},js:{language:"js",code:"\nconst ".concat(n," = supabase.channel('custom-filter-channel')\n  .on(\n    'postgres_changes',\n    { event: '*', schema: 'public', table: '").concat(e,"', filter: '").concat(a,"=eq.").concat(t,"' },\n    (payload) => {\n      console.log('Change received!', payload)\n    }\n  )\n  .subscribe()")}}},readAll:function(n,e,a){return{title:"Read all rows",bash:{language:"bash",code:"\ncurl '".concat(e,"/rest/v1/").concat(n,"?select=*' \\\n-H \"apikey: ").concat(a,'" \\\n-H "Authorization: Bearer ').concat(a,'"\n')},js:{language:"js",code:"\nlet { data: ".concat(n,", error } = await supabase\n  .from('").concat(n,"')\n  .select('*')\n")}}},readColumns:function(n){var e=n.title,a=void 0===e?"Read specific columns":e,t=n.resourceId,o=n.endpoint,c=n.apiKey,r=n.columnName,s=void 0===r?"some_column,other_column":r;return{title:a,bash:{language:"bash",code:"\ncurl '".concat(o,"/rest/v1/").concat(t,"?select=").concat(s,"' \\\n-H \"apikey: ").concat(c,'" \\\n-H "Authorization: Bearer ').concat(c,'"\n')},js:{language:"js",code:"\nlet { data: ".concat(t,", error } = await supabase\n  .from('").concat(t,"')\n  .select('").concat(s,"')\n")}}},readForeignTables:function(n,e,a){return{title:"Read foreign tables",bash:{language:"bash",code:"\ncurl '".concat(e,"/rest/v1/").concat(n,"?select=some_column,other_table(foreign_key)' \\\n-H \"apikey: ").concat(a,'" \\\n-H "Authorization: Bearer ').concat(a,'"\n')},js:{language:"js",code:"\nlet { data: ".concat(n,", error } = await supabase\n  .from('").concat(n,"')\n  .select(`\n    some_column,\n    other_table (\n      foreign_key\n    )\n  `)\n")}}},readRange:function(n,e,a){return{title:"With pagination",bash:{language:"bash",code:"\ncurl '".concat(e,"/rest/v1/").concat(n,"?select=*' \\\n-H \"apikey: ").concat(a,'" \\\n-H "Authorization: Bearer ').concat(a,'" \\\n-H "Range: 0-9"\n')},js:{language:"js",code:"\nlet { data: ".concat(n,", error } = await supabase\n  .from('").concat(n,"')\n  .select('*')\n  .range(0, 9)\n")}}},readFilters:function(n,e,a){return{title:"With filtering",bash:{language:"bash",code:"\ncurl '".concat(e,"/rest/v1/").concat(n,"?id=eq.1&select=*' \\\n-H \"apikey: ").concat(a,'" \\\n-H "Authorization: Bearer ').concat(a,'" \\\n-H "Range: 0-9"\n')},js:{language:"js",code:"\nlet { data: ".concat(n,", error } = await supabase\n  .from('").concat(n,"')\n  .select(\"*\")\n\n  // Filters\n  .eq('column', 'Equal to')\n  .gt('column', 'Greater than')\n  .lt('column', 'Less than')\n  .gte('column', 'Greater than or equal to')\n  .lte('column', 'Less than or equal to')\n  .like('column', '%CaseSensitive%')\n  .ilike('column', '%CaseInsensitive%')\n  .is('column', null)\n  .in('column', ['Array', 'Values'])\n  .neq('column', 'Not equal to')\n\n  // Arrays\n  .cs('array_column', ['array', 'contains'])\n  .cd('array_column', ['contained', 'by'])\n\n")}}},insertSingle:function(n,e,a){return{title:"Insert a row",bash:{language:"bash",code:"\ncurl -X POST '".concat(e,"/rest/v1/").concat(n,"' \\\n-H \"apikey: ").concat(a,'" \\\n-H "Authorization: Bearer ').concat(a,'" \\\n-H "Content-Type: application/json" \\\n-H "Prefer: return=minimal" \\\n-d \'{ "some_column": "someValue", "other_column": "otherValue" }\'\n')},js:{language:"js",code:"\nconst { data, error } = await supabase\n  .from('".concat(n,"')\n  .insert([\n    { some_column: 'someValue', other_column: 'otherValue' },\n  ])\n  .select()\n")}}},insertMany:function(n,e,a){return{title:"Insert many rows",bash:{language:"bash",code:"\ncurl -X POST '".concat(e,"/rest/v1/").concat(n,"' \\\n-H \"apikey: ").concat(a,'" \\\n-H "Authorization: Bearer ').concat(a,'" \\\n-H "Content-Type: application/json" \\\n-d \'[{ "some_column": "someValue" }, { "other_column": "otherValue" }]\'\n')},js:{language:"js",code:"\nconst { data, error } = await supabase\n  .from('".concat(n,"')\n  .insert([\n    { some_column: 'someValue' },\n    { some_column: 'otherValue' },\n  ])\n  .select()\n")}}},upsert:function(n,e,a){return{title:"Upsert matching rows",bash:{language:"bash",code:"\ncurl -X POST '".concat(e,"/rest/v1/").concat(n,"' \\\n-H \"apikey: ").concat(a,'" \\\n-H "Authorization: Bearer ').concat(a,'" \\\n-H "Content-Type: application/json" \\\n-H "Prefer: resolution=merge-duplicates" \\\n-d \'{ "some_column": "someValue", "other_column": "otherValue" }\'\n')},js:{language:"js",code:"\nconst { data, error } = await supabase\n  .from('".concat(n,"')\n  .upsert({ some_column: 'someValue' })\n  .select()\n")}}},update:function(n,e,a){return{title:"Update matching rows",bash:{language:"bash",code:"\ncurl -X PATCH '".concat(e,"/rest/v1/").concat(n,"?some_column=eq.someValue' \\\n-H \"apikey: ").concat(a,'" \\\n-H "Authorization: Bearer ').concat(a,'" \\\n-H "Content-Type: application/json" \\\n-H "Prefer: return=minimal" \\\n-d \'{ "other_column": "otherValue" }\'\n')},js:{language:"js",code:"\nconst { data, error } = await supabase\n  .from('".concat(n,"')\n  .update({ other_column: 'otherValue' })\n  .eq('some_column', 'someValue')\n  .select()\n")}}},delete:function(n,e,a){return{title:"Delete matching rows",bash:{language:"bash",code:"\ncurl -X DELETE '".concat(e,"/rest/v1/").concat(n,"?some_column=eq.someValue' \\\n-H \"apikey: ").concat(a,'" \\\n-H "Authorization: Bearer ').concat(a,'"\n')},js:{language:"js",code:"\nconst { error } = await supabase\n  .from('".concat(n,"')\n  .delete()\n  .eq('some_column', 'someValue')\n")}}},authSignup:function(n,e,a){return{title:"User signup",bash:{language:"bash",code:"\ncurl -X POST '".concat(n,"/auth/v1/signup' \\\n-H \"apikey: ").concat(e,'" \\\n-H "Content-Type: application/json" \\\n-d \'{\n  "email": "someone@email.com",\n  "password": "').concat(a,"\"\n}'\n")},js:{language:"js",code:"\nlet { data, error } = await supabase.auth.signUp({\n  email: 'someone@email.com',\n  password: '".concat(a,"'\n})\n")}}},authLogin:function(n,e,a){return{title:"User login",bash:{language:"bash",code:"\ncurl -X POST '".concat(n,"/auth/v1/token?grant_type=password' \\\n-H \"apikey: ").concat(e,'" \\\n-H "Content-Type: application/json" \\\n-d \'{\n  "email": "someone@email.com",\n  "password": "').concat(a,"\"\n}'\n")},js:{language:"js",code:"\nlet { data, error } = await supabase.auth.signInWithPassword({\n  email: 'someone@email.com',\n  password: '".concat(a,"'\n})\n")}}},authMagicLink:function(n,e){return{title:"User login",bash:{language:"bash",code:"\ncurl -X POST '".concat(n,"/auth/v1/magiclink' \\\n-H \"apikey: ").concat(e,'" \\\n-H "Content-Type: application/json" \\\n-d \'{\n  "email": "someone@email.com"\n}\'\n')},js:{language:"js",code:"\nlet { data, error } = await supabase.auth.signInWithOtp({\n  email: 'someone@email.com'\n})\n"}}},authPhoneSignUp:function(n,e){return{title:"Phone Signup",bash:{language:"bash",code:"\ncurl -X POST '".concat(n,"/auth/v1/signup' \\\n-H \"apikey: ").concat(e,'" \\\n-H "Content-Type: application/json" \\\n-d \'{\n  "phone": "+13334445555",\n  "password": "some-password"\n}\'\n')},js:{language:"js",code:"\nlet { data, error } = await supabase.auth.signUp({\n  phone: '+13334445555',\n  password: 'some-password'\n})\n"}}},authMobileOTPLogin:function(n,e){return{title:"Phone Login",bash:{language:"bash",code:"\ncurl -X POST '".concat(n,"/auth/v1/otp' \\\n-H \"apikey: ").concat(e,'" \\\n-H "Content-Type: application/json" \\\n-d \'{\n  "phone": "+13334445555"\n}\'\n')},js:{language:"js",code:"\nlet { data, error } = await supabase.auth.signInWithOtp({\n  phone: '+13334445555'\n})\n"}}},authMobileOTPVerify:function(n,e){return{title:"Verify Pin",bash:{language:"bash",code:"\ncurl -X POST '".concat(n,"/auth/v1/verify' \\\n-H \"apikey: ").concat(e,'" \\\n-H "Content-Type: application/json" \\\n-d \'{\n  "type": "sms",\n  "phone": "+13334445555",\n  "token": "123456"\n}\'\n')},js:{language:"js",code:"\nlet { data, error } = await supabase.auth.verifyOtp({\n  phone: '+13334445555',\n  token: '123456',\n  type: 'sms'\n})\n"}}},authInvite:function(n,e){return{title:"Invite User",bash:{language:"bash",code:"\ncurl -X POST '".concat(n,"/auth/v1/invite' \\\n-H \"apikey: ").concat(e,'" \\\n-H "Authorization: Bearer ').concat(e,'" \\\n-H "Content-Type: application/json" \\\n-d \'{\n  "email": "someone@email.com"\n}\'\n')},js:{language:"js",code:"\nlet { data, error } = await supabase.auth.api.inviteUserByEmail('someone@email.com')\n"}}},authThirdPartyLogin:function(n,e){return{title:"Third Party Login",bash:{language:"bash",code:""},js:{language:"js",code:"\nlet { data, error } = await supabase.auth.signInWithOAuth({\n  provider: 'github'\n})\n"}}},authUser:function(n,e){return{title:"Get User",bash:{language:"bash",code:"\ncurl -X GET '".concat(n,"/auth/v1/user' \\\n-H \"apikey: ").concat(e,'" \\\n-H "Authorization: Bearer USER_TOKEN"\n')},js:{language:"js",code:"\nconst { data: { user } } = await supabase.auth.getUser()\n"}}},authRecover:function(n,e){return{title:"Password Recovery",bash:{language:"bash",code:"\n      curl -X POST '".concat(n,"/auth/v1/recover' \\\n-H \"apikey: ").concat(e,'" \\\n-H "Content-Type: application/json" \\\n-d \'{\n  "email": "someone@email.com"\n}\'\n')},js:{language:"js",code:"\nlet { data, error } = await supabase.auth.resetPasswordForEmail(email)\n"}}},authUpdate:function(n,e){return{title:"Update User",bash:{language:"bash",code:"\n      curl -X PUT '".concat(n,"/auth/v1/user' \\\n-H \"apikey: ").concat(e,'" \\\n-H "Authorization: Bearer <USERS-ACCESS-TOKEN>" \\\n-H "Content-Type: application/json" \\\n-d \'{\n  "email": "someone@email.com",\n  "password": "new-password",\n  "data": {\n    "key": "value"\n  }\n}\'\n')},js:{language:"js",code:'\nconst { data, error } = await supabase.auth.updateUser({\n  email: "new@email.com",\n  password: "new-password",\n  data: { hello: \'world\' }\n})\n'}}},authLogout:function(n,e,a){return{title:"User logout",bash:{language:"bash",code:"\ncurl -X POST '".concat(n,"/auth/v1/logout' \\\n-H \"apikey: ").concat(e,'" \\\n-H "Content-Type: application/json" \\\n-H "Authorization: Bearer USER_TOKEN"\n')},js:{language:"js",code:"\nlet { error } = await supabase.auth.signOut()\n"}}}}},20951:function(n,e,a){var t=a(90849),o=a(27378),c=a(55620),r=a(59235),s=a(9228),u=a.n(s),i=a(6324),l=a.n(i),p=a(88671),g=a(33954),h=a(24246);function d(n,e){var a=Object.keys(n);if(Object.getOwnPropertySymbols){var t=Object.getOwnPropertySymbols(n);e&&(t=t.filter((function(e){return Object.getOwnPropertyDescriptor(n,e).enumerable}))),a.push.apply(a,t)}return a}function b(n){for(var e=1;e<arguments.length;e++){var a=null!=arguments[e]?arguments[e]:{};e%2?d(Object(a),!0).forEach((function(e){(0,t.Z)(n,e,a[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(n,Object.getOwnPropertyDescriptors(a)):d(Object(a)).forEach((function(e){Object.defineProperty(n,e,Object.getOwnPropertyDescriptor(a,e))}))}return n}var m=/{([\d,-]+)}/,y={defaultLanguage:"js",plugins:["line-numbers","show-language"]};e.Z=function(n){var e=n.children,a=n.className,t=n.metastring,s=(0,o.useState)(!1),i=s[0],d=s[1],f=(0,o.useRef)(null),j=(0,o.useRef)(null),v=[];if(t&&m.test(t)){var w=t.match(m)[1];v=l()(w).filter((function(n){return n>0}))}(0,o.useEffect)((function(){if(i){var n=setTimeout((function(){return d(!1)}),2e3);return function(){return clearTimeout(n)}}}),[i]),(0,o.useEffect)((function(){var n,e;return null!==j&&void 0!==j&&null!==(n=j.current)&&void 0!==n&&n.button&&(e=new(u())(j.current.button,{target:function(){return f.current}})),function(){e&&e.destroy()}}),[j.current,f.current]);var H=a&&a.replace(/language-/,"");!H&&y.defaultLanguage&&(H=y.defaultLanguage);return(0,h.jsx)(c.ZP,b(b({},c.lG),{},{theme:y.theme||r.Z,code:e.trim(),language:H,children:function(n){var a=n.className,t=(n.style,n.tokens),o=n.getLineProps,c=n.getTokenProps;return(0,h.jsxs)("div",{className:"Code codeBlockWrapper group",children:[(0,h.jsx)("pre",{ref:f,className:"codeBlock ".concat(a),children:t.map((function(n,e){var a=o({line:n,key:e});return v.includes(e+1)&&(a.className="".concat(a.className," docusaurus-highlight-code-line")),(0,h.jsx)("div",b(b({},a),{},{children:n.map((function(n,e){return(0,h.jsx)("span",b({},c({token:n,key:e})),e)}))}),e)}))}),(0,h.jsx)("div",{className:"invisible absolute right-0 top-0 opacity-0 transition-opacity group-hover:visible group-hover:opacity-100",children:(0,h.jsx)(p.z,{size:"tiny",type:"default",onClick:function(){return n=e,void(0,g.vQ)(n,(function(){return d(!0)}));var n},children:i?"Copied":"Copy"})})]})}}))}},4708:function(n,e,a){var t=a(90849),o=(a(27378),a(55375)),c=a(12163),r=a(24246);function s(n,e){var a=Object.keys(n);if(Object.getOwnPropertySymbols){var t=Object.getOwnPropertySymbols(n);e&&(t=t.filter((function(e){return Object.getOwnPropertyDescriptor(n,e).enumerable}))),a.push.apply(a,t)}return a}e.Z=function(n){return(0,r.jsx)(c.Z,function(n){for(var e=1;e<arguments.length;e++){var a=null!=arguments[e]?arguments[e]:{};e%2?s(Object(a),!0).forEach((function(e){(0,t.Z)(n,e,a[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(n,Object.getOwnPropertyDescriptors(a)):s(Object(a)).forEach((function(e){Object.defineProperty(n,e,Object.getOwnPropertyDescriptor(a,e))}))}return n}({icon:o.Z},n))}}}]);
//# sourceMappingURL=4758-9ec3c73df6253236.js.map