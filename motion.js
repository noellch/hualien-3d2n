(()=>{
  const root=document.documentElement;
  const hero=document.querySelector('.hero');
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  let raf=0;

  const progress=document.createElement('div');
  progress.className='scroll-progress';
  progress.setAttribute('aria-hidden','true');
  document.body.prepend(progress);

  const stage=document.querySelector('.hero-grid');
  if(stage&&!stage.querySelector('.motion-cue')){
    stage.insertAdjacentHTML('afterbegin','<div class="motion-cue" aria-hidden="true"><i></i><span>Scroll to explore</span></div>');
  }

  const targets=[
    ...document.querySelectorAll('.label,.headline,.dek,.big-no,.choice,.forecast,.food-note,.footer-title,.footer-meta,.day,.best,.score,.route-guide,.spot,.food-item,.utility-item')
  ];

  targets.forEach((el,i)=>{
    if(!el.matches('.day,.best,.score,.route-guide,.spot,.food-item,.utility-item')) el.classList.add('motion-reveal');
    el.style.transitionDelay=`${Math.min((i%4)*45,135)}ms`;
  });

  document.body.classList.add('motion-ready');

  const io=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      }
    });
  },{threshold:innerWidth<=680?.08:.12,rootMargin:'0px 0px -5% 0px'});
  targets.forEach(el=>io.observe(el));

  const sectionIO=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{if(entry.isIntersecting)entry.target.classList.add('section-in')});
  },{threshold:.06});
  document.querySelectorAll('#spots,#food').forEach(el=>sectionIO.observe(el));

  function update(){
    const max=Math.max(1,document.documentElement.scrollHeight-innerHeight);
    root.style.setProperty('--page-progress',clamp(scrollY/max,0,1).toFixed(5));
    if(hero){
      const r=hero.getBoundingClientRect();
      const travel=Math.max(1,hero.offsetHeight-innerHeight);
      root.style.setProperty('--hero-progress',clamp(-r.top/travel,0,1).toFixed(5));
    }
    raf=0;
  }

  const requestUpdate=()=>{if(!raf)raf=requestAnimationFrame(update)};
  addEventListener('scroll',requestUpdate,{passive:true});
  addEventListener('resize',requestUpdate);
  addEventListener('orientationchange',()=>setTimeout(update,160));
  update();
})();
