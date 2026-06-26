/**
 * ArthSaathi - Local Rule-Based Scam Detector
 * Analyzes messages for potential financial fraud using a deterministic keyword/pattern mapping engine.
 */

export interface ScamAnalysisResult {
  probability: number; // 0 - 100
  verdict: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  reasons: string[];
  action: string;
  redFlags: string[];
  tips: string[];
}

export function analyzeMessageForScam(text: string): ScamAnalysisResult {
  const input = text.trim().toLowerCase();
  
  if (!input) {
    return {
      probability: 0,
      verdict: 'LOW',
      reasons: ['No text provided for analysis.'],
      action: 'Enter suspicious message text to scan for scams.',
      redFlags: [],
      tips: ['Keep your private details safe.']
    };
  }

  const criticalRules = [
    { pattern: /\botp\b|one time password|one-time-password/i, reason: 'Requests a One-Time Password (OTP)', flag: 'OTP Request' },
    { pattern: /\bpassword\b|\bpasswords\b/i, reason: 'Requests your login password', flag: 'Password Request' },
    { pattern: /share.*pin|enter.*pin|\bupi pin\b|\bcard pin\b/i, reason: 'Requests sharing or entering your secret transaction PIN', flag: 'PIN Request' },
    { pattern: /remote access|anydesk|teamviewer|rustdesk|zoom|screen share/i, reason: 'Asks for screen-sharing or remote phone control software installation', flag: 'Remote Screen Share' },
  ];

  const highRules = [
    { pattern: /kyc update|verify.*kyc|kyc.*blocked|account.*suspended|account.*blocked|pan.*blocked|aadhaar.*blocked/i, reason: 'Claims KYC is expired/blocked (banks never suspend accounts via SMS links)', flag: 'Fake KYC Update' },
    { pattern: /click link|click here|bit\.ly|tinyurl|cutt\.ly|url|https?:\/\//i, reason: 'Contains a hyperlink directing you to an external website', flag: 'Suspicious Hyperlink' },
    { pattern: /won|winner|lucky draw|lottery|prize|gift card|congratulations/i, reason: 'Claims you won a lottery or lucky draw reward', flag: 'Lottery/Prize Claim' },
    { pattern: /double.*money|double.*investment|2x.*returns|100% guaranteed/i, reason: 'Promises to double your investment quickly (a classic Ponzi scheme sign)', flag: 'Guaranteed Double Money' },
    { pattern: /urgent|immediately|within.*hour|24 hour|deadline|now/i, reason: 'Uses high-urgency tactics to force panic-driven actions', flag: 'Urgency Pressure' },
  ];

  const mediumRules = [
    { pattern: /investment opportunity|earn from home|work.*home|earn.*daily|part-time job/i, reason: 'Promotes suspicious low-effort high-income job/investment schemes', flag: 'Get-Rich-Quick Offer' },
    { pattern: /guaranteed returns|no risk investment|risk free/i, reason: 'Uses statements promising risk-free high payouts', flag: 'Guaranteed Returns claims' },
    { pattern: /limited offer|last chance|only.*left/i, reason: 'Employs scarcity techniques to limit your thinking window', flag: 'Scarcity Tactic' },
  ];

  const matchedCritical = criticalRules.filter(r => r.pattern.test(input));
  const matchedHigh = highRules.filter(r => r.pattern.test(input));
  const matchedMedium = mediumRules.filter(r => r.pattern.test(input));

  const reasons: string[] = [];
  const redFlags: string[] = [];
  const tips: string[] = [
    'Never share your OTP, PIN, password, or card details with anyone.',
    'Verify any claims by calling your bank\'s official number printed behind your debit card.',
    'Do not click on links sent from personal mobile numbers claiming to represent brands/banks.'
  ];

  let verdict: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'LOW';
  let probability = 5;

  if (matchedCritical.length > 0) {
    verdict = 'CRITICAL';
    probability = Math.min(99, 90 + matchedCritical.length * 4 + matchedHigh.length * 2);
    matchedCritical.forEach(r => { reasons.push(r.reason); redFlags.push(r.flag); });
    matchedHigh.forEach(r => { reasons.push(r.reason); redFlags.push(r.flag); });
    matchedMedium.forEach(r => { reasons.push(r.reason); redFlags.push(r.flag); });
    tips.push('IMMEDIATELY terminate any phone call or chat with this sender.');
    tips.push('Legitimate banks or payment systems NEVER require sharing OTPs or screen-sharing for verification.');
  } else if (matchedHigh.length > 0) {
    verdict = 'HIGH';
    probability = Math.min(89, 65 + matchedHigh.length * 10 + matchedMedium.length * 3);
    matchedHigh.forEach(r => { reasons.push(r.reason); redFlags.push(r.flag); });
    matchedMedium.forEach(r => { reasons.push(r.reason); redFlags.push(r.flag); });
    tips.push('Do NOT click the links in this message or open files.');
    tips.push('Ignore sender requests if they urge you to take immediate cash action.');
  } else if (matchedMedium.length > 0) {
    verdict = 'MEDIUM';
    probability = Math.min(64, 30 + matchedMedium.length * 15);
    matchedMedium.forEach(r => { reasons.push(r.reason); redFlags.push(r.flag); });
    tips.push('Be cautious before transferring any money or providing name/PAN cards.');
  } else {
    // Check if it looks like a normal transaction SMS to provide extra intelligence
    const legitPatterns = [
      /avl bal|available balance/i,
      /debited|credited|transaction id/i,
      /your otp is \d{4,6}/i, // receiving an OTP without an agent asking is normal
    ];
    const isTransaction = legitPatterns.some(p => p.test(input));
    if (isTransaction) {
      reasons.push('Contains normal bank transaction/notification keywords.');
      tips.push('This looks like a standard automated transaction SMS. Ensure it matches your actual bank action.');
    } else {
      reasons.push('No obvious scam triggers or high-risk keywords detected.');
    }
  }

  let action = 'Looks safe to proceed, but stay alert.';
  if (verdict === 'CRITICAL') {
    action = '⚠️ BLOCK the sender immediately. Do NOT share details or allow phone access. Report on cybercrime.gov.in (Helpline: 1930).';
  } else if (verdict === 'HIGH') {
    action = '🛑 DANGER: Do NOT click any links, do not pay fees, and do not make quick decisions. Delete the message.';
  } else if (verdict === 'MEDIUM') {
    action = '🔶 WARNING: Verify caller or sender identity through official customer care channels first.';
  }

  return {
    probability,
    verdict,
    reasons,
    action,
    redFlags,
    tips
  };
}
