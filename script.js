// ── Domain data injected from index.html ──
const answers = {};
// ── Data moved from app.py ──
const DOMAINS = [
    {
        "id": "risk_identification", "title": "Risk Identification", "icon": "🔍", "color": "#3B82F6",
        "description": "Identify cyber risks in your OT environment before they cause disruptions.",
        "questions": [
            { "id": "q1_1", "text": "Has your organisation conducted an OT/ICS asset inventory in the last 12 months?", "context": "An up-to-date asset inventory is the foundation of all OT risk management.", "recommendation": "Conduct a full OT asset inventory using free passive tools like Nmap." },
            { "id": "q1_2", "text": "Do you have documented network diagrams showing IT/OT boundaries?", "context": "Without visibility, you cannot defend what you cannot see.", "recommendation": "Create network diagrams using free tools like draw.io." },
            { "id": "q1_3", "text": "Are vendor access points reviewed regularly?", "context": "Third-party access is a primary attack vector.", "recommendation": "Maintain a vendor access register." },
            { "id": "q1_4", "text": "Do you perform periodic vulnerability scans on OT systems?", "context": "Unpatched systems are a major entry point.", "recommendation": "Use passive scanning tools." }
        ]
    },
    {
        "id": "supplier_security", "title": "Supplier Security", "icon": "🤝", "color": "#10B981",
        "description": "Define minimum security standards for all vendors and technology partners.",
        "questions": [
            { "id": "q2_1", "text": "Do suppliers sign a cybersecurity addendum?", "context": "Contractual obligations hold vendors accountable.", "recommendation": "Draft a Vendor Security Addendum." },
            { "id": "q2_2", "text": "Is MFA enforced for all remote access?", "context": "VPNs without MFA are easily breached.", "recommendation": "Implement MFA immediately." },
            { "id": "q2_3", "text": "Are patches applied within an SLA window?", "context": "Delays in patching lead to costly breaches.", "recommendation": "Enforce patch SLAs." },
            { "id": "q2_4", "text": "Do suppliers hold security certifications?", "context": "Certified suppliers have audited processes.", "recommendation": "Require ISO 27001 for Tier 1 suppliers." }
        ]
    },
    {
        "id": "monitoring_protection", "title": "Monitoring & Protection", "icon": "🛡️", "color": "#F59E0B",
        "description": "Continuously monitor systems and detect threats early.",
        "questions": [
            { "id": "q3_1", "text": "Is there 24/7 monitoring covering OT?", "context": "Early detection reduces damage.", "recommendation": "Engage an MDR service." },
            { "id": "q3_2", "text": "Are IT/OT networks segmented?", "context": "Segmentation prevents ransomware spread.", "recommendation": "Implement a DMZ." },
            { "id": "q3_3", "text": "Is annual cyber training provided?", "context": "Human error causes 80% of incidents.", "recommendation": "Deploy OT-specific training." },
            { "id": "q3_4", "text": "Are anomaly alerts configured?", "context": "Alert on unusual PLC commands.", "recommendation": "Configure baseline profiles." }
        ]
    },
    {
        "id": "incident_response", "title": "Incident Response", "icon": "🚨", "color": "#EF4444",
        "description": "Prepare to respond and recover quickly from attacks.",
        "questions": [
            { "id": "q4_1", "text": "Is there an OT-specific IR Plan?", "context": "Without a plan, response time multiplies.", "recommendation": "Develop an OT IRP." },
            { "id": "q4_2", "text": "Are offline backups maintained?", "context": "Offline backups are your recovery lifeline.", "recommendation": "Follow the 3-2-1 rule." },
            { "id": "q4_3", "text": "Is there an escalation tree?", "context": "Uncoordinated communication adds risk.", "recommendation": "Create a communication matrix." },
            { "id": "q4_4", "text": "Are tabletop exercises conducted?", "context": "Tests build muscle memory.", "recommendation": "Run an annual simulation." }
        ]
    }
];

const ATTACK_CASES = [
    { "title": "Colonial Pipeline", "year": 2021, "country": "USA", "domain": "Remote Access", "summary": "Ransomware via VPN with no MFA.", "cost": "$4.4M", "lesson": "MFA is mandatory.", "severity": "critical" },
    { "title": "SolarWinds", "year": 2020, "country": "Global", "domain": "Supply Chain", "summary": "Code embedded in software updates.", "cost": "Billions", "lesson": "Verify supply chain integrity.", "severity": "critical" },
    { "title": "NotPetya", "year": 2017, "country": "Global", "domain": "Patching", "summary": "Wiper exploiting unpatched systems.", "cost": "$10B+", "lesson": "Enforce patch SLAs.", "severity": "critical" },
    { "title": "Stuxnet", "year": 2010, "country": "Iran", "domain": "PLC Targeting", "summary": "Cyberweapon targeting nuclear PLCs.", "cost": "Physical damage", "lesson": "ICS needs dedicated protection.", "severity": "critical" },
    { "title": "Oldsmar Water", "year": 2021, "country": "USA", "domain": "Monitoring", "summary": "Remote poisoning attempt.", "cost": "Public safety risk", "lesson": "Monitor remote access.", "severity": "high" },
    { "title": "SA Power Grid", "year": 2023, "country": "SA", "domain": "Infrastructure", "summary": "Ageing SCADA high-risk profile.", "cost": "Economic exposure", "lesson": "Affordable resilience is key.", "severity": "high" }
];

window.onload = () => {
    renderPillars();
    renderAttacks();
    initAssessment();
    updateHistory();
};

function renderPillars() {
    const grid = document.getElementById('pillarsGrid');
    if (!grid) return;
    grid.innerHTML = DOMAINS.map((d, i) => `
        <div class="pillar-card">
            <div class="pillar-icon">${d.icon}</div>
            <div class="pillar-num">Pillar ${i + 1}</div>
            <div class="pillar-name">${d.title}</div>
            <div class="pillar-desc">${d.description}</div>
            <div class="pillar-q">${d.questions.length} controls assessed</div>
        </div>
    `).join('');
}

function renderAttacks() {
    const grid = document.getElementById('casesGrid');
    if (!grid) return;
    grid.innerHTML = ATTACK_CASES.map(c => `
        <div class="case-card">
            <div class="case-top">
                <div><div class="case-title">${c.title}</div><div class="case-domain">${c.domain}</div></div>
                <div class="case-meta"><div class="case-sev sev-${c.severity}">${c.severity}</div><div class="case-year">${c.country} · ${c.year}</div></div>
            </div>
            <div class="case-body">
                <div class="case-summary">${c.summary}</div>
                <div class="case-lesson"><div class="case-lesson-label">Key Lesson</div><div class="case-lesson-text">${c.lesson}</div></div>
                <div class="case-cost">💸 ${c.cost}</div>
            </div>
        </div>
    `).join('');
}

function initAssessment() {
    const container = document.getElementById('domainBlocks');
    if (!container) return;

    DOMAINS.forEach((domain, di) => {
        const block = document.createElement('div');
        block.className = 'domain-block open';
        block.id = `domain-${domain.id}`;

        block.innerHTML = `
      <div class="domain-header" onclick="toggleDomain('${domain.id}')">
        <span class="domain-icon">${domain.icon}</span>
        <span class="domain-title">Pillar ${di + 1} — ${domain.title}</span>
        <span class="domain-progress-pill" id="pill-${domain.id}">0 / ${domain.questions.length}</span>
        <span class="domain-chevron">▶</span>
      </div>
      <div class="domain-body" id="body-${domain.id}">
        ${domain.questions.map((q, qi) => `
          <div class="question-item" id="qi-${q.id}">
            <div class="q-text">${qi + 1}. ${q.text}</div>
            <div class="q-context">${q.context}</div>
            <div class="q-answers">
              <button class="q-btn" onclick="setAnswer('${domain.id}','${q.id}','yes',this)">✓ Yes</button>
              <button class="q-btn" onclick="setAnswer('${domain.id}','${q.id}','partial',this)">◑ Partial</button>
              <button class="q-btn" onclick="setAnswer('${domain.id}','${q.id}','no',this)">✗ No</button>
            </div>
            <div class="q-rec" id="rec-${q.id}">${q.recommendation}</div>
          </div>
        `).join('')}
      </div>
    `;
        container.appendChild(block);
    });
}

function toggleDomain(id) {
    const block = document.getElementById(`domain-${id}`);
    block.classList.toggle('open');
}

function setAnswer(domainId, qId, value, btn) {
    answers[qId] = value;
    const qItem = document.getElementById(`qi-${qId}`);
    qItem.querySelectorAll('.q-btn').forEach(b => {
        b.classList.remove('sel-yes', 'sel-partial', 'sel-no');
    });
    btn.classList.add(`sel-${value}`);
    const rec = document.getElementById(`rec-${qId}`);
    rec.classList.toggle('visible', value === 'no' || value === 'partial');
    updateProgress();
}

function updateProgress() {
    const total = DOMAINS.reduce((s, d) => s + d.questions.length, 0);
    const done = Object.keys(answers).length;
    const countEl = document.getElementById('answeredCount');
    const barEl = document.getElementById('progressBar');

    if (countEl) countEl.textContent = done;
    if (barEl) barEl.style.width = `${(done / total) * 100}%`;

    DOMAINS.forEach(domain => {
        const count = domain.questions.filter(q => answers[q.id]).length;
        const pill = document.getElementById(`pill-${domain.id}`);
        if (pill) {
            pill.textContent = `${count} / ${domain.questions.length}`;
            if (count === domain.questions.length) {
                pill.classList.add('completed');
            }
        }
    });

    const btn = document.getElementById('submitBtn');
    const note = document.getElementById('submitNote');
    if (done === total) {
        btn.disabled = false;
        note.textContent = '✓ All questions answered — ready to submit';
        note.classList.add('ready');
    } else {
        btn.disabled = true;
        note.textContent = `${total - done} questions remaining`;
        note.classList.remove('ready');
    }
}

function calculateScore(ans) {
    let total_score = 0;
    let total_possible = DOMAINS.length * 8; // 4 q's * 2 pts
    const domain_results = DOMAINS.map(d => {
        let ds = 0, dp = 8;
        let gaps = [], partial = [];
        d.questions.forEach(q => {
            const val = ans[q.id] || 'no';
            if (val === 'yes') ds += 2;
            else if (val === 'partial') { ds += 1; partial.push({ question: q.text, recommendation: q.recommendation }); }
            else gaps.push({ question: q.text, recommendation: q.recommendation });
        });
        const pct = Math.round((ds / dp) * 100);
        total_score += ds;
        return { ...d, score: ds, percent: pct, maturity: getMaturity(pct), gaps, partial };
    });
    const overall = Math.round((total_score / total_possible) * 100);
    const recs = [];
    domain_results.forEach(dr => {
        dr.gaps.forEach(g => recs.push({ priority: 'high', domain: dr.title, ...g }));
        dr.partial.forEach(p => recs.push({ priority: 'medium', domain: dr.title, ...p }));
    });
    return {
        overall_percent: overall,
        overall_maturity: getMaturity(overall),
        domains: domain_results,
        top_recommendations: recs.slice(0, 8)
    };
}

function getMaturity(pct) {
    if (pct >= 85) return "Resilient";
    if (pct >= 65) return "Developing";
    if (pct >= 40) return "Vulnerable";
    return "Critical Risk";
}

function submitAssessment() {
    const orgNameInput = document.getElementById('orgName');
    const orgName = orgNameInput.value.trim();
    if (!orgName) { 
        orgNameInput.focus();
        orgNameInput.classList.add('error'); 
        return; 
    }
    orgNameInput.classList.remove('error');

    const btn = document.getElementById('submitBtn');
    const label = document.getElementById('submitLabel');
    const spinner = document.getElementById('submitSpinner');

    btn.disabled = true;
    label.textContent = 'Analysing...';
    spinner.classList.add('visible');

    setTimeout(() => {
        const scored = calculateScore(answers);
        const result = {
            org_name: orgName,
            sector: document.getElementById('sector').value,
            timestamp: new Date().toISOString().split('T')[0],
            ...scored
        };
        
        // Save to LocalStorage instead of API
        const history = JSON.parse(localStorage.getItem('ot_history') || '[]');
        history.push(result);
        localStorage.setItem('ot_history', JSON.stringify(history));

        renderResults(result);
        updateHistory();
        
        document.getElementById('results').scrollIntoView({ behavior: 'smooth' });
        
        btn.disabled = false;
        label.textContent = 'Submit & Get Results';
        spinner.classList.remove('visible');
    }, 1000);
}

function maturityClass(m) {
    const map = { 'Resilient': 'resilient', 'Developing': 'developing', 'Vulnerable': 'vulnerable', 'Critical Risk': 'critical' };
    return map[m] || 'critical';
}
function maturityColor(m) {
    const map = { 'Resilient': '#10B981', 'Developing': '#3B82F6', 'Vulnerable': '#F59E0B', 'Critical Risk': '#EF4444' };
    return map[m] || '#EF4444';
}

function renderResults(data) {
    const sec = document.getElementById('results');
    sec.classList.add('visible');
    const mc = maturityColor(data.overall_maturity);

    let domainMinis = data.domains.map(d => `
    <div class="result-domain-mini">
      <div class="rdm-title">${d.icon} ${d.title}</div>
      <div class="rdm-score" style="color:${maturityColor(d.maturity)}">${d.percent}%</div>
      <div class="rdm-bar"><div class="rdm-bar-fill" style="width:${d.percent}%;background:${maturityColor(d.maturity)}"></div></div>
    </div>
  `).join('');

    let domainBreakdowns = data.domains.map(d => {
        const gaps = d.gaps.map(g => `
      <div class="gap-item gap-high">
        <div class="gap-tag">Gap — High Priority</div>
        <div class="gap-q">${g.question}</div>
        <div class="gap-rec">${g.recommendation}</div>
      </div>`).join('');
        const partials = d.partial.map(g => `
      <div class="gap-item gap-medium">
        <div class="gap-tag">Partial — Improvement Needed</div>
        <div class="gap-q">${g.question}</div>
        <div class="gap-rec">${g.recommendation}</div>
      </div>`).join('');
        return `
      <div class="domain-result">
        <div class="dr-header" onclick="this.parentElement.classList.toggle('open')">
          <span class="dr-icon">${d.icon}</span>
          <span class="dr-title">${d.title}</span>
          <span class="dr-pct" style="color:${maturityColor(d.maturity)}">${d.percent}%</span>
          <span class="dr-mat mat-${maturityClass(d.maturity)}">${d.maturity}</span>
        </div>
        <div class="dr-body">${gaps}${partials}${(!d.gaps.length && !d.partial.length) ? '<div class="all-good">✓ All controls in place.</div>' : ''}</div>
      </div>`;
    }).join('');

    let recs = data.top_recommendations.map((r, i) => `
    <div class="rec-item">
      <div class="rec-num ${r.priority}">${i + 1}</div>
      <div>
        <div class="rec-domain ${r.priority}">${r.domain}</div>
        <div class="rec-text">${r.recommendation}</div>
      </div>
    </div>`).join('');

    document.getElementById('resultsContent').innerHTML = `
    <div class="result-hero">
      <div class="result-hero-top" style="background:linear-gradient(135deg,${mc}18,var(--bg2))">
        <div>
          <div class="result-score-big" style="color:${mc}">${data.overall_percent}%</div>
          <div class="result-maturity" style="color:${mc}">${data.overall_maturity}</div>
          <div class="result-org">${data.org_name} · ${data.sector} · ${data.timestamp}</div>
        </div>
      </div>
      <div class="result-hero-bottom">${domainMinis}</div>
    </div>
    <div class="sec-header"><span class="sec-num">Domain Breakdown</span></div>
    ${domainBreakdowns}
    <div class="sec-header"><span class="sec-num">Priority Recommendations</span></div>
    <div class="rec-list">${recs}</div>
  `;
}

function updateHistory() {
    const list = document.getElementById('historyList');
    if (!list) return;

    const history = JSON.parse(localStorage.getItem('ot_history') || '[]');
    if (history.length === 0) {
        list.innerHTML = '<div class="empty-history">No assessments yet. Complete your first assessment above.</div>';
        return;
    }

    list.innerHTML = history.slice().reverse().map(s => `
        <div class="hist-item">
            <div class="hist-score" style="color:${maturityColor(s.overall_maturity)}">${s.overall_percent}%</div>
            <div class="hist-info">
                <div class="hist-org">${s.org_name}</div>
                <div class="hist-meta">${s.sector} · ${s.timestamp}</div>
            </div>
            <div class="hist-mat mat-${maturityClass(s.overall_maturity)}">${s.overall_maturity}</div>
        </div>`).join('');
}