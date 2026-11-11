const configs = {
  password: {
    number:"MODEL 01 / DFA", title:"Password verification",
    description:"A password must satisfy the selected length and character-class requirements.",
    label:"Enter a password", placeholder:"e.g. Automata@2026",
    hint:"8–16 characters · uppercase · lowercase · digit · special character",
    alphabet:"Σ = uppercase, lowercase, digit, special character. Other characters are rejected.",
    acceptance:"Length is 8–16 and at least one uppercase, lowercase, digit and special character is present.",
    language:"L = { w ∈ Σ* | 8 ≤ |w| ≤ 16 and w contains U, L, D and S }",
    states:["q0","q1","q2","q3","q4","qF"],
    theoryTitle:"Password DFA",
    theory:"The automaton tracks four Boolean features (uppercase, lowercase, digit and special character) together with the input length. This is a finite state representation: there are finitely many combinations and length values from 0 through 17 (where 17 means overflow).",
    tests:[
      ["Abcdef1!","accept","All four character classes; 8 characters"],
      ["Hello123@","accept","Uppercase, lowercase, digit and special"],
      ["A1!bcdefg","accept","All required classes; 9 characters"],
      ["Strong#9a","accept","All required classes; 9 characters"],
      ["XyZ!4567a","accept","All required classes; 9 characters"],
      ["abcdef1!","reject","Missing uppercase letter"],
      ["ABCDEF1!","reject","Missing lowercase letter"],
      ["Abcdefgh!","reject","Missing digit"],
      ["Abcdefg1","reject","Missing special character"],
      ["Aa1!","reject","Below minimum length"]
    ]
  },
  email: {
    number:"MODEL 02 / DFA", title:"Email format validator",
    description:"Checks a deliberately defined email syntax: local part, @, domain and a final alphabetic suffix.",
    label:"Enter an email address", placeholder:"e.g. student@example.com",
    hint:"Example syntax: name@domain.com · no spaces",
    alphabet:"Σ = ASCII letters, digits, and permitted symbols . _ % + - @",
    acceptance:"Exactly one @; non-empty local part; valid domain labels; final suffix has at least two letters.",
    language:"Simplified email-shaped strings: local@domain.tld, subject to the syntax rules in README.",
    states:["q0","qL","q@","qD","q.","qT","qF"],
    theoryTitle:"Email syntax DFA",
    theory:"The DFA moves through local-part, separator, domain-label, dot and top-level-domain phases. It rejects illegal placement of dots/hyphens, spaces, repeated @ symbols and incomplete suffixes. This is a teaching subset of email syntax, not the complete email standard.",
    tests:[
      ["student@example.com","accept","Local part, domain and suffix present"],
      ["a.b+tag@sub.example.in","accept","Permitted local symbols and subdomain"],
      ["user_1@my-domain.org","accept","Underscore local part and hyphenated domain"],
      ["name99@college.edu","accept","Alphanumeric local part"],
      ["first-last@site.co","accept","Hyphen in local part; two-letter suffix"],
      ["@example.com","reject","Missing local part"],
      ["user@","reject","Missing domain and suffix"],
      ["userexample.com","reject","Missing @ separator"],
      ["user@@example.com","reject","More than one @"],
      ["user name@example.com","reject","Whitespace is not allowed"]
    ]
  },
  pin: {
    number:"MODEL 03 / DFA", title:"ATM PIN verification",
    description:"Accepts only numeric PIN strings containing exactly four or six digits.",
    label:"Enter an ATM PIN", placeholder:"Enter 4 or 6 digits",
    hint:"Digits only · exactly 4 or 6 characters",
    alphabet:"Σ = {0,1,2,3,4,5,6,7,8,9}",
    acceptance:"The input contains exactly 4 or exactly 6 digits.",
    language:"L = { w ∈ {0,…,9}* | |w| = 4 or |w| = 6 }",
    states:["q0","q1","q2","q3","q4*","q5","q6*","qDead"],
    theoryTitle:"ATM PIN DFA",
    theory:"The automaton counts digits up to six. q4 and q6 are accepting states. Any non-digit or a seventh digit moves to a dead state. The length is checked only; the model does not authenticate a PIN with a bank.",
    tests:[
      ["1234","accept","Exactly four digits"],
      ["0000","accept","Four digits; leading zeros allowed"],
      ["739152","accept","Exactly six digits"],
      ["111111","accept","Six digits"],
      ["9087","accept","Four digits"],
      ["123","reject","Only three digits"],
      ["12345","reject","Five digits"],
      ["1234567","reject","Seven digits"],
      ["12a4","reject","Contains a non-digit"],
      ["12 34","reject","Contains whitespace"]
    ]
  }
};

let current = "password";
const $ = id => document.getElementById(id);
const classify = c => /[A-Z]/.test(c) ? "U" : /[a-z]/.test(c) ? "L" : /[0-9]/.test(c) ? "D" : /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?`~]/.test(c) ? "S" : "X";

function runPassword(s) {
  let flags = {U:false,L:false,D:false,S:false}, trace=[];
  let state = "q0";
  trace.push({state,char:"start"});
  for (const c of s) {
    const cls=classify(c);
    if(cls!=="X") flags[cls]=true;
    state = "q(" + Object.values(flags).map(Boolean).map(v=>v?1:0).join("") + ")";
    trace.push({state,char:c});
  }
  const lengthOK=s.length>=8&&s.length<=16;
  const ok=lengthOK&&Object.values(flags).every(Boolean)&&![...s].some(c=>classify(c)==="X");
  return {ok,trace,reason:ok?"All password rules satisfied":passwordReason(s,flags)};
}
function passwordReason(s,f) {
  const missing=Object.keys(f).filter(k=>!f[k]).map(k=>({U:"uppercase",L:"lowercase",D:"digit",S:"special character"}[k]));
  if(s.length<8)return "Too short: minimum length is 8.";
  if(s.length>16)return "Too long: maximum length is 16.";
  if([...s].some(c=>classify(c)==="X"))return "Contains a character outside the defined alphabet.";
  return "Missing: "+missing.join(", ")+".";
}
function runEmail(s) {
  let phase="LOCAL", trace=[{state:"q0",char:"start"}], local="", domain="", suffix="", at=0, valid=true, reason="";
  const allowedLocal=/^[A-Za-z0-9._%+-]$/;
  for(let i=0;i<s.length;i++){
    const c=s[i];
    if(c==="@"){
      at++;
      if(at>1||local.length===0||local.endsWith(".")){valid=false;reason="Invalid @ placement or multiple @ symbols.";}
      phase="DOMAIN";
    } else if(phase==="LOCAL"){
      if(!allowedLocal.test(c)|| (c==="."&&(local.length===0||local.endsWith(".")))){valid=false;reason="Invalid character or dot placement in local part.";}
      local+=c;
    } else {
      if(!/[A-Za-z0-9.-]/.test(c)){valid=false;reason="Invalid character in domain.";}
      domain+=c;
    }
    let st=phase==="LOCAL"?"qL":phase==="DOMAIN"?(domain.includes(".")?"q.":"qD"):"q?";
    trace.push({state:st,char:c});
  }
  const parts=domain.split(".");
  const tld=parts[parts.length-1]||"";
  const domainOK=parts.length>=2&&parts.every(p=>p.length>0&&!p.startsWith("-")&&!p.endsWith("-"))&&/^[A-Za-z]{2,}$/.test(tld);
  const ok=valid&&at===1&&local.length>0&&!local.endsWith(".")&&domainOK;
  if(!ok&&!reason)reason=at!==1?"Exactly one @ symbol is required.":!domainOK?"Domain labels and a 2+ letter suffix are required.":"Incomplete email address.";
  trace.push({state:ok?"qF":"qReject",char:"end"});
  return {ok,trace,reason:ok?"Email syntax accepted":reason};
}
function runPin(s) {
  let count=0,dead=false,trace=[{state:"q0",char:"start"}];
  for(const c of s){
    if(!/[0-9]/.test(c))dead=true;
    else if(count>=6)dead=true;
    else count++;
    trace.push({state:dead?"qDead":"q"+count,char:c});
  }
  const ok=!dead&&(count===4||count===6);
  trace.push({state:ok?"qAccept":"qReject",char:"end"});
  return {ok,trace,reason:ok?"Valid PIN length":dead?"Only digits are allowed and maximum length is 6.":"PIN must contain exactly 4 or 6 digits."};
}
function validate(key,s){return key==="password"?runPassword(s):key==="email"?runEmail(s):runPin(s);}
function selectTab(key){
  current=key;
  document.querySelectorAll(".tab").forEach(b=>{const on=b.dataset.tab===key;b.classList.toggle("active",on);b.setAttribute("aria-selected",String(on));});
  const c=configs[key];
  $("model-number").textContent=c.number;$("model-title").textContent=c.title;$("model-description").textContent=c.description;
  $("input-label").textContent=c.label;$("user-input").placeholder=c.placeholder;$("user-input").value="";$("input-hint").textContent=c.hint;
  $("user-input").type=key==="password"?"password":"text";$("toggle-visibility").style.display=key==="password"?"block":"none";
  $("alphabet").textContent=c.alphabet;$("acceptance").textContent=c.acceptance;$("language").textContent=c.language;
  $("result").className="result neutral";$("result").innerHTML='<span class="result-icon">◎</span><div><strong>Ready to validate</strong><small>Enter an input and run the automaton.</small></div>';
  $("trace").innerHTML='<p class="empty-trace">Your state transitions will appear here.</p>';$("trace-count").textContent="0 steps";
  renderState([]);
}
function renderState(trace){
  const states=configs[current].states;
  const active=trace.length?trace[trace.length-1].state:"";
  $("state-visual").innerHTML=states.map((s,i)=>`${i?'<span class="state-arrow">→</span>':''}<div class="state-node ${active===s?'active':''} ${s.endsWith("*")?'accept':''}">${s}</div>`).join("");
}
function execute(){
  const s=$("user-input").value;
  if(!s){$("result").className="result error";$("result").innerHTML='<span class="result-icon">!</span><div><strong>Input required</strong><small>Please enter a value first.</small></div>';return;}
  const r=validate(current,s);
  $("result").className="result "+(r.ok?"success":"error");
  $("result").innerHTML=`<span class="result-icon">${r.ok?"✓":"×"}</span><div><strong>${r.ok?"ACCEPTED":"REJECTED"}</strong><small>${escapeHtml(r.reason)}</small></div>`;
  $("trace").innerHTML=r.trace.map((t,i)=>`<div class="trace-row"><span class="step">${String(i).padStart(2,"0")}</span><span class="state">${escapeHtml(t.state)}</span><span class="char">${escapeHtml(t.char)}</span></div>`).join("");
  $("trace-count").textContent=(r.trace.length-1)+" transitions";
  renderState(r.trace);
}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function renderTheory(){
  $("theory-grid").innerHTML=Object.entries(configs).map(([k,c],i)=>`<article class="theory-card"><span class="number">0${i+1} / ${k.toUpperCase()}</span><h3>${c.theoryTitle}</h3><p>${c.theory}</p></article>`).join("");
}
function renderTests(key){
  const c=configs[key];$("test-summary").textContent=c.tests.length+" test cases";
  $("test-body").innerHTML=c.tests.map((t,i)=>`<tr class="test-row" data-value="${escapeHtml(t[0])}"><td>${escapeHtml(t[0])}</td><td><span class="status ${t[1]}">${t[1].toUpperCase()}</span></td><td>${escapeHtml(t[2])}</td><td><span class="status ${t[1]}">LOAD ↗</span></td></tr>`).join("");
  document.querySelectorAll(".test-row").forEach(row=>row.addEventListener("click",()=>{selectTab(key);$("user-input").value=row.dataset.value;$("user-input").focus();document.querySelector("#validators").scrollIntoView({behavior:"smooth"});}));
}
document.querySelectorAll(".tab").forEach(b=>b.addEventListener("click",()=>selectTab(b.dataset.tab)));
document.querySelectorAll(".filter").forEach(b=>b.addEventListener("click",()=>{document.querySelectorAll(".filter").forEach(x=>x.classList.toggle("active",x===b));renderTests(b.dataset.suite);}));
$("run-button").addEventListener("click",execute);
$("user-input").addEventListener("keydown",e=>{if(e.key==="Enter")execute();});
$("toggle-visibility").addEventListener("click",()=>{const input=$("user-input");input.type=input.type==="password"?"text":"password";$("toggle-visibility").textContent=input.type==="password"?"Show":"Hide";});
selectTab("password");renderTheory();renderTests("password");
