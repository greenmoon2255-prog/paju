:root{
  --bg:#0b1020;
  --panel:rgba(0,0,0,.65);
  --text:#f5f7ff;
  --red:#ff3b30;
  --blue:#2f7dff;
}

*{box-sizing:border-box}
body{
  margin:0; overflow:hidden;
  background:var(--bg); color:var(--text);
  font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;
}

.stage{position:fixed; inset:0; display:none; align-items:center; justify-content:center}
.stage.active{display:flex}

.panel{
  width:min(560px,92vw);
  padding:18px 16px;
  border-radius:16px;
  background:var(--panel);
  backdrop-filter: blur(8px);
  border:1px solid rgba(255,255,255,.12);
}
.warning{border:1px solid rgba(255,59,48,.35)}
.warning-title{font-weight:900;letter-spacing:.08em;color:var(--red);font-size:18px}
.warning-msg{font-size:20px;font-weight:900;margin-top:6px}
.sub{opacity:.9;margin:10px 0 14px 0}

.blink-dot{
  width:10px;height:10px;border-radius:50%;
  background:var(--red);
  box-shadow:0 0 16px rgba(255,59,48,.9);
  animation:blink 1s infinite;
  margin-bottom:10px;
}
@keyframes blink{0%,50%{opacity:1}51%,100%{opacity:.15}}

.primary,.ghost{
  width:100%;
  border:0;
  border-radius:999px;
  padding:14px 16px;
  font-size:16px;
  margin-top:10px;
}
.primary{background:rgba(47,125,255,.95);color:#fff}
.primary:disabled{opacity:.45}
.ghost{background:rgba(255,255,255,.08);color:#fff}

.footer-hint{
  position:fixed;bottom:14px;left:0;right:0;
  text-align:center;font-size:13px;opacity:.75;
  padding:0 12px;
}

#cam{
  position:fixed;inset:0;
  width:100%;height:100%;
  object-fit:cover;
  background:#000;
}
#rain{position:fixed;inset:0;width:100%;height:100%;pointer-events:none}

#water{
  position:fixed;left:0;right:0;bottom:0;
  height:0%;
  background:linear-gradient(to top, rgba(47,125,255,.55), rgba(47,125,255,.15), rgba(47,125,255,0));
  backdrop-filter: blur(1px);
  pointer-events:none;
  transition:height 8s linear;
}
.water-text{
  position:absolute;left:16px;top:14px;
  font-weight:900;text-shadow:0 2px 10px rgba(0,0,0,.6);
}

.hud{
  position:fixed;top:12px;left:12px;
  background:rgba(0,0,0,.45);
  border:1px solid rgba(255,255,255,.12);
  border-radius:14px;
  padding:10px 12px;
  backdrop-filter: blur(8px);
}
.hud-title{font-weight:900}
.hud-sub{opacity:.85;margin-top:2px}

.modal{
  position:fixed;inset:0;
  display:none;align-items:center;justify-content:center;
  background:rgba(0,0,0,.45);
  backdrop-filter: blur(6px);
}
.modal.open{display:flex}

.modal-card{
  width:min(620px,92vw);
  border-radius:18px;
  padding:16px 16px 14px;
  background:rgba(15,18,30,.92);
  border:1px solid rgba(255,255,255,.12);
}
.modal-title{font-size:18px;font-weight:950;margin:6px 0 10px}
.modal-body{opacity:.95;line-height:1.55}

.row{display:flex;gap:10px;margin:8px 0}
.k{min-width:120px;opacity:.8}
.v{flex:1}

.shieldBig{
  font-size:44px;
  filter: drop-shadow(0 6px 18px rgba(47,125,255,.25));
}

.pill{
  display:inline-block;
  font-size:13px;
  opacity:.9;
  padding:6px 10px;
  border-radius:999px;
  background:rgba(255,255,255,.08);
  border:1px solid rgba(255,255,255,.10);
  margin:2px 0 10px;
}

.q-title{font-weight:900;margin-bottom:10px}

.opt{
  display:flex; gap:10px; align-items:flex-start;
  padding:10px 12px; border-radius:12px;
  background:rgba(255,255,255,.06);
  border:1px solid rgba(255,255,255,.10);
  margin:8px 0;
}
.opt input{margin-top:2px}

.feedback{
  margin-top:10px;
  min-height:22px;
  font-weight:900;
}
.feedback.ok{color:#7CFF9A}
.feedback.bad{color:#FF7C7C}

.reward-card{text-align:center}
.rewardShield{
  font-size:70px;
  margin:8px 0 6px;
  animation: pop 650ms ease-out both;
}
@keyframes pop{
  0%{transform:scale(.2); opacity:0}
  70%{transform:scale(1.18); opacity:1}
  100%{transform:scale(1); opacity:1}
}
