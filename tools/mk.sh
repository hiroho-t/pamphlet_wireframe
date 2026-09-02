# usage: mk <dir>/<id> [W] [H]  ; stdin = "<style extra>" + line "@@@" + "<body html>"
mk() {
  local out="$1" w="${2:-794}" h="${3:-1123}"
  local id="${out##*/}"
  local input style body
  input="$(cat)"
  style="${input%%$'\n'@@@*}"
  body="${input#*$'\n'@@@$'\n'}"
  local mark=""
  [ -n "$TRACE" ] && mark="<!-- traced: 実誌面から採寸して再現 -->"
  cat > "${out}.html" <<EOF
<!DOCTYPE html>
${mark}
<html lang="ja">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${id}</title>
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  html,body{height:100%;background:#e9e9e9;font-family:"Noto Sans JP","Hiragino Sans","Yu Gothic",sans-serif;-webkit-font-smoothing:antialiased}
  .stage{position:fixed;inset:0;overflow:hidden}
  .page{position:relative;width:${w}px;height:${h}px;background:#fff;overflow:hidden;left:50%;top:50%;transform:translate(-50%,-50%) scale(var(--s,1));transform-origin:center;box-shadow:0 4px 24px rgba(0,0,0,.18)}
  .ph{position:absolute;background:#dcdcdc;display:grid;place-items:center;font-size:12px;letter-spacing:.2em;color:#8c8c8c}
  .pn{position:absolute;font-size:11px;letter-spacing:.1em;color:#8c8c8c}
${style}
</style>
</head>
<body>
<div class="stage">
  <div class="page">
${body}
  </div>
</div>
<script>
  const fit=()=>document.documentElement.style.setProperty('--s',Math.min(innerWidth/${w},innerHeight/${h}));
  addEventListener('resize',fit);fit();
</script>
</body>
</html>
EOF
}
