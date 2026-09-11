/* ==========================================================================
   illust.js — 팀별 일러스트 (SVG로 직접 그림, 이미지 파일 없음)
   ==========================================================================
   화면과 결과 카드(PNG) 양쪽에서 씁니다.
   색은 팀 색(--accent)을 그대로 물려받습니다.
   ※ 문구 수정은 content.js 에서 하시면 됩니다. 이 파일은 그림입니다.
   ========================================================================== */

/* 공통 viewBox: 400 x 200 */

const ILLUST = {

  /* ── 시작 화면 전용 · 중립 ──
     특정 팀을 연상시키지 않도록 산·길·구름만. 색은 보라를 따라갑니다. */
  START: `
    <svg class="illust" viewBox="0 0 400 200" role="img"
         aria-label="MT 떠나는 날 일러스트">
      <rect width="400" height="200" fill="var(--accent-soft)"/>

      <!-- 구름 -->
      <g fill="currentColor" opacity=".16">
        <ellipse cx="86"  cy="48" rx="30" ry="13"/>
        <ellipse cx="108" cy="44" rx="20" ry="11"/>
        <ellipse cx="300" cy="38" rx="26" ry="11"/>
        <ellipse cx="320" cy="42" rx="17" ry="9"/>
      </g>

      <!-- 먼 산 -->
      <path d="M0 150 L58 108 L104 138 L156 96 L212 140 L268 104 L322 142 L372 116 L400 138 L400 200 L0 200 Z"
            fill="currentColor" opacity=".16"/>
      <path d="M0 168 L52 140 L98 160 L152 130 L206 158 L262 132 L318 162 L368 140 L400 160 L400 200 L0 200 Z"
            fill="currentColor" opacity=".3"/>

      <!-- 길 -->
      <path d="M188 200 C 196 176, 214 168, 206 146 C 200 128, 216 120, 232 114"
            fill="none" stroke="var(--paper)" stroke-width="13"
            stroke-linecap="round" opacity=".9"/>
      <path d="M188 200 C 196 176, 214 168, 206 146 C 200 128, 216 120, 232 114"
            fill="none" stroke="currentColor" stroke-width="1.3"
            stroke-dasharray="5 8" stroke-linecap="round" opacity=".4"/>

      <!-- 해 -->
      <circle cx="342" cy="70" r="15" fill="currentColor" opacity=".28"/>
    </svg>`,

  /* ── A · 화담숲 : 겹친 침엽수 능선 + 모노레일 선 + 오솔길 ── */
  A: `
    <svg class="illust" viewBox="0 0 400 200" role="img"
         aria-label="화담숲 숲길과 모노레일 일러스트">
      <!-- 하늘 -->
      <rect width="400" height="200" fill="var(--accent-soft)"/>

      <!-- 먼 능선 -->
      <path d="M0 148 L46 112 L78 134 L116 96 L152 130 L196 100 L238 132 L286 104 L330 136 L368 114 L400 142 L400 200 L0 200 Z"
            fill="currentColor" opacity=".14"/>

      <!-- 중간 능선 -->
      <path d="M0 164 L38 138 L72 156 L112 128 L148 152 L188 132 L228 158 L272 136 L316 160 L356 142 L400 164 L400 200 L0 200 Z"
            fill="currentColor" opacity=".26"/>

      <!-- 앞줄 침엽수 -->
      <g fill="currentColor" opacity=".62">
        <path d="M64 178 L78 128 L92 178 Z"/>
        <path d="M68 158 L78 138 L88 158 Z"/>
        <path d="M300 178 L316 120 L332 178 Z"/>
        <path d="M304 154 L316 130 L328 154 Z"/>
      </g>
      <g fill="currentColor" opacity=".78">
        <path d="M112 180 L124 140 L136 180 Z"/>
        <path d="M262 180 L274 144 L286 180 Z"/>
      </g>
      <g stroke="currentColor" stroke-width="2.5" opacity=".78">
        <line x1="124" y1="180" x2="124" y2="188"/>
        <line x1="274" y1="180" x2="274" y2="188"/>
        <line x1="78" y1="178" x2="78" y2="186"/>
        <line x1="316" y1="178" x2="316" y2="186"/>
      </g>

      <!-- 모노레일 선로 -->
      <path d="M0 92 C 90 70, 180 104, 268 78 S 366 62, 400 74"
            fill="none" stroke="currentColor" stroke-width="1.6"
            stroke-dasharray="7 6" opacity=".5"/>
      <!-- 모노레일 차량 -->
      <g opacity=".9">
        <rect x="186" y="82" width="30" height="14" rx="5" fill="currentColor"/>
        <line x1="201" y1="82" x2="201" y2="74" stroke="currentColor" stroke-width="1.6"/>
      </g>

      <!-- 오솔길 -->
      <path d="M176 200 C 190 178, 210 172, 204 152 C 199 136, 214 128, 226 122"
            fill="none" stroke="var(--paper)" stroke-width="11"
            stroke-linecap="round" opacity=".85"/>
      <path d="M176 200 C 190 178, 210 172, 204 152 C 199 136, 214 128, 226 122"
            fill="none" stroke="currentColor" stroke-width="1.2"
            stroke-dasharray="4 7" stroke-linecap="round" opacity=".45"/>
    </svg>`,

  /* ── B · 연못 옆 카페 : 통창 + 연못 물결 + 커피잔 ── */
  B: `
    <svg class="illust" viewBox="0 0 400 200" role="img"
         aria-label="연못이 보이는 카페 창가 일러스트">
      <rect width="400" height="200" fill="var(--accent-soft)"/>

      <!-- 창 너머 : 나무 실루엣 -->
      <g fill="currentColor" opacity=".16">
        <circle cx="128" cy="74" r="26"/>
        <circle cx="158" cy="84" r="18"/>
        <circle cx="268" cy="70" r="22"/>
        <circle cx="292" cy="82" r="15"/>
      </g>

      <!-- 연못 -->
      <path d="M0 116 L400 116 L400 152 L0 152 Z" fill="currentColor" opacity=".2"/>
      <g stroke="currentColor" fill="none" stroke-linecap="round" opacity=".45">
        <path d="M40 126 q 12 -5 24 0 t 24 0"  stroke-width="1.4"/>
        <path d="M132 136 q 12 -5 24 0 t 24 0" stroke-width="1.4"/>
        <path d="M236 124 q 12 -5 24 0 t 24 0" stroke-width="1.4"/>
        <path d="M300 140 q 12 -5 24 0 t 24 0" stroke-width="1.4"/>
      </g>

      <!-- 창틀 -->
      <g stroke="currentColor" stroke-width="2.2" fill="none" opacity=".55">
        <rect x="30" y="26" width="340" height="126" rx="3"/>
        <line x1="200" y1="26" x2="200" y2="152"/>
      </g>

      <!-- 테이블 -->
      <rect x="0" y="152" width="400" height="6" fill="currentColor" opacity=".72"/>
      <rect x="0" y="158" width="400" height="42" fill="currentColor" opacity=".1"/>

      <!-- 커피잔 두 개 -->
      <g fill="currentColor">
        <path d="M140 158 h 34 v 14 a 17 17 0 0 1 -34 0 Z" opacity=".85"/>
        <path d="M174 160 a 9 9 0 0 1 0 14" fill="none" stroke="currentColor" stroke-width="2.4" opacity=".85"/>
        <ellipse cx="157" cy="182" rx="24" ry="3.4" opacity=".22"/>

        <path d="M226 158 h 28 v 12 a 14 14 0 0 1 -28 0 Z" opacity=".85"/>
        <path d="M254 160 a 8 8 0 0 1 0 12" fill="none" stroke="currentColor" stroke-width="2.2" opacity=".85"/>
        <ellipse cx="240" cy="179" rx="20" ry="3" opacity=".22"/>
      </g>

      <!-- 김 -->
      <g stroke="currentColor" fill="none" stroke-width="1.8" stroke-linecap="round" opacity=".42">
        <path d="M150 150 c -5 -8, 5 -12, 0 -20"/>
        <path d="M164 150 c -5 -8, 5 -12, 0 -20"/>
        <path d="M240 150 c -4 -7, 4 -10, 0 -17"/>
      </g>
    </svg>`,

  /* ── C · 곤지암 루지 : 곡선 트랙 + 헬멧 + 속도선 ── */
  C: `
    <svg class="illust" viewBox="0 0 400 200" role="img"
         aria-label="루지 트랙을 내려가는 일러스트">
      <rect width="400" height="200" fill="var(--accent-soft)"/>

      <!-- 배경 언덕 -->
      <path d="M0 96 C 80 56, 150 88, 220 62 S 340 46, 400 72 L400 200 L0 200 Z"
            fill="currentColor" opacity=".12"/>

      <!-- 트랙 바깥선 -->
      <path d="M-10 66 C 90 60, 120 116, 210 120 S 330 150, 410 128"
            fill="none" stroke="currentColor" stroke-width="26"
            stroke-linecap="round" opacity=".24"/>
      <!-- 트랙 노면 -->
      <path d="M-10 66 C 90 60, 120 116, 210 120 S 330 150, 410 128"
            fill="none" stroke="var(--paper)" stroke-width="18"
            stroke-linecap="round" opacity=".9"/>
      <!-- 중앙 차선 -->
      <path d="M-10 66 C 90 60, 120 116, 210 120 S 330 150, 410 128"
            fill="none" stroke="currentColor" stroke-width="1.6"
            stroke-dasharray="10 12" opacity=".45"/>

      <!-- 루지 카트 + 라이더 -->
      <g transform="translate(196 96) rotate(6)">
        <!-- 카트 -->
        <path d="M-26 20 h 52 l -6 10 h -40 Z" fill="currentColor" opacity=".9"/>
        <circle cx="-16" cy="32" r="4.5" fill="currentColor"/>
        <circle cx="16"  cy="32" r="4.5" fill="currentColor"/>
        <!-- 몸통 -->
        <path d="M-14 20 c 2 -12, 10 -16, 20 -14 l 2 14 Z" fill="currentColor" opacity=".95"/>
        <!-- 헬멧 -->
        <circle cx="6" cy="0" r="11" fill="currentColor"/>
        <path d="M-4 2 a 11 11 0 0 1 15 -9 l 1 5 Z" fill="var(--paper)" opacity=".55"/>
        <!-- 팔 -->
        <path d="M4 10 L 22 16" stroke="currentColor" stroke-width="4.5" stroke-linecap="round"/>
      </g>

      <!-- 속도선 -->
      <g stroke="currentColor" stroke-width="3" stroke-linecap="round" opacity=".5">
        <line x1="104" y1="78"  x2="146" y2="80"/>
        <line x1="86"  y1="94"  x2="136" y2="96"/>
        <line x1="112" y1="110" x2="150" y2="112"/>
      </g>

      <!-- 앞쪽 나무 두 그루 (둥근 수형) -->
      <g fill="currentColor" opacity=".45">
        <circle cx="346" cy="152" r="19"/>
        <circle cx="52"  cy="160" r="16"/>
      </g>
      <g stroke="currentColor" stroke-width="4" opacity=".45" stroke-linecap="round">
        <line x1="346" y1="168" x2="346" y2="184"/>
        <line x1="52"  y1="174" x2="52"  y2="188"/>
      </g>
    </svg>`,
};
