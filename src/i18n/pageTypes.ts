export type Section = { h: string; body: string };

export type PageDict = {
  common: { home: string; backHome: string; ctaTitle: string; ctaText: string; ctaButton: string; ctaSecondary: string; readMore: string };
  work: { title: string; intro: string; featured: string; other: string; otherNote: string };
  caseDetail: {
    back: string; industry: string; challenge: string; approach: string; work: string; result: string;
    systemUsed: string; mediaNote: string; next: string; disclaimer: string;
    approaches: Record<string, string>;
  };
  expertise: { title: string; intro: string; open: string };
  expertiseDetail: {
    inSystem: string; deliverables: string; howLabel: string; relatedLabel: string;
    modules: { lead: string; sections: Section[]; deliverables: string[] }[];
  };
  processPage: { title: string; intro: string; insideLabel: string; outputLabel: string; inside: string[][]; outputs: string[]; ninetyTitle: string; ninety: { when: string; what: string }[] };
  about: { title: string; lead: string; story: Section[]; principlesTitle: string; principles: Section[]; teamTitle: string; teamText: string; numbersTitle: string };
  insightsPage: { title: string; intro: string; langNote: string; minutes: string };
  applyPage: { title: string; intro: string };
  privacy: { title: string; updated: string; sections: Section[] };
  notFound: { title: string; text: string };
};
