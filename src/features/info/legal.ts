/**
 * Legal texts (English). DRAFT — describes what the app actually does with data, but
 * must be reviewed by a lawyer before launch. The Impressum needs the operator's real
 * details (name, address, contact), which only the product owner can provide.
 */
type Doc = { updated: string; sections: { title: string; body: string[] }[] };

export const LEGAL: Record<'impressum' | 'privacy' | 'terms', Doc> = {
  impressum: {
    updated: 'Draft · 5 November 2026',
    sections: [
      {
        title: 'Provider (§ 5 Digitale-Dienste-Gesetz)',
        body: [
          'TODO(product owner): full name or company name and legal form',
          'TODO(product owner): postal address (no P.O. box)',
          'Email: hello@settleingermany.app',
          'TODO(product owner): phone number, commercial register entry and VAT ID if applicable',
        ],
      },
      {
        title: 'Responsible for content (§ 18 Abs. 2 MStV)',
        body: ['TODO(product owner): name and address of the person responsible for editorial content'],
      },
      {
        title: 'About our content',
        body: [
          'Our guides give general information and are not legal advice. Every guide lists its official sources and the date it was last checked.',
          'Rules change. Before you act, check the official source linked on the page or ask one of the services in “Where to get help”.',
        ],
      },
    ],
  },
  privacy: {
    updated: 'Draft · 5 November 2026',
    sections: [
      {
        title: 'Who is responsible',
        body: ['The provider named in the Impressum is the controller under the GDPR. Contact: hello@settleingermany.app.'],
      },
      {
        title: 'Data that stays on your phone',
        body: [
          'Without an account, your profile (nationality, status, city, stage, arrival date), roadmap progress, reminders and notes are stored only on your device. We cannot see them.',
          'Reminders store dates and notes only — never photos of your documents.',
        ],
      },
      {
        title: 'If you create an account',
        body: [
          'We store your email address and the data above in our database (Supabase, servers in the EU) so you can use it on another phone. Legal basis: Art. 6(1)(b) GDPR (providing the service you asked for).',
        ],
      },
      {
        title: 'Notifications',
        body: [
          'If you turn on notifications, we store your device’s push token together with your nationality, status, city and language, so that rule-change notifications reach only people they affect. Legal basis: your consent, Art. 6(1)(a) GDPR. You can switch notifications off at any time in your phone’s settings.',
        ],
      },
      {
        title: 'Letter scans (Premium AI tools)',
        body: [
          'Scans are sent to our server, processed to create the explanation, and deleted after processing unless you choose to save them. The client app never contacts an AI provider directly.',
        ],
      },
      {
        title: 'Ads and measurement',
        body: [
          'Free users see ads from Google AdMob (apps) or AdSense (web). Personalised ads and usage measurement run only if you agree in the consent dialog. If you say no, ads are not personalised. You can change your choice in Me › Privacy or under “Cookie settings”.',
        ],
      },
      {
        title: 'Payments',
        body: ['Premium purchases are handled by Apple, Google or Stripe through RevenueCat. We receive your subscription status, not your card details.'],
      },
      {
        title: 'Your rights',
        body: [
          'You can access, correct, download (Me › Privacy › Download my data) and delete (Me › Privacy › Delete my account) your data, object to processing and withdraw consent at any time. You can also complain to a data protection authority, for example the Saxon Data Protection Commissioner.',
        ],
      },
    ],
  },
  terms: {
    updated: 'Draft · 5 November 2026',
    sections: [
      {
        title: 'What the service is',
        body: [
          'Settle in Germany gives general information about living in Germany, a personal checklist, reminders and tools. It is not legal, tax or immigration advice and does not replace the authorities or a lawyer.',
        ],
      },
      {
        title: 'Accuracy',
        body: [
          'We check our content against official sources and show the date of the last check. Rules can change at short notice; the official source always takes precedence.',
        ],
      },
      {
        title: 'Age',
        body: ['You must be at least 16 years old to create an account.'],
      },
      {
        title: 'Premium',
        body: [
          'Premium costs €3.99 per month or €29.99 per year after a 7-day free trial. You can cancel at any time in your App Store, Google Play or web account; Premium then stays active until the end of the paid period. All guides, the roadmap and reminders remain free.',
        ],
      },
      {
        title: 'Referral links',
        body: ['Some links to providers may be referral links. They are always labelled. Rankings are by fees, never by commission.'],
      },
    ],
  },
};
