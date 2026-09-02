// ローカル確認用の簡易サーバー。node tools/serve.js [port]
const http=require('http'),fs=require('fs'),path=require('path');
const ROOT=path.join(__dirname,'..'),PORT=process.argv[2]||8123;
const TYPES={'.html':'text/html; charset=utf-8','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml'};
http.createServer((req,res)=>{
  let p=decodeURIComponent(req.url.split('?')[0]);
  if(p.endsWith('/'))p+='index.html';
  const f=path.join(ROOT,p);
  if(!f.startsWith(ROOT)||!fs.existsSync(f)||fs.statSync(f).isDirectory()){res.writeHead(404);return res.end('not found');}
  res.writeHead(200,{'Content-Type':TYPES[path.extname(f)]||'application/octet-stream'});
  fs.createReadStream(f).pipe(res);
}).listen(PORT,()=>console.log('http://localhost:'+PORT+'/'));
