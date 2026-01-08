// =====================
//  설정(여기만 바꿔도 됨)
// =====================
const CONFIG = {
  // 좌표를 아직 안 정했으면 아래 useGeoGate를 false로 두세요.
  // 좌표를 정하고 "그 근처에서만 시작"을 원하면 true로 바꾸고 targetLat/Lon 입력.
  useGeoGate: false,
  targetLat: 37.7260,
  targetLon: 126.7430,
  radiusM: 180,            // 권장 120~250m

  floodSeconds: 8,
  diagnoseAtSeconds: 9
};

// =====================
//  DOM
// =====================
const stage1 = document.getElementById("stage1");
const stage2 = document.getElementById("stage2");

const geoStatus = document.getElementById("geoStatus");
const startBtn = document.getElementById("startBtn");
const bypassBtn = document.getElementById("bypassBtn");

const cam = document.getElementById("cam");
const rainCanvas = document.getElementById("rain");
const water = document.getElementById("water");
const waterText = document.getElementById("waterText");
const timerEl = document.getElementById("timer");

const diagnosis = document.getElementById("diagnosis");
const retentionText = document.getElementById("retentionText");
const quizBtn = document.getElementById("quizBtn");
const closeDiagnosisBtn = document.getElementById("closeDiagnosisBtn");

const quiz = document.getElementById("quiz");
const quizForm = document.getElementById("quizForm");
const qTitle = document.getElementById("qTitle");
const optionsBox = document.getElementById("options");
const quizFeedback = document.getElementById("quizFeedback");
const closeQuizBtn = document.getElementById("closeQuizBtn");

const reward = document.getElementById("reward");
const rewardMsg = document.getElementById("rewardMsg");
const rewardOkBtn = document.getElementById("rewardOkBtn");

// =====================
//  복불복(랜덤) 데이터
// =====================
const RETENTION_VARIANTS = [
  "약 30만 톤",
  "약 28만 톤",
  "약 32만 톤",
  "약 25만 톤",
  "약 35만 톤"
];

const WATER_TEXT_VARIANTS = [
  "수위 상승… 산책로 침수 위험!",
  "배수 한계 접근… 하수관이 버티는 중!",
  "우수 유출 급증… 주변 저지대 주의!",
  "빗물이 빠르게 몰립니다… 위험!"
];

const REWARD_MESSAGES = [
  "잘했어요. 그린인프라는 빗물을 ‘빨리’ 보내는 게 아니라 ‘천천히’ 모으고 스며들게 하는 기술이에요.",
  "정답입니다. 땅이 숨쉴 틈(침투)이 있어야 비가 와도 덜 넘칩니다.",
  "훌륭해요. 빗물정원·투수블록·식생수로 같은 그린인프라가 홍수를 줄이는 데 도움 됩니다."
];

const QUESTION_BANK = [
  {
    q: "도시에서 비가 오면 물이 빨리 넘치는 가장 큰 이유는 무엇일까요?",
    options: [
      "비가 더러워서",
      "콘크리트·아스팔트가 많아 물이 스며들 틈이 적어서",
      "바람이 많이 불어서",
      "나무가 너무 많아서"
    ],
    correct: "콘크리트·아스팔트가 많아 물이 스며들 틈이 적어서",
    explainOk: "정답! 땅이 물을 흡수하지 못하면 빗물이 한꺼번에 몰려요.",
    explainBad: "아쉽지만 오답이에요. 핵심은 ‘스며들 틈’이 부족하다는 점입니다."
  },
  {
    q: "다음 중 ‘그린인프라(저영향개발)’에 가장 가까운 것은 무엇일까요?",
    options: [
      "빗물을 바로 하수관으로 보내는 큰 관",
      "빗물정원처럼 물을 잠깐 모아두고 스며들게 하는 공간",
      "비가 오면 켜지는 사이렌",
      "주차장을 더 단단하게 포장하기"
    ],
    correct: "빗물정원처럼 물을 잠깐 모아두고 스며들게 하는 공간",
    explainOk: "정답! 그린인프라는 현장에서 ‘저류·침투’로 부담을 줄입니다.",
    explainBad: "오답이에요. 그린인프라는 물을 모아두고 스며들게 하는 쪽에 가깝습니다."
  },
  {
    q: "그린인프라가 홍수 위험을 줄이는 방식으로 알맞은 것은 무엇일까요?",
    options: [
      "물을 더 빨리 흘려보낸다",
      "물을 천천히 모으고, 스며들게 하고, 저장해 하수관 부담을 줄인다",
      "비를 멈추게 한다",
      "강을 무조건 더 깊게 판다"
    ],
    correct: "물을 천천히 모으고, 스며들게 하고, 저장해 하수관 부담을 줄인다",
    explainOk: "정답! ‘천천히(지연) + 스며들게(침투) + 저장(저류)’가 핵심이에요.",
    explainBad: "오답이에요. ‘천천히 모으고 스며들게’ 하는 게 핵심입니다."
  },
  {
    q: "투수블록(물이 스며드는 블록)의 가장 큰 장점은 무엇일까요?",
    options: [
      "비가 오면 더 미끄럽다",
      "빗물이 땅으로 스며들 수 있어 물이 고이는 것을 줄인다",
      "물이 전혀 스며들지 않게 만든다",
      "비가 내릴 때만 색이 바뀐다"
    ],
    correct: "빗물이 땅으로 스며들 수 있어 물이 고이는 것을 줄인다",
    explainOk: "정답! 투수성 포장은 유출을 줄이고 고임을 완화합니다.",
    explainBad: "오답이에요. 핵심은 ‘스며듦(침투)’입니다."
  }
];

// =====================
//  유틸
// =====================
function pickOne(arr){
  return arr[Math.floor(Math.random() * arr.length)];
}
function shuffle(arr){
  const a = [...arr];
  for(let i=a.length-1;i>0;i--){
    const j = Math.floor(Math.random()*(i+1));
    [a[i],a[j]] = [a[j],a[i]];
  }
  return a;
}

function toRad(d){ return d * Math.PI / 180; }
function haversineMeters(lat1, lon1, lat2, lon2){
  const R = 6371000;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat/2)**2 +
            Math.cos(toRad(lat1))*Math.cos(toRad(lat2))*(Math.sin(dLon/2)**2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// =====================
//  STAGE 1: 위치 게이트(옵션)
// =====================
function enableStartButtonsAlways(){
  startBtn.disabled = false;
  startBtn.textContent = "스캐너 시작 (카메라/위치 허용)";
  geoStatus.textContent = "위치 게이트를 사용하지 않습니다. 시작 버튼을 눌러 진행하세요.";
}

function checkGeo(){
  if(!CONFIG.useGeoGate){
    enableStartButtonsAlways();
    return;
  }
  if (!("geolocation" in navigator)){
    geoStatus.textContent = "이 기기/브라우저는 위치 기능을 지원하지 않습니다. 플랜B로 진행하세요.";
    return;
  }

  geoStatus.textContent = "위치 권한을 허용해 주세요…";
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const {latitude, longitude, accuracy} = pos.coords;
      const d = haversineMeters(latitude, longitude, CONFIG.targetLat, CONFIG.targetLon);
      const ok = d <= CONFIG.radiusM;

      geoStatus.textContent =
        `현재 위치 정확도 ±${Math.round(accuracy)}m / 미션 지점까지 ${Math.round(d)}m`;

      startBtn.disabled = !ok;
      startBtn.textContent = ok
        ? "스캐너 시작 (카메라/위치 허용)"
        : "지정 장소에 가까이 가면 시작됩니다";
    },
    (err) => {
      geoStatus.textContent = `위치 수신 실패: ${err.message} (플랜B로 진행 가능)`;
    },
    { enableHighAccuracy:true, timeout:12000, maximumAge:0 }
  );
}

checkGeo();
setInterval(checkGeo, 10000);

// =====================
//  STAGE 2: 카메라 + 연출
// =====================
let rainRunning = false;

async function startCamera(){
  const stream = await navigator.mediaDevices.getUserMedia({
    video: { facingMode: "environment" },
    audio: false
  });
  cam.srcObject = stream;
  await cam.play();
}

function showStage2(){
  stage1.classList.remove("active");
  stage2.classList.add("active");
}

function startTimer(){
  const t0 = Date.now();
  const timer = setInterval(() => {
    const sec = Math.floor((Date.now()-t0)/1000);
    const mm = String(Math.floor(sec/60)).padStart(2,"0");
    const ss = String(sec%60).padStart(2,"0");
    timerEl.textContent = `${mm}:${ss}`;
  }, 250);
  setTimeout(() => clearInterval(timer), 60_000);
}

function startWaterRise(){
  waterText.textContent = pickOne(WATER_TEXT_VARIANTS);
  setTimeout(() => {
    water.style.transition = `height ${CONFIG.floodSeconds}s linear`;
    water.style.height = "55%";
  }, 400);
}

function openDiagnosis(){
  retentionText.textContent = pickOne(RETENTION_VARIANTS);
  diagnosis.classList.add("open");
}

function startRain(){
  const ctx = rainCanvas.getContext("2d");
  function resize(){
    const dpr = window.devicePixelRatio || 1;
    rainCanvas.width = Math.floor(window.innerWidth * dpr);
    rainCanvas.height = Math.floor(window.innerHeight * dpr);
    rainCanvas.style.width = window.innerWidth + "px";
    rainCanvas.style.height = window.innerHeight + "px";
    ctx.setTransform(dpr,0,0,dpr,0,0);
  }
  resize();
  window.addEventListener("resize", resize);

  const drops = [];
  const COUNT = 240; // 기기 느리면 160~200으로 줄이기
  for(let i=0;i<COUNT;i++){
    drops.push({
      x: Math.random()*window.innerWidth,
      y: Math.random()*window.innerHeight,
      len: 8 + Math.random()*16,
      spd: 12 + Math.random()*26,
      a: 0.22 + Math.random()*0.35
    });
  }

  rainRunning = true;
  (function loop(){
    if(!rainRunning) return;
    ctx.clearRect(0,0,window.innerWidth,window.innerHeight);
    ctx.lineWidth = 1.2;

    for(const d of drops){
      ctx.strokeStyle = `rgba(200,220,255,${d.a})`;
      ctx.beginPath();
      ctx.moveTo(d.x, d.y);
      ctx.lineTo(d.x + 1.2, d.y + d.len);
      ctx.stroke();

      d.y += d.spd;
      d.x += 1.4;

      if(d.y > window.innerHeight) { d.y = -d.len; d.x = Math.random()*window.innerWidth; }
      if(d.x > window.innerWidth) d.x = 0;
    }
    requestAnimationFrame(loop);
  })();
}

async function startSimulation(){
  try{
    await startCamera();
  }catch(e){
    alert("카메라 권한이 필요합니다. 브라우저 설정에서 카메라 허용 후 다시 시도해 주세요.");
    return;
  }

  showStage2();
  startRain();
  startTimer();
  startWaterRise();

  setTimeout(openDiagnosis, CONFIG.diagnoseAtSeconds * 1000);
}

startBtn.addEventListener("click", startSimulation);
bypassBtn.addEventListener("click", startSimulation);

// =====================
//  STAGE 3: 퀴즈(복불복 1문항)
// =====================
let currentQuestion = null;
let shuffledOptions = null;

function renderRandomQuestion(){
  currentQuestion = pickOne(QUESTION_BANK);

  // 보기 순서 랜덤
  shuffledOptions = shuffle(currentQuestion.options);

  qTitle.textContent = currentQuestion.q;
  optionsBox.innerHTML = "";
  quizFeedback.textContent = "";
  quizFeedback.className = "feedback";

  shuffledOptions.forEach((text, idx) => {
    const id = `opt_${idx}`;
    const label = document.createElement("label");
    label.className = "opt";
    label.setAttribute("for", id);

    const input = document.createElement("input");
    input.type = "radio";
    input.name = "q";
    input.value = text;
    input.id = id;

    const span = document.createElement("span");
    span.textContent = text;

    label.appendChild(input);
    label.appendChild(span);
    optionsBox.appendChild(label);
  });
}

quizBtn.addEventListener("click", () => {
  diagnosis.classList.remove("open");
  renderRandomQuestion();
  quiz.classList.add("open");
});

closeDiagnosisBtn.addEventListener("click", () => {
  diagnosis.classList.remove("open");
});

closeQuizBtn.addEventListener("click", () => {
  quiz.classList.remove("open");
});

quizForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const picked = quizForm.querySelector('input[name="q"]:checked');
  if(!picked){
    quizFeedback.textContent = "정답을 하나 선택해 주세요.";
    quizFeedback.className = "feedback bad";
    return;
  }

  const isCorrect = (picked.value === currentQuestion.correct);

  if(isCorrect){
    quizFeedback.textContent = currentQuestion.explainOk;
    quizFeedback.className = "feedback ok";

    setTimeout(() => {
      quiz.classList.remove("open");
      rewardMsg.textContent = pickOne(REWARD_MESSAGES);
      reward.classList.add("open");
    }, 450);
  }else{
    quizFeedback.textContent = currentQuestion.explainBad + " 다시 시도해 보세요.";
    quizFeedback.className = "feedback bad";
  }
});

rewardOkBtn.addEventListener("click", () => {
  reward.classList.remove("open");
});
