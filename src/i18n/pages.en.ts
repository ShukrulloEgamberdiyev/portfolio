import type { PageDict } from './pageTypes';

export const pagesEn: PageDict = {
  common: {
    home: 'Home', backHome: 'Back to home', readMore: 'Next article',
    ctaTitle: 'Want to talk about growth?',
    ctaText: 'We’ll look at your business and show you where the result is being lost. The call is free.',
    ctaButton: 'Submit an application', ctaSecondary: 'Message on Telegram',
  },
  work: {
    title: 'Work', intro: 'In every project we answered one question: where is the money being lost, and how do we get it back?',
    featured: 'Detailed cases', other: 'Other projects', otherNote: 'Brands we have worked with on SMM, paid acquisition, content or sales.',
  },
  caseDetail: {
    back: 'All work', industry: 'Industry', challenge: 'Challenge', approach: 'Approach', work: 'What we did', result: 'Result',
    systemUsed: 'System stages involved', mediaNote: 'Project material', next: 'Next project',
    disclaimer: 'Results are published with the client’s agreement. Where no exact figure is given, it is confidential or unverified.',
    approaches: {
      'fazilat-estate': 'In real estate the problem wasn’t reach — most enquiries came from people with a different budget. We split campaigns by property and price segment, made the content about the decision rather than the apartment, and gave the sales team a way to qualify a lead in the first 15 minutes.',
      'exeed-buxoro-autocity': 'A cheap lead is worth nothing if the person never reaches the showroom. So the test drive became the objective, creatives were split by model, and a follow-up sequence was built for people who didn’t show up.',
      'laminox-factory': 'In B2B you are looking for a partner, not a buyer. We turned the factory itself into content: the process, the volume, the quality control. For a dealer that is the strongest trust signal — enquiries grew after that.',
      'uz-style-catering': 'A corporate order and a private event are two different clients with two different offers. We separated them, wrote an offer and a script for each, and used retargeting to bring back the people who asked for a price and left.',
      'zk-academy': 'In education an application can be cheap and still never reach enrolment. We put the teacher and the outcome in the content and automated the follow-up — cutting response time lifted conversion.',
      'dilbar-restaurant': 'A celebration is a slow decision. We showed the hall, the service and real events, automated the reply to an enquiry, and routed booking requests straight to a manager.',
    },
  },
  expertise: { title: 'Expertise', intro: 'Four capabilities, one system. Each works on its own, but the result comes from the connection between them.', open: 'Open capability' },
  expertiseDetail: {
    inSystem: 'Place in the system', deliverables: 'What you get', howLabel: 'How we work', relatedLabel: 'Projects from this capability',
    modules: [
      {
        lead: 'Strategy isn’t a deck. It is a decision: which customer, with which offer, through which channel.',
        sections: [
          { h: 'We study the market', body: 'We collect competitors’ ads, prices and promises. We talk to your customers or read your existing enquiries — that is where you see what people fear and what they compare.' },
          { h: 'We define the position', body: 'What makes you different, and can you say it in one sentence? If the only difference is price, creating one is part of this stage.' },
          { h: 'We build the offer and funnel', body: 'What the customer gets at the first step, what happens next, where they drop out. Every stage gets a measurable objective.' },
        ],
        deliverables: ['Market and competitor analysis', 'Customer profile and objection list', 'Positioning and key messages', 'Offer architecture', 'Funnel map and KPI'],
      },
      {
        lead: 'Content doesn’t have to be beautiful. It has to hold attention and move someone to the next step.',
        sections: [
          { h: 'A content system', body: 'The monthly plan is built from customer questions and objections, not from random topics. We know which stage each format serves.' },
          { h: 'Production', body: 'Reels, product and process films, interviews. Script, direction and edit are on us. In product shots we never alter colour — the customer has to see the real thing.' },
          { h: 'Performance creatives', body: 'Ad creatives are produced separately and tested. What works stays, what doesn’t is replaced — the process never stops.' },
        ],
        deliverables: ['Content strategy and formats', 'Monthly content plan', 'Production and editing', 'Reels and commercial films', 'Ad creatives and test results'],
      },
      {
        lead: 'Paid media is the machine that turns budget into demand. Its job is not a cheap lead — it is a lead that buys.',
        sections: [
          { h: 'Campaign structure', body: 'A clear structure by objective, audience and creative. No settings are added at random — every change is logged with a reason.' },
          { h: 'Testing and optimisation', body: 'Creative, offer and audience are tested in sequence. Decisions come from the real numbers in the account: CPA, spend, results and lead quality.' },
          { h: 'Reporting', body: 'Every week: what worked, what didn’t and the next step. Reach and likes are never the headline number.' },
        ],
        deliverables: ['Media plan and budget split', 'Meta Ads campaigns', 'Retargeting sequences', 'Creative testing schedule', 'Weekly and monthly reporting'],
      },
      {
        lead: 'In most businesses the money is lost here, not in the ads: the lead arrived and nobody worked it properly.',
        sections: [
          { h: 'Lead intake', body: 'Where the lead lands, who answers, how fast. Cutting response time is the cheapest growth available.' },
          { h: 'Script and objections', body: 'A sequence of questions, answers to objections and a next step. A written document, not a verbal agreement.' },
          { h: 'CRM and control', body: 'Every stage is visible: new, in progress, meeting, won, lost. Losses are logged with a reason — next month’s strategy comes from there.' },
        ],
        deliverables: ['Lead intake process', 'Sales script and objection handling', 'CRM structure and stages', 'Sales KPI and reporting format', 'Short training for the sales team'],
      },
    ],
  },
  processPage: {
    title: 'Process', intro: 'How the work runs — from the first call to scaling. Every phase has a concrete output.',
    insideLabel: 'What’s inside', outputLabel: 'Phase output',
    inside: [
      ['Review the business and its revenue structure', 'Check the real numbers in the ad account', 'Measure the sales team’s response time', 'Analyse content and competitors'],
      ['Define positioning and offer', 'Map the customer journey', 'Channel and budget plan', 'KPI and measurement'],
      ['Creative system and content plan', 'Campaign structure', 'CRM and lead intake process', 'Scripts'],
      ['Content goes out', 'Campaigns go live', 'Lead flow begins', 'Daily monitoring in week one'],
      ['Weekly tests and optimisation', 'Lead quality reviewed with sales', 'Scale what works', 'Monthly strategic review'],
    ],
    outputs: ['Audit document and the gaps found', 'Strategy and growth plan', 'A working system and the material for it', 'Live campaigns and lead flow', 'Monthly report and next month’s plan'],
    ninetyTitle: 'The first 90 days',
    ninety: [
      { when: 'Weeks 1–2', what: 'Audit, strategy and offer. This is usually where the biggest gap is found.' },
      { when: 'Weeks 3–4', what: 'Production, creatives, CRM and scripts. The first campaigns go live.' },
      { when: 'Month 2', what: 'Testing: creatives and audiences rotate, lead quality is checked together with sales.' },
      { when: 'Month 3', what: 'What works gets scaled and the budget is redistributed behind it.' },
    ],
  },
  about: {
    title: 'About FAZO', lead: 'We work in Tashkent and help businesses connect marketing to sales.',
    story: [
      { h: 'Where it started', body: 'FAZO started as an SMM agency. Over time one thing became clear: neither good content nor a cheap lead makes money on its own. The client’s question was always the same — “where are the sales?”' },
      { h: 'What changed', body: 'We widened the scope: past the ads into sales, CRM and analytics. Today we are not a content producer but the team accountable for a client’s growth system.' },
      { h: 'How we work', body: 'Each project brings together specialists in strategy, advertising, scriptwriting, copywriting, design and video production, with each discipline handled by a dedicated specialist. The rhythm is weekly: plan, execute, read the numbers, correct. Reports are written in leads and sales, not likes.' },
    ],
    principlesTitle: 'Principles',
    principles: [
      { h: 'Start with the numbers', body: 'Before recommending anything we check the real results in the account. Your CPA and your sales, not generic best practice.' },
      { h: 'No promises', body: 'We don’t talk about guaranteed revenue. We commit to what we control: process, quality and speed.' },
      { h: 'We say the uncomfortable part', body: 'If the problem is the product or the sales team rather than the ads, we say so directly.' },
      { h: 'One owner', body: 'One team and one outcome instead of five disconnected contractors.' },
    ],
    teamTitle: 'Team', teamText: 'Strategists, advertising specialists, scriptwriters, copywriters, designers, videographers, video editors, content managers and sales consultants each work in their own discipline. The team is assembled around the project’s needs. As the scope of work and engagement budget grow, more specialists join the project.',
    numbersTitle: 'In numbers',
  },
  insightsPage: { title: 'Insights', intro: 'On the mistakes that keep repeating, and how to fix them.', langNote: 'This article is available in Uzbek.', minutes: 'min read' },
  applyPage: { title: 'Application', intro: 'Fill in the form — a strategist reviews every application and gets in touch if there’s a fit.' },
  privacy: {
    title: 'Privacy Policy', updated: 'Updated: September 2026',
    sections: [
      { h: 'What we collect', body: 'The information you provide in the application form: name, company, website or Instagram, industry, revenue and budget ranges, objective and a contact (phone or Telegram). We may also collect site visit statistics (pages, device type, source).' },
      { h: 'Why we use it', body: 'Only to review your application, contact you and prepare a proposal. Your data is never sold or passed to third parties for advertising.' },
      { h: 'Where it is stored', body: 'Applications are stored in FAZO Digital’s internal Google Sheets CRM. Only staff working on the project have access.' },
      { h: 'Cookies and analytics', body: 'The site uses browser storage to remember your language. Tools such as Meta Pixel may be used to measure advertising performance.' },
      { h: 'Your rights', body: 'You can ask us to delete or correct your data at any time. Write to @fazo_digital on Telegram.' },
      { h: 'Contact', body: 'FAZO Digital, Tashkent, Uzbekistan. Telegram: @fazo_digital. Phone: +998 93 040 10 70.' },
    ],
  },
  notFound: { title: 'Page not found', text: 'The address is wrong or the page has moved.' },
};
