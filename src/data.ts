/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GovernmentScheme, DocumentChecklist, Complaint } from "./types";

export const GOVERNMENT_SCHEMES: GovernmentScheme[] = [
  {
    id: "pm-kisan",
    name: "Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)",
    category: "Agriculture",
    description: "An initiative by the Government of India that provides up to ₹6,000 per year in three equal installments as minimum income support to all small and marginal landholding farmer families.",
    eligibility: [
      "All small and marginal farmer families who hold cultivable land in their names.",
      "The landholding should be registered in the state land records.",
      "Excludes institutional landholders, income tax payers, and high-income professionals."
    ],
    benefits: "Direct income support of ₹6,000 per year, directly credited into the bank accounts of farmer families in three installments of ₹2,000 each."
  },
  {
    id: "ayushman-bharat",
    name: "Ayushman Bharat Pradhan Mantri Jan Arogya Yojana (AB-PMJAY)",
    category: "Healthcare",
    description: "The largest national health insurance scheme in the world, providing free access to healthcare providers for marginalized families.",
    eligibility: [
      "Families listed in the Socio-Economic Caste Census (SECC) 2011 database.",
      "Household with no adult member between ages 16 and 59.",
      "Landless households deriving major part of income from manual casual labor.",
      "Living in one-room houses with kucha walls and roof."
    ],
    benefits: "Cashless health cover of up to ₹5,000,000 (5 Lakhs) per family per year for secondary and tertiary care hospitalization across India."
  },
  {
    id: "pmay-urban",
    name: "Pradhan Mantri Awas Yojana - Urban (PMAY-U)",
    category: "Housing",
    description: "A flagship program of the Ministry of Housing and Urban Affairs that addresses urban housing shortage among the EWS/LIG and MIG categories.",
    eligibility: [
      "The beneficiary family should not own a pucca house in their name anywhere in India.",
      "Annual household income categories: EWS (up to ₹3 Lakh), LIG (₹3-6 Lakh), MIG-I (₹6-12 Lakh), MIG-II (₹12-18 Lakh).",
      "The house must be co-owned by a female member of the household, preferably."
    ],
    benefits: "Interest subsidy of up to 6.5% on home loans, or direct central assistance of ₹1.5 Lakh for house construction."
  },
  {
    id: "sukanya-samriddhi",
    name: "Sukanya Samriddhi Yojana (SSY)",
    category: "Women & Child",
    description: "A small deposit scheme for the girl child launched as a part of the 'Beti Bachao Beti Padhao' campaign to meet education and marriage expenses.",
    eligibility: [
      "Can be opened by a natural or legal guardian in the name of a girl child.",
      "The girl child must be under 10 years of age at the time of opening.",
      "Only one account per girl child, and a maximum of two accounts in a family (exceptions for twins)."
    ],
    benefits: "High government-backed interest rate (currently ~8.2%), full tax deduction under Section 80C, and maturity amount exempt from income tax."
  },
  {
    id: "pm-svanidhi",
    name: "PM Street Vendor’s AtmaNirbhar Nidhi (PM SVANidhi)",
    category: "Finance & Business",
    description: "A special micro-credit facility scheme to provide affordable working capital loans to street vendors to resume their livelihoods post COVID-19.",
    eligibility: [
      "Street vendors vending in urban areas on or before March 24, 2020.",
      "Vendors who possess a Certificate of Vending or Identity Card issued by Urban Local Bodies (ULBs)."
    ],
    benefits: "Initial working capital collateral-free loan of up to ₹10,000. Interest subsidy of 7% per annum on timely repayment, and eligibility for enhanced next-cycle loan of ₹20,000 and ₹50,000."
  },
  {
    id: "mudra-yojana",
    name: "Pradhan Mantri Mudra Yojana (PMMY)",
    category: "Finance & Business",
    description: "A scheme to provide loans up to ₹10 Lakh to non-corporate, non-farm small/micro enterprises.",
    eligibility: [
      "Any Indian citizen who has a business plan for a non-farm sector income-generating activity.",
      "Requires loans up to ₹10 Lakh for manufacturing, trading, or service sectors."
    ],
    benefits: "Collateral-free loans in three categories: Shishu (up to ₹50,000), Kishor (₹50,000 to ₹5 Lakh), and Tarun (₹5 Lakh to ₹10 Lakh) with minimal processing charges."
  },
  {
    id: "atal-pension",
    name: "Atal Pension Yojana (APY)",
    category: "Pension & Insurance",
    description: "A pension scheme focused on unorganized sector workers, encouraging them to save for their retirement voluntarily.",
    eligibility: [
      "All citizens of India aged between 18 and 40 years.",
      "Must have a savings bank account with a bank or post office.",
      "Must not be a member of any statutory social security scheme and not be an income taxpayer."
    ],
    benefits: "Guaranteed minimum monthly pension of ₹1,000, ₹2,000, ₹3,000, ₹4,000, or ₹5,000 after the age of 60, based on contributions made."
  },
  {
    id: "pm-ujjwala",
    name: "Pradhan Mantri Ujjwala Yojana (PMUY)",
    category: "Energy",
    description: "A scheme launched to safeguard the health of women and children by providing clean cooking fuel (LPG) to households in rural and deprived areas.",
    eligibility: [
      "Applicant must be a woman of age above 18 years.",
      "Must belong to an eligible BPL (Below Poverty Line) household or marginalized category.",
      "The household should not already have an LPG connection in anyone's name."
    ],
    benefits: "Free LPG connection with deposit-free cylinder, pressure regulator, safety hose, and gas stove assistance."
  },
  {
    id: "pmgky",
    name: "Pradhan Mantri Garib Kalyan Anna Yojana (PMGKAY)",
    category: "Food Security",
    description: "A food security welfare scheme under which the government provides free food grains to eligible marginalized citizens.",
    eligibility: [
      "All families covered under the National Food Security Act (NFSA).",
      "Antyodaya Anna Yojana (AAY) households and Priority Households (PHH) cards."
    ],
    benefits: "5 kg of free food grains (rice, wheat, or coarse grains) per person per month, in addition to the highly subsidized regular NFSA allocation."
  },
  {
    id: "pm-vishwakarma",
    name: "PM Vishwakarma Scheme",
    category: "Employment & Skill",
    description: "A scheme to support and empower traditional artisans and craftspeople who work with their hands and tools, preserving cultural heritage.",
    eligibility: [
      "An artisan or craftsperson working in one of the 18 family-based traditional trades (e.g., carpenter, blacksmith, potter, cobbler, tailor).",
      "Age of applicant should be 18 years or more. Only one member of a family is eligible."
    ],
    benefits: "Skill training up-gradation, tool kit incentive of ₹15,000, collateral-free credit support up to ₹3 Lakh (5% concessional interest rate), and marketing support."
  }
];

export const DOCUMENT_CHECKLISTS: DocumentChecklist[] = [
  {
    id: "passport",
    serviceName: "Passport (New/Reissue)",
    description: "Standard document requirements and steps to apply for a fresh Indian Passport.",
    documents: [
      "Proof of Date of Birth (Birth Certificate, Matriculation Certificate, or PAN Card)",
      "Proof of Present Address (Aadhaar Card, Water/Electricity bill, Rent Agreement, or active Bank Passbook with photo)",
      "Non-ECR Category proof, if eligible (10th Standard passing certificate or higher degree)"
    ],
    steps: [
      "Register on the official Passport Seva online portal (passportindia.gov.in).",
      "Fill out the online application form and pay the application fee (₹1,500 for normal, ₹3,500 for Tatkaal).",
      "Book an appointment at your nearest Passport Seva Kendra (PSK) or Post Office Passport Seva Kendra (POPSK).",
      "Attend the appointment with all original documents for verification, biometric capture, and photography.",
      "Undergo police verification at your local police station.",
      "Receive passport via Speed Post."
    ]
  },
  {
    id: "ration-card",
    serviceName: "Ration Card (New Card)",
    description: "Required documentation and procedure to obtain a new Ration Card for subsidized food grain distribution.",
    documents: [
      "Proof of Address (LPG Connection receipt, Electricity bill, or House tax receipt)",
      "Passport size photographs of all family members attested by a Gazetted Officer",
      "Age Proof of the Head of the Family (Birth certificate or School leaving certificate)",
      "Income Certificate of the entire family issued by the competent revenue authority",
      "Aadhaar card copies of all family members"
    ],
    steps: [
      "Download the application form from your State Food & Civil Supplies portal or visit the local Circle Office/FPS.",
      "Fill in the family details, attaching Aadhaar numbers and income credentials.",
      "Submit the form along with document photocopies.",
      "An Inspector from the Food Department will visit your house to verify family details.",
      "If approved, the Ration Card is issued within 15 to 30 days and can be collected from the circle office."
    ]
  },
  {
    id: "driving-license",
    serviceName: "Driving License (Permanent)",
    description: "Documentation checklist and application steps to transition from a Learner's License to a Permanent DL.",
    documents: [
      "Valid Learner's License (issued at least 30 days prior)",
      "Proof of Age (PAN Card, Passport, or Birth Certificate)",
      "Proof of Address (Aadhaar Card, Voter ID, or LIC Policy)",
      "Medical Certificate Form 1A (compulsory for applicants above 40 years or for transport vehicle licenses)",
      "Application Form 4 (generated online)"
    ],
    steps: [
      "Apply online on the Sarathi Parivahan portal (sarathi.parivahan.gov.in).",
      "Upload the required documents and Learner's License details.",
      "Pay the driving test and license fee (~₹1,000 depending on state and vehicle class).",
      "Book a slot for the physical driving skill test at your nearest RTO.",
      "Appear at the RTO with the test vehicle and pass the driving skill test under inspector supervision.",
      "Upon passing, the physical smart card license is sent to your registered address via post within 3 weeks."
    ]
  },
  {
    id: "pan-card",
    serviceName: "Permanent Account Number (PAN Card)",
    description: "Essential documents to apply for a PAN Card issued by the Income Tax Department.",
    documents: [
      "Proof of Identity (Aadhaar Card, Voter ID, Driving License, or Passport)",
      "Proof of Address (Aadhaar Card, Electricity/Water bill, Bank statement less than 3 months old)",
      "Proof of Date of Birth (Aadhaar Card, Matriculation certificate, PAN/Birth certificate)"
    ],
    steps: [
      "Visit the online NSDL (now Protean) or UTITSL e-Gov portal.",
      "Select Form 49A (for Indian Citizens) and fill in your personal details.",
      "Pay the processing fee (₹107 for physical card, ₹72 for e-PAN only).",
      "Authenticate via Aadhaar e-KYC using OTP (instant, paperless process) or print the acknowledgement and mail the documents to the NSDL office.",
      "The e-PAN is generated and emailed within 48 hours. The physical PAN card is delivered within 10-15 business days."
    ]
  },
  {
    id: "voter-id",
    serviceName: "Voter ID Card (Voter Enrollment)",
    description: "Process to register as a voter in the Electoral Roll and get a physical Electors Photo Identity Card (EPIC).",
    documents: [
      "Proof of Age (Aadhaar Card, Birth Certificate, 10th marksheet, or Driving License)",
      "Proof of Address (Aadhaar Card, Water/Gas/Electricity bill, Passport, or registered Rent Deed)",
      "One recent passport-size photograph"
    ],
    steps: [
      "Go to the National Voters' Service Portal (voters.eci.gov.in) or download the Voters Helpline App.",
      "Fill out Form 6 (Application for New Voter Registration).",
      "Upload your photo, age proof, and address proof.",
      "The Booth Level Officer (BLO) will visit your residence to verify the address and identity details.",
      "Once approved, your name is added to the electoral roll, and your physical voter card (EPIC) is sent to your home by post free of cost."
    ]
  },
  {
    id: "income-certificate",
    serviceName: "Income Certificate",
    description: "Documents required to obtain an official income certificate for educational scholarships or reservation criteria.",
    documents: [
      "Identity Proof (Aadhaar Card, Voter ID, or PAN Card)",
      "Address Proof (Aadhaar, Ration Card, or electricity bill)",
      "Income Proof (Salary slips, Form 16, or Income Tax Returns for salaried; Audit reports or affidavit for self-employed)",
      "Land ownership details (for agricultural income, Form 7/12 or 8A)"
    ],
    steps: [
      "Apply online on your state's 'e-District' portal or visit the local Tahsildar/Revenue Office / Common Service Center (CSC).",
      "Upload/Attach documents along with a self-declaration affidavit.",
      "The application goes to the local Revenue Inspector (Patwari/Talathi) for verification.",
      "Upon field verification and Patwari report, the Tahsildar issues the digitally signed Income Certificate (usually valid for 1 year). Process takes 7 to 15 days."
    ]
  }
];

// Seed complaints around New Delhi (28.6139, 77.2090)
export const SEED_COMPLAINTS: Complaint[] = [
  {
    id: "comp-101",
    category: "pothole",
    severity: "high",
    description: "Massive pothole in the middle of Karol Bagh main market road. Very dangerous for two-wheelers, already caused three minor slip-ups during evening rush hour.",
    photoUrl: "https://images.unsplash.com/photo-1515162305285-0293e4767cc2?auto=format&fit=crop&w=500&q=80",
    latitude: 28.6448,
    longitude: 77.1901,
    status: "open",
    upvoteCount: 18,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() // 3 days ago
  },
  {
    id: "comp-102",
    category: "garbage",
    severity: "medium",
    description: "Illegal garbage dump accumulation near Connaught Place Block E. Emitting a terrible smell and blocking half of the pedestrian sidewalk. Stray cattle gathering.",
    photoUrl: "https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&w=500&q=80",
    latitude: 28.6304,
    longitude: 77.2177,
    status: "in_progress",
    upvoteCount: 9,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() // 5 days ago
  },
  {
    id: "comp-103",
    category: "streetlight",
    severity: "low",
    description: "Streetlight is not working near India Gate outer circle pillar 14. The walkway gets extremely dark after 7 PM, creating safety concerns for women and evening walkers.",
    photoUrl: "https://images.unsplash.com/photo-1509024644558-2f56ce76c490?auto=format&fit=crop&w=500&q=80",
    latitude: 28.6129,
    longitude: 77.2295,
    status: "resolved",
    upvoteCount: 4,
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString() // 10 days ago
  },
  {
    id: "comp-104",
    category: "water_leak",
    severity: "high",
    description: "Main municipal water supply pipeline leakage in Sector 6, Dwarka, near the main gate of Shanti CGHS. Thousands of liters of drinking water wasted every morning.",
    photoUrl: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=500&q=80",
    latitude: 28.5823,
    longitude: 77.0500,
    status: "open",
    upvoteCount: 22,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() // 1 day ago
  },
  {
    id: "comp-105",
    category: "pothole",
    severity: "medium",
    description: "Multiple potholes appearing right at the entrance of Hauz Khas Village road. Causing heavy traffic congestion as cars have to stop and navigate slowly.",
    photoUrl: "https://images.unsplash.com/photo-1515162305285-0293e4767cc2?auto=format&fit=crop&w=500&q=80",
    latitude: 28.5494,
    longitude: 77.2001,
    status: "open",
    upvoteCount: 11,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() // 2 days ago
  },
  {
    id: "comp-106",
    category: "streetlight",
    severity: "medium",
    description: "Three consecutive streetlights have been blinking erratically and going pitch black near Lajpat Nagar II, Central Market road. Disturbing traffic visibility.",
    photoUrl: "https://images.unsplash.com/photo-1509024644558-2f56ce76c490?auto=format&fit=crop&w=500&q=80",
    latitude: 28.5677,
    longitude: 77.2433,
    status: "in_progress",
    upvoteCount: 6,
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString() // 4 days ago
  },
  {
    id: "comp-107",
    category: "garbage",
    severity: "high",
    description: "Massive piling up of wedding and restaurant waste in the narrow alleys of Chandni Chowk, near Gali Paranthe Wali. Extremely unhygienic and blocking path.",
    photoUrl: "https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&w=500&q=80",
    latitude: 28.6505,
    longitude: 77.2303,
    status: "open",
    upvoteCount: 45,
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString() // 8 hours ago
  },
  {
    id: "comp-108",
    category: "water_leak",
    severity: "medium",
    description: "Clogged sewage drain overflow on the street corner of Munirka DDA flats. Dirty sewer water spilling over to the pedestrian road, posing high health risk.",
    photoUrl: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=500&q=80",
    latitude: 28.5584,
    longitude: 77.1685,
    status: "resolved",
    upvoteCount: 15,
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString() // 8 days ago
  },
  {
    id: "comp-109",
    category: "other",
    severity: "low",
    description: "Damaged child play equipment (swing chain broken) at the Sector B park, Vasant Kunj. Safety hazard for toddlers using the swings.",
    photoUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=500&q=80",
    latitude: 28.5385,
    longitude: 77.1354,
    status: "in_progress",
    upvoteCount: 5,
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString() // 6 days ago
  },
  {
    id: "comp-110",
    category: "other",
    severity: "high",
    description: "Stray dog pack has become highly aggressive near Nehru Place Metro Station parking exit. They have chased down two delivery boys, immediate MCD intervention required.",
    photoUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=500&q=80",
    latitude: 28.5492,
    longitude: 77.2519,
    status: "open",
    upvoteCount: 34,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() // 1 day ago
  }
];
