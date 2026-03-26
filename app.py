"""
OT Cyber Resilience Platform — Flask Backend
=============================================
DataGr8 | SANCS26 Challenge 5
Run: python app.py  →  open http://localhost:5000
"""

from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
import uuid, datetime

app = Flask(__name__)
app.secret_key = "datagr8-sancs26-ot-resilience-2026"
CORS(app)

# ─── In-memory store (swap for SQLite/Postgres in production) ───
RESULTS_STORE: dict = {}

# ─── Assessment data ───
DOMAINS = [
    {
        "id": "risk_identification",
        "title": "Risk Identification",
        "icon": "🔍",
        "color": "#3B82F6",
        "description": "Identify cyber risks in your OT environment before they cause disruptions.",
        "questions": [
            {
                "id": "q1_1",
                "text": "Has your organisation conducted an OT/ICS asset inventory in the last 12 months?",
                "context": "An up-to-date asset inventory is the foundation of all OT risk management.",
                "recommendation": "Conduct a full OT asset inventory using free passive tools like Nmap or OpenVAS. Document every PLC, HMI, SCADA server and IIoT sensor.",
            },
            {
                "id": "q1_2",
                "text": "Do you have documented network diagrams showing IT/OT boundaries and all data flows?",
                "context": "Without network visibility, you cannot defend what you cannot see.",
                "recommendation": "Create and maintain network diagrams using free tools like draw.io. Map all IT/OT boundaries and remote access points.",
            },
            {
                "id": "q1_3",
                "text": "Are all vendor and third-party access points to OT systems inventoried and reviewed regularly?",
                "context": "Third-party access is a primary attack vector (Colonial Pipeline, SolarWinds).",
                "recommendation": "Maintain a vendor access register. Review and revoke unnecessary access every quarter.",
            },
            {
                "id": "q1_4",
                "text": "Do you perform periodic vulnerability scans on OT/ICS systems using passive (non-disruptive) methods?",
                "context": "Unpatched systems are the most exploited entry point in OT environments.",
                "recommendation": "Use passive scanning tools that won't disrupt live OT systems. DataGr8 offers safe OT vulnerability management.",
            },
        ],
    },
    {
        "id": "supplier_security",
        "title": "Supplier Security",
        "icon": "🤝",
        "color": "#10B981",
        "description": "Define minimum security standards for all vendors and technology partners.",
        "questions": [
            {
                "id": "q2_1",
                "text": "Do suppliers and vendors sign a cybersecurity addendum with minimum security requirements?",
                "context": "Contractual security obligations hold vendors legally accountable.",
                "recommendation": "Draft a Vendor Security Addendum requiring MFA, patch management SLAs, and incident reporting obligations.",
            },
            {
                "id": "q2_2",
                "text": "Is multi-factor authentication (MFA) enforced for all remote access to OT systems?",
                "context": "Colonial Pipeline was breached via a single VPN password with no MFA.",
                "recommendation": "Implement MFA immediately. Free options: Google Authenticator or Microsoft Authenticator. No exceptions.",
            },
            {
                "id": "q2_3",
                "text": "Are software updates and patches applied to OT systems within an agreed SLA window?",
                "context": "NotPetya cost $1.2B+ globally because patching was delayed on a known vulnerability.",
                "recommendation": "Enforce patch SLAs: critical CVEs within 30 days, high within 60. Use compensating controls for legacy systems.",
            },
            {
                "id": "q2_4",
                "text": "Do your critical suppliers hold a recognised security certification (e.g., ISO 27001, SOC 2)?",
                "context": "Certified suppliers have proven, audited security processes and formal accountability.",
                "recommendation": "Require ISO 27001 or equivalent for Tier 1 suppliers. Perform annual security reviews for all others.",
            },
        ],
    },
    {
        "id": "monitoring_protection",
        "title": "Monitoring & Protection",
        "icon": "🛡️",
        "color": "#F59E0B",
        "description": "Continuously monitor systems and detect threats early before they escalate.",
        "questions": [
            {
                "id": "q3_1",
                "text": "Is there 24/7 monitoring (SIEM or Managed Detection & Response) covering your OT environment?",
                "context": "Most OT breaches go undetected for weeks. Early detection dramatically reduces damage.",
                "recommendation": "Engage DataGr8's MDR service for cost-effective 24/7 OT monitoring without an in-house SOC.",
            },
            {
                "id": "q3_2",
                "text": "Are your IT and OT networks physically or logically segmented with a DMZ or industrial firewall?",
                "context": "Colonial Pipeline's ransomware spread from IT to OT due to insufficient segmentation.",
                "recommendation": "Implement a DMZ between IT and OT. Open-source pfSense works well for budget-constrained environments.",
            },
            {
                "id": "q3_3",
                "text": "Do employees with OT access receive annual cybersecurity awareness training?",
                "context": "Human error causes over 80% of security incidents. Training is the cheapest, highest-impact control.",
                "recommendation": "Deploy quarterly OT-specific cyber awareness training. DataGr8 offers Africa-contextualised modules.",
            },
            {
                "id": "q3_4",
                "text": "Are anomaly detection alerts configured for unusual OT behaviour (unexpected commands, off-hours access)?",
                "context": "Stuxnet issued unusual PLC commands for months before anyone noticed — no alerts were configured.",
                "recommendation": "Configure baseline behaviour profiles for PLC/SCADA systems and alert on any deviations immediately.",
            },
        ],
    },
    {
        "id": "incident_response",
        "title": "Incident Response",
        "icon": "🚨",
        "color": "#EF4444",
        "description": "Prepare your organisation to respond effectively and recover quickly from attacks.",
        "questions": [
            {
                "id": "q4_1",
                "text": "Does your organisation have a documented, OT-specific Incident Response Plan (IRP)?",
                "context": "Without a plan, response time multiplies during a crisis — causing far greater damage.",
                "recommendation": "Develop an OT IRP using NIST SP 800-61 adapted for ICS. Test and review it bi-annually.",
            },
            {
                "id": "q4_2",
                "text": "Are regular offline backups of OT configurations and critical data maintained and tested?",
                "context": "Ransomware destroys online backups first. Offline, tested backups are your recovery lifeline.",
                "recommendation": "Apply the 3-2-1 rule: 3 copies, 2 media types, 1 offline/air-gapped. Test restoration every quarter.",
            },
            {
                "id": "q4_3",
                "text": "Is there a defined communication escalation tree for OT cyber incidents (internal and external)?",
                "context": "Uncoordinated communication during an incident leads to greater operational and legal exposure.",
                "recommendation": "Create a communication matrix: IT, OT, executive, legal, regulator, DataGr8 MDR, and CERT contacts.",
            },
            {
                "id": "q4_4",
                "text": "Have you conducted a tabletop exercise or OT cyberattack simulation in the past 12 months?",
                "context": "Controls you never test fail under pressure. Exercises build organisational resilience muscle memory.",
                "recommendation": "Run a 2-hour annual tabletop simulating ransomware on your SCADA. Include all key stakeholders.",
            },
        ],
    },
]

ATTACK_CASES = [
    {
        "title": "Colonial Pipeline",
        "year": 2021, "country": "USA",
        "domain": "Remote Access / Ransomware",
        "summary": "Ransomware entered via a single compromised VPN password with no MFA, forcing the shutdown of 5,500 miles of US fuel pipeline. Caused widespread fuel shortages across the East Coast.",
        "cost": "$4.4M ransom + massive operational losses",
        "lesson": "MFA on all remote access and strict access control reviews would have prevented this entirely.",
        "severity": "critical",
    },
    {
        "title": "SolarWinds Supply Chain",
        "year": 2020, "country": "Global",
        "domain": "Vendor / Supply Chain Risk",
        "summary": "Attackers embedded malicious code into a legitimate SolarWinds Orion software update. Over 18,000 organisations — including US government agencies — unknowingly installed the backdoor.",
        "cost": "Billions in global remediation",
        "lesson": "Vendor risk assessments and software supply chain integrity verification are non-negotiable.",
        "severity": "critical",
    },
    {
        "title": "NotPetya",
        "year": 2017, "country": "Global",
        "domain": "Patch Management / Lateral Movement",
        "summary": "A destructive wiper exploiting EternalBlue in unpatched Windows systems. Maersk lost $300M; Merck lost $870M. Spread from IT into OT networks within minutes across interconnected systems.",
        "cost": "$10B+ globally",
        "lesson": "Strict patch management SLAs and enforced IT/OT network segmentation prevent lateral spread.",
        "severity": "critical",
    },
    {
        "title": "Stuxnet",
        "year": 2010, "country": "Iran",
        "domain": "OT-Specific / PLC Targeting",
        "summary": "The world's first known cyberweapon targeting ICS. Infected Siemens PLCs and caused nuclear centrifuges to spin destructively while falsely reporting normal operation. Spread via USB drives.",
        "cost": "Major physical infrastructure damage",
        "lesson": "OT systems need dedicated protection. Standard IT security tools are insufficient for ICS environments.",
        "severity": "critical",
    },
    {
        "title": "Oldsmar Water Treatment",
        "year": 2021, "country": "USA",
        "domain": "Remote Access / No Monitoring",
        "summary": "An attacker accessed a water plant via unprotected TeamViewer and raised sodium hydroxide to 111x the safe limit. A vigilant operator spotted it on screen and reversed it — just in time.",
        "cost": "Near-catastrophic public safety event",
        "lesson": "Remote OT access must be controlled, logged, and monitored with real-time anomaly alerting.",
        "severity": "high",
    },
    {
        "title": "South African Power Grid",
        "year": 2023, "country": "South Africa",
        "domain": "African OT / Critical Infrastructure",
        "summary": "South Africa's power utility operates ageing SCADA systems under severe budget constraints and loadshedding pressure, with ongoing remote access requirements — a textbook high-risk African OT profile.",
        "cost": "Ongoing economic and operational exposure",
        "lesson": "African OT environments need affordable, practical resilience — not enterprise tools that go unimplemented.",
        "severity": "high",
    },
]


def _maturity(pct):
    if pct >= 85: return "Resilient"
    if pct >= 65: return "Developing"
    if pct >= 40: return "Vulnerable"
    return "Critical Risk"


def _score(answers):
    domain_results = []
    total_score = total_possible = 0
    for domain in DOMAINS:
        ds, dp = 0, len(domain["questions"]) * 2
        gaps, partial = [], []
        for q in domain["questions"]:
            ans = answers.get(q["id"], "no").lower()
            if ans == "yes":
                ds += 2
            elif ans == "partial":
                ds += 1
                partial.append({"question": q["text"], "recommendation": q["recommendation"]})
            else:
                gaps.append({"question": q["text"], "recommendation": q["recommendation"]})
        pct = round(ds / dp * 100)
        domain_results.append({
            "id": domain["id"], "title": domain["title"],
            "color": domain["color"], "icon": domain["icon"],
            "score": ds, "possible": dp, "percent": pct,
            "maturity": _maturity(pct), "gaps": gaps, "partial": partial,
        })
        total_score += ds
        total_possible += dp
    overall = round(total_score / total_possible * 100)
    all_recs = []
    for dr in domain_results:
        for g in dr["gaps"]:
            all_recs.append({"priority": "high", "domain": dr["title"], **g})
        for p in dr["partial"]:
            all_recs.append({"priority": "medium", "domain": dr["title"], **p})
            
    return {
        "total_score": total_score, "total_possible": total_possible,
        "overall_percent": overall, "overall_maturity": _maturity(overall),
        "domains": domain_results, "top_recommendations": all_recs[:8],
    }


# ─── Routes ───

@app.route("/")
def index():
    return render_template("index.html", domains=DOMAINS, attack_cases=ATTACK_CASES)


@app.route("/api/domains")
def api_domains():
    return jsonify({"domains": DOMAINS})


@app.route("/api/attack-cases")
def api_attack_cases():
    return jsonify({"cases": ATTACK_CASES})


@app.route("/api/assess", methods=["POST"])
def api_assess():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400
    org_name = data.get("org_name", "").strip()
    sector = data.get("sector", "General Industry")
    answers = data.get("answers", {})
    if not org_name:
        return jsonify({"error": "Organisation name is required"}), 400
    scored = _score(answers)
    sid = str(uuid.uuid4())[:8]
    result = {
        "session_id": sid, "org_name": org_name, "sector": sector,
        "timestamp": datetime.datetime.now().strftime("%Y-%m-%d %H:%M"),
        **scored,
    }
    RESULTS_STORE[sid] = result
    return jsonify(result)


@app.route("/api/results")
def api_results():
    sessions = [
        {"session_id": v["session_id"], "org_name": v["org_name"],
         "sector": v["sector"], "timestamp": v["timestamp"],
         "overall_percent": v["overall_percent"], "overall_maturity": v["overall_maturity"]}
        for v in RESULTS_STORE.values()
    ]
    return jsonify({"sessions": sessions})


@app.route("/api/stats")
def api_stats():
    if not RESULTS_STORE:
        return jsonify({"total_assessments": 0})
    percents = [v["overall_percent"] for v in RESULTS_STORE.values()]
    return jsonify({
        "total_assessments": len(RESULTS_STORE),
        "average_score": round(sum(percents) / len(percents)),
        "maturity_distribution": {
            m: sum(1 for p in percents if _maturity(p) == m)
            for m in ["Resilient", "Developing", "Vulnerable", "Critical Risk"]
        },
    })


if __name__ == "__main__":
    print("\n  ╔══════════════════════════════════════════╗")
    print("  ║  OT Resilience Platform — DataGr8        ║")
    print("  ║  SANCS26 Challenge 5                     ║")
    print("  ║  http://localhost:5000                   ║")
    print("  ╚══════════════════════════════════════════╝\n")
    app.run(debug=True, port=5000)
