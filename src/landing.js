// Server-rendered explainer page for the Hermes Eigen control plane.
// No external dependencies — inline CSS, values injected from live config.

function esc(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function shorten(addr) {
  const a = String(addr);
  return a.length > 12 ? `${a.slice(0, 6)}…${a.slice(-4)}` : a;
}

export function renderLanding({ config, domain, commandCount, appId, verifyUrl, repoUrl, demoEnabled }) {
  const scopes = config.allowedScopes.map((s) => `<code>${esc(s)}</code>`).join(' ');
  const owners = config.ownerAddresses.length
    ? config.ownerAddresses
        .map((o) => `<code title="${esc(o)}">${esc(shorten(o))}</code>`)
        .join(' ')
    : '<span class="muted">none configured</span>';

  const verifyRow = appId
    ? `<tr><th>App ID</th><td><code>${esc(appId)}</code></td></tr>
       <tr><th>Verification</th><td><a href="${esc(verifyUrl)}">verify.eigencloud.xyz ↗</a></td></tr>`
    : '';

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Hermes Eigen Control Plane</title>
<meta name="description" content="Wallet-controlled command plane for an autonomous agent running inside an EigenCompute TEE.">
<style>
  :root {
    --bg: #0b0e14; --panel: #131822; --line: #222b3a; --ink: #e6edf3;
    --muted: #8b98a9; --accent: #6ee7b7; --accent2: #7dd3fc; --warn: #fbbf24;
    --mono: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace;
  }
  * { box-sizing: border-box; }
  body {
    margin: 0; background: var(--bg); color: var(--ink);
    font: 15px/1.6 -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    -webkit-font-smoothing: antialiased;
  }
  .wrap { max-width: 760px; margin: 0 auto; padding: 56px 24px 80px; }
  header { border-bottom: 1px solid var(--line); padding-bottom: 28px; margin-bottom: 32px; }
  .badge {
    display: inline-flex; align-items: center; gap: 7px; font-family: var(--mono);
    font-size: 12px; color: var(--accent); background: rgba(110,231,183,.08);
    border: 1px solid rgba(110,231,183,.25); border-radius: 999px; padding: 4px 11px;
    margin-bottom: 18px;
  }
  .dot { width: 7px; height: 7px; border-radius: 50%; background: var(--accent); box-shadow: 0 0 8px var(--accent); }
  h1 { font-size: 28px; margin: 0 0 8px; letter-spacing: -.01em; }
  .lede { color: var(--muted); font-size: 16px; margin: 0; max-width: 60ch; }
  h2 { font-size: 13px; text-transform: uppercase; letter-spacing: .08em; color: var(--muted); margin: 38px 0 14px; }
  .flow {
    font-family: var(--mono); font-size: 12.5px; color: var(--accent2);
    background: var(--panel); border: 1px solid var(--line); border-radius: 10px;
    padding: 16px 18px; overflow-x: auto; white-space: pre; margin: 0;
  }
  table { width: 100%; border-collapse: collapse; background: var(--panel); border: 1px solid var(--line); border-radius: 10px; overflow: hidden; }
  th, td { text-align: left; padding: 11px 16px; border-bottom: 1px solid var(--line); vertical-align: top; }
  tr:last-child th, tr:last-child td { border-bottom: 0; }
  th { color: var(--muted); font-weight: 500; width: 38%; white-space: nowrap; }
  code { font-family: var(--mono); font-size: 13px; color: var(--ink); background: rgba(125,211,252,.10); padding: 1.5px 6px; border-radius: 5px; }
  .ep { display: grid; grid-template-columns: 58px 1fr; gap: 4px 14px; font-family: var(--mono); font-size: 13px; }
  .ep .m { color: var(--accent); }
  .ep .m.post { color: var(--warn); }
  .ep .d { color: var(--muted); font-family: -apple-system, sans-serif; font-size: 13px; }
  .two { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  .card { background: var(--panel); border: 1px solid var(--line); border-radius: 10px; padding: 16px 18px; }
  .card h3 { margin: 0 0 6px; font-size: 14px; }
  .card p { margin: 0; color: var(--muted); font-size: 13px; }
  .muted { color: var(--muted); }
  a { color: var(--accent2); text-decoration: none; }
  a:hover { text-decoration: underline; }
  footer { margin-top: 44px; padding-top: 22px; border-top: 1px solid var(--line); color: var(--muted); font-size: 13px; display: flex; gap: 18px; flex-wrap: wrap; }
  .note { font-size: 13px; color: var(--muted); margin-top: 10px; }
  .demo { background: var(--panel); border: 1px solid var(--line); border-radius: 10px; padding: 18px; }
  .demo-row { display: flex; gap: 10px; flex-wrap: wrap; align-items: center; }
  .demo input {
    flex: 1; min-width: 220px; background: var(--bg); border: 1px solid var(--line); color: var(--ink);
    font: 13px/1.5 var(--mono); padding: 9px 12px; border-radius: 8px;
  }
  .demo input:focus { outline: none; border-color: var(--accent2); }
  .btn {
    background: var(--accent); color: #04140d; border: 0; font-weight: 600; font-size: 13px;
    padding: 9px 16px; border-radius: 8px; cursor: pointer; font-family: inherit; white-space: nowrap;
  }
  .btn:hover { filter: brightness(1.08); }
  .btn:disabled { opacity: .5; cursor: default; }
  .steps { display: grid; gap: 8px; margin-top: 14px; }
  .step { display: grid; grid-template-columns: 22px 1fr; gap: 10px; align-items: start; font-size: 13px; }
  .step .ix {
    width: 22px; height: 22px; border-radius: 50%; background: var(--bg); border: 1px solid var(--line);
    display: flex; align-items: center; justify-content: center; font-family: var(--mono); font-size: 11px; color: var(--muted);
  }
  .step.ok .ix { border-color: var(--accent); color: var(--accent); }
  .step.bad .ix { border-color: var(--warn); color: var(--warn); }
  .step.run .ix { border-color: var(--accent2); color: var(--accent2); }
  .step .lbl { color: var(--ink); }
  .step .sub { color: var(--muted); }
  .step pre {
    margin: 6px 0 0; background: var(--bg); border: 1px solid var(--line); border-radius: 7px;
    padding: 9px 11px; overflow-x: auto; font-family: var(--mono); font-size: 11.5px; color: var(--accent2); white-space: pre-wrap; word-break: break-word;
  }
  @media (max-width: 560px) { .two { grid-template-columns: 1fr; } .ep { grid-template-columns: 52px 1fr; } th { width: 44%; } }
</style>
</head>
<body>
<div class="wrap">
  <header>
    <span class="badge"><span class="dot"></span> running · runner: ${esc(config.runnerMode)}</span>
    <h1>Hermes Eigen Control Plane</h1>
    <p class="lede">A wallet-controlled command plane for an autonomous agent running inside an
    EigenCompute TEE. The owner wallet never enters the runtime — it authorizes commands with
    EIP-712 signatures, which the TEE verifies before the agent acts.</p>
  </header>

  <h2>How it works</h2>
  <pre class="flow">Owner wallet (human-held)
      │  signs EIP-712 AgentCommand
      ▼
POST /command  ──►  verify signature · check nonce · check scope · check deadline
      │
      ▼
Runner (${esc(config.runnerMode)})  ──►  audit record (command hashed, not stored in plaintext)</pre>
  <p class="note">Two wallets, separated by design: the <strong>owner wallet</strong> (human/governance, signs intent, never in the TEE)
  and the <strong>agent wallet</strong> (derived inside the TEE from its provisioned mnemonic, executes permitted actions).</p>

  ${demoEnabled ? `
  <h2>Try it live</h2>
  <div class="demo">
    <p class="note" style="margin-top:0">Runs against this deployment's real <code>POST /command</code> endpoint.
    For this demo, the well-known public test key signs on your behalf (safe — the runner is in <code>mock</code> mode,
    so an accepted command only echoes text and moves nothing).</p>
    <div class="demo-row">
      <input id="cmd" value="Summarize current agent status" maxlength="200" aria-label="Command text">
      <button class="btn" id="run">Sign &amp; submit →</button>
    </div>
    <div class="steps" id="steps"></div>
  </div>
  ` : ''}

  <h2>Live configuration</h2>
  <table>
    <tr><th>Agent ID</th><td><code>${esc(config.agentId)}</code></td></tr>
    <tr><th>Runner mode</th><td><code>${esc(config.runnerMode)}</code> ${config.runnerMode === 'mock' ? '<span class="muted">— deterministic echo, no real execution</span>' : ''}</td></tr>
    <tr><th>Allowed scopes</th><td>${scopes}</td></tr>
    <tr><th>Authorized owners</th><td>${owners}</td></tr>
    <tr><th>EIP-712 domain</th><td><code>${esc(domain.name)}</code> v${esc(domain.version)} · chainId <code>${esc(domain.chainId)}</code></td></tr>
    <tr><th>Commands processed</th><td><code>${esc(commandCount)}</code></td></tr>
    ${verifyRow}
  </table>

  <h2>API</h2>
  <div class="ep">
    <span class="m">GET</span><span><code>/health</code></span>
    <span></span><span class="d">Liveness check.</span>
    <span class="m">GET</span><span><code>/status</code></span>
    <span></span><span class="d">Full controller config + recent command audit records.</span>
    <span class="m">GET</span><span><code>/challenge</code></span>
    <span></span><span class="d">Fresh nonce + EIP-712 signing template. Add <code>?scope=</code>.</span>
    <span class="m post">POST</span><span><code>/command</code></span>
    <span></span><span class="d">Submit a signed AgentCommand. Rejects bad signatures, replays, and disabled scopes.</span>
    <span class="m">GET</span><span><code>/attestation</code></span>
    <span></span><span class="d">TEE attestation surface (placeholder in this prototype).</span>
  </div>

  <h2>Security posture</h2>
  <div class="two">
    <div class="card"><h3>Signature-gated</h3><p>Every command requires a valid EIP-712 signature from a configured owner. Unsigned or wrong-signer requests are rejected.</p></div>
    <div class="card"><h3>Replay-protected</h3><p>Per-owner nonces and a command deadline prevent replaying or delaying a signed intent.</p></div>
    <div class="card"><h3>Key never in TEE</h3><p>The owner's private key stays with the human. The runtime only ever sees signatures.</p></div>
    <div class="card"><h3>Verifiable build</h3><p>The image is built from pinned public source; its digest is recorded on-chain and checkable on the dashboard.</p></div>
  </div>

  <p class="note" style="margin-top:18px">⚠️ Prototype — <code>mock</code> runner does not execute real actions or move funds. Review the threat model before enabling wallet writes.</p>

  <footer>
    <span>Hermes Eigen Prototype</span>
    ${repoUrl ? `<a href="${esc(repoUrl)}">Source ↗</a>` : ''}
    ${appId ? `<a href="${esc(verifyUrl)}">Verify on EigenCloud ↗</a>` : ''}
  </footer>
</div>
${demoEnabled ? `<script>
(function () {
  var btn = document.getElementById('run');
  var steps = document.getElementById('steps');
  if (!btn) return;

  function row(cls, label, sub, body) {
    var d = document.createElement('div');
    d.className = 'step ' + cls;
    var ix = cls === 'ok' ? '✓' : cls === 'bad' ? '✕' : cls === 'run' ? '•' : '·';
    d.innerHTML = '<div class="ix">' + ix + '</div><div><div class="lbl"></div>'
      + '<div class="sub"></div></div>';
    d.querySelector('.lbl').textContent = label;
    d.querySelector('.sub').textContent = sub || '';
    if (body) {
      var pre = document.createElement('pre');
      pre.textContent = typeof body === 'string' ? body : JSON.stringify(body, null, 2);
      d.querySelector('div:last-child').appendChild(pre);
    }
    steps.appendChild(d);
    return d;
  }

  async function postJson(path, payload) {
    var res = await fetch(path, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload || {})
    });
    var json = await res.json().catch(function () { return {}; });
    return { status: res.status, json: json };
  }

  btn.addEventListener('click', async function () {
    btn.disabled = true;
    steps.innerHTML = '';
    var command = (document.getElementById('cmd').value || '').trim() || 'Summarize current agent status';
    try {
      row('run', '1. Requesting EIP-712 signature', 'Signed server-side with the public test key…');
      var signed = await postJson('/demo/sign', { command: command });
      if (signed.status !== 200) throw new Error('sign failed: ' + JSON.stringify(signed.json));
      steps.lastChild.className = 'step ok';
      steps.lastChild.querySelector('.sub').textContent = 'owner ' + signed.json.owner + ' · nonce ' + signed.json.nonce;

      row('run', '2. Submitting to POST /command', 'The TEE verifies the signature, scope, deadline, and nonce…');
      var accepted = await postJson('/command', signed.json);
      var okStep = steps.lastChild;
      okStep.className = accepted.status === 200 ? 'step ok' : 'step bad';
      okStep.querySelector('.sub').textContent = 'HTTP ' + accepted.status
        + (accepted.json.result ? ' · ' + accepted.json.result.status : '');
      okStep.querySelector('div:last-child').appendChild(Object.assign(document.createElement('pre'), {
        textContent: JSON.stringify(accepted.json.result || accepted.json, null, 2)
      }));

      row('run', '3. Replaying the same signed command', 'Re-submitting the identical payload…');
      var replay = await postJson('/command', signed.json);
      var rStep = steps.lastChild;
      rStep.className = replay.status === 409 ? 'step ok' : 'step bad';
      rStep.querySelector('.sub').textContent = 'HTTP ' + replay.status + ' — '
        + (replay.json.error || 'unexpected') + (replay.status === 409 ? ' (replay protection works ✓)' : '');
      rStep.querySelector('div:last-child').appendChild(Object.assign(document.createElement('pre'), {
        textContent: JSON.stringify(replay.json, null, 2)
      }));
    } catch (e) {
      row('bad', 'Error', String(e && e.message || e));
    } finally {
      btn.disabled = false;
    }
  });
})();
</script>` : ''}
</body>
</html>`;
}
