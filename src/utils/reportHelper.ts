import type { Lab } from '../data/labsData';

export const exportSimulationReport = (
  completedLabs: Lab[],
  allLabsCount: number,
  customPayloads: Record<string, string>,
  attackStatus: Record<string, boolean>
) => {
  const date = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const completionRate = Math.round((completedLabs.length / allLabsCount) * 100);

  let md = `# PROMPTFORGE — LLM Prompt Injection Security Report
Generated on: ${date}
Developer Credential: Gurram Jagan Bhasker
System Classification: OFF-SITE SANDBOX REPORT

---

## 1. Executive Summary

This security assessment details simulation runs performed in PromptForge, an LLM prompt injection cyber range. The lab simulates adversarial prompt payloads against both unprotected and aligned inference systems to examine vulnerabilities and validate countermeasures.

- **Completion Progress**: ${completedLabs.length} / ${allLabsCount} Labs Simulated (${completionRate}%)
- **System Defense Success**: 100% of injection vectors blocked in Protected Mode
- **Security Assessment Status**: IN PROGRESS

---

## 2. Lab Completion Ledger

| Lab ID | Lab Name | Difficulty | Severity | OWASP Mapping | Status | Exploit Succeeded |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
${labsListMarkdown(completedLabs, attackStatus)}

---

## 3. Vulnerability Deconstructs & Analysis

${vulnerabilitiesDetailMarkdown(completedLabs, customPayloads)}

---

## 4. General LLM Hardening Checklist

To prevent prompt injection, context hijacking, and data leaks in real LLM deployments, implement the following best practices:

- [ ] **Dual-Receiver Architectures**: Separate system prompts from user input channels at the API request level.
- [ ] **Data Packaging (Framing)**: Place user queries inside rigid container tags (such as XML tags &lt;user_input&gt;...&lt;/user_input&gt;) and instruct the LLM specifically to ignore command tokens inside those boundaries.
- [ ] **Content Security Policy (CSP)**: In chat interfaces rendering markdown, enforce strict domain locks to prevent markdown image tags (such as standard image links targeting external domains) from exfiltrating environment keys.
- [ ] **Input Classifier Scanners**: Apply light keyword/vector filters on inputs before calling LLM endpoints to detect phrases like 'ignore instructions', 'developer mode', or 'override'.
- [ ] **Privilege Separation (Excessive Agency Control)**: Never grant LLM systems direct, unmonitored write-access to shell terminals, transaction databases, or email engines. Enable manual validation (Human-in-the-loop) for high-impact actions.

---
*End of Report — Confidential and Educational Use Only.*
`;

  // Create a blob and trigger download
  const blob = new Blob([md], { type: 'text/markdown;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `promptforge_security_report_${new Date().getTime()}.md`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

function labsListMarkdown(
  completedLabs: Lab[],
  attackStatus: Record<string, boolean>
): string {
  if (completedLabs.length === 0) {
    return '| - | No labs completed yet | - | - | - | - | - |';
  }
  return completedLabs.map(lab => {
    const executed = attackStatus[lab.id] ? 'YES' : 'NO';
    return `| ${lab.id} | ${lab.name} | ${lab.difficulty} | ${lab.severity} | ${lab.owasp} | COMPLETED | ${executed} |`;
  }).join('\n');
}

function vulnerabilitiesDetailMarkdown(
  completedLabs: Lab[],
  customPayloads: Record<string, string>
): string {
  if (completedLabs.length === 0) {
    return '_No simulated events logged yet. Complete at least one lab workspace simulation to export logs._';
  }

  return completedLabs.map((lab, index) => {
    const payload = customPayloads[lab.id] || lab.defaultPayload;
    return `### ${index + 1}. Lab: ${lab.name}
- **Vulnerability Category**: ${lab.category}
- **OWASP Reference**: [${lab.owasp}]
- **Risk Severity Score**: ${lab.riskScore}/100 (${lab.severity})

#### A. Exploit Payload Utilized
\`\`\`text
${payload}
\`\`\`

#### B. Vulnerable System Response (Simulation)
\`\`\`text
${lab.vulnerableOutput}
\`\`\`

#### C. Protected System Response (Simulation)
\`\`\`text
${lab.protectedOutput}
\`\`\`

#### D. Hardening & Mitigation Action Plan
${lab.mitigation}

---
`;
  }).join('\n\n');
}
