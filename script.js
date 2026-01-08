// ====== 설정(여기만 바꾸면 됨) ======
const CONFIG = {
  // 운정호수 "미션 시작 지점" 좌표로 바꾸세요 (전망데크/제방 등)
  targetLat: 37.7260,
  targetLon: 126.7430,
  radiusM: 180,           // 위치 오차 대비 반경(권장 120~250m)
  retentionText: "약 30만 톤",

  // 연출 타이밍
  floodSeconds: 8,        // 물이 차오르는 시간(초)
  diagnoseAtSeconds: 9    // 진단 팝업 띄우는 시점(초)
};

// ====== DOM ======
const stage1 = document.getElementById("stage1");
const stage2 = document.getElementById("stage2");
const stage3 = document.getElementById("stage3");
const quiz = document.getElementById("quiz");

const geoStatus = document.getElementById("geoStatus");
const startBtn = document.getElementById("startBtn");
const bypassBtn = document.getElementById("bypassBtn");

const cam = document.getElementById("cam");
const rainCanvas = document.getElementById("rain");
const water = document.getElementById("water");
const timerEl = document.getElementById("timer");

document.getElementById("retentionText").textContent = CONFIG.retentionText;

const quizBtn = document.getElementById("quizBtn");
const closeBtn = document.getElementById("closeBtn");

// ====== 유틸: 거리 계산(하버사인) ======
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

// ====== 단계1: 위치 확인 ======
async function checkGeo(){
  if (!("geolocation" in navigator)){
    geoStatus.textContent = "이 기기/브라우저는 위치 기능을 지원하지 않아요. 플랜B로 진행하세요.";
    return;
  }

  geoStatus.textContent = "위치 권한을 허용해주세요…";
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const {latitude, longitude, accuracy} = pos.coords;
      const d = haversineMeters(latitude, longitude, CONFIG.targetLat, CONFIG.targetLon);
      const ok = d <= CONFIG.radiusM;

      geoStatus.textContent =
        `현재 위치 정확도 ±${Math.round(accuracy)}m / 미션 지점까지 ${Math.round(d)}m`;

      startBtn.disabled = !ok;
      if (!ok){
        startBtn.textContent = "지정 장소에 가까이 가면 시작됩니다";
      } else {
        startBtn.textContent = "스캐너 시작 (카메라/위치 허용)";
      }
    },
    (err) => {
      geoStatus.textContent = `위치 권한/수신 실패: ${err.message} (플랜B로 진행 가능)`;
    },
    { enableHighAccuracy:true, timeout:12000, maximumAge:0 }
  );
}

checkGeo();

// 10초마다 재확인(현장 이동 반영)
setInterval(checkGeo, 10000);

// ====== 단계2: 카메라 시작 + 연출 ======
async function startSimulation(){
  // 1) 카메라 권한
  try{
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "environment" },
      audio: false
    });
    cam.srcObject = stream;
    await cam.play();
  }catch(e){
    alert("카메라 권한이 필요합니다. 브라우저 설정에서 카메라 허용 후 다시 시도하세요.");
    return;
  }

  // 화면 전환
  stage1.classList.remove("active");
  stage2.classList.add("active");

  // 비 캔버스 시작
  startRain();

  // 물 차오르기 시작(transition)
  // 약간 딜레이를 주면 연출이 더 자연스러움
  setTimeout(() => {
    water.style.height = "55%";
  }, 400);

  // 타이머 표시
  const t0 = Date.now();
  const timer = setInterval(() => {
    const sec = Math.floor((Date.now()-t0)/1000);
    const mm = String(Math.floor(sec/60)).padStart(2,"0");
    const ss = String(sec%60).padStart(2,"0");
    timerEl.textContent = `${mm}:${ss}`;
  }, 250);

  // 단계3 진단 팝업
  setTimeout(() => {
    stage3.classList.add("open");
  }, CONFIG.diagnoseAtSeconds * 1000);

  // (옵션) 특정 시간이 지나면 타이머 멈춤
  setTimeout(() => clearInterval(timer), 60_000);
}

startBtn.addEventListener("click", startSimulation);
bypassBtn.addEventListener("click", startSimulation);

// ====== 단계3 버튼들 ======
quizBtn.addEventListener("click", () => {
  stage3.classList.remove("open");
  quiz.classList.add("open");
});

closeBtn.addEventListener("click", () => {
  stage3.classList.remove("open");
});

// ====== 비(파티클) 효과: 가벼운 캔버스 ======
let rainRunning = false;
function startRain(){
  const ctx = rainCanvas.getContext("2d");
  resizeCanvas();

  const drops = [];
  const COUNT = 260; // 태블릿 성능에 따라 160~320 조정

  for(let i=0;i<COUNT;i++){
    drops.push({
      x: Math.random()*rainCanvas.width,
      y: Math.random()*rainCanvas.height,
      len: 8 + Math.random()*14,
      spd: 12 + Math.random()*22,
      a: 0.25 + Math.random()*0.35
    });
  }

  rainRunning = true;
  function loop(){
    if(!rainRunning) return;

    ctx.clearRect(0,0,rainCanvas.width,rainCanvas.height);
    ctx.lineWidth = 1.2;

    for(const d of drops){
      ctx.strokeStyle = `rgba(200,220,255,${d.a})`;
      ctx.beginPath();
      ctx.moveTo(d.x, d.y);
      ctx.lineTo(d.x, d.y + d.len);
      ctx.stroke();

      d.y += d.spd;
      d.x += 1.2; // 바람 느낌
      if(d.y > rainCanvas.height) {
        d.y = -d.len;
        d.x = Math.random()*rainCanvas.width;
      }
      if(d.x > rainCanvas.width) d.x = 0;
    }

    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);

  window.addEventListener("resize", resizeCanvas);
  function resizeCanvas(){
    rainCanvas.width = window.innerWidth * devicePixelRatio;
    rainCanvas.height = window.innerHeight * devicePixelRatio;
    rainCanvas.style.width = window.innerWidth + "px";
    rainCanvas.style.height = window.innerHeight + "px";
    ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);
  }
}
