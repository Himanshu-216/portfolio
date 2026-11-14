(() => {
  'use strict';

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const esc = (s) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  /* ─────────── Data ─────────── */
  const SKILLS = [
    { ns: 'cloud', title: 'Cloud Platforms', items: ['AWS', 'EC2', 'ECS', 'EKS', 'RDS', 'Lambda', 'DynamoDB', 'SQS', 'S3', 'EventBridge', 'ALB', 'OpenSearch', 'Bedrock', 'GCP (GKE)'] },
    { ns: 'orchestration', title: 'Containers & Orchestration', items: ['Kubernetes', 'Docker', 'Helm', 'Amazon EKS', 'Amazon ECS'] },
    { ns: 'cicd', title: 'CI/CD & GitOps', items: ['GitHub Actions', 'Jenkins', 'Azure DevOps', 'CircleCI', 'FluxCD', 'Git'] },
    { ns: 'iac', title: 'IaC & Config Management', items: ['Terraform', 'Ansible'] },
    { ns: 'observability', title: 'Monitoring & Logging', items: ['Prometheus', 'Grafana', 'Loki', 'Amazon CloudWatch'] },
    { ns: 'security', title: 'Security & DevSecOps', items: ['AWS IAM', 'IAM Identity Center (SSO)', 'AWS WAF', 'Amazon GuardDuty', 'SonarQube'] },
    { ns: 'data-ai', title: 'Data & AI Workflows', items: ['Apache Airflow', 'AWS Glue', 'AWS Step Functions', 'Bedrock AgentCore', 'Ollama'] },
    { ns: 'code', title: 'Programming & Scripting', items: ['Python', 'Go', 'Bash'] },
    { ns: 'network', title: 'OS & Networking', items: ['Linux', 'Nginx', 'VPC', 'Subnets', 'Security Groups', 'Load Balancing', 'DNS'] },
  ];

  const JOBS = [
    { name: 'resident-interface', role: 'devops-developer', status: 'Ready', when: 'Feb 2026 – Present', where: 'Pune' },
    { name: 'algorizz-technologies', role: 'cloud-devops-engineer', status: 'Drained', when: 'Aug 2025 – Feb 2026', where: 'Remote' },
    { name: 'rubico-it', role: 'devops-engineer', status: 'Drained', when: 'Mar 2024 – Aug 2025', where: 'Dehradun' },
  ];

  /* ─────────── Skills grid ─────────── */
  const grid = $('#skills-grid');
  SKILLS.forEach((g, i) => {
    const el = document.createElement('article');
    el.className = 'panel ns reveal';
    el.style.setProperty('--d', `${(i % 3) * 70}ms`);
    el.innerHTML =
      `<div class="ns-head"><span>~/${g.ns}</span><span>${g.items.length} tools</span></div>` +
      `<h3>${esc(g.title)}</h3>` +
      `<div class="pods">${g.items.map((s) => `<span class="pod">${esc(s)}</span>`).join('')}</div>`;
    grid.appendChild(el);
  });

  /* ─────────── Reveal on scroll + counters ─────────── */
  const countUp = (el) => {
    const target = +el.dataset.count;
    const suffix = el.dataset.suffix || '';
    if (reduced) return;
    const t0 = performance.now();
    const step = (t) => {
      const p = Math.min((t - t0) / 1200, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))) + suffix;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  $$('.metrics .stat').forEach((el, i) => el.style.setProperty('--d', `${i * 80}ms`));
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.classList.add('in');
        const n = $('[data-count]', e.target);
        if (n) countUp(n);
        io.unobserve(e.target);
      });
    }, { threshold: 0.08 });
    $$('.reveal').forEach((el) => io.observe(el));

    // active nav link
    const links = new Map($$('.nav a').map((a) => [a.getAttribute('href').slice(1), a]));
    const navIo = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        links.forEach((a) => a.classList.remove('active'));
        links.get(e.target.id)?.classList.add('active');
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    $$('main section[id]').forEach((s) => navIo.observe(s));
  } else {
    $$('.reveal').forEach((el) => el.classList.add('in'));
  }

  /* ─────────── Scroll: progress bar + wheel rotation ─────────── */
  const bar = $('#rollout-bar');
  const root = document.documentElement;
  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const max = root.scrollHeight - innerHeight;
      bar.style.width = `${max > 0 ? (scrollY / max) * 100 : 0}%`;
      if (!reduced) root.style.setProperty('--scroll', (scrollY * 0.08).toFixed(2));
      ticking = false;
    });
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ─────────── Card spotlight ─────────── */
  document.addEventListener('pointermove', (e) => {
    const p = e.target.closest?.('.panel');
    if (!p) return;
    const r = p.getBoundingClientRect();
    p.style.setProperty('--mx', `${e.clientX - r.left}px`);
    p.style.setProperty('--my', `${e.clientY - r.top}px`);
  }, { passive: true });

  /* ─────────── Career uptime (since Mar 2024) ─────────── */
  const upEl = $('#uptime');
  const START = new Date(2024, 2, 1);
  const pad = (n) => String(n).padStart(2, '0');
  const uptime = () => {
    const now = new Date();
    let y = now.getFullYear() - START.getFullYear();
    let m = now.getMonth() - START.getMonth();
    let d = now.getDate() - START.getDate();
    if (d < 0) { m--; d += new Date(now.getFullYear(), now.getMonth(), 0).getDate(); }
    if (m < 0) { y--; m += 12; }
    return { y, m, d, clock: `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}` };
  };
  const tick = () => { const u = uptime(); upEl.textContent = `${u.y}y ${u.m}m ${u.d}d ${u.clock}`; };
  tick();
  setInterval(tick, 1000);

  /* ─────────── Typed role ─────────── */
  const typed = $('#typed');
  const ROLES = ['DevOps Engineer', 'Kubernetes on EKS & GKE', 'Terraform everything', 'GitOps with Helm + FluxCD', 'Cloud cost optimizer', 'Prometheus · Grafana · Loki'];
  if (!reduced) {
    let ri = 0, ci = ROLES[0].length, del = true;
    const loop = () => {
      const word = ROLES[ri];
      ci += del ? -1 : 1;
      typed.textContent = word.slice(0, ci);
      let wait = del ? 28 : 62;
      if (!del && ci === word.length) { del = true; wait = 1900; }
      else if (del && ci === 0) { del = false; ri = (ri + 1) % ROLES.length; wait = 260; }
      setTimeout(loop, wait);
    };
    setTimeout(loop, 2200);
  }

  /* ─────────── Terminal ─────────── */
  const out = $('#term-out');
  const body = $('#term-body');
  const input = $('#term-in');
  const line = $('#term-line');
  const history = [];
  let hIdx = 0;

  const print = (html = '') => {
    const d = document.createElement('div');
    d.innerHTML = html || '&nbsp;';
    out.appendChild(d);
    body.scrollTop = body.scrollHeight;
  };
  const col = (s, w) => esc(s).padEnd(w + (esc(s).length - s.length));
  const k = (s) => `<span class="c-key">${s}</span>`;
  const ok = (s) => `<span class="c-ok">${s}</span>`;
  const dim = (s) => `<span class="c-dim">${s}</span>`;
  const hi = (s) => `<span class="c-hi">${s}</span>`;
  const err = (s) => `<span class="c-err">${s}</span>`;
  const warn = (s) => `<span class="c-warn">${s}</span>`;
  const goto = (id) => $(`#${id}`)?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });

  const yaml = () => [
    `${k('apiVersion')}: devops/v1`,
    `${k('kind')}: Engineer`,
    `${k('metadata')}:`,
    `  ${k('name')}: himanshu-pant`,
    `  ${k('namespace')}: pune-india`,
    `  ${k('labels')}: { ${hi('aws')}, ${hi('kubernetes')}, ${hi('terraform')}, ${hi('gitops')} }`,
    `${k('spec')}:`,
    `  ${k('role')}: DevOps Developer @ Resident Interface`,
    `  ${k('experience')}: ~3 years in production`,
    `  ${k('clusters')}: [ Amazon EKS, Google GKE ]`,
    `${k('status')}:`,
    `  ${k('phase')}: ${ok('Running')}`,
    `  ${k('conditions')}: ${ok('Ready')}, ${ok('OpenToInterestingProblems')}`,
  ];

  const COMMANDS = {
    help: () => [
      'Available commands:',
      `  ${hi('kubectl get engineer himanshu -o yaml')}   who is this`,
      `  ${hi('kubectl get nodes')}                       where I have worked`,
      `  ${hi('kubectl get pods -n skills')}              what I work with`,
      `  ${hi('kubectl logs career')}                     career log`,
      `  ${hi('kubectl top engineer')}                    impact numbers`,
      `  ${hi('helm list')}                               projects`,
      `  ${hi('kubectl get svc')}                         contact endpoints`,
      `  ${hi('cd')} ${dim('skills|projects|contact')}   jump to a section`,
      `  ${hi('resume')}  ${hi('whoami')}  ${hi('clear')}`,
      dim('  tip: "k" works as an alias for kubectl, ↑/↓ for history'),
    ],
    whoami: () => ['visitor ' + dim('(read-only ClusterRole — look around, break nothing)')],
    'kubectl get engineer himanshu -o yaml': yaml,
    'kubectl describe engineer himanshu': yaml,
    'kubectl get nodes': () => [
      dim(`${col('NAME', 23)}${col('STATUS', 9)}${col('ROLE', 23)}AGE`),
      ...JOBS.map((j) => `${col(j.name, 23)}${j.status === 'Ready' ? ok(col(j.status, 9)) : warn(col(j.status, 9))}${col(j.role, 23)}${j.when}`),
    ],
    'kubectl get pods -n skills': () => [
      dim(`${col('NAMESPACE', 15)}${col('READY', 7)}PODS`),
      ...SKILLS.map((g) => `${k(col(g.ns, 15))}${ok(col(`${g.items.length}/${g.items.length}`, 7))}${esc(g.items.join(', '))}`),
    ],
    'kubectl logs career': () => [
      `${dim('2022-07')} ${hi('INFO')}  started MCA @ GBPIET, Pauri Garhwal`,
      `${dim('2024-03')} ${hi('INFO')}  joined Rubico IT as DevOps Engineer`,
      `${dim('2024-06')} ${hi('INFO')}  MCA completed (GPA 7.07/10)`,
      `${dim('       ')} ${ok('DONE')}  migrated 30+ Jenkins pipelines → GitHub Actions`,
      `${dim('2025-08')} ${hi('INFO')}  joined Algorizz Technologies as Cloud & DevOps Engineer`,
      `${dim('       ')} ${ok('DONE')}  GitOps (Helm + FluxCD) for 30+ microservices × 3 envs`,
      `${dim('       ')} ${ok('DONE')}  observability stack: Prometheus, Grafana, Loki`,
      `${dim('2026-02')} ${hi('INFO')}  joined Resident Interface as DevOps Developer`,
      `${dim('       ')} ${ok('DONE')}  AWS bill −20% ($3,000+/month)`,
      `${dim('       ')} ${ok('DONE')}  CircleCI → GitHub Actions; SSO, GuardDuty, WAF rolled out`,
      `${dim('       ')} ${warn('LIVE')}  agentic AI on Bedrock AgentCore, Ollama on EKS…`,
    ],
    'kubectl top engineer': () => [
      dim(`${col('METRIC', 28)}VALUE`),
      `${col('microservices_in_prod', 28)}${ok('40+')}`,
      `${col('aws_bill_reduction', 28)}${ok('20%  ($3,000+/mo)')}`,
      `${col('pipelines_migrated', 28)}${ok('30+')}`,
      `${col('gitops_services', 28)}${ok('30+ across 3 envs')}`,
      `${col('client_projects', 28)}${ok('20+')}`,
    ],
    'helm list': () => [
      dim(`${col('NAME', 15)}${col('STATUS', 10)}${col('STACK', 30)}URL`),
      `${k(col('ssh-exporter', 15))}${ok(col('deployed', 10))}${col('Go, Prometheus, Docker, TF', 30)}github.com/Himanshu-216/ssh-exporter`,
    ],
    'kubectl get svc': () => [
      dim(`${col('NAME', 10)}ENDPOINT`),
      `${k(col('email', 10))}himanshu162pnt@gmail.com`,
      `${k(col('linkedin', 10))}linkedin.com/in/himanshu-pant-130415211`,
      `${k(col('github', 10))}github.com/Himanshu-216`,
    ],
    resume: () => { window.open('assets/Himanshu_Pant_Resume.pdf', '_blank', 'noopener'); return ['opening resume.pdf …']; },
    ls: () => ['skills/  projects/  contact/  resume.pdf'],
    pwd: () => ['/home/visitor/himanshu-cluster'],
    date: () => [new Date().toString()],
    uptime: () => { const u = uptime(); return [`up ${u.y} years, ${u.m} months, ${u.d} days — 0 restarts`]; },
  };

  const ALIASES = {
    'kubectl get engineer': 'kubectl get engineer himanshu -o yaml',
    'kubectl get engineer himanshu': 'kubectl get engineer himanshu -o yaml',
    'kubectl get no': 'kubectl get nodes',
    'kubectl get node': 'kubectl get nodes',
    'kubectl get experience': 'kubectl get nodes',
    'kubectl get pods': 'kubectl get pods -n skills',
    'kubectl get po': 'kubectl get pods -n skills',
    'kubectl get pods -a': 'kubectl get pods -n skills',
    'kubectl get pods --all-namespaces': 'kubectl get pods -n skills',
    'kubectl get skills': 'kubectl get pods -n skills',
    'kubectl logs': 'kubectl logs career',
    'kubectl top': 'kubectl top engineer',
    'kubectl get projects': 'helm list',
    'helm ls': 'helm list',
    'kubectl get services': 'kubectl get svc',
    'kubectl get svc -n contact': 'kubectl get svc',
    contact: 'kubectl get svc',
    '?': 'help',
    man: 'help',
  };

  const run = (raw) => {
    const cmd = raw.trim().replace(/\s+/g, ' ');
    print(`<span class="ps1">visitor@cluster:~$</span> ${esc(cmd)}`);
    if (!cmd) return;
    let c = cmd.toLowerCase().replace(/^k( |$)/, 'kubectl$1');
    c = ALIASES[c] || c;

    if (c === 'clear') { out.innerHTML = ''; return; }
    if (COMMANDS[c]) { COMMANDS[c]().forEach(print); return; }

    const cd = c.match(/^(?:cd|goto) \/?(skills|projects|contact)\/?$/);
    if (cd) { print(dim(`→ scrolling to #${cd[1]}`)); goto(cd[1]); return; }

    if (/^kubectl (delete|drain|cordon|edit|apply|patch|scale)\b/.test(c)) {
      print(err(`Error from server (Forbidden): user "visitor" cannot ${c.split(' ')[1]} resources in this cluster. Nice try.`));
    } else if (/^sudo\b/.test(c)) {
      print(err('visitor is not in the sudoers file. This incident will be reported to Prometheus.'));
    } else if (/^rm\b/.test(c)) {
      print(err("rm: refusing — this cluster has backups, and they're tested."));
    } else if (c === 'kubectl') {
      print(`kubectl controls the Himanshu cluster. Try ${hi('help')}.`);
    } else if (c === 'exit') {
      print(dim("there's no escape — try scrolling instead."));
    } else {
      print(`${err('command not found:')} ${esc(cmd)} ${dim('— type')} ${hi('help')}`);
    }
  };

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const v = input.value;
      input.value = '';
      if (v.trim()) history.push(v);
      hIdx = history.length;
      run(v);
    } else if (e.key === 'ArrowUp' && history.length) {
      e.preventDefault();
      hIdx = Math.max(0, hIdx - 1);
      input.value = history[hIdx];
    } else if (e.key === 'ArrowDown' && history.length) {
      e.preventDefault();
      hIdx = Math.min(history.length, hIdx + 1);
      input.value = history[hIdx] || '';
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault();
      out.innerHTML = '';
    }
  });
  body.addEventListener('click', () => { if (!getSelection().toString()) input.focus({ preventScroll: true }); });
  $$('.term-hints button').forEach((b) => b.addEventListener('click', () => run(b.dataset.cmd)));

  // Intro: type the first command, then hand over the prompt.
  const INTRO = 'kubectl get engineer himanshu -o yaml';
  const finishIntro = () => {
    run(INTRO);
    print(dim('# this terminal is live — type "help" or click a command below'));
    line.style.visibility = 'visible';
  };
  if (reduced) {
    finishIntro();
  } else {
    line.style.visibility = 'hidden';
    const ghost = document.createElement('div');
    ghost.innerHTML = '<span class="ps1">visitor@cluster:~$</span> <span></span><span class="caret"></span>';
    out.appendChild(ghost);
    const target = ghost.children[1];
    let i = 0;
    const type = () => {
      target.textContent = INTRO.slice(0, ++i);
      if (i < INTRO.length) setTimeout(type, 34 + Math.random() * 40);
      else setTimeout(() => { ghost.remove(); finishIntro(); }, 350);
    };
    setTimeout(type, 600);
  }

  /* ─────────── Sea: layered swell with a container ship on the horizon ─────────── */
  const sea = $('#sea');
  const sctx = sea.getContext('2d');
  if (sctx) {
    // back → front: hazy and light in the distance, dark and slow-rolling up close
    const LAYERS = [
      { base: 0.34, amp: 4, len: 460, speed: 0.10, rgb: '34,66,124', alpha: 0.30 },
      { base: 0.45, amp: 6, len: 380, speed: -0.13, rgb: '26,54,108', alpha: 0.42 },
      { base: 0.58, amp: 8, len: 310, speed: 0.17, rgb: '18,42,88', alpha: 0.58 },
      { base: 0.72, amp: 10, len: 260, speed: -0.21, rgb: '12,30,66', alpha: 0.78 },
      { base: 0.86, amp: 12, len: 210, speed: 0.26, rgb: '8,20,46', alpha: 0.95 },
    ];
    const CARGO = ['#42609f', '#3b8794', '#9c7f4c', '#437f6c', '#8d5562', '#5f79b0'];
    let sw, sh, sraf, last = 0, placed = false;

    const waveY = (L, i, x, t) =>
      L.base * sh +
      L.amp * Math.sin((x / L.len) * 6.283 + t * L.speed * 4) +
      L.amp * 0.4 * Math.sin((x / (L.len * 0.37)) * 6.283 - t * L.speed * 6 + i * 1.7);

    const drawLayer = (L, i, t) => {
      sctx.beginPath();
      sctx.moveTo(0, waveY(L, i, 0, t));
      for (let x = 8; x <= sw + 8; x += 8) sctx.lineTo(x, waveY(L, i, x, t));
      sctx.strokeStyle = `rgba(140,185,255,${0.05 + i * 0.025})`;
      sctx.lineWidth = 1;
      sctx.stroke();
      sctx.lineTo(sw + 8, sh); sctx.lineTo(0, sh); sctx.closePath();
      const g = sctx.createLinearGradient(0, L.base * sh - L.amp, 0, sh);
      g.addColorStop(0, `rgba(${L.rgb},${L.alpha})`);
      g.addColorStop(1, 'rgba(7,11,20,0.9)');
      sctx.fillStyle = g;
      sctx.fill();
    };

    // Each vessel is drawn facing right, origin at the waterline amidships (y up is negative).
    const SHAPES = {
      container(t) {
        [[-34, 5], [-52, 6], [-52, 7]].forEach(([x0, n], r) => {
          for (let c = 0; c < n; c++) {
            sctx.fillStyle = CARGO[(r * 2 + c * 5) % CARGO.length];
            sctx.fillRect(x0 + c * 18, -37 + r * 9, 17, 8);
          }
        });
        sctx.fillStyle = '#6f7f9f';                       // bridge at the stern
        sctx.fillRect(-78, -40, 20, 30);
        sctx.fillRect(-71, -50, 5, 10);
        sctx.fillStyle = 'rgba(255,214,140,.9)';          // lit windows
        sctx.fillRect(-75, -36, 14, 2);
        sctx.fillRect(-75, -30, 14, 2);
        sctx.fillStyle = `rgba(255,107,122,${0.35 + 0.65 * (Math.sin(t * 3) > 0)})`;
        sctx.fillRect(-70, -54, 3, 3);                    // blinking mast light
        poly('#1b3260', [-88, -10, 92, -10, 80, 12, -80, 12]);
        sctx.fillStyle = '#2a4a86';
        sctx.fillRect(-87, -10, 178, 3);
      },
      sailboat() {
        sctx.fillStyle = '#9fb0d0';
        sctx.fillRect(-1, -62, 2, 56);                    // mast
        poly('rgba(220,230,250,.88)', [3, -60, 3, -11, 30, -11]);     // mainsail
        poly('rgba(160,190,240,.75)', [-3, -52, -3, -11, -24, -11]);  // jib
        poly('#38d6f0', [1, -62, 1, -67, 10, -64.5]);     // pennant
        poly('#7f93b8', [-28, -7, 32, -7, 20, 7, -22, 7]);
        sctx.fillStyle = '#c9d6f2';
        sctx.fillRect(-27, -7, 58, 2);
      },
      tug(t) {
        sctx.fillStyle = '#42609f';                       // funnel + band
        sctx.fillRect(-20, -34, 8, 22);
        sctx.fillStyle = '#9c7f4c';
        sctx.fillRect(-20, -34, 8, 4);
        for (let i = 0; i < 3; i++) {                     // drifting smoke
          const p = (t * 0.35 + i / 3) % 1;
          sctx.fillStyle = `rgba(150,170,210,${0.22 * (1 - p)})`;
          sctx.beginPath();
          sctx.arc(-16 - p * 26, -38 - p * 22, 3 + p * 6, 0, 6.283);
          sctx.fill();
        }
        sctx.fillStyle = '#7d8cab';                       // wheelhouse
        sctx.fillRect(-8, -27, 22, 18);
        sctx.fillStyle = 'rgba(255,214,140,.9)';
        sctx.fillRect(-4, -23, 15, 4);
        poly('#22385f', [-32, -9, 30, -9, 36, -3, 26, 8, -28, 8]);
        sctx.fillStyle = '#8d5562';
        sctx.fillRect(-32, -9, 63, 3);
      },
      tanker(t) {
        sctx.fillStyle = '#5d6d8f';                       // bridge at the stern
        sctx.fillRect(-86, -32, 22, 24);
        sctx.fillRect(-80, -42, 6, 10);
        sctx.fillStyle = 'rgba(255,214,140,.8)';
        sctx.fillRect(-83, -28, 16, 2);
        sctx.fillStyle = '#3b558c';                       // deck piping + tank domes
        sctx.fillRect(-56, -12, 136, 2);
        for (let x = -40; x <= 60; x += 25) {
          sctx.beginPath(); sctx.arc(x, -8, 9, Math.PI, 0); sctx.fill();
        }
        sctx.fillStyle = `rgba(61,220,151,${0.3 + 0.7 * (Math.sin(t * 2.2) > 0)})`;
        sctx.fillRect(86, -14, 3, 3);                     // bow light
        poly('#1c2f58', [-96, -8, 100, -8, 90, 10, -90, 10]);
        sctx.fillStyle = '#6b3f4c';
        sctx.fillRect(-92, 4, 184, 3);
      },
    };
    const poly = (fill, pts) => {
      sctx.fillStyle = fill;
      sctx.beginPath();
      sctx.moveTo(pts[0], pts[1]);
      for (let i = 2; i < pts.length; i += 2) sctx.lineTo(pts[i], pts[i + 1]);
      sctx.closePath();
      sctx.fill();
    };

    // layer: which swell it floats in · speed: px/s, negative sails right → left · at: start position (0–1)
    const FLEET = [
      { shape: 'tanker', layer: 0, speed: -4, scale: 0.5, at: 0.86, pad: 70 },
      { shape: 'container', layer: 1, speed: 9, scale: 0.85, at: 0.3, pad: 110 },
      { shape: 'tug', layer: 2, speed: -13, scale: 0.9, at: 0.62, pad: 60 },
      { shape: 'sailboat', layer: 3, speed: 17, scale: 0.95, at: 0.1, pad: 50 },
    ];

    const drawVessel = (v, t) => {
      const L = LAYERS[v.layer];
      const k = v.scale * (sw < 720 ? 0.62 : 1);
      const y = waveY(L, v.layer, v.x, t);
      const tilt = Math.atan2(waveY(L, v.layer, v.x + 30, t) - waveY(L, v.layer, v.x - 30, t), 60) * 0.5;
      sctx.save();
      sctx.translate(v.x, y + 4 * k);
      sctx.rotate(tilt);
      sctx.scale(v.speed < 0 ? -k : k, k);
      SHAPES[v.shape](t);
      sctx.restore();
    };

    const frame = (ms) => {
      const t = ms / 1000;
      const dt = Math.min(t - last, 0.1); last = t;
      for (const v of FLEET) {
        v.x += dt * v.speed;
        if (v.x > sw + v.pad) v.x = -v.pad;
        else if (v.x < -v.pad) v.x = sw + v.pad;
      }
      sctx.clearRect(0, 0, sw, sh);
      LAYERS.forEach((L, i) => {
        for (const v of FLEET) if (v.layer === i) drawVessel(v, t);   // hull sits in this layer's water
        drawLayer(L, i, t);
      });
      if (!reduced) sraf = requestAnimationFrame(frame);
    };

    const fit = () => {
      const dpr = Math.min(devicePixelRatio || 1, 2);
      sw = sea.clientWidth; sh = sea.clientHeight;
      sea.width = sw * dpr; sea.height = sh * dpr;
      sctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      for (const v of FLEET) if (!placed || v.x > sw + v.pad) v.x = sw * v.at;
      placed = true;
      if (reduced) frame(0);
    };
    fit();
    if (!reduced) sraf = requestAnimationFrame(frame);
    let st;
    addEventListener('resize', () => { clearTimeout(st); st = setTimeout(fit, 150); });
    document.addEventListener('visibilitychange', () => {
      cancelAnimationFrame(sraf);
      if (!document.hidden && !reduced) sraf = requestAnimationFrame(frame);
    });
  }

  /* ─────────── Background mesh (pods drifting between nodes) ─────────── */
  const canvas = $('#mesh');
  const ctx = canvas.getContext('2d');
  if (ctx && !reduced) {
    let w, h, pts = [], raf;
    const LINK = 150;
    const resize = () => {
      const dpr = Math.min(devicePixelRatio || 1, 2);
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.min(70, Math.round((w * h) / 26000));
      pts = Array.from({ length: n }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.25, vy: (Math.random() - 0.5) * 0.25,
        r: Math.random() * 1.6 + 0.8,
      }));
    };
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (const p of pts) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
      }
      for (let i = 0; i < pts.length; i++) {
        const a = pts[i];
        for (let j = i + 1; j < pts.length; j++) {
          const b = pts[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < LINK) {
            ctx.strokeStyle = `rgba(80,135,240,${(1 - d / LINK) * 0.22})`;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
        ctx.fillStyle = 'rgba(122,165,255,.55)';
        ctx.beginPath(); ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2); ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };
    resize();
    draw();
    let rt;
    addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(resize, 150); });
    document.addEventListener('visibilitychange', () => {
      cancelAnimationFrame(raf);
      if (!document.hidden) draw();
    });
  }
})();
