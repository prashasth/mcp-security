const {chromium}=require('playwright');const {spawn}=require('child_process');
(async()=>{const fps=30;const b=await chromium.launch();const p=await b.newPage({viewport:{width:1280,height:720}});
await p.goto('file://'+__dirname+'/index.html');await p.waitForTimeout(500);
const dur=await p.evaluate(()=>DURATION);const n=Math.round(dur*fps);
const ff=spawn('ffmpeg',['-y','-f','image2pipe','-framerate',''+fps,'-c:v','mjpeg','-i','-','-c:v','libx264','-pix_fmt','yuv420p','-crf','18','-preset','medium','-movflags','+faststart','matrix-mcp-explainer.mp4'],{stdio:['pipe','ignore','inherit']});
for(let i=0;i<n;i++){await p.evaluate(t=>render(t),i/fps);const buf=await p.screenshot({type:'jpeg',quality:95});if(!ff.stdin.write(buf))await new Promise(r=>ff.stdin.once('drain',r));}
ff.stdin.end();await new Promise(r=>ff.on('close',r));await b.close();console.log('frames',n);})();
