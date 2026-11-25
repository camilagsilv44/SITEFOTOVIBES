/* ========================== A PARTIR DAQUI É O MOTOR DO SITE ========================== */
const C = CONFIG, L = C.links;
const $ = (s, r=document) => r.querySelector(s);
const $$ = (s, r=document) => [...r.querySelectorAll(s)];
const esc = s => String(s).replace(/[&<>"]/g, m => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[m]));

const I = {
  arrow:'<svg class="arr" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  out:'<svg class="go" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17 17 7M8 7h9v9"/></svg>',
  ig:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.3" cy="6.7" r=".9" fill="currentColor" stroke="none"/></svg>',
  wa:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.04 2a9.9 9.9 0 0 0-8.5 14.95L2 22l5.2-1.5A9.9 9.9 0 1 0 12.04 2Zm0 18.1a8.2 8.2 0 0 1-4.2-1.15l-.3-.18-3.08.89.9-3-.2-.31a8.2 8.2 0 1 1 6.88 3.75Zm4.5-6.13c-.25-.12-1.46-.72-1.69-.8-.23-.09-.4-.12-.56.12-.17.25-.65.8-.8.97-.14.17-.29.19-.54.06a6.7 6.7 0 0 1-3.3-2.88c-.25-.43.25-.4.72-1.34a.46.46 0 0 0-.02-.43c-.06-.12-.56-1.35-.77-1.85-.2-.48-.4-.42-.56-.43h-.48a.93.93 0 0 0-.67.31 2.8 2.8 0 0 0-.88 2.09 4.86 4.86 0 0 0 1.02 2.59 11.1 11.1 0 0 0 4.25 3.76c1.58.68 2.2.74 3 .62a2.55 2.55 0 0 0 1.67-1.18 2.07 2.07 0 0 0 .14-1.18c-.06-.1-.23-.17-.48-.3Z"/></svg>',
  menu:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
  close:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>',
  expand:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>',
  prev:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>',
  next:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>',
  chev:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>',
  plus:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
  calc:'<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="2"/><path d="M8 6h8M8 11h.01M12 11h.01M16 11h.01M8 15h.01M12 15h.01M16 15h.01M8 18h.01M12 18h.01M16 18h.01"/></svg>',
  mail:'<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>',
  pin:'<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11Z"/><circle cx="12" cy="10" r="2.5"/></svg>',
  globe:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3.2 3 14.8 0 18M12 3c-3 3.2-3 14.8 0 18"/>',
  share:'<circle cx="18" cy="5" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="19" r="2.5"/><path d="m8.2 10.9 7.6-4.3M8.2 13.1l7.6 4.3"/>',
  target:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
  camera:'<path d="M3 8h4l2-3h6l2 3h4v12H3z"/><circle cx="12" cy="13" r="3.5"/>',
  box:'<path d="M12 3 3 7.5v9L12 21l9-4.5v-9z"/><path d="M3 7.5 12 12l9-4.5M12 12v9"/>',
  video:'<rect x="3" y="6" width="13" height="12" rx="2"/><path d="m16 10 5-3v10l-5-3"/>',
  trend:'<path d="m3 17 6-6 4 4 8-8M15 7h6v6"/>',
  palette:'<circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/>',
  sparkles:'<path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/><path d="M20 3v4M22 5h-4M4 17v2M5 18H3"/>'
};
const svc = n => `<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">${I[n]||I.camera}</svg>`;

const TONES = [["#2a2622","#4a4036","#8c7b5f"],["#1b1b1d","#3a3a3d","#a39f98"],["#2d2924","#6a5c49","#d8ccb8"],["#141415","#2c2c2f","#8a8a8d"],["#33291f","#74614a","#e8dfd2"]];
function photo(src, alt, seed=0, label="Foto demonstrativa", foco=""){
  if (src) return `<div class="ph"><img src="${esc(src)}" alt="${esc(alt)}" loading="lazy" decoding="async"${foco?` style="object-position:${esc(foco)}"`:""}></div>`;
  const [a,b,c] = TONES[seed % TONES.length];
  const bg = `radial-gradient(120% 90% at ${20+(seed*17)%60}% ${15+(seed*23)%50}%, ${c}55 0%, transparent 55%), linear-gradient(160deg, ${b} 0%, ${a} 100%)`;
  return `<div class="ph"><div class="fake" role="img" aria-label="${esc(alt)} (espaço para sua foto)" style="background:${bg}"><svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice"><circle cx="50" cy="44" r="14" fill="none" stroke="#f6f2ec" stroke-width=".4"/><path d="M36 36h5l2-3h14l2 3h5v17H36z" fill="none" stroke="#f6f2ec" stroke-width=".4"/></svg><i>${esc(label)}</i></div></div>`;
}
const cine = label => `<div class="cine" role="img" aria-label="Espaço para sua foto ou vídeo"><b></b><b></b><b></b><i>${esc(label)}</i></div>`;
const bgMedia = (src, alt, label, video) => video
  ? `<video class="hero-video" autoplay muted loop playsinline preload="metadata" ${src?`poster="${esc(src)}"`:""}><source src="${esc(video)}"></video>`
  : (src ? photo(src, alt, 2) : cine(label));
const rv = (html, d=0, tag="div", cls="") => `<${tag} class="rv ${cls}" style="--d:${d}s">${html}</${tag}>`;
const ext = (href, cls, inner) => `<a href="${esc(href)}" target="_blank" rel="noopener noreferrer" class="btn ${cls}">${inner}</a>`;

/* ---------- Navegação ---------- */
const NAV = [
  ["Início","home","inicio"],["Sobre mim","home","sobre"],["Portfólio","home","portfolio"],
  ["Vibe Marketing","mkt",""],["Contato","*","contato"]
];
const navLink = ([label,page,id]) => `<a href="#" data-go="${page}" data-id="${id}">${label}</a>`;
$("#hd nav").innerHTML = `
  <a href="#" class="logo" data-go="home" data-id="inicio">VIBE<span> FOTOS</span></a>
  <ul class="menu">${NAV.map(n=>`<li>${navLink(n)}</li>`).join("")}</ul>
  <div style="display:flex;align-items:center;gap:.75rem">
    ${ext(L.whatsapp,"line hwa",I.wa+" WhatsApp").replace('<a ','<a aria-label="Falar no WhatsApp" ')}
    <button class="burger" id="burger" aria-expanded="false" aria-controls="mmenu" aria-label="Abrir menu">${I.menu}</button>
  </div>`;
$("#mmenu").innerHTML = `<ul>${NAV.map(n=>`<li>${navLink(n)}</li>`).join("")}</ul>${ext(L.whatsapp,"solid full",I.wa+" Falar no WhatsApp")}`;

/* ---------- Seções: Início ---------- */
const contactBlock = () => {
  const items = [
    [I.wa.replace("<svg",'<svg class="ico"'),"WhatsApp","Chamar agora",L.whatsapp],
    [I.ig.replace("<svg",'<svg class="ico"'),"Instagram Vibe Fotos","@vib3s.ft",L.instagram],
    [I.calc,"Orçamento","Monte o seu online",L.orcamento]
  ];
  if (C.contato.email) items.push([I.mail,"E-mail",C.contato.email,"mailto:"+C.contato.email]);
  if (C.contato.localizacao) items.push([I.pin,"Localização",C.contato.localizacao,""]);
  if (L.instagramMarketing) items.push([I.ig.replace("<svg",'<svg class="ico"'),"Instagram Vibe Marketing","Ver perfil",L.instagramMarketing]);
  const li = items.map(([ic,lab,val,href],i)=>{
    const inner = `${ic}<span class="bd"><small>${esc(lab)}</small><b>${esc(val)}</b></span>${href?I.out:""}`;
    const el = href ? `<a href="${esc(href)}" ${href.startsWith("mailto:")?"":'target="_blank" rel="noopener noreferrer"'}>${inner}</a>` : `<div>${inner}</div>`;
    return rv(el,i*.06,"li");
  }).join("");
  return `<section id="contato" class="contact"><div class="in">${rv('<p class="eyebrow">Contato</p>')}${rv(`<h2 class="display">${esc(C.contatoTitulo)}</h2>`,.1)}${rv(`<p class="t">${esc(C.contatoTexto)}</p>`,.2)}<ul class="ct">${li}</ul></div></section>`;
};

$("#page-home").innerHTML = `
<section id="inicio" class="grain">
  <div class="hero-bg" id="heroBg">${bgMedia(C.fotos.capa,"Fotografia de destaque da Vibe Fotos","Espaço da sua foto/vídeo de capa — CONFIG.fotos",C.fotos.capaVideo)}</div>
  <div class="shade1"></div><div class="shade2"></div>
  <div class="wrap hero-in" id="heroIn">
    <p class="eyebrow">${esc(C.marca.nome)}</p>
    <h1 class="display" aria-label="${esc(C.hero.linha1+" "+C.hero.linha2)}"><span class="l"><span>${esc(C.hero.linha1)}</span></span><span class="l"><span class="metal" style="font-style:italic">${esc(C.hero.linha2)}</span></span></h1>
    <p class="t">${esc(C.hero.texto)}</p>
    <div class="ctas">
      <a href="#" data-go="home" data-id="portfolio" class="btn solid">${esc(C.hero.botao1)} ${I.arrow}</a>
      ${ext(L.orcamento,"line",esc(C.hero.botao2)+" "+I.arrow)}
    </div>
  </div>
  <a href="#" data-go="home" data-id="sobre" class="chev" aria-label="Rolar">${I.chev}</a>
</section>

<section id="sobre"><div class="wrap about-g">
  <div class="about-photo" id="aboutPhoto"><div class="frame" style="position:relative">${photo(C.fotos.retrato,"Retrato de Camila Geovana, fotógrafa",4,"Seu retrato — troque em CONFIG.fotos.retrato")}</div><div class="deco" aria-hidden="true"></div></div>
  <div>
    ${rv('<p class="eyebrow">Sobre mim</p>')}
    ${rv(`<h2 class="display">${esc(C.sobre.titulo)}</h2>`,.1)}
    <div class="txt">${C.sobre.paragrafos.map((p,i)=>rv(esc(p),.15+i*.08,"p")).join("")}</div>
    <div class="btn-w">${rv(ext(L.instagram,"dark",I.ig+" "+esc(C.sobre.botao)+" "+I.arrow),.4)}</div>
  </div>
</div></section>

<section id="portfolio"><div class="wrap">
  ${rv('<p class="eyebrow">Portfólio</p>')}
  ${rv(`<h2 class="display">${esc(C.portfolio.titulo)}</h2>`,.1)}
  <div class="chips" id="chips" role="tablist" aria-label="Filtrar por categoria"></div>
  <div class="grid" id="grid"></div>
</div></section>

<section id="agendar" class="grain">
  <div class="bg">${C.fotos.agendamento ? photo(C.fotos.agendamento,"Ensaio fotográfico Vibe Fotos",1,"Foto demonstrativa","50% 58%") : cine("Espaço da sua foto — CONFIG.fotos.agendamento")}</div><div class="ov"></div>
  <div class="in">
    ${rv(`<h2 class="display metal">${esc(C.agendamento.titulo)}</h2>`)}
    ${rv(`<p class="t">${esc(C.agendamento.texto)}</p>`,.15)}
    ${rv(ext(L.orcamento,"solid full full-m",esc(C.agendamento.botao)+" "+I.arrow),.25)}
  </div>
</section>

<section id="teaser"><div class="grid-bg"></div><div class="in">
  ${rv('<p class="eyebrow">VIBE MARKETING</p>')}
  ${rv(`<h2 class="mk-title">${esc(C.marketing.titulo)}</h2>`,.1)}
  ${rv(`<p class="t">${esc(C.marketing.texto)}</p>`,.2)}
  ${rv(`<a href="#" data-go="mkt" data-id="" class="btn line full full-m">${esc(C.marketing.botaoHome)} ${I.arrow}</a>`,.3)}
</div></section>
${contactBlock()}`;

/* ---------- Marketing ---------- */
const mkLines = C.marketing.titulo.split(". ").map((p,i,a)=> i<a.length-1 ? p+"." : p);
const proj = C.projetos.map((p,i)=>`<li>${photo(p.img,p.titulo,i)}<div class="cap"><small>${esc(p.categoria||"")}</small><p>${esc(p.titulo)}</p></div></li>`).join("")
  + Array.from({length:Math.max(0,C.marketing.espacosVazios-C.projetos.length)}).map(()=>`<li class="empty">${I.plus}<span>Novo projeto em breve</span></li>`).join("");
$("#page-mkt").innerHTML = `
<section id="mk-hero"><div class="grid-bg"></div><div class="glow"></div><div class="in">
  <p class="eyebrow">VIBE MARKETING</p>
  <h1 class="mk-title">${mkLines.map((l,i)=>`<span class="l"><span class="${i===1?"metal":""}">${esc(l)}</span></span>`).join("")}</h1>
  <p class="t">${esc(C.marketing.texto)}</p>
  ${ext(L.whatsapp,"solid full full-m",I.wa+" "+esc(C.marketing.botao))}
</div></section>
<section id="servicos"><div class="in">
  ${rv('<p class="eyebrow">Serviços</p>')}
  ${rv(`<h2 class="mk-title">${esc(C.marketing.tituloServicos)}</h2>`,.1)}
  <ul class="svc">${C.servicos.map((s,i)=>rv(`<span class="n">${String(i+1).padStart(2,"0")}</span>${svc(s.icone)}<h3>${esc(s.titulo)}</h3><p>${esc(s.desc)}</p><button type="button" data-svc="${i}" aria-haspopup="dialog">Quero saber mais ${I.arrow.replace('class="arr"','')}</button>`,(i%3)*.08,"li")).join("")}</ul>
</div></section>
<section id="projetos"><div class="in">
  ${rv('<p class="eyebrow">Projetos</p>')}
  ${rv(`<p class="t">${esc(C.marketing.textoProjetos)}</p>`,.1)}
  <ul class="proj">${proj}</ul>
  <div class="cta">${rv(ext(L.whatsapp,"solid full full-m",I.wa+" "+esc(C.marketing.botao)),.1)}</div>
</div></section>
${contactBlock().replace('id="contato"','id="contato-mkt"')}`;

/* ---------- Rodapé ---------- */
$("#ft").innerHTML = `<div class="f-g">
  <div><p class="nm">VIBE FOTOS — CAMILA GEOVANA</p><p class="fr">“${esc(C.marca.frase)}”</p></div>
  <nav aria-label="Rodapé"><p class="eyebrow">Navegação</p><ul>${NAV.map(n=>`<li>${navLink(n)}</li>`).join("")}<li><a href="${esc(L.orcamento)}" target="_blank" rel="noopener noreferrer">Orçamento</a></li></ul></nav>
  <div><p class="eyebrow">Redes</p><div class="soc"><a href="${esc(L.instagram)}" target="_blank" rel="noopener noreferrer" aria-label="Instagram da Vibe Fotos">${I.ig}</a><a href="${esc(L.whatsapp)}" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">${I.wa}</a></div></div>
</div><p class="copy">© ${new Date().getFullYear()} ${esc(C.marca.nome)}. Todos os direitos reservados.</p>`;
$("#ld-by").textContent = C.marca.fotografa.toUpperCase().split("").join(" ");

/* ---------- Roteamento entre páginas ---------- */
let current = null;
function show(page, id){
  if (page === "*") page = current || "home";
  if (page !== current){
    $$(".page").forEach(p=>p.classList.remove("active"));
    $("#page-"+page).classList.add("active");
    current = page; window.scrollTo(0,0); observe();
  }
  const target = id ? (page==="mkt" && id==="contato" ? "contato-mkt" : id) : null;
  if (target){ const el = document.getElementById(target); if (el) setTimeout(()=>el.scrollIntoView({behavior:"smooth"}), page!==current?30:0); }
  document.title = (page==="mkt" ? "Vibe Marketing | Vibe Fotos" : "Vibe Fotos — Camila Geovana | Fotografia e Marketing Digital");
  history.replaceState(null,"", page==="mkt" ? "#vibe-marketing" : "#");
}
document.addEventListener("click", e=>{
  const a = e.target.closest("[data-go]"); if (!a) return;
  e.preventDefault(); closeMenu(); show(a.dataset.go, a.dataset.id);
});

/* ---------- Menu mobile ---------- */
function closeMenu(){ $("#mmenu").classList.remove("open"); $("#burger").innerHTML=I.menu; $("#burger").setAttribute("aria-expanded","false"); document.body.style.overflow=""; }
$("#burger").addEventListener("click",()=>{
  const open = !$("#mmenu").classList.contains("open");
  $("#mmenu").classList.toggle("open",open); $("#burger").innerHTML = open?I.close:I.menu;
  $("#burger").setAttribute("aria-expanded",open); document.body.style.overflow = open?"hidden":"";
});

/* ---------- Portfólio: filtros + lightbox ---------- */
let filter = "todas", visible = [], lbIndex = -1;
const cats = C.categorias;
function renderChips(){
  $("#chips").innerHTML = [{id:"todas",nome:"Todas"},...cats].map(c=>`<button class="chip ${c.id===filter?"on":""}" role="tab" aria-selected="${c.id===filter}" data-f="${c.id}">${esc(c.nome)}</button>`).join("");
}
function renderGrid(){
  visible = filter==="todas" ? cats : cats.filter(c=>c.id===filter);
  $("#grid").innerHTML = visible.map((c,i)=>{
    const seed = cats.indexOf(c)+1;
    return `<article class="card zoomable" style="--d:${Math.min(i,5)*.06}s">
      <button class="pic r-${c.ratio}" data-open="${i}" data-cursor aria-label="Ampliar foto: ${esc(c.nome)}">${photo(c.img,"Fotografia de "+c.nome,seed,"Foto demonstrativa",c.foco||"")}<span class="exp">${I.expand}</span></button>
      <h3>${esc(c.nome)}</h3><p>${esc(c.desc)}</p>
      ${ext(L.orcamento,"line full full-m",esc(C.portfolio.botao)+" "+I.arrow)}
    </article>`;
  }).join("");
}
renderChips(); renderGrid();
$("#chips").addEventListener("click",e=>{ const b=e.target.closest("[data-f]"); if(!b) return; filter=b.dataset.f; renderChips(); renderGrid(); });
$("#grid").addEventListener("click",e=>{ const b=e.target.closest("[data-open]"); if(b) openLb(+b.dataset.open); });
function lbRender(){
  const c = visible[lbIndex], seed = cats.indexOf(c)+1;
  $("#lb").innerHTML = `<button class="x" aria-label="Fechar">${I.close}</button>
   ${visible.length>1?`<button class="pv" aria-label="Anterior">${I.prev}</button><button class="nx" aria-label="Próxima">${I.next}</button>`:""}
   <figure><div class="big">${photo(c.img,"Fotografia de "+c.nome,seed)}</div>
   <figcaption><b>${esc(c.nome)}</b>${ext(L.orcamento,"solid",esc(C.portfolio.botao)+" "+I.arrow)}</figcaption></figure>`;
}
function openLb(i){ lbIndex=i; lbRender(); $("#lb").classList.add("open"); $("#lb").setAttribute("aria-hidden","false"); document.body.style.overflow="hidden"; }
function closeLb(){ $("#lb").classList.remove("open"); $("#lb").setAttribute("aria-hidden","true"); document.body.style.overflow=""; lbIndex=-1; }
function stepLb(d){ lbIndex=(lbIndex+d+visible.length)%visible.length; lbRender(); }
$("#lb").addEventListener("click",e=>{
  if (e.target.closest(".x")||e.target===$("#lb")) return closeLb();
  if (e.target.closest(".pv")) return stepLb(-1);
  if (e.target.closest(".nx")) return stepLb(1);
});
document.addEventListener("keydown",e=>{
  if (lbIndex>=0){ if(e.key==="Escape")closeLb(); if(e.key==="ArrowRight")stepLb(1); if(e.key==="ArrowLeft")stepLb(-1); }
  else if (e.key==="Escape") closeMenu();
});

/* ---------- Revelação ao rolar ---------- */
let io;
function observe(){
  if (io) io.disconnect();
  io = new IntersectionObserver(es=>es.forEach(en=>{ if(en.isIntersecting){ en.target.classList.add("in"); io.unobserve(en.target);} }),{rootMargin:"0px 0px -8% 0px"});
  $$(".page.active .rv, .page.active .about-photo").forEach(el=>io.observe(el));
}

/* ---------- Header, progresso, parallax ---------- */
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
let ticking=false;
function onScroll(){
  if (ticking) return; ticking=true;
  requestAnimationFrame(()=>{
    const y=scrollY, h=document.documentElement.scrollHeight-innerHeight;
    $("#progress").style.transform=`scaleX(${h>0?y/h:0})`;
    $("#hd").classList.toggle("solid-bg", y>30);
    if (!reduce && current==="home" && y<innerHeight*1.2){
      $("#heroBg").style.transform=`translateY(${y*.22}px)`;
      $("#heroIn").style.opacity=Math.max(0,1-y/(innerHeight*.8));
    }
    ticking=false;
  });
}
addEventListener("scroll",onScroll,{passive:true});

/* ---------- Cursor discreto (somente com mouse) ---------- */
if (matchMedia("(hover: hover) and (pointer: fine)").matches && !reduce){
  $("#cur").innerHTML='<div class="cursor-ring"></div><div class="cursor-dot"></div>';
  document.documentElement.classList.add("has-cursor");
  const ring=$(".cursor-ring"), dot=$(".cursor-dot"); let x=0,y=0,rx=0,ry=0;
  addEventListener("mousemove",e=>{ x=e.clientX;y=e.clientY; dot.style.transform=`translate3d(${x}px,${y}px,0)`; ring.classList.toggle("act",!!e.target.closest("a,button,[data-cursor]")); },{passive:true});
  (function loop(){ rx+=(x-rx)*.16; ry+=(y-ry)*.16; ring.style.transform=`translate3d(${rx}px,${ry}px,0)`; requestAnimationFrame(loop); })();
}

/* ---------- Abertura cinematográfica ---------- */
let seen=false; try{ seen = sessionStorage.getItem("vibe-intro")==="1"; }catch(e){}
const ld = $("#loader");
if (seen || reduce){ ld.remove(); document.body.classList.add("skip"); }
else {
  document.body.style.overflow="hidden";
  setTimeout(()=>{ ld.classList.add("out"); document.body.style.overflow=""; try{sessionStorage.setItem("vibe-intro","1")}catch(e){} setTimeout(()=>ld.remove(),1200); },2700);
}

/* ---------- Formulário por serviço → WhatsApp ---------- */
(function(){
  const box = document.createElement("div");
  box.id = "sf"; box.setAttribute("role","dialog"); box.setAttribute("aria-modal","true"); box.setAttribute("aria-labelledby","sf-t");
  document.body.appendChild(box);
  let last = null, svcAtual = null;
  const fechar = () => { box.classList.remove("open"); document.body.style.overflow=""; if (last) last.focus(); };
  const campo = (id, rot, extra, obrig) => `<div><label for="${id}">${esc(rot)}${obrig?' <b>*</b>':""}</label>${extra}</div>`;
  function abrir(i, trigger){
    const s = C.servicos[i]; svcAtual = s; last = trigger;
    const extras = (s.campos||[]).map((c,k)=> c.o
      ? campo("sf-q"+k, c.r, `<select id="sf-q${k}" name="q${k}"><option value="">Selecione…</option>${c.o.map(o=>`<option>${esc(o)}</option>`).join("")}</select>`)
      : campo("sf-q"+k, c.r, `<input id="sf-q${k}" name="q${k}" type="text" autocomplete="off" placeholder="Escreva aqui">`)
    ).join("");
    box.innerHTML = `<div class="box">
      <button type="button" class="x" aria-label="Fechar formulário">${'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>'}</button>
      <p class="eyebrow">Vibe Marketing</p>
      <h3 id="sf-t">${esc(s.titulo)}</h3>
      <p class="sub">Responda rapidinho e eu continuo a conversa pelo WhatsApp, já sabendo o que você precisa.</p>
      <form novalidate>
        ${campo("sf-nome","Seu nome",'<input id="sf-nome" name="nome" type="text" autocomplete="name" required placeholder="Como posso te chamar?">',true)}
        ${campo("sf-neg","Seu negócio ou @ do Instagram",'<input id="sf-neg" name="neg" type="text" autocomplete="organization" placeholder="Ex.: Loja da Ana · @lojadaana">')}
        ${extras}
        ${campo("sf-obs","Quer contar mais alguma coisa?",'<textarea id="sf-obs" name="obs" placeholder="Opcional"></textarea>')}
        <button type="submit" class="btn solid full">${I.wa} Enviar pelo WhatsApp</button>
      </form>
      <p class="ok" role="status"></p>
    </div>`;
    box.classList.add("open"); document.body.style.overflow="hidden";
    box.querySelector(".x").onclick = fechar;
    box.querySelector("form").addEventListener("submit", enviar);
    setTimeout(()=>$("#sf-nome").focus(), 60);
  }
  function enviar(e){
    e.preventDefault();
    const f = e.target, nome = f.nome.value.trim();
    if (!nome){ f.nome.focus(); f.nome.style.borderColor="#c0584a"; return; }
    const linhas = [`Olá, Camila! Vim pelo site e quero saber mais sobre *${svcAtual.titulo}*.`, "", `*Nome:* ${nome}`];
    if (f.neg.value.trim()) linhas.push(`*Negócio / Instagram:* ${f.neg.value.trim()}`);
    (svcAtual.campos||[]).forEach((c,k)=>{ const v = f["q"+k].value.trim(); if (v) linhas.push(`*${c.r}* ${v}`); });
    if (f.obs.value.trim()) linhas.push(`*Observações:* ${f.obs.value.trim()}`);
    const texto = linhas.join("\n"), num = (L.whatsappNumero||"").replace(/\D/g,"");
    const ok = box.querySelector(".ok");
    if (num){
      window.open(`https://wa.me/${num}?text=${encodeURIComponent(texto)}`,"_blank","noopener");
      ok.textContent = "Pronto! O WhatsApp abriu com a sua mensagem. É só enviar."; ok.classList.add("show");
    } else {
      window.open(L.whatsapp,"_blank","noopener");
      let copiou = false;
      try{ navigator.clipboard.writeText(texto); copiou = true; }catch(err){}
      ok.textContent = copiou ? "Abri o WhatsApp e copiei a sua mensagem. É só colar na conversa e enviar." : "Abri o WhatsApp. Se a mensagem não aparecer sozinha, me conte o que você precisa por lá.";
      ok.classList.add("show");
    }
  }
  box.addEventListener("click", e=>{ if (e.target === box) fechar(); });
  addEventListener("keydown", e=>{ if (e.key==="Escape" && box.classList.contains("open")) fechar(); });
  document.addEventListener("click", e=>{ const b = e.target.closest("[data-svc]"); if (b) abrir(+b.dataset.svc, b); });
})();

/* ---------- Início ---------- */
show(location.hash==="#vibe-marketing" ? "mkt" : "home");
onScroll();
