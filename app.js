/* ==========================================================================
   app.js — 화면 동작
   ==========================================================================
   ※ 문구를 고치실 때는 이 파일이 아니라 content.js 를 여세요.
   ※ 색·모양은 style.css, 그림은 illust.js 입니다.
   ========================================================================== */

'use strict';

/* ── 상태 ───────────────────────────────────────────────────── */

let answers = [];      // 각 문항에서 고른 팀 코드
let step = 0;          // 현재 문항 번호 (0부터)
let result = '';       // 최종 팀 코드
let person = '';       // 참가자 이름
let submitId = '';     // 중복 전송 방지용 고유 번호
let sentOK = false;    // 이미 전송에 성공했는지

const app = document.querySelector('#app');
const TOTAL = QUESTIONS.length;

/* ── 도우미 ─────────────────────────────────────────────────── */

// HTML 특수문자 이스케이프 (이름이 화면에 들어갈 때 사용)
function esc(s) {
  return String(s).replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c]));
}

// 팀 색을 CSS 변수로 꺼내기
function teamColor(key) {
  const map = { A: '--mint', B: '--sky', C: '--coral' };
  return getComputedStyle(document.documentElement)
    .getPropertyValue(map[key]).trim() || '#10B981';
}

// 팀 색의 옅은 배경색 (일러스트 바탕)
const SOFT = { A: '#E7F9F0', B: '#E8F1FE', C: '#FDE8F0' };

// 옅은 배경 위 글자용 진한 팀 색 (대비 확보)
const DEEP = { A: '#0B8F66', B: '#2563EB', C: '#C41653' };

// 질문·이름 화면에서 쓰는 보라 (팀에 없는 색이라 결과가 미리 노출되지 않음)
const VIOLET = '#8B5CF6';
const VIOLET_SOFT = '#F3EEFE';

// 화면을 그리고 맨 위로 스크롤
function render(html, accentKey) {
  const root = document.documentElement;
  if (accentKey) {
    // 결과 화면 — 팀 색
    root.style.setProperty('--accent', teamColor(accentKey));
    root.style.setProperty('--accent-soft', SOFT[accentKey]);
    root.style.setProperty('--accent-deep', DEEP[accentKey]);
  } else {
    // 시작·질문·이름 화면 — 보라
    root.style.setProperty('--accent', VIOLET);
    root.style.setProperty('--accent-soft', VIOLET_SOFT);
    root.style.setProperty('--accent-deep', '#6D28D9');
  }
  app.innerHTML = html;
  window.scrollTo(0, 0);
}

/* ==========================================================================
   화면 1 — 시작
   ========================================================================== */

function screenStart() {
  render(`
    <section class="hero">
      <div>
        <span class="tag">${SITE.eyebrow}</span>
        <h1>${SITE.title}</h1>
        <p class="lead">${SITE.lead.replace('{n}', TOTAL)}</p>
        <button class="primary" id="begin">${SITE.startButton} →</button>
        <p class="meta startmeta">${SITE.startMeta.replace('{n}', TOTAL)}</p>
      </div>

      <div>
        <div class="ticket">
          ${ILLUST.START}
          <div class="ticket-body">
            <span class="ticket-label">${SITE.passLabel ? SITE.brand + ' · ' + SITE.passLabel : SITE.brand}</span>
            <div class="ticket-word">${SITE.passWord}</div>
            <p class="ticket-line">${SITE.passLine}</p>
            <p class="ticket-sub">${SITE.passSub}</p>
          </div>
          <div class="perforation"></div>
          <div class="ticket-foot">
            <span>${SITE.passFootLeft}</span>
            <b>${SITE.passFootRight}</b>
          </div>
        </div>
        <div class="small-tags">
          ${SITE.passTags.map(t => `<span>${t}</span>`).join('')}
        </div>
      </div>
    </section>
  `);

  document.querySelector('#begin').onclick = () => {
    answers = [];
    step = 0;
    sentOK = false;
    submitId = '';
    screenQuiz();
  };
}

/* ==========================================================================
   화면 2 — 질문
   ========================================================================== */

function screenQuiz() {
  const q = QUESTIONS[step];
  const num = String(step + 1).padStart(2, '0');
  const all = String(TOTAL).padStart(2, '0');

  render(`
    <section class="quiz">
      <div class="quiz-top">
        <span>MY MT MODE</span>
        <span class="count">${num} / ${all}</span>
      </div>
      <div class="progress">
        <div style="width:${(step / TOTAL) * 100}%"></div>
      </div>

      <h2>${q.q}</h2>
      <p class="meta">${QUIZ_HINT}</p>

      <div class="options">
        ${q.a.map((a, i) => `
          <button class="option" data-i="${i}">
            <span class="num">${i + 1}</span>
            <span>${a[1]}</span>
          </button>
        `).join('')}
      </div>

      <button class="back">← ${step ? '이전 질문' : '처음으로'}</button>
    </section>
  `);

  document.querySelectorAll('[data-i]').forEach(btn => {
    btn.onclick = () => {
      answers[step] = q.a[+btn.dataset.i][0];
      step += 1;
      if (step < TOTAL) screenQuiz();
      else decide();
    };
  });

  document.querySelector('.back').onclick = () => {
    if (step) { step -= 1; screenQuiz(); }
    else screenStart();
  };
}

/* ==========================================================================
   채점 — 동점이면 한 번 더 고르기
   ========================================================================== */

function decide() {
  const scores = { A: 0, B: 0, C: 0 };
  answers.forEach(t => { scores[t] += 1; });

  const best = Math.max(...Object.values(scores));
  const top = Object.keys(scores).filter(t => scores[t] === best);

  if (top.length === 1) {
    result = top[0];
    screenName();
    return;
  }

  render(`
    <section class="quiz">
      <span class="eyebrow">${TIE.eyebrow}</span>
      <h2>${TIE.title}</h2>
      <p class="lead">${TIE.lead}</p>
      <div class="options">
        ${top.map(t => `
          <button class="option" data-team="${t}">
            <span class="num">·</span>
            <span>${TEAMS[t].quote}</span>
          </button>
        `).join('')}
      </div>
    </section>
  `);

  document.querySelectorAll('[data-team]').forEach(btn => {
    btn.onclick = () => { result = btn.dataset.team; screenName(); };
  });
}

/* ==========================================================================
   화면 3 — 이름 입력
   ========================================================================== */

function screenName() {
  const collecting = !!COLLECT.endpoint;

  render(`
    <form class="quiz" id="nameForm" novalidate>
      <span class="eyebrow">${FORM.eyebrow}</span>
      <h2>${FORM.title}</h2>

      <label class="field">
        <span class="field-label">${FORM.label}</span>
        <input type="text" id="name" maxlength="12" autocomplete="name"
               placeholder="${FORM.placeholder}" enterkeyhint="go">
      </label>
      <p class="field-help">${FORM.help}</p>
      <p class="error" id="err" role="alert"></p>

      <p class="privacy">${collecting ? FORM.privacy : COLLECT.offNotice}</p>

      <button class="primary" type="submit" id="go">${FORM.submit} →</button>
    </form>
  `);

  const form = document.querySelector('#nameForm');
  const input = document.querySelector('#name');
  const err = document.querySelector('#err');
  const go = document.querySelector('#go');

  input.focus();

  form.onsubmit = async (e) => {
    e.preventDefault();
    const value = input.value.trim();

    if (!value) { err.textContent = FORM.errEmpty; input.focus(); return; }
    if (value.length < 2) { err.textContent = FORM.errShort; input.focus(); return; }

    err.textContent = '';
    person = value;

    if (!collecting) { screenResult(); return; }

    go.disabled = true;
    go.textContent = FORM.sending;

    const ok = await submit();
    if (ok) {
      screenResult();
    } else {
      go.disabled = false;
      go.textContent = FORM.submit + ' →';
      err.textContent = FORM.errSend;
    }
  };
}

/* ==========================================================================
   응답 전송 (Google Apps Script)
   ==========================================================================
   같은 사람이 버튼을 여러 번 눌러도 submitId 가 같으므로
   시트에서 중복으로 쌓이지 않습니다.
   ========================================================================== */

async function submit() {
  if (sentOK) return true;                       // 이미 보냄
  if (!submitId) submitId = makeId();

  const payload = {
    id: submitId,
    name: person,
    team: result,
    course: TEAMS[result].course,
    answers: answers.join(''),
    at: new Date().toISOString(),
  };

  try {
    // Apps Script 는 text/plain 으로 보내야 CORS 사전요청이 안 생깁니다.
    const res = await fetch(COLLECT.endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (data && data.ok) { sentOK = true; return true; }
    return false;
  } catch (e) {
    return false;
  }
}

function makeId() {
  if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

/* ==========================================================================
   화면 4 — 결과
   ========================================================================== */

function screenResult() {
  const t = TEAMS[result];

  render(`
    <section class="result">
      <div class="ticket">
        ${ILLUST[result]}
        <div class="ticket-body">
          <span class="ticket-label">${SITE.brand} · MY DAY PASS</span>
          <div class="ticket-word">TEAM ${result}</div>
          <p class="result-name"><b>${esc(person)}</b>님의 오늘</p>
          <p class="result-type">${t.name}</p>
          <p class="result-quote">${t.quote}</p>
        </div>
        <div class="perforation"></div>
        <div class="ticket-foot">
          <span>오늘의 추천 코스</span>
          <b>${t.course}</b>
        </div>
      </div>

      <div>
        <span class="eyebrow">${RESULT.eyebrow}</span>
        <h2>${RESULT.descTitle}</h2>

        <ul class="card-lines">
          ${(t.cardLines || []).map(l => `<li>${l}</li>`).join('')}
        </ul>

        <div class="mission">
          <span class="mission-label">${RESULT.missionLabel}</span>
          <p class="mission-text">${t.mission}</p>
        </div>

        <dl class="info-table">
          <div class="info-label">${RESULT.infoLabel}</div>
          ${t.info.map(row => `
            <div class="info-row">
              <dt>${row[0]}</dt>
              <dd>${row[1]}</dd>
            </div>
          `).join('')}
        </dl>

        <button class="primary" id="save">${RESULT.saveButton} ↓</button>
        <button class="secondary" id="share" hidden>${RESULT.shareButton} ↗</button>
        <p id="status" role="status"></p>

        <p class="notice" style="margin-top:16px">${RESULT.notice}</p>
        <button class="back" id="again">← ${RESULT.againButton}</button>
      </div>
    </section>
  `, result);

  document.querySelector('#save').onclick = save;
  document.querySelector('#again').onclick = screenStart;

  if (navigator.canShare) {
    const b = document.querySelector('#share');
    b.hidden = false;
    b.onclick = share;
  }
}

/* ==========================================================================
   결과 카드 PNG — 1080 x 1440
   ==========================================================================
   화면과 별개로 Canvas 에 다시 그립니다.
   화면 CSS 를 바꿔도 이 이미지는 자동으로 바뀌지 않습니다.
   ========================================================================== */

async function card() {
  try { await document.fonts.ready; } catch (e) { /* 무시 */ }

  const t = TEAMS[result];
  const accent = teamColor(result);
  const deep = DEEP[result];
  const W = 1080, H = 1330;
  const M = 72;                       // 바깥 여백
  const PAD = 76;                     // 카드 안쪽 여백
  const L = M + PAD;                  // 글자 시작 x
  const RIGHT = W - M - PAD;
  const maxW = RIGHT - L;

  const c = document.createElement('canvas');
  c.width = W;
  c.height = H;
  const x = c.getContext('2d');

  // 배경
  x.fillStyle = '#FFFFFF';
  x.fillRect(0, 0, W, H);

  // 카드
  x.fillStyle = '#FFFFFF';
  roundRect(x, M, M, W - M * 2, H - M * 2, 28);
  x.fill();
  x.strokeStyle = '#EBEEEC';
  x.lineWidth = 2;
  roundRect(x, M, M, W - M * 2, H - M * 2, 28);
  x.stroke();

  // 상단 팀 색 띠
  x.save();
  roundRect(x, M, M, W - M * 2, H - M * 2, 28);
  x.clip();
  x.fillStyle = accent;
  x.fillRect(M, M, W - M * 2, 14);
  x.restore();

  // ── 글자 도우미 ──
  const font = (size, weight = 400, serif = false) => {
    x.font = `${weight} ${size}px ${serif
      ? '"Gowun Batang", "Noto Sans KR", serif'
      : '"Noto Sans KR", sans-serif'}`;
  };

  const line = (text, y, size, weight, color, serif) => {
    font(size, weight, serif);
    x.fillStyle = color;
    x.fillText(text, L, y);
  };

  // 여러 줄 자동 줄바꿈 (한글은 글자 단위로도 끊음)
  const wrap = (text, y, size, weight, color, lh, serif) => {
    font(size, weight, serif);
    x.fillStyle = color;
    const words = String(text).split(' ');
    let cur = '';
    let yy = y;
    for (const w of words) {
      const test = cur ? cur + ' ' + w : w;
      if (x.measureText(test).width > maxW && cur) {
        x.fillText(cur, L, yy);
        yy += lh;
        cur = w;
      } else {
        cur = test;
      }
    }
    if (cur) { x.fillText(cur, L, yy); yy += lh; }
    return yy;
  };

  let y = M + 92;

  // ── 머리말 : 행사명(왼쪽) + 날짜(오른쪽) ──
  line(SITE.cardTitle, y, 26, 900, '#1A1D1B');
  y += 40;
  // 날짜는 오른쪽 끝에 맞춥니다
  x.save();
  x.textAlign = 'right';
  font(25, 400);
  x.fillStyle = '#7C8580';
  x.fillText(SITE.cardDate, RIGHT, y);
  x.restore();

  // ── 일러스트 (원본 400x200 = 2:1 비율 유지) ──
  y += 22;
  const ILLUST_W = 700;
  const ILLUST_H = ILLUST_W / 2;                  // 350
  const ILLUST_X = (W - ILLUST_W) / 2;            // 가운데 정렬
  drawIllust(x, result, accent, ILLUST_X, y, ILLUST_W, ILLUST_H, false);
  y += ILLUST_H;

  // ── TEAM X — 보조 정보로 작게 ──
  y += 62;
  line('TEAM ' + result, y, 34, 900, accent);

  // ── 이름 ──
  //    강승호 님은 오늘
  y += 62;
  x.font = '900 54px "Noto Sans KR", sans-serif';
  const nameW = x.measureText(person).width;
  x.fillStyle = '#1A1D1B';
  x.fillText(person, L, y);

  x.font = '400 30px "Noto Sans KR", sans-serif';
  x.fillStyle = '#7C8580';
  x.fillText(RESULT.cardNameSuffix, L + nameW + 13, y);

  // ── 유형명 — 결과의 중심 ──
  //    토크 요셉!
  y += 88;
  line(t.name + RESULT.cardTypeSuffix, y, 76, 900, accent);


  // 절취선
  y = H - M - 430;
  x.save();
  x.setLineDash([12, 12]);
  x.strokeStyle = '#DADEDB';
  x.lineWidth = 2;
  x.beginPath();
  x.moveTo(L, y);
  x.lineTo(RIGHT, y);
  x.stroke();
  x.restore();

  // 절취선 양옆 반원
  x.fillStyle = '#FFFFFF';
  x.beginPath(); x.arc(M, y, 18, 0, Math.PI * 2); x.fill();
  x.beginPath(); x.arc(W - M, y, 18, 0, Math.PI * 2); x.fill();
  x.strokeStyle = '#DADEDB';
  x.lineWidth = 2;
  x.beginPath(); x.arc(M, y, 18, 0, Math.PI * 2); x.stroke();
  x.beginPath(); x.arc(W - M, y, 18, 0, Math.PI * 2); x.stroke();

  // ── 절취선 아래: 추천 코스 + 해설 3줄 + 오늘의 미션 ──

  // 추천 코스
  y += 50;
  line('오늘의 추천 코스', y, 24, 400, '#7C8580');
  y += 46;
  line(t.cardCourse || t.course, y, 42, 900, '#1A1D1B');

  // 해설 3줄
  y += 58;
  const cl = t.cardLines || [];
  for (let i = 0; i < cl.length; i++) {
    line(cl[i], y, 27, 400, '#1A1D1B');
    y += 44;
  }

  // 오늘의 미션 — 팀색 옅은 배경 박스
  y += 12;
  const boxH = 104;
  x.fillStyle = SOFT[result];
  roundRect(x, L, y, maxW, boxH, 14);
  x.fill();

  // 미션 글자는 박스 안에서 가운데 정렬
  const cx = L + maxW / 2;
  x.save();
  x.textAlign = 'center';
  font(24, 700);
  x.fillStyle = deep;
  x.fillText(RESULT.missionLabel, cx, y + 38);
  font(30, 700);
  x.fillStyle = '#1A1D1B';
  x.fillText(t.mission, cx, y + 78);
  x.restore();

  return new Promise(resolve => c.toBlob(resolve, 'image/png'));
}

// 사각형 둥근 모서리 (roundRect 미지원 브라우저 대비)
function roundRect(ctx, rx, ry, rw, rh, r) {
  ctx.beginPath();
  if (ctx.roundRect) { ctx.roundRect(rx, ry, rw, rh, r); return; }
  ctx.moveTo(rx + r, ry);
  ctx.arcTo(rx + rw, ry, rx + rw, ry + rh, r);
  ctx.arcTo(rx + rw, ry + rh, rx, ry + rh, r);
  ctx.arcTo(rx, ry + rh, rx, ry, r);
  ctx.arcTo(rx, ry, rx + rw, ry, r);
  ctx.closePath();
}

/* ── PNG용 일러스트 — 화면 SVG를 Canvas 도형으로 단순화해 그림 ── */

function drawIllust(x, key, accent, ox, oy, w, h, flush) {
  x.save();

  // 옅은 바탕 (flush = 카드 폭 가득. 모서리 없이 직사각형)
  x.fillStyle = SOFT[key];
  if (flush) {
    x.fillRect(ox, oy, w, h);
    x.beginPath();
    x.rect(ox, oy, w, h);
    x.clip();
  } else {
    roundRect(x, ox, oy, w, h, 8);
    x.fill();
    roundRect(x, ox, oy, w, h, 8);
    x.clip();
  }

  // SVG 좌표계(400x200)를 실제 영역에 맞춤.
  // 가로세로 비율을 그대로 유지(균등 배율)하고 넘치는 부분은 잘라냅니다.
  // 예전처럼 x.scale(w/400, h/200) 을 쓰면 그림이 옆으로 늘어납니다.
  const sc = Math.min(w / 400, h / 200);     // contain 방식 (그림 전체가 보이게)
  const dx = (w - 400 * sc) / 2;             // 가운데 정렬
  const dy = (h - 200 * sc) / 2;
  x.translate(ox + dx, oy + dy);
  x.scale(sc, sc);

  x.fillStyle = accent;
  x.strokeStyle = accent;
  x.lineCap = 'round';

  const tri = (x1, y1, x2, y2, x3, y3, a) => {
    x.globalAlpha = a;
    x.beginPath();
    x.moveTo(x1, y1); x.lineTo(x2, y2); x.lineTo(x3, y3);
    x.closePath();
    x.fill();
  };

  if (key === 'A') {
    // 능선
    x.globalAlpha = .14;
    x.beginPath();
    x.moveTo(0, 148);
    [[46,112],[78,134],[116,96],[152,130],[196,100],[238,132],[286,104],[330,136],[368,114],[400,142]]
      .forEach(p => x.lineTo(p[0], p[1]));
    x.lineTo(400, 200); x.lineTo(0, 200); x.closePath(); x.fill();

    x.globalAlpha = .26;
    x.beginPath();
    x.moveTo(0, 164);
    [[38,138],[72,156],[112,128],[148,152],[188,132],[228,158],[272,136],[316,160],[356,142],[400,164]]
      .forEach(p => x.lineTo(p[0], p[1]));
    x.lineTo(400, 200); x.lineTo(0, 200); x.closePath(); x.fill();

    // 나무
    tri(64, 178, 78, 128, 92, 178, .62);
    tri(300, 178, 316, 120, 332, 178, .62);
    tri(112, 180, 124, 140, 136, 180, .78);
    tri(262, 180, 274, 144, 286, 180, .78);

    // 모노레일
    x.globalAlpha = .5;
    x.lineWidth = 1.6;
    x.setLineDash([7, 6]);
    x.beginPath();
    x.moveTo(0, 92);
    x.bezierCurveTo(90, 70, 180, 104, 268, 78);
    x.bezierCurveTo(320, 66, 366, 62, 400, 74);
    x.stroke();
    x.setLineDash([]);

    x.globalAlpha = .9;
    roundRect(x, 186, 82, 30, 14, 5);
    x.fill();

  } else if (key === 'B') {
    // 나무
    x.globalAlpha = .16;
    [[128,74,26],[158,84,18],[268,70,22],[292,82,15]].forEach(c => {
      x.beginPath(); x.arc(c[0], c[1], c[2], 0, Math.PI * 2); x.fill();
    });

    // 연못
    x.globalAlpha = .2;
    x.fillRect(0, 116, 400, 36);

    // 물결
    x.globalAlpha = .45;
    x.lineWidth = 1.4;
    [[40,126],[132,136],[236,124],[300,140]].forEach(p => {
      x.beginPath();
      x.moveTo(p[0], p[1]);
      x.quadraticCurveTo(p[0] + 12, p[1] - 5, p[0] + 24, p[1]);
      x.quadraticCurveTo(p[0] + 36, p[1] + 5, p[0] + 48, p[1]);
      x.stroke();
    });

    // 창틀
    x.globalAlpha = .55;
    x.lineWidth = 2.2;
    x.strokeRect(30, 26, 340, 126);
    x.beginPath(); x.moveTo(200, 26); x.lineTo(200, 152); x.stroke();

    // 테이블
    x.globalAlpha = .72;
    x.fillRect(0, 152, 400, 6);
    x.globalAlpha = .1;
    x.fillRect(0, 158, 400, 42);

    // 커피잔
    x.globalAlpha = .85;
    x.beginPath();
    x.moveTo(140, 158); x.lineTo(174, 158); x.lineTo(174, 172);
    x.arc(157, 172, 17, 0, Math.PI); x.closePath(); x.fill();
    x.beginPath();
    x.moveTo(226, 158); x.lineTo(254, 158); x.lineTo(254, 170);
    x.arc(240, 170, 14, 0, Math.PI); x.closePath(); x.fill();

  } else {
    // 언덕
    x.globalAlpha = .12;
    x.beginPath();
    x.moveTo(0, 96);
    x.bezierCurveTo(80, 56, 150, 88, 220, 62);
    x.bezierCurveTo(290, 36, 340, 46, 400, 72);
    x.lineTo(400, 200); x.lineTo(0, 200); x.closePath(); x.fill();

    // 트랙
    const track = () => {
      x.beginPath();
      x.moveTo(-10, 66);
      x.bezierCurveTo(90, 60, 120, 116, 210, 120);
      x.bezierCurveTo(300, 124, 330, 150, 410, 128);
    };
    x.globalAlpha = .24; x.lineWidth = 26; track(); x.stroke();
    x.globalAlpha = 1; x.strokeStyle = SOFT.C;
    x.lineWidth = 18; track(); x.stroke();
    x.strokeStyle = accent;
    x.globalAlpha = .45; x.lineWidth = 1.6;
    x.setLineDash([10, 12]); track(); x.stroke(); x.setLineDash([]);

    // 카트 + 라이더
    x.save();
    x.translate(196, 96);
    x.rotate(6 * Math.PI / 180);
    x.globalAlpha = .9;
    x.beginPath();
    x.moveTo(-26, 20); x.lineTo(26, 20); x.lineTo(20, 30); x.lineTo(-20, 30);
    x.closePath(); x.fill();
    x.beginPath(); x.arc(-16, 32, 4.5, 0, Math.PI * 2); x.fill();
    x.beginPath(); x.arc(16, 32, 4.5, 0, Math.PI * 2); x.fill();
    x.globalAlpha = .95;
    x.beginPath();
    x.moveTo(-14, 20);
    x.bezierCurveTo(-12, 8, -4, 4, 6, 6);
    x.lineTo(8, 20); x.closePath(); x.fill();
    x.globalAlpha = 1;
    x.beginPath(); x.arc(6, 0, 11, 0, Math.PI * 2); x.fill();
    x.lineWidth = 4.5;
    x.beginPath(); x.moveTo(4, 10); x.lineTo(22, 16); x.stroke();
    x.restore();

    // 속도선
    x.globalAlpha = .5;
    x.lineWidth = 3;
    [[104,78,146,80],[86,94,136,96],[112,110,150,112]].forEach(l => {
      x.beginPath(); x.moveTo(l[0], l[1]); x.lineTo(l[2], l[3]); x.stroke();
    });

    // 나무 (둥근 수형)
    x.globalAlpha = .45;
    x.beginPath(); x.arc(346, 152, 19, 0, Math.PI * 2); x.fill();
    x.beginPath(); x.arc(52, 160, 16, 0, Math.PI * 2); x.fill();
    x.lineWidth = 4;
    x.beginPath(); x.moveTo(346, 168); x.lineTo(346, 184); x.stroke();
    x.beginPath(); x.moveTo(52, 174); x.lineTo(52, 188); x.stroke();
  }

  x.restore();
}

/* ==========================================================================
   저장 · 공유
   ========================================================================== */

async function save() {
  const status = document.querySelector('#status');
  try {
    const blob = await card();
    if (!blob) throw new Error('no blob');

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `요셉MT_TEAM-${result}_${person}.png`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 60000);

    status.textContent = RESULT.saved;
  } catch (e) {
    status.textContent = RESULT.saveFail;
  }
}

async function share() {
  const status = document.querySelector('#status');
  try {
    const blob = await card();
    const file = new File([blob], 'joseph-mt.png', { type: 'image/png' });

    if (navigator.canShare({ files: [file] })) {
      await navigator.share({ files: [file], title: '오늘의 요셉 리더 모드' });
    } else {
      status.textContent = RESULT.shareFail;
    }
  } catch (e) {
    if (e.name !== 'AbortError') status.textContent = RESULT.shareFail;
  }
}

/* ==========================================================================
   시작
   ========================================================================== */

// 헤더·푸터 문구도 content.js 에서 가져옵니다
document.querySelector('#brand').textContent = SITE.brand;
document.querySelector('#edition').textContent = SITE.edition;
document.querySelector('#footer').textContent = SITE.footer;
document.title = SITE.eyebrow.replace(/<[^>]+>/g, '');

screenStart();
