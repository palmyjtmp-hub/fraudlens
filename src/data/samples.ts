import { SampleSubmission } from '../types/analysis';

export const SAMPLE_SUBMISSIONS: SampleSubmission[] = [
  {
    id: 'sample-phish-paypal',
    title: 'PayPal Impersonation Link',
    category: 'Brand Phishing',
    type: 'url',
    value: 'https://paypal-security-update-account.top/login/verify?ref=urgent_notice',
    previewNote: 'Imitates PayPal with misleading subdomain and .top TLD',
    expectedRisk: 'high_risk',
    sampleDescription: 'A classic credential-harvesting link received via email pretending your account has been temporarily restricted.'
  },
  {
    id: 'sample-delivery-smishing',
    title: 'Postal Delivery Redelivery Fee',
    category: 'Smishing',
    type: 'url',
    value: 'http://usps-parcel-redelivery-fee.xyz/tracking/redeliver',
    previewNote: 'Fake parcel redelivery scam asking for small $1.85 fee',
    expectedRisk: 'high_risk',
    sampleDescription: 'Received as an SMS text claiming an undelivered parcel is awaiting dispatch upon credit card fee payment.'
  },
  {
    id: 'sample-crypto-giveaway',
    title: 'Crypto Double-Your-Money Bot',
    category: 'Financial Scam',
    type: 'url',
    value: 'https://elon-tesla-giveaway-airdrop.live/claim-btc',
    previewNote: 'Promises guaranteed 200% return on crypto deposits',
    expectedRisk: 'high_risk',
    sampleDescription: 'Common social media scam impersonating high-profile figures promising to multiply sent cryptocurrency.'
  },
  {
    id: 'sample-shortened-url',
    title: 'Obfuscated Shortened Link',
    category: 'URL Obfuscation',
    type: 'url',
    value: 'https://tinyurl.com/bank-urgent-reset-902',
    previewNote: 'Hides true destination behind public redirect service',
    expectedRisk: 'suspicious',
    sampleDescription: 'A shortened URL sent in a message without destination context, concealing the final target website.'
  },
  {
    id: 'sample-legit-wikipedia',
    title: 'Wikipedia Cybersecurity Guide',
    category: 'Legitimate Website',
    type: 'url',
    value: 'https://www.wikipedia.org/wiki/Computer_security',
    previewNote: 'Official Wikipedia educational reference article',
    expectedRisk: 'clean',
    sampleDescription: 'Established global educational foundation domain with legitimate SSL and trusted registrar history.'
  },
  {
    id: 'sample-legit-github',
    title: 'GitHub Official Repository',
    category: 'Legitimate Website',
    type: 'url',
    value: 'https://github.com/torvalds/linux',
    previewNote: 'Verified repository on github.com',
    expectedRisk: 'clean',
    sampleDescription: 'Authentic developer platform repository belonging to standard verified domain.'
  }
];
