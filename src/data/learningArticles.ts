export interface LearningArticle {
  id: string;
  title: string;
  category: string;
  readTime: string;
  summary: string;
  whatItIs: string;
  realWorldExample: string;
  warningSigns: string[];
  safetyChecklist: string[];
  immediateStepsIfTargeted: string[];
}

export const LEARNING_ARTICLES: LearningArticle[] = [
  {
    id: 'phishing-and-smishing',
    title: 'Phishing & Smishing: Deceptive Messages & Links',
    category: 'Communication Threats',
    readTime: '4 min read',
    summary: 'How criminals use fraudulent emails and SMS text messages to manipulate you into opening deceptive websites.',
    whatItIs: 'Phishing is a social engineering attack where attackers pretend to be trusted organizations (like your bank, tax agency, postal service, or subscription provider) to steal passwords, credit card numbers, or personal identity details.',
    realWorldExample: '"USPS: Your package could not be delivered due to an incomplete address. Update your shipping details within 12 hours at usps-address-update.xyz to avoid return to sender."',
    warningSigns: [
      'Artificial urgency demanding immediate action within a ticking clock (e.g. 12 or 24 hours)',
      'Threats of account suspension, legal penalties, or missed parcel deliveries',
      'Sender address does not match official domain (e.g., using random Gmail, Hotmail, or lookalike domains)',
      'Generic greetings like "Dear Customer" instead of your actual registered name',
      'Links that direct to unusual top-level domains such as .top, .live, .xyz, or .click'
    ],
    safetyChecklist: [
      'Never tap links inside unsolicited SMS text messages or unexpected emails.',
      'Navigate to the organization by opening a fresh browser tab and typing the verified web address yourself.',
      'Check tracking numbers directly on the official postal or courier website.',
      'Remember that legitimate organizations rarely require urgent credential verification by SMS.'
    ],
    immediateStepsIfTargeted: [
      'Do not click the link or reply to the text.',
      'Take a screenshot if you wish to report it, then delete the message.',
      'Forward suspicious SMS messages to your network provider fraud number (e.g. 7726 in many countries).'
    ]
  },
  {
    id: 'fake-websites',
    title: 'Fake Websites & Brand Impersonation',
    category: 'Web Security',
    readTime: '5 min read',
    summary: 'Recognize clone websites, typosquatted web addresses, and fraudulent login pages designed to look authentic.',
    whatItIs: 'Attackers create near-identical copies of legitimate websites (banks, social media, shopping carts, cloud storage) to trick you into entering your account login credentials or payment card details.',
    realWorldExample: 'A fraudulent login page with the official logo, colors, and layout of a major bank hosted on "secure-login-chasebank.info" rather than the official "chase.com".',
    warningSigns: [
      'Subtle spelling variations or extra words in the address (e.g. "paypal-security-center.com" instead of "paypal.com")',
      'The brand name appears in the subdomain while the actual domain is completely different (e.g. "apple.com.id-verify-portal.net")',
      'Substituted lookalike characters (such as the letter "l" replaced by number "1" or Cyrillic characters)',
      'Non-functional secondary links (privacy policy, terms, help links that lead nowhere or reload the same page)',
      'Broken images or slightly distorted logos copied from web searches'
    ],
    safetyChecklist: [
      'Look at the primary domain (the part right before the first single slash "/").',
      'Bookmark your most critical banking, email, and shopping websites.',
      'Use a reputable password manager—password managers will not autofill your credentials on a fake domain.',
      'Do not trust the padlock icon alone: over 80% of phishing sites today use free HTTPS certificates!'
    ],
    immediateStepsIfTargeted: [
      'Close the browser tab immediately without typing anything.',
      'If you already entered a password, immediately visit the genuine official website and change your password.',
      'Enable two-factor authentication (2FA) using an authenticator app.'
    ]
  },
  {
    id: 'fake-online-stores',
    title: 'Fake Online Stores & Counterfeit Retailers',
    category: 'E-Commerce Safety',
    readTime: '5 min read',
    summary: 'Spot fraudulent shopping sites offering unrealistic discounts, fake stock, and non-existent deliveries.',
    whatItIs: 'Fake online stores are scam websites built to capture money and credit card information for products that do not exist or are dangerous counterfeits.',
    realWorldExample: 'A store advertising luxury designer jackets or out-of-stock gaming consoles at 85% off retail prices, claiming to have "clearance liquidation inventory".',
    warningSigns: [
      'Prices that are too good to be true across all catalog items',
      'The domain name was registered only days or weeks ago',
      'The only accepted payment methods are direct bank transfers, peer-to-peer apps (Zelle, Venmo, CashApp), or cryptocurrency',
      'No physical business address, no phone number, or a fake address located in a residential area',
      'Copy-pasted "About Us" and "Privacy Policy" sections with generic placeholder text or typos'
    ],
    safetyChecklist: [
      'Research the store name on independent consumer review platforms before purchasing.',
      'Pay with a credit card or buyer-protected platform rather than debit cards, direct transfers, or gift cards.',
      'Verify the physical address using satellite map street views.',
      'Check whether the company is registered with official government trade registries.'
    ],
    immediateStepsIfTargeted: [
      'Contact your credit card issuer immediately to report unauthorized transactions and dispute charges.',
      'Request a cancellation and reissue of your payment card if details were entered.',
      'Monitor your statements closely for recurring micro-charges.'
    ]
  },
  {
    id: 'payment-scams',
    title: 'Payment Scams & Wire Fraud',
    category: 'Financial Safety',
    readTime: '4 min read',
    summary: 'Avoid overpayment schemes, fake refund checks, peer-to-peer payment fraud, and advance fee requests.',
    whatItIs: 'Payment scams involve tricking individuals into transferring non-reversible funds under false pretenses such as accidental overpayments, bogus lottery winnings, or fake job placement equipment funds.',
    realWorldExample: 'A buyer sends a screenshot of an apparent payment transfer and claims they accidentally sent $500 too much, demanding you refund the difference via Zelle.',
    warningSigns: [
      'Requests to send money using non-reversible transfer methods (cryptocurrency, wire transfers, retail gift cards)',
      'The buyer or seller insists on moving communication off the official platform (e.g. from eBay or Facebook Marketplace to WhatsApp)',
      'Claims that payment is "pending in escrow" until you pay an upfront processing or courier insurance fee',
      'Fake email receipts from payment platforms sent from generic email providers'
    ],
    safetyChecklist: [
      'Always log into your official banking or payment app directly to verify actual settled funds.',
      'Never send money back for an "overpayment" before the original transaction has permanently cleared.',
      'Keep all transaction chats and receipts within the official marketplace platform.'
    ],
    immediateStepsIfTargeted: [
      'Immediately notify your bank or payment platform fraud department.',
      'Preserve all message records, payment references, and phone numbers.',
      'File an official report with your national consumer protection agency.'
    ]
  },
  {
    id: 'qr-code-scams',
    title: 'QR Code Scams (Quishing)',
    category: 'Physical & Digital',
    readTime: '4 min read',
    summary: 'Understand how malicious QR codes replace legitimate ones in physical spaces and digital communications.',
    whatItIs: 'QR codes simply encode text or web addresses. Attackers stick fraudulent QR stickers over legitimate ones (on parking meters, restaurant menus, and bike shares) or embed them in emails to bypass email security scanners.',
    realWorldExample: 'A scammer places a fraudulent sticker over the official QR payment code on a city parking meter. Drivers scan it and are taken to a cloned payment page that steals credit card data.',
    warningSigns: [
      'A physical sticker placed over an existing printed sign or payment terminal',
      'An email containing no text links, only a QR code asking you to "scan to verify MFA"',
      'When scanned, the preview URL shows a strange or shortened domain rather than the municipal or company website',
      'The page prompts you to download an app (APK file) rather than opening a standard webpage'
    ],
    safetyChecklist: [
      'Inspect physical QR codes with your finger to check if a sticker is pasted over the original.',
      'Always preview the full web address before tapping to open it from your camera app.',
      'Never scan a QR code in an email asking you to verify login credentials or multi-factor authentication.',
      'Pay for parking or public services through official verified apps downloaded from official app stores.'
    ],
    immediateStepsIfTargeted: [
      'If you scanned a suspicious QR code, do not enter any credentials or card information.',
      'If you downloaded a file, do not open or install it, and delete it immediately.',
      'Alert venue staff or municipal operators if a physical sticker appears tampered with.'
    ]
  },
  {
    id: 'social-engineering',
    title: 'Social Engineering & Psychological Manipulation',
    category: 'Psychological Tactics',
    readTime: '5 min read',
    summary: 'The psychological levers attackers exploit: fear, greed, urgency, authority, and curiosity.',
    whatItIs: 'Social engineering targets human psychology rather than software vulnerabilities. Attackers manipulate people into making mistakes or voluntarily handing over confidential assets.',
    realWorldExample: 'An urgent phone call or message from someone claiming to be in your company\'s IT department instructing you to accept a two-factor push notification to fix a security issue.',
    warningSigns: [
      'High-pressure emotional demands ("You must act now or your account will be locked forever")',
      'Appeals to authority claiming to be law enforcement, bank fraud departments, or executive leadership',
      'Requests for secrecy ("Do not tell your family or branch staff because this is an internal investigation")',
      'Unsolicited offers of technical help for problems you never reported'
    ],
    safetyChecklist: [
      'Slow down. Urgency is the scammer\'s most effective weapon.',
      'Independently verify any urgent request through an established, separate contact method.',
      'Remember that your bank will NEVER ask you to move your money to a "safe account".',
      'Consult a trusted friend or colleague when a situation feels rushed or stressful.'
    ],
    immediateStepsIfTargeted: [
      'Disconnect immediately. You are never obligated to remain on a suspicious call or chat.',
      'Contact your organization or bank through the official phone number printed on the back of your card.'
    ]
  },
  {
    id: 'password-otp-theft',
    title: 'Password and OTP (One-Time Password) Theft',
    category: 'Credential Protection',
    readTime: '4 min read',
    summary: 'Why one-time verification codes must never be shared with anyone, including purported bank employees.',
    whatItIs: 'One-time passwords (OTPs) sent by SMS or generated in apps are the final barrier protecting your accounts. Attackers use real-time phishing proxies to trick you into supplying these codes.',
    realWorldExample: '"Hi, this is Chase Fraud Department. We detected a suspicious transfer of $2,000. To cancel this transfer, please read back the 6-digit code we just sent to your phone."',
    warningSigns: [
      'Anyone asking you to read back, forward, or enter a verification code over the phone or in chat',
      'Receiving unexpected OTP text messages when you did not initiate any login or transaction',
      'Messages stating: "Do not share this code with anyone. FraudLens code: 123456" where the person contacting you still asks for it'
    ],
    safetyChecklist: [
      'No legitimate bank, credit card company, or government agency will ever ask for your OTP.',
      'Carefully read the text accompanying the OTP: it specifies what action the code authorizes (e.g. "for a transfer of $500 to John").',
      'Switch from SMS-based 2FA to hardware keys (FIDO2 / YubiKey) or authenticator apps (Google Authenticator, Microsoft Authenticator) whenever available.'
    ],
    immediateStepsIfTargeted: [
      'If you shared an OTP, assume your account is compromised right now.',
      'Immediately log in to your account from another clean device and change your primary password.',
      'Call your bank fraud helpline immediately to freeze transfers and lock cards.'
    ]
  },
  {
    id: 'verify-official-websites',
    title: 'How to Verify Official Websites & Domains',
    category: 'Practical Skills',
    readTime: '6 min read',
    summary: 'A step-by-step masterclass on dissecting web addresses, subdomains, TLDs, and SSL certificates.',
    whatItIs: 'Understanding domain anatomy is the single most powerful defense against web deception.',
    realWorldExample: 'Distinguishing between "https://login.microsoftonline.com" (authentic) and "https://login.microsoftonline.com.account-recovery.biz" (fraudulent).',
    warningSigns: [
      'Confusion caused by extra subdomains preceding the actual root domain',
      'Use of hyphens to join reputable brand names with generic action terms (e.g., "bankofamerica-secure-login.com")',
      'Unusual port numbers at the end of the address (e.g., "example.com:8443")',
      'URLs displaying IP addresses directly (e.g., "http://192.168.1.1/login") instead of standard domain names'
    ],
    safetyChecklist: [
      'Find the first single forward slash "/" after the "http://" or "https://".',
      'Read backwards to the left until the domain suffix (like .com or .gov) and the word preceding it. That is the actual domain controlling the site.',
      'Verify government websites always end in their official TLD (such as .gov or .gov.uk). Scammers cannot purchase genuine .gov domains.',
      'Use the browser address bar zoom or tap to expand full URL strings on mobile devices.'
    ],
    immediateStepsIfTargeted: [
      'Double check spelling of the domain.',
      'Use FraudLens or official WHOIS lookup tools to inspect domain registration dates.'
    ]
  },
  {
    id: 'after-clicking-suspicious-link',
    title: 'Emergency Action Plan: What To Do After Clicking a Suspicious Link',
    category: 'Incident Response',
    readTime: '5 min read',
    summary: 'Clear, prioritized emergency checklist if you accidentally opened a suspect link or submitted details.',
    whatItIs: 'Mistakes happen. Taking the right actions within the first 10 minutes can prevent financial loss and identity theft.',
    realWorldExample: 'You clicked a parcel tracking link, typed your email and password, and suddenly realized the web address was suspicious.',
    warningSigns: [
      'Sudden device slowdown or unexpected browser pop-ups prompting installation of "security updates"',
      'New unrecognized login alert emails from your accounts',
      'Sudden loss of phone cellular signal (potential SIM swap attempt)'
    ],
    safetyChecklist: [
      'Step 1: Disconnect Internet (turn on Airplane mode or unplug Ethernet if you suspect malware download).',
      'Step 2: Change Compromised Passwords from a separate, secure device.',
      'Step 3: Revoke Active Sessions in your account security dashboard ("Sign out of all devices").',
      'Step 4: Contact your financial institutions if payment or banking details were exposed.',
      'Step 5: Run a full anti-malware scan using your operating system\'s built-in or trusted scanner.'
    ],
    immediateStepsIfTargeted: [
      'Do not panic. Focus on locking down payment cards and primary email accounts first.',
      'Place a credit freeze or fraud alert with credit reporting agencies if Social Security or national identity numbers were disclosed.'
    ]
  }
];
