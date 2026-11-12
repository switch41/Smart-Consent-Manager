const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

// ─── DuckDuckGo Tracker Radar Dataset (curated subset) ────────────────────────
// Based on https://github.com/nicnacs/nicnacs.github.io/blob/b7c5ef4/content/post/privacy-toolkit.md
// and DuckDuckGo Tracker Radar open-source data
const DDG_TRACKER_RADAR: Record<string, { owner: string; prevalence: number; category: string; fingerprinting: number }> = {
  // High-prevalence trackers from DDG Tracker Radar
  'google-analytics.com': { owner: 'Google', prevalence: 0.64, category: 'Analytics', fingerprinting: 1 },
  'googletagmanager.com': { owner: 'Google', prevalence: 0.56, category: 'Analytics', fingerprinting: 1 },
  'doubleclick.net': { owner: 'Google', prevalence: 0.52, category: 'Ad Motivated Tracking', fingerprinting: 2 },
  'googlesyndication.com': { owner: 'Google', prevalence: 0.28, category: 'Advertising', fingerprinting: 1 },
  'googleadservices.com': { owner: 'Google', prevalence: 0.24, category: 'Advertising', fingerprinting: 1 },
  'facebook.net': { owner: 'Meta', prevalence: 0.25, category: 'Advertising', fingerprinting: 2 },
  'facebook.com': { owner: 'Meta', prevalence: 0.18, category: 'Social - Facebook', fingerprinting: 2 },
  'fbcdn.net': { owner: 'Meta', prevalence: 0.12, category: 'CDN', fingerprinting: 1 },
  'connect.facebook.net': { owner: 'Meta', prevalence: 0.25, category: 'Advertising', fingerprinting: 2 },
  'adnxs.com': { owner: 'Xandr (Microsoft)', prevalence: 0.14, category: 'Advertising', fingerprinting: 2 },
  'criteo.com': { owner: 'Criteo', prevalence: 0.10, category: 'Advertising', fingerprinting: 2 },
  'criteo.net': { owner: 'Criteo', prevalence: 0.09, category: 'Advertising', fingerprinting: 2 },
  'rubiconproject.com': { owner: 'Magnite', prevalence: 0.08, category: 'Advertising', fingerprinting: 2 },
  'pubmatic.com': { owner: 'PubMatic', prevalence: 0.08, category: 'Advertising', fingerprinting: 2 },
  'casalemedia.com': { owner: 'Casale Media', prevalence: 0.07, category: 'Advertising', fingerprinting: 2 },
  'amazon-adsystem.com': { owner: 'Amazon', prevalence: 0.11, category: 'Advertising', fingerprinting: 1 },
  'adsrvr.org': { owner: 'The Trade Desk', prevalence: 0.09, category: 'Advertising', fingerprinting: 2 },
  'taboola.com': { owner: 'Taboola', prevalence: 0.07, category: 'Advertising', fingerprinting: 1 },
  'outbrain.com': { owner: 'Outbrain', prevalence: 0.05, category: 'Advertising', fingerprinting: 1 },
  'twitter.com': { owner: 'X Corp', prevalence: 0.06, category: 'Social - Twitter', fingerprinting: 1 },
  'ads-twitter.com': { owner: 'X Corp', prevalence: 0.04, category: 'Advertising', fingerprinting: 1 },
  'linkedin.com': { owner: 'Microsoft', prevalence: 0.04, category: 'Social - LinkedIn', fingerprinting: 1 },
  'snap.licdn.com': { owner: 'Microsoft', prevalence: 0.03, category: 'Analytics', fingerprinting: 1 },
  'tiktok.com': { owner: 'ByteDance', prevalence: 0.04, category: 'Social - TikTok', fingerprinting: 1 },
  'hotjar.com': { owner: 'Hotjar', prevalence: 0.06, category: 'Analytics', fingerprinting: 2 },
  'clarity.ms': { owner: 'Microsoft', prevalence: 0.05, category: 'Analytics', fingerprinting: 2 },
  'mixpanel.com': { owner: 'Mixpanel', prevalence: 0.02, category: 'Analytics', fingerprinting: 1 },
  'segment.io': { owner: 'Twilio', prevalence: 0.03, category: 'Analytics', fingerprinting: 1 },
  'segment.com': { owner: 'Twilio', prevalence: 0.02, category: 'Analytics', fingerprinting: 1 },
  'amplitude.com': { owner: 'Amplitude', prevalence: 0.02, category: 'Analytics', fingerprinting: 1 },
  'quantserve.com': { owner: 'Quantcast', prevalence: 0.04, category: 'Analytics', fingerprinting: 2 },
  'scorecardresearch.com': { owner: 'comScore', prevalence: 0.05, category: 'Analytics', fingerprinting: 1 },
  'pinterest.com': { owner: 'Pinterest', prevalence: 0.03, category: 'Social - Pinterest', fingerprinting: 1 },
  'snapchat.com': { owner: 'Snap', prevalence: 0.02, category: 'Social - Snapchat', fingerprinting: 1 },
  'bing.com': { owner: 'Microsoft', prevalence: 0.06, category: 'Analytics', fingerprinting: 1 },
  'yahoo.com': { owner: 'Yahoo', prevalence: 0.04, category: 'Advertising', fingerprinting: 1 },
  'newrelic.com': { owner: 'New Relic', prevalence: 0.03, category: 'Analytics', fingerprinting: 1 },
  'nr-data.net': { owner: 'New Relic', prevalence: 0.03, category: 'Analytics', fingerprinting: 1 },
  'demdex.net': { owner: 'Adobe', prevalence: 0.05, category: 'Advertising', fingerprinting: 2 },
  'omtrdc.net': { owner: 'Adobe', prevalence: 0.03, category: 'Analytics', fingerprinting: 1 },
  'adobedtm.com': { owner: 'Adobe', prevalence: 0.03, category: 'Analytics', fingerprinting: 1 },
  'bluekai.com': { owner: 'Oracle', prevalence: 0.04, category: 'Advertising', fingerprinting: 2 },
  'addthis.com': { owner: 'Oracle', prevalence: 0.03, category: 'Advertising', fingerprinting: 2 },
  'sharethis.com': { owner: 'ShareThis', prevalence: 0.02, category: 'Advertising', fingerprinting: 1 },
  'openx.net': { owner: 'OpenX', prevalence: 0.05, category: 'Advertising', fingerprinting: 2 },
  'indexww.com': { owner: 'Index Exchange', prevalence: 0.04, category: 'Advertising', fingerprinting: 2 },
  'medianet.com': { owner: 'Media.net', prevalence: 0.03, category: 'Advertising', fingerprinting: 1 },
  'bidswitch.net': { owner: 'IPONWEB', prevalence: 0.04, category: 'Advertising', fingerprinting: 2 },
  'mathtag.com': { owner: 'MediaMath', prevalence: 0.03, category: 'Advertising', fingerprinting: 2 },
  'eyeota.net': { owner: 'Eyeota', prevalence: 0.02, category: 'Advertising', fingerprinting: 2 },
  'liadm.com': { owner: 'LiveIntent', prevalence: 0.03, category: 'Advertising', fingerprinting: 2 },
  'rlcdn.com': { owner: 'LiveRamp', prevalence: 0.04, category: 'Advertising', fingerprinting: 2 },
  'krxd.net': { owner: 'Salesforce', prevalence: 0.03, category: 'Advertising', fingerprinting: 2 },
  'exelator.com': { owner: 'Nielsen', prevalence: 0.02, category: 'Advertising', fingerprinting: 2 },
  'chartbeat.com': { owner: 'Chartbeat', prevalence: 0.02, category: 'Analytics', fingerprinting: 1 },
  'optimizely.com': { owner: 'Optimizely', prevalence: 0.02, category: 'Analytics', fingerprinting: 1 },
  'crazyegg.com': { owner: 'Crazy Egg', prevalence: 0.01, category: 'Analytics', fingerprinting: 2 },
  'mouseflow.com': { owner: 'Mouseflow', prevalence: 0.01, category: 'Analytics', fingerprinting: 2 },
  'fullstory.com': { owner: 'FullStory', prevalence: 0.01, category: 'Analytics', fingerprinting: 2 },
};

// Map DDG categories to our simplified categories
function mapDDGCategory(ddgCategory: string): string {
  if (ddgCategory.startsWith('Ad') || ddgCategory === 'Advertising') return 'Marketing';
  if (ddgCategory === 'Analytics') return 'Analytics';
  if (ddgCategory.startsWith('Social')) return 'Marketing';
  if (ddgCategory === 'CDN') return 'Essential';
  return 'Suspicious';
}

// Known tracker domains (kept as fallback)
const TRACKER_DOMAINS: Record<string, { category: string; description: string }> = {
  'google-analytics.com': { category: 'Analytics', description: 'Google Analytics' },
  'googletagmanager.com': { category: 'Analytics', description: 'Google Tag Manager' },
  'analytics.google.com': { category: 'Analytics', description: 'Google Analytics' },
  'facebook.com': { category: 'Marketing', description: 'Facebook/Meta' },
  'facebook.net': { category: 'Marketing', description: 'Facebook/Meta SDK' },
  'fbcdn.net': { category: 'Marketing', description: 'Facebook CDN' },
  'doubleclick.net': { category: 'Suspicious', description: 'Google DoubleClick Ad Network' },
  'googlesyndication.com': { category: 'Marketing', description: 'Google AdSense' },
  'googleadservices.com': { category: 'Marketing', description: 'Google Ads' },
  'twitter.com': { category: 'Marketing', description: 'Twitter/X' },
  'ads-twitter.com': { category: 'Marketing', description: 'Twitter Ads' },
  'linkedin.com': { category: 'Marketing', description: 'LinkedIn' },
  'snap.licdn.com': { category: 'Marketing', description: 'LinkedIn Tracking' },
  'tiktok.com': { category: 'Marketing', description: 'TikTok' },
  'hotjar.com': { category: 'Analytics', description: 'Hotjar Analytics' },
  'clarity.ms': { category: 'Analytics', description: 'Microsoft Clarity' },
  'mixpanel.com': { category: 'Analytics', description: 'Mixpanel' },
  'segment.io': { category: 'Analytics', description: 'Segment' },
  'segment.com': { category: 'Analytics', description: 'Segment' },
  'amplitude.com': { category: 'Analytics', description: 'Amplitude' },
  'adnxs.com': { category: 'Suspicious', description: 'AppNexus Ad Exchange' },
  'criteo.com': { category: 'Suspicious', description: 'Criteo Retargeting' },
  'criteo.net': { category: 'Suspicious', description: 'Criteo Network' },
  'taboola.com': { category: 'Marketing', description: 'Taboola' },
  'outbrain.com': { category: 'Marketing', description: 'Outbrain' },
  'pinterest.com': { category: 'Marketing', description: 'Pinterest' },
  'snapchat.com': { category: 'Marketing', description: 'Snapchat' },
  'bing.com': { category: 'Analytics', description: 'Microsoft Bing' },
  'yahoo.com': { category: 'Marketing', description: 'Yahoo' },
  'rubiconproject.com': { category: 'Suspicious', description: 'Rubicon Project' },
  'pubmatic.com': { category: 'Suspicious', description: 'PubMatic' },
  'casalemedia.com': { category: 'Suspicious', description: 'Casale Media' },
  'quantserve.com': { category: 'Analytics', description: 'Quantcast' },
  'scorecardresearch.com': { category: 'Analytics', description: 'comScore' },
};

const MARKETING_KEYWORDS = ['ad', 'ads', 'advert', 'campaign', 'click', 'conversion', 'pixel', 'retarget', 'remarketing', 'sponsor'];
const ANALYTICS_KEYWORDS = ['analytics', 'stat', 'metric', 'measure', 'track', 'event', 'pageview', 'session', 'visitor'];
const SUSPICIOUS_KEYWORDS = ['sync', 'uid', 'fingerprint', 'beacon', 'collect', 'profil'];

// ─── DuckDuckGo Tracker Radar Lookup ──────────────────────────────────────────
function lookupDDGTrackerRadar(domain: string): { owner: string; prevalence: number; category: string; fingerprinting: number; ddgCategory: string } | null {
  const domainLower = domain.toLowerCase();
  for (const [trackerDomain, info] of Object.entries(DDG_TRACKER_RADAR)) {
    if (domainLower.includes(trackerDomain)) {
      return { ...info, ddgCategory: info.category };
    }
  }
  return null;
}

function classifyCookie(name: string, domain: string, expiry: string, secure: boolean, sameSite: string, hostDomain: string) {
  const nameLower = name.toLowerCase();
  const domainLower = domain.toLowerCase();
  const isFirstParty = domainLower === 'self' || domainLower.includes(hostDomain);

  // DDG Tracker Radar lookup first (higher confidence)
  const ddgMatch = lookupDDGTrackerRadar(domainLower);
  if (ddgMatch) {
    const category = mapDDGCategory(ddgMatch.ddgCategory);
    const riskLevel = getRiskLevel(category, expiry, secure, sameSite, isFirstParty, ddgMatch.fingerprinting);
    return {
      category,
      riskLevel,
      confidence: 0.95,
      explanation: `🦆 DuckDuckGo Tracker Radar: ${ddgMatch.owner} tracker (${ddgMatch.ddgCategory}). Prevalence: ${(ddgMatch.prevalence * 100).toFixed(1)}% of top sites. Fingerprinting score: ${ddgMatch.fingerprinting}/3. ${getRiskExplanation(riskLevel, expiry, secure, sameSite, isFirstParty)}`,
      ddgTrackerRadar: { owner: ddgMatch.owner, prevalence: ddgMatch.prevalence, fingerprinting: ddgMatch.fingerprinting, ddgCategory: ddgMatch.ddgCategory },
    };
  }

  // Check known tracker domains (fallback)
  for (const [trackerDomain, info] of Object.entries(TRACKER_DOMAINS)) {
    if (domainLower.includes(trackerDomain)) {
      const riskLevel = getRiskLevel(info.category, expiry, secure, sameSite, isFirstParty, 0);
      return {
        category: info.category,
        riskLevel,
        confidence: 0.9,
        explanation: `Matched known tracker domain: ${info.description} (${trackerDomain}). ${getRiskExplanation(riskLevel, expiry, secure, sameSite, isFirstParty)}`,
      };
    }
  }

  // Keyword-based classification
  if (SUSPICIOUS_KEYWORDS.some(kw => nameLower.includes(kw)) && !isFirstParty) {
    return {
      category: 'Suspicious',
      riskLevel: getRiskLevel('Suspicious', expiry, secure, sameSite, isFirstParty, 0),
      confidence: 0.5,
      explanation: `Cookie name "${name}" contains suspicious keyword pattern. Third-party origin increases risk. ${getRiskExplanation('High', expiry, secure, sameSite, isFirstParty)}`,
    };
  }
  if (MARKETING_KEYWORDS.some(kw => nameLower.includes(kw))) {
    return {
      category: 'Marketing',
      riskLevel: getRiskLevel('Marketing', expiry, secure, sameSite, isFirstParty, 0),
      confidence: 0.65,
      explanation: `Cookie name "${name}" contains marketing-related keyword. ${getRiskExplanation('Medium', expiry, secure, sameSite, isFirstParty)}`,
    };
  }
  if (ANALYTICS_KEYWORDS.some(kw => nameLower.includes(kw))) {
    return {
      category: 'Analytics',
      riskLevel: getRiskLevel('Analytics', expiry, secure, sameSite, isFirstParty, 0),
      confidence: 0.7,
      explanation: `Cookie name "${name}" contains analytics-related keyword. ${getRiskExplanation('Medium', expiry, secure, sameSite, isFirstParty)}`,
    };
  }

  // Default: first-party session cookies are essential
  if (isFirstParty && (expiry === 'Session' || expiry.includes('hour'))) {
    return {
      category: 'Essential',
      riskLevel: 'Low' as const,
      confidence: 0.8,
      explanation: `First-party cookie with short expiry. Likely used for session management. Low risk.`,
    };
  }

  return {
    category: isFirstParty ? 'Essential' : 'Analytics',
    riskLevel: isFirstParty ? 'Low' as const : 'Medium' as const,
    confidence: 0.4,
    explanation: `Unable to classify with high confidence. ${isFirstParty ? 'First-party origin suggests essential use.' : 'Third-party origin warrants review.'}`,
  };
}

function getRiskLevel(category: string, expiry: string, secure: boolean, sameSite: string, isFirstParty: boolean, fingerprinting: number = 0): string {
  let score = 0;
  if (category === 'Suspicious') score += 3;
  else if (category === 'Marketing') score += 2;
  else if (category === 'Analytics') score += 1;

  if (!isFirstParty) score += 1;
  if (!secure) score += 1;
  if (sameSite === 'None') score += 1;

  // Fingerprinting score from DDG Tracker Radar (0-3)
  if (fingerprinting >= 2) score += 2;
  else if (fingerprinting >= 1) score += 0.5;

  // Long expiry
  if (expiry.includes('year') || expiry.includes('365')) score += 1;
  else if (expiry.includes('month') || expiry.includes('90') || expiry.includes('180')) score += 0.5;

  if (score >= 5) return 'Critical';
  if (score >= 3) return 'High';
  if (score >= 2) return 'Medium';
  return 'Low';
}

function getRiskExplanation(level: string, expiry: string, secure: boolean, sameSite: string, isFirstParty: boolean): string {
  const parts = [];
  if (!secure) parts.push('missing Secure flag');
  if (sameSite === 'None') parts.push('cross-site SameSite policy');
  if (!isFirstParty) parts.push('third-party origin');
  if (expiry.includes('year')) parts.push('long expiry duration');
  return parts.length > 0 ? `Risk factors: ${parts.join(', ')}.` : '';
}

function parseCookieHeader(setCookieHeader: string, hostDomain: string) {
  const parts = setCookieHeader.split(';').map(p => p.trim());
  const nameValue = parts[0]?.split('=') || ['unknown'];
  const name = nameValue[0];

  let domain = 'self';
  let expiry = 'Session';
  let secure = false;
  let sameSite = 'Lax';
  let httpOnly = false;

  for (const part of parts.slice(1)) {
    const lower = part.toLowerCase();
    if (lower.startsWith('domain=')) domain = part.split('=')[1]?.trim() || 'self';
    else if (lower.startsWith('expires=')) {
      const date = new Date(part.split('=').slice(1).join('=').trim());
      const diff = date.getTime() - Date.now();
      if (diff > 365 * 24 * 60 * 60 * 1000) expiry = `${Math.round(diff / (365 * 24 * 60 * 60 * 1000))} year(s)`;
      else if (diff > 30 * 24 * 60 * 60 * 1000) expiry = `${Math.round(diff / (30 * 24 * 60 * 60 * 1000))} month(s)`;
      else if (diff > 24 * 60 * 60 * 1000) expiry = `${Math.round(diff / (24 * 60 * 60 * 1000))} day(s)`;
      else expiry = `${Math.round(diff / (60 * 60 * 1000))} hour(s)`;
    }
    else if (lower.startsWith('max-age=')) {
      const seconds = parseInt(part.split('=')[1] || '0');
      if (seconds > 365 * 24 * 60 * 60) expiry = `${Math.round(seconds / (365 * 24 * 60 * 60))} year(s)`;
      else if (seconds > 30 * 24 * 60 * 60) expiry = `${Math.round(seconds / (30 * 24 * 60 * 60))} month(s)`;
      else if (seconds > 24 * 60 * 60) expiry = `${Math.round(seconds / (24 * 60 * 60))} day(s)`;
      else expiry = `${Math.round(seconds / 3600)} hour(s)`;
    }
    else if (lower === 'secure') secure = true;
    else if (lower === 'httponly') httpOnly = true;
    else if (lower.startsWith('samesite=')) sameSite = part.split('=')[1]?.trim() || 'Lax';
  }

  const classification = classifyCookie(name, domain, expiry, secure, sameSite, hostDomain);

  return {
    name,
    domain,
    expiry,
    secure,
    sameSite,
    httpOnly,
    ...classification,
  };
}

function extractDomain(url: string): string {
  try {
    const parsed = new URL(url);
    return parsed.hostname.replace(/^www\./, '');
  } catch {
    return '';
  }
}

// Extract third-party script/img/link domains from HTML
function extractThirdPartyResources(html: string, hostDomain: string) {
  const resources: Array<{ domain: string; type: string; url: string }> = [];
  const urlPatterns = [
    /(?:src|href)=["'](https?:\/\/[^"']+)["']/gi,
  ];

  for (const pattern of urlPatterns) {
    let match;
    while ((match = pattern.exec(html)) !== null) {
      try {
        const resourceUrl = match[1];
        const resourceDomain = new URL(resourceUrl).hostname.replace(/^www\./, '');
        if (resourceDomain !== hostDomain && !resourceDomain.endsWith(`.${hostDomain}`)) {
          const type = resourceUrl.includes('.js') ? 'script' :
                       resourceUrl.includes('.css') ? 'stylesheet' :
                       resourceUrl.match(/\.(png|jpg|gif|svg|ico|webp)/) ? 'image' : 'resource';
          resources.push({ domain: resourceDomain, type, url: resourceUrl });
        }
      } catch { /* ignore invalid URLs */ }
    }
  }

  // Deduplicate by domain
  const seen = new Set<string>();
  return resources.filter(r => {
    if (seen.has(r.domain)) return false;
    seen.add(r.domain);
    return true;
  });
}

// Convert third-party resources into tracker entries with DDG Tracker Radar
function classifyResources(resources: Array<{ domain: string; type: string; url: string }>) {
  return resources.map((resource, i) => {
    // DDG Tracker Radar first
    const ddgMatch = lookupDDGTrackerRadar(resource.domain);
    if (ddgMatch) {
      const category = mapDDGCategory(ddgMatch.ddgCategory);
      const riskLevel = category === 'Suspicious' || ddgMatch.fingerprinting >= 2 ? 'High' : category === 'Marketing' ? 'Medium' : 'Low';
      return {
        id: `resource-${i}`,
        name: resource.domain,
        domain: resource.domain,
        category,
        riskLevel,
        confidence: 0.92,
        expiry: 'N/A (resource)',
        secure: resource.url.startsWith('https'),
        sameSite: 'N/A',
        explanation: `🦆 DuckDuckGo Tracker Radar: ${ddgMatch.owner} (${ddgMatch.ddgCategory}). Prevalence: ${(ddgMatch.prevalence * 100).toFixed(1)}% of top sites. Fingerprinting: ${ddgMatch.fingerprinting}/3. Detected via HTML ${resource.type} tag.`,
        detectedVia: `${resource.type} tag (DDG Tracker Radar)`,
        ddgTrackerRadar: { owner: ddgMatch.owner, prevalence: ddgMatch.prevalence, fingerprinting: ddgMatch.fingerprinting, ddgCategory: ddgMatch.ddgCategory },
      };
    }

    // Fallback to known tracker domains
    for (const [trackerDomain, info] of Object.entries(TRACKER_DOMAINS)) {
      if (resource.domain.includes(trackerDomain)) {
        const riskLevel = info.category === 'Suspicious' ? 'High' : info.category === 'Marketing' ? 'Medium' : 'Low';
        return {
          id: `resource-${i}`,
          name: resource.domain,
          domain: resource.domain,
          category: info.category,
          riskLevel,
          confidence: 0.85,
          expiry: 'N/A (resource)',
          secure: resource.url.startsWith('https'),
          sameSite: 'N/A',
          explanation: `Third-party ${resource.type} loaded from known tracker domain: ${info.description}. Detected via HTML ${resource.type} tag.`,
          detectedVia: `${resource.type} tag`,
        };
      }
    }

    // Check keywords in URL
    const urlLower = resource.url.toLowerCase();
    if (SUSPICIOUS_KEYWORDS.some(kw => urlLower.includes(kw))) {
      return {
        id: `resource-${i}`, name: resource.domain, domain: resource.domain,
        category: 'Suspicious', riskLevel: 'High', confidence: 0.5,
        expiry: 'N/A', secure: resource.url.startsWith('https'), sameSite: 'N/A',
        explanation: `Third-party resource URL contains suspicious keywords. Review recommended.`,
        detectedVia: `${resource.type} tag`,
      };
    }
    if (MARKETING_KEYWORDS.some(kw => urlLower.includes(kw))) {
      return {
        id: `resource-${i}`, name: resource.domain, domain: resource.domain,
        category: 'Marketing', riskLevel: 'Medium', confidence: 0.5,
        expiry: 'N/A', secure: resource.url.startsWith('https'), sameSite: 'N/A',
        explanation: `Third-party resource URL contains marketing-related keywords.`,
        detectedVia: `${resource.type} tag`,
      };
    }

    return null;
  }).filter(Boolean);
}

// ─── DuckDuckGo Search for Domain Reputation ──────────────────────────────────
async function ddgSearchDomainReputation(domain: string): Promise<{ reputation: string; details: string[] } | null> {
  try {
    // Use DuckDuckGo Instant Answer API (no API key needed)
    const query = encodeURIComponent(`${domain} privacy tracker data collection`);
    const response = await fetch(`https://api.duckduckgo.com/?q=${query}&format=json&no_html=1&skip_disambig=1`, {
      headers: { 'User-Agent': 'SmartConsent/2.0 Privacy Scanner' },
    });

    if (!response.ok) return null;
    const data = await response.json();

    const details: string[] = [];
    let reputation = 'Unknown';

    if (data.Abstract) {
      details.push(data.Abstract.slice(0, 200));
    }

    // Check related topics for privacy concerns
    const relatedTopics = data.RelatedTopics || [];
    for (const topic of relatedTopics.slice(0, 3)) {
      if (topic.Text) {
        const textLower = topic.Text.toLowerCase();
        if (textLower.includes('privacy') || textLower.includes('tracking') || textLower.includes('data')) {
          details.push(topic.Text.slice(0, 150));
        }
      }
    }

    if (details.some(d => d.toLowerCase().includes('privacy concern') || d.toLowerCase().includes('controversy'))) {
      reputation = 'Concerning';
    } else if (details.length > 0) {
      reputation = 'Known Entity';
    }

    return details.length > 0 ? { reputation, details } : null;
  } catch (err) {
    console.warn('DDG search failed for', domain, err);
    return null;
  }
}

// ─── DuckDuckGo-Style Privacy Grade (A+ to F) ────────────────────────────────
interface ScanTracker {
  domain: string;
  explanation: string;
  ddgTrackerRadar?: { fingerprinting?: number; prevalence?: number };
  ddgReputation?: { reputation: string; details: string[] };
}

interface PolicyAnalysisInput {
  score?: string;
  missingKeywords?: string[];
}

function calculatePrivacyGrade(
  trackers: ScanTracker[],
  policyAnalysis: PolicyAnalysisInput,
  httpsEnforced: boolean,
): { grade: string; score: number; breakdown: { trackerPenalty: number; policyPenalty: number; httpsPenalty: number; fingerprintPenalty: number; prevalencePenalty: number } } {
  // Start at 100 and subtract penalties (like DDG methodology)
  let score = 100;

  // 1. Tracker quantity penalty (max -30)
  const trackerPenalty = Math.min(trackers.length * 3, 30);
  score -= trackerPenalty;

  // 2. Fingerprinting penalty (max -20) — from DDG Tracker Radar fingerprinting scores
  let fingerprintPenalty = 0;
  for (const t of trackers) {
    const fp = t.ddgTrackerRadar?.fingerprinting || 0;
    if (fp >= 3) fingerprintPenalty += 8;
    else if (fp >= 2) fingerprintPenalty += 5;
    else if (fp >= 1) fingerprintPenalty += 2;
  }
  fingerprintPenalty = Math.min(fingerprintPenalty, 20);
  score -= fingerprintPenalty;

  // 3. Tracker prevalence penalty (max -15) — highly prevalent trackers are worse
  let prevalencePenalty = 0;
  for (const t of trackers) {
    const prev = t.ddgTrackerRadar?.prevalence || 0;
    if (prev >= 0.3) prevalencePenalty += 5;
    else if (prev >= 0.1) prevalencePenalty += 3;
    else if (prev > 0) prevalencePenalty += 1;
  }
  prevalencePenalty = Math.min(prevalencePenalty, 15);
  score -= prevalencePenalty;

  // 4. Policy penalty (max -20)
  let policyPenalty = 0;
  if (policyAnalysis.score === 'Potentially Non-Compliant') policyPenalty = 20;
  else if (policyAnalysis.score === 'Review Recommended') policyPenalty = 10;
  else policyPenalty = 0;
  // Missing keywords
  policyPenalty += Math.min((policyAnalysis.missingKeywords?.length || 0) * 2, 10);
  policyPenalty = Math.min(policyPenalty, 20);
  score -= policyPenalty;

  // 5. HTTPS penalty (max -15)
  const httpsPenalty = httpsEnforced ? 0 : 15;
  score -= httpsPenalty;

  score = Math.max(0, Math.min(100, score));

  // Map score to letter grade (DDG-style)
  let grade: string;
  if (score >= 95) grade = 'A+';
  else if (score >= 85) grade = 'A';
  else if (score >= 75) grade = 'B+';
  else if (score >= 65) grade = 'B';
  else if (score >= 55) grade = 'C+';
  else if (score >= 45) grade = 'C';
  else if (score >= 35) grade = 'D+';
  else if (score >= 25) grade = 'D';
  else grade = 'F';

  return {
    grade,
    score,
    breakdown: { trackerPenalty, policyPenalty, httpsPenalty, fingerprintPenalty, prevalencePenalty },
  };
}

// Privacy policy analysis (AI-powered)
const PRIVACY_POLICY_PATHS = ['/privacy', '/privacy-policy', '/privacy.html', '/privacypolicy', '/legal/privacy'];

async function fetchPrivacyPolicyText(baseUrl: string): Promise<{ text: string; url: string } | null> {
  for (const path of PRIVACY_POLICY_PATHS) {
    try {
      const url = new URL(path, baseUrl).toString();
      const response = await fetch(url, {
        headers: { 'User-Agent': 'SmartConsent/1.0 Privacy Scanner' },
        redirect: 'follow',
      });
      if (response.ok) {
        const html = await response.text();
        const text = html
          .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
          .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
          .replace(/<[^>]+>/g, ' ')
          .replace(/\s+/g, ' ')
          .trim()
          .slice(0, 12000);
        if (text.length > 200) return { text, url };
      }
    } catch { /* try next path */ }
  }
  return null;
}

async function analyzePrivacyPolicy(baseUrl: string, trackerSummary: string) {
  const policyData = await fetchPrivacyPolicyText(baseUrl);

  if (!policyData) {
    return {
      score: 'Review Recommended',
      policyUrl: null,
      highlights: [
        { text: 'Could not locate a privacy policy page. Checked common paths like /privacy, /privacy-policy.', type: 'negative' },
      ],
      foundKeywords: [],
      missingKeywords: ['privacy policy page'],
    };
  }

  const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
  if (!LOVABLE_API_KEY) {
    console.warn('LOVABLE_API_KEY not set, falling back to basic analysis');
    return fallbackKeywordAnalysis(policyData.text, policyData.url);
  }

  try {
    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-3-flash-preview',
        messages: [
          {
            role: 'system',
            content: `You are a privacy compliance analyst. Analyze the provided privacy policy text and return a structured assessment. Be concise and actionable. Focus on GDPR, CCPA, and ePrivacy Directive compliance.`
          },
          {
            role: 'user',
            content: `Analyze this privacy policy for compliance. The website has these trackers: ${trackerSummary}

Privacy policy text (truncated):
${policyData.text.slice(0, 8000)}

Respond using the analyze_policy tool.`
          }
        ],
        tools: [{
          type: 'function',
          function: {
            name: 'analyze_policy',
            description: 'Return structured privacy policy analysis',
            parameters: {
              type: 'object',
              properties: {
                score: {
                  type: 'string',
                  enum: ['Likely Compliant', 'Review Recommended', 'Potentially Non-Compliant'],
                  description: 'Overall compliance assessment'
                },
                highlights: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      text: { type: 'string', description: 'Finding description, max 120 chars' },
                      type: { type: 'string', enum: ['positive', 'negative', 'warning'] }
                    },
                    required: ['text', 'type'],
                    additionalProperties: false
                  },
                  description: '4-8 key findings about the policy'
                },
                foundKeywords: {
                  type: 'array',
                  items: { type: 'string' },
                  description: 'Compliance concepts found (e.g. "right to erasure", "data portability", "cookie consent")'
                },
                missingKeywords: {
                  type: 'array',
                  items: { type: 'string' },
                  description: 'Important compliance concepts missing from the policy'
                }
              },
              required: ['score', 'highlights', 'foundKeywords', 'missingKeywords'],
              additionalProperties: false
            }
          }
        }],
        tool_choice: { type: 'function', function: { name: 'analyze_policy' } },
      }),
    });

    if (!aiResponse.ok) {
      const errText = await aiResponse.text();
      console.error('AI gateway error:', aiResponse.status, errText);
      return fallbackKeywordAnalysis(policyData.text, policyData.url);
    }

    const aiData = await aiResponse.json();
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) {
      console.error('No tool call in AI response');
      return fallbackKeywordAnalysis(policyData.text, policyData.url);
    }

    const parsed = JSON.parse(toolCall.function.arguments);
    return {
      score: parsed.score,
      policyUrl: policyData.url,
      highlights: parsed.highlights,
      foundKeywords: parsed.foundKeywords,
      missingKeywords: parsed.missingKeywords,
    };
  } catch (err) {
    console.error('AI analysis failed:', err);
    return fallbackKeywordAnalysis(policyData.text, policyData.url);
  }
}

// Fallback if AI is unavailable
function fallbackKeywordAnalysis(policyText: string, policyUrl: string) {
  const POSITIVE = ['data subject rights', 'right to access', 'right to erasure', 'opt-out', 'cookie consent', 'data retention', 'gdpr', 'ccpa'];
  const MISSING_CHECK = ['granular consent', 'cookie banner', 'opt-out mechanism', 'data retention period', 'right to erasure'];
  const textLower = policyText.toLowerCase();
  const foundKeywords = POSITIVE.filter(kw => textLower.includes(kw));
  const missingKeywords = MISSING_CHECK.filter(kw => !textLower.includes(kw));
  const highlights: Array<{ text: string; type: 'positive' | 'negative' | 'warning' }> = [];
  if (foundKeywords.length >= 4) highlights.push({ text: 'Policy covers several important data rights topics.', type: 'positive' });
  if (missingKeywords.length >= 3) highlights.push({ text: 'Multiple key compliance terms are missing from the policy.', type: 'negative' });
  const score = foundKeywords.length >= 6 && missingKeywords.length <= 2
    ? 'Likely Compliant' as const
    : missingKeywords.length >= 4 ? 'Potentially Non-Compliant' as const : 'Review Recommended' as const;
  return { score, policyUrl, highlights, foundKeywords, missingKeywords };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { url } = await req.json();
    if (!url) {
      return new Response(JSON.stringify({ success: false, error: 'URL is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    let formattedUrl = url.trim();
    if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = `https://${formattedUrl}`;
    }

    const hostDomain = extractDomain(formattedUrl);
    console.log('Scanning URL:', formattedUrl, 'Host domain:', hostDomain);

    // Fetch the root page
    const pageResponse = await fetch(formattedUrl, {
      headers: { 'User-Agent': 'SmartConsent/2.0 Privacy Scanner' },
      redirect: 'follow',
    });

    if (!pageResponse.ok) {
      return new Response(JSON.stringify({
        success: false,
        error: `Failed to fetch URL: HTTP ${pageResponse.status}`,
      }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const httpsEnforced = formattedUrl.startsWith('https://');

    // Extract cookies from response headers
    const setCookieHeaders: string[] = [];
    pageResponse.headers.forEach((value, key) => {
      if (key.toLowerCase() === 'set-cookie') {
        setCookieHeaders.push(value);
      }
    });

    const html = await pageResponse.text();

    // Parse cookies
    const cookies = setCookieHeaders.map((header, i) => ({
      id: `cookie-${i}`,
      detectedVia: 'Set-Cookie header',
      ...parseCookieHeader(header, hostDomain),
    }));

    // Extract third-party resources from HTML
    const thirdPartyResources = extractThirdPartyResources(html, hostDomain);
    const resourceTrackers = classifyResources(thirdPartyResources);

    // Combine all trackers
    const allTrackers = [...cookies, ...resourceTrackers];

    // DDG domain reputation lookup for unique third-party domains (top 5)
    const uniqueThirdPartyDomains = [...new Set(allTrackers.filter(t => t.category !== 'Essential').map(t => t.domain))].slice(0, 5);
    const ddgReputations: Record<string, { reputation: string; details: string[] }> = {};

    // Fetch DDG reputations in parallel
    const reputationResults = await Promise.allSettled(
      uniqueThirdPartyDomains.map(async (domain) => {
        const rep = await ddgSearchDomainReputation(domain);
        return { domain, rep };
      })
    );
    for (const result of reputationResults) {
      if (result.status === 'fulfilled' && result.value.rep) {
        ddgReputations[result.value.domain] = result.value.rep;
      }
    }

    // Enrich trackers with DDG reputation data
    for (const tracker of allTrackers as ScanTracker[]) {
      const rep = ddgReputations[tracker.domain];
      if (rep) {
        tracker.ddgReputation = rep;
        tracker.explanation += ` | DDG Reputation: ${rep.reputation}. ${rep.details[0] || ''}`;
      }
    }

    // Build tracker summary for AI context
    const trackerSummary = allTrackers.map(t => `${t.name} (${t.category}/${t.riskLevel})`).join(', ') || 'None detected';

    // Analyze privacy policy with AI
    const policyAnalysis = await analyzePrivacyPolicy(formattedUrl, trackerSummary);

    // Calculate DuckDuckGo-style Privacy Grade
    const privacyGrade = calculatePrivacyGrade(allTrackers, policyAnalysis, httpsEnforced);

    // Compute overall risk
    const suspiciousCount = allTrackers.filter(t => t.category === 'Suspicious').length;
    const marketingCount = allTrackers.filter(t => t.category === 'Marketing').length;
    const criticalCount = allTrackers.filter(t => t.riskLevel === 'Critical').length;
    const highCount = allTrackers.filter(t => t.riskLevel === 'High').length;
    const policyNonCompliant = policyAnalysis.score === 'Potentially Non-Compliant';

    let overallRisk = 'Low';
    let suggestedAction = 'Allow';
    const riskParts = [];

    if (criticalCount > 0 || (suspiciousCount >= 2 && policyNonCompliant)) {
      overallRisk = 'Critical';
      suggestedAction = 'Deny';
      riskParts.push(`${criticalCount} critical-risk tracker(s)`);
    } else if (suspiciousCount > 0 || (highCount >= 2 && policyNonCompliant)) {
      overallRisk = 'High';
      suggestedAction = 'Review Manually';
      riskParts.push(`${suspiciousCount} suspicious tracker(s)`);
    } else if (marketingCount >= 2 || policyNonCompliant) {
      overallRisk = 'Medium';
      suggestedAction = 'Review Manually';
    }

    if (suspiciousCount > 0) riskParts.push(`${suspiciousCount} suspicious tracker(s)`);
    if (marketingCount > 0) riskParts.push(`${marketingCount} marketing tracker(s)`);
    if (policyNonCompliant) riskParts.push('potentially non-compliant privacy policy');
    if (policyAnalysis.missingKeywords.length > 3) riskParts.push(`missing ${policyAnalysis.missingKeywords.length} key policy terms`);

    // DDG-enhanced risk explanation
    const ddgTrackerCount = (allTrackers as ScanTracker[]).filter(t => t.ddgTrackerRadar).length;
    if (ddgTrackerCount > 0) riskParts.push(`${ddgTrackerCount} tracker(s) confirmed by DuckDuckGo Tracker Radar`);

    const riskExplanation = riskParts.length > 0
      ? `${overallRisk} Risk: ${riskParts.join(', ')}.`
      : `${overallRisk} Risk: No significant concerns detected.`;

    const result = {
      success: true,
      url: formattedUrl,
      timestamp: new Date().toISOString(),
      overallRisk,
      riskExplanation,
      suggestedAction,
      trackers: allTrackers,
      policyAnalysis,
      privacyGrade,
    };

    console.log(`Scan complete: ${allTrackers.length} trackers, risk: ${overallRisk}, privacy grade: ${privacyGrade.grade} (${privacyGrade.score}/100)`);

    return new Response(JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

  } catch (error) {
    console.error('Scan error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : 'Scan failed',
    }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
