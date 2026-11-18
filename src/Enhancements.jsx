import React, {useEffect, useRef, useState} from 'react';

export function AnimatedStat({percent}) {
  const root = useRef(null);
  const [progress, setProgress] = useState(0);
  const target = Math.round(percent * 100);
  useEffect(() => {
    let frame;
    const observer = new IntersectionObserver(entries => {
      if (!entries.some(entry => entry.isIntersecting)) return;
      observer.disconnect();
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        setProgress(target);
        return;
      }
      const start = performance.now();
      const animate = now => {
        const elapsed = Math.min((now - start) / 2000, 1);
        setProgress(target * (1 - Math.pow(1 - elapsed, 3)));
        if (elapsed < 1) frame = requestAnimationFrame(animate);
      };
      frame = requestAnimationFrame(animate);
    }, {threshold: 0.45});
    observer.observe(root.current);
    return () => {observer.disconnect();cancelAnimationFrame(frame);};
  }, [target]);
  const circumference = 2 * Math.PI * 70;
  return <div ref={root} className="circle replica-stat" data-percent={percent} role="img" aria-label={`${target}%`}>
    <svg viewBox="0 0 160 160" aria-hidden="true"><circle className="replica-ring-track" cx="80" cy="80" r="70"/><circle className="replica-ring-progress" cx="80" cy="80" r="70" strokeDasharray={circumference} strokeDashoffset={circumference * (1 - progress / 100)}/></svg>
    <div className="Index_object_percent_list_sides_innerright_innerboxs_value_main_new" aria-hidden="true"><span>{Math.floor(progress)}</span><div className="Index_object_percent_list_sides_innerright_innerboxs_value_new">%</div></div>
  </div>;
}

export function SignupPopup({onClose}) {
  const dialog = useRef(null);
  const [submitted, setSubmitted] = useState(false);
  useEffect(() => {
    const previous = document.activeElement;
    dialog.current.focus({preventScroll:true});
    return () => previous?.focus({preventScroll:true});
  }, []);
  function trapFocus(e) {
    if (e.key !== 'Tab') return;
    const elements = [...dialog.current.querySelectorAll('button, input, a[href]')];
    const first = elements[0], last = elements.at(-1);
    if (e.shiftKey && document.activeElement === first) {e.preventDefault();last.focus();}
    if (!e.shiftKey && document.activeElement === last) {e.preventDefault();first.focus();}
  }
  return <div className="replica-signup-backdrop" onClick={onClose}>
    <section ref={dialog} tabIndex={-1} className="replica-signup" role="dialog" aria-modal="true" aria-labelledby="signup-title" onClick={e=>e.stopPropagation()} onKeyDown={trapFocus}>
      <button className="replica-signup-close" onClick={onClose} aria-label="Close signup popup"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m4 4 16 16M20 4 4 20"/></svg></button>
      <div className="replica-signup-content">{submitted ? <div className="replica-signup-confirmation" role="status"><h2 id="signup-title">Thank you for signing up!</h2><p>This preview demonstrates the signup experience. Email delivery will be available when the mailing service is connected.</p><button onClick={onClose}>CONTINUE SHOPPING</button></div> : <>
        <h2 id="signup-title">Save 25% with our 3 Month Subscription.</h2>
        <p><strong>PLUS</strong> sign up to our newsletter for an extra <strong>10% OFF</strong> your first order.</p>
        <form onSubmit={e=>{e.preventDefault();setSubmitted(true);sessionStorage.setItem('ingenious-signup-dismissed','true');}}>
          <label className="sr-only" htmlFor="popup-email">Email</label><input id="popup-email" type="email" placeholder="Email" autoComplete="email" required/>
          <button type="submit">SIGN UP</button>
        </form>
        <small>You can view our <a href="/policies/privacy-policy" rel="noreferrer">Privacy Policy</a></small>
      </>}</div>
      <img className="replica-signup-photo" src="/assets/signup-products.jpeg" alt="Ingenious Collagen+ and Active supplements on a glass shelf"/>
    </section>
  </div>;
}

export function MegaMenu({products, onProduct, onClose}) {
  const links = [['COLLAGEN CALCULATOR','/pages/collagen-calculator'],['OUR STORY','/pages/about-us'],['INGREDIENTS','/pages/ingredients'],['CLINICAL TRIAL','/pages/clinical-trial'],['FAQs','/pages/faqs'],['BLOG','/blogs/news']];
  return <nav className="replica-mega-menu" id="replica-navigation" aria-label="Expanded navigation">
    <div className="replica-mega-links"><div className="replica-menu-shop"><h2>SHOP</h2><div className="replica-menu-products">{[products[1],products[0]].map((product,i)=><button key={product.slug} onClick={()=>onProduct(product)}><img src={i===0?'/assets/menu-active.jpg':'/assets/menu-collagen.jpg'} alt={product.name+' capsules'}/><small>★ {i===0?'4.6 61 Reviews':'4.7 596 Reviews'}</small><h3>{product.name.toUpperCase()}</h3><p>{i===0?'For recovery + endurance':'For skin, hair, nails'}</p></button>)}</div><a className="replica-menu-shop-all" href="/collections/all" onClick={onClose}>SHOP ALL</a></div>
    <div className="replica-menu-link-columns"><div><h2>LEARN</h2>{links.map(([label,url])=><a key={label} href={url} onClick={onClose}>{label}</a>)}</div><div><h2>ACCOUNT</h2><a href="/a/account/login">LOG IN</a><a href="/a/account/register">CREATE ACCOUNT</a><a href="/pages/track-delivery">TRACK MY ORDER</a></div></div></div>
    <a className="replica-menu-rewards" href="/pages/rewards"><img src="/assets/menu-rewards.png" alt="Woman holding flowers"/><div><h2>INGENIOUS<br/>REWARDS</h2><span>LEARN MORE</span></div></a>
  </nav>;
}
