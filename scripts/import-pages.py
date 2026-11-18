"""Import reference page content and assets for local demo routes."""
import concurrent.futures, hashlib, html, json, pathlib, re, time, urllib.request, urllib.parse
ROOT=pathlib.Path(__file__).resolve().parent.parent
OUT=ROOT/'public'/'pages-data'; OUT.mkdir(parents=True,exist_ok=True)
ASSETS=ROOT/'public'/'assets'; ASSETS.mkdir(exist_ok=True)
base='https://ingeniouslife.com'
known=json.loads((ROOT/'src'/'assets.json').read_text())
manifest={}; failed={}; asset_urls=set()
initial=['/pages/about-us','/pages/clinical-trial','/pages/collagen-calculator','/pages/contact','/pages/faqs','/pages/giveaway-t-cs','/pages/ingredients','/pages/rewards','/pages/sustainability','/pages/track-delivery','/policies/privacy-policy','/policies/terms-of-service','/policies/shipping-policy','/policies/refund-policy','/products/ingenious-active','/products/ingenious-collagen','/collections/all','/blogs/blog','/blogs/blog/amazing-astaxanthin','/blogs/blog/astaxanthin-and-healthy-vision']
def request(url):
 for attempt in range(3):
  try:
   with urllib.request.urlopen(urllib.request.Request(url,headers={'User-Agent':'Mozilla/5.0'}),timeout=45) as r:return r.read()
  except Exception:
   if attempt==2:raise
   time.sleep(1)
def sanitize(text):
 text=re.sub(r'<script\b[\s\S]*?</script>','',text,flags=re.I)
 text=re.sub(r'\s+(?:srcset|sizes|on\w+)="[^"]*"','',text)
 text=re.sub(r'<!--.*?-->','',text,flags=re.S)
 text=re.sub(r'\s+action="[^"]*"','',text)
 text=re.sub(r'<input[^>]*name="(?:form_type|utf8|return_to)"[^>]*>','',text)
 return text

def fetch_page(path):
 try:
  cached=OUT/(hashlib.md5(path.encode()).hexdigest()[:12]+'.json')
  if cached.exists():return path,json.loads(cached.read_text(encoding='utf-8')),None
  raw=request(base+path).decode('utf-8')
  match=re.search(r'<main\b[\s\S]*?</main>',raw)
  if not match:raise ValueError('No page content')
  content=sanitize(match.group())
  title=html.unescape(re.search(r'<title[^>]*>(.*?)</title>',raw,re.S).group(1).strip())
  body=re.search(r'<body[^>]*class="([^"]*)"',raw)
  # Common theme styles are shared; section-specific styles inside main are retained.
  page={'title':title,'bodyClass':body.group(1) if body else '', 'html':content}
  return path,page,None
 except Exception as e:return path,None,str(e)

def internal_path(href):
 href=html.unescape(href)
 u=urllib.parse.urlparse(urllib.parse.urljoin(base,href))
 if u.hostname not in ['ingeniouslife.com','www.ingeniouslife.com','ingenious-laboratories.myshopify.com']:return None
 path=urllib.parse.unquote(u.path).rstrip('/')
 if path=='/blogs/blog' and u.query:path+='?'+u.query
 if any(path.startswith(p) for p in ['/pages/','/policies/','/products/','/collections/','/blogs/']):
  if '/tagged/' not in path and not path.endswith(('.jpg','.png','.pdf')):return path
 return None
initial += ['/blogs/blog?page='+str(n) for n in range(2,9)] + ['/blogs/blog/keep-your-brain-sharp-with-astaxanthin','/blogs/blog/hyaluronic-acid-or-hyaluron-complex']
seen=set();todo=initial
for depth in range(3):
 batch=[p for p in dict.fromkeys(todo) if p not in seen]
 if not batch:break
 seen.update(batch);todo=[]
 print('Fetching',len(batch),'pages at depth',depth,flush=True)
 with concurrent.futures.ThreadPoolExecutor(max_workers=8) as pool:
  for path,page,error in pool.map(fetch_page,batch):
   if error:failed[path]=error;print('FAILED',path,error,flush=True);continue
   manifest[path]={'file':hashlib.md5(path.encode()).hexdigest()[:12]+'.json','title':page['title']}
   (OUT/manifest[path]['file']).write_text(json.dumps(page,ensure_ascii=False),encoding='utf-8')
   for href in re.findall(r'href="([^"]+)"',page['html']):
    link=internal_path(href)
    if link and link not in seen:todo.append(link)
   for url in re.findall(r'(?:src|poster|data-src)="([^"]+)"',page['html']):
    url=html.unescape(url)
    if url.startswith('//'):url='https:'+url
    if url.startswith('http') and not url.split('?')[0].endswith(('.js','.mp4','.m3u8')):asset_urls.add(url)
   for url in re.findall(r'url\([\"\']?([^\)\"\']+)',page['html']):
    url=html.unescape(url)
    if url.startswith('//'):url='https:'+url
    if url.startswith('http'):asset_urls.add(url)
 print('Imported',len(manifest),'pages;',len(set(todo)),'additional linked routes',flush=True)
 # Follow linked pages and articles, without crawling unrelated site indexes.
 todo=sorted(set(todo))
for entry in manifest.values():
 content=json.loads((OUT/entry['file']).read_text(encoding='utf-8'))['html']
 for url in re.findall(r'<link[^>]*href="([^"]+)"',content):
  url=html.unescape(url)
  if url.startswith('//'):url='https:'+url
  if '/cdn/shop/t/' in url and '.css' in url:asset_urls.add(url)
print('Downloading',len(asset_urls),'asset URLs',flush=True)
def download(url):
 if url in known and (ROOT/'public'/known[url].lstrip('/')).exists():return url,known[url]
 name=hashlib.md5(url.encode()).hexdigest()[:8]+'-'+urllib.parse.unquote(urllib.parse.urlparse(url).path.rsplit('/',1)[-1])
 name=re.sub(r'[^\w.\-]','_',name)
 target=ASSETS/name
 try:
  if not target.exists():target.write_bytes(request(url))
  return url,'/assets/'+name
 except Exception as e:print('ASSET FAILED',url,str(e),flush=True);return url,url
with concurrent.futures.ThreadPoolExecutor(max_workers=12) as pool:
 for url,local in pool.map(download,sorted(asset_urls)):known[url]=local
for entry in manifest.values():
 p=OUT/entry['file'];page=json.loads(p.read_text(encoding='utf-8'));content=page['html']
 for url,local in sorted(known.items(),key=lambda x:-len(x[0])):
  for original in [url,url.removeprefix('https:'),html.escape(url,quote=False),html.escape(url.removeprefix('https:'),quote=False)]:content=content.replace(original,local)
 page['html']=content;p.write_text(json.dumps(page,ensure_ascii=False),encoding='utf-8')
(ROOT/'src'/'route-manifest.json').write_text(json.dumps(manifest,indent=2,ensure_ascii=False),encoding='utf-8')
(ROOT/'src'/'assets.json').write_text(json.dumps(known,indent=2),encoding='utf-8')
print('DONE',len(manifest),'pages;',len(known),'assets;',len(failed),'unavailable routes',flush=True)
print(json.dumps(failed),flush=True)
