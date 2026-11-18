const referenceHosts = new Set(['ingeniouslife.com','www.ingeniouslife.com','ingenious-laboratories.myshopify.com','eu.ingeniouslife.com']);
const aliases = {'/clinical-trial':'/pages/clinical-trial','/ingenious-active':'/products/ingenious-active','/collagen-plus':'/products/ingenious-collagen','/astaxanthin-and-healthy-vision':'/blogs/blog/astaxanthin-and-healthy-vision','/keep-your-brain-sharp-with-astaxanthin':'/blogs/blog/keep-your-brain-sharp-with-astaxanthin','/hyaluronic-acid-or-hyaluron-complex':'/blogs/blog/hyaluronic-acid-or-hyaluron-complex','/pages/blog':'/blogs/blog','/blogs/news':'/blogs/blog','/account':'/a/account/login','/account/login':'/a/account/login','/account/register':'/a/account/register','/account/logout':'/a/account/login','/pages/faq':'/pages/faqs'};
export function localHref(href) {
  if (!href || href.startsWith('#') || /^(mailto:|tel:|data:)/i.test(href)) return href;
  try {
    const url = new URL(href, window.location.origin);
    if (!referenceHosts.has(url.hostname) && url.origin !== window.location.origin) {
      return url.hostname === 'af.uppromote.com' ? '/pages/affiliate' : href;
    }
    if(url.pathname.startsWith('/cdn/'))return href;
    const path = url.pathname.replace(/\/$/,'') || '/';
    return (aliases[path] || path) + url.search + url.hash;
  } catch { return href; }
}
export function currentPath(){return (localHref(window.location.pathname)||'/').split(/[?#]/)[0];}
