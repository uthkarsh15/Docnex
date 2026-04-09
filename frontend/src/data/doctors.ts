/**
 * AIIMS India Doctor Database — All Major Campuses
 * Expanded dataset covering AIIMS hospitals across India.
 */

export interface AIIMSDoctor {
  id: number;
  name: string;
  department: string;
  specialization: string[];
  hospital: string;
  location: string;
  designation: string;
  availability: string;
  opd: string;
  contact: string;
  fallback?: boolean;
}

export const AIIMS_DOCTORS: AIIMSDoctor[] = [

  // ── AIIMS NEW DELHI ──────────────────────────────────────
  {
    id: 1,
    name: "Dr. Randeep Guleria",
    department: "Pulmonology & Internal Medicine",
    specialization: ["respiratory", "pulmonology", "lungs", "TB", "tuberculosis", "breathing", "COPD", "asthma", "internal medicine"],
    hospital: "AIIMS New Delhi",
    location: "Ansari Nagar, New Delhi — 110029",
    designation: "Former Director, AIIMS New Delhi",
    availability: "Mon, Wed, Fri — 9AM to 1PM",
    opd: "OPD Block, Room 12",
    contact: "011-26588500"
  },
  {
    id: 2,
    name: "Dr. Shrinivas Narayan",
    department: "Cardiology",
    specialization: ["heart", "cardiology", "cardiac", "chest pain", "ECG", "blood pressure", "hypertension", "arrhythmia", "heart failure"],
    hospital: "AIIMS New Delhi",
    location: "Ansari Nagar, New Delhi — 110029",
    designation: "Head of Cardiology",
    availability: "Tue, Thu — 10AM to 2PM",
    opd: "Cardiology OPD, Room 5",
    contact: "011-26588500"
  },
  {
    id: 3,
    name: "Dr. Deepak Agrawal",
    department: "Neurosurgery",
    specialization: ["brain", "neurology", "neurosurgery", "spine", "seizures", "headache", "nervous system", "stroke", "paralysis", "epilepsy"],
    hospital: "AIIMS New Delhi",
    location: "Ansari Nagar, New Delhi — 110029",
    designation: "Professor, Neurosurgery",
    availability: "Mon, Thu — 8AM to 12PM",
    opd: "Neurosciences Block, Room 3",
    contact: "011-26588500"
  },
  {
    id: 4,
    name: "Dr. Rajesh Malhotra",
    department: "Orthopaedics",
    specialization: ["bones", "joints", "orthopaedics", "fracture", "spine", "knee", "hip", "musculoskeletal", "arthritis", "ligament"],
    hospital: "AIIMS New Delhi",
    location: "Ansari Nagar, New Delhi — 110029",
    designation: "Chief, Orthopaedics",
    availability: "Mon, Tue, Fri — 9AM to 12PM",
    opd: "Orthopaedics OPD, Room 15",
    contact: "011-26588500"
  },
  {
    id: 5,
    name: "Dr. Sushma Bhatnagar",
    department: "Oncology & Palliative Care",
    specialization: ["cancer", "oncology", "tumour", "chemotherapy", "palliative", "malignancy", "lymphoma", "leukaemia", "biopsy"],
    hospital: "AIIMS New Delhi",
    location: "Ansari Nagar, New Delhi — 110029",
    designation: "Head of Palliative Care",
    availability: "Mon, Wed — 9AM to 1PM",
    opd: "BRA Cancer Block, Room 2",
    contact: "011-26588500"
  },
  {
    id: 6,
    name: "Dr. Sandeep Mathur",
    department: "Endocrinology & Metabolism",
    specialization: ["diabetes", "thyroid", "hormones", "endocrinology", "metabolism", "insulin", "sugar", "HbA1c", "hypothyroid", "hyperthyroid"],
    hospital: "AIIMS New Delhi",
    location: "Ansari Nagar, New Delhi — 110029",
    designation: "Professor, Endocrinology",
    availability: "Tue, Fri — 9AM to 12PM",
    opd: "Endocrinology OPD, Room 9",
    contact: "011-26588500"
  },
  {
    id: 7,
    name: "Dr. Pramod Garg",
    department: "Gastroenterology",
    specialization: ["stomach", "digestive", "gastroenterology", "liver", "IBD", "gut", "abdomen", "hepatitis", "cirrhosis", "pancreatitis"],
    hospital: "AIIMS New Delhi",
    location: "Ansari Nagar, New Delhi — 110029",
    designation: "Head of Gastroenterology",
    availability: "Mon, Thu — 10AM to 1PM",
    opd: "GI Block, Room 6",
    contact: "011-26588500"
  },
  {
    id: 8,
    name: "Dr. Vishal Sharma",
    department: "Nephrology",
    specialization: ["kidney", "nephrology", "dialysis", "renal", "urine", "urinary tract", "creatinine", "proteinuria", "kidney failure"],
    hospital: "AIIMS New Delhi",
    location: "Ansari Nagar, New Delhi — 110029",
    designation: "Professor, Nephrology",
    availability: "Wed, Sat — 9AM to 12PM",
    opd: "Nephrology OPD, Room 11",
    contact: "011-26588500"
  },

  // ── AIIMS MUMBAI ─────────────────────────────────────────
  {
    id: 9,
    name: "Dr. Priya Tiwari",
    department: "Haematology",
    specialization: ["blood", "haematology", "anaemia", "platelet", "WBC", "RBC", "haemoglobin", "bleeding", "clotting", "thalassemia"],
    hospital: "AIIMS Mumbai",
    location: "Marol, Andheri East, Mumbai — 400093",
    designation: "Head of Haematology",
    availability: "Mon, Wed, Fri — 9AM to 1PM",
    opd: "Haematology OPD, Block B",
    contact: "022-61919191"
  },
  {
    id: 10,
    name: "Dr. Suresh Advani",
    department: "Medical Oncology",
    specialization: ["cancer", "oncology", "chemotherapy", "tumour", "breast cancer", "lung cancer", "colon cancer", "malignancy"],
    hospital: "AIIMS Mumbai",
    location: "Marol, Andheri East, Mumbai — 400093",
    designation: "Senior Oncologist",
    availability: "Tue, Thu, Sat — 10AM to 2PM",
    opd: "Oncology OPD, Block C",
    contact: "022-61919191"
  },

  // ── AIIMS BHOPAL ─────────────────────────────────────────
  {
    id: 11,
    name: "Dr. Amit Agarwal",
    department: "Cardiology",
    specialization: ["heart", "cardiology", "cardiac", "angioplasty", "bypass", "pacemaker", "ECG", "chest pain", "heart failure"],
    hospital: "AIIMS Bhopal",
    location: "Saket Nagar, Bhopal, Madhya Pradesh — 462020",
    designation: "Associate Professor, Cardiology",
    availability: "Mon, Wed, Fri — 9AM to 1PM",
    opd: "Cardiology OPD, Room 3",
    contact: "0755-2672335"
  },
  {
    id: 12,
    name: "Dr. Seema Sharma",
    department: "Gynaecology & Obstetrics",
    specialization: ["gynaecology", "obstetrics", "women health", "pregnancy", "fertility", "PCOS", "menstrual", "reproductive", "menopause"],
    hospital: "AIIMS Bhopal",
    location: "Saket Nagar, Bhopal, Madhya Pradesh — 462020",
    designation: "Professor, Gynaecology",
    availability: "Tue, Thu — 10AM to 1PM",
    opd: "Maternity Block, Room 4",
    contact: "0755-2672335"
  },

  // ── AIIMS JODHPUR ─────────────────────────────────────────
  {
    id: 13,
    name: "Dr. Mahendra Singh",
    department: "Pulmonology",
    specialization: ["lungs", "respiratory", "asthma", "COPD", "pulmonology", "bronchitis", "pneumonia", "breathing", "TB", "chest"],
    hospital: "AIIMS Jodhpur",
    location: "Basni Industrial Area, Jodhpur, Rajasthan — 342005",
    designation: "Professor, Pulmonology",
    availability: "Mon, Thu — 9AM to 12PM",
    opd: "Respiratory OPD, Room 7",
    contact: "0291-2740741"
  },
  {
    id: 14,
    name: "Dr. Nisha Bhati",
    department: "Dermatology",
    specialization: ["skin", "dermatology", "rash", "eczema", "psoriasis", "acne", "allergy", "fungal", "hair loss", "vitiligo"],
    hospital: "AIIMS Jodhpur",
    location: "Basni Industrial Area, Jodhpur, Rajasthan — 342005",
    designation: "Assistant Professor, Dermatology",
    availability: "Tue, Fri — 9AM to 1PM",
    opd: "Dermatology OPD, Room 2",
    contact: "0291-2740741"
  },

  // ── AIIMS RISHIKESH ───────────────────────────────────────
  {
    id: 15,
    name: "Dr. Ravindra Kumar",
    department: "Neurology",
    specialization: ["brain", "neurology", "stroke", "epilepsy", "migraine", "Parkinson", "dementia", "neuropathy", "vertigo", "nervous system"],
    hospital: "AIIMS Rishikesh",
    location: "Virbhadra Road, Rishikesh, Uttarakhand — 249203",
    designation: "Professor, Neurology",
    availability: "Mon, Wed, Fri — 9AM to 1PM",
    opd: "Neurology OPD, Block A",
    contact: "0135-2462900"
  },
  {
    id: 16,
    name: "Dr. Pooja Ramola",
    department: "Psychiatry",
    specialization: ["mental health", "psychiatry", "depression", "anxiety", "schizophrenia", "bipolar", "stress", "insomnia", "OCD", "PTSD"],
    hospital: "AIIMS Rishikesh",
    location: "Virbhadra Road, Rishikesh, Uttarakhand — 249203",
    designation: "Associate Professor, Psychiatry",
    availability: "Tue, Thu — 10AM to 1PM",
    opd: "Psychiatry OPD, Block B",
    contact: "0135-2462900"
  },

  // ── AIIMS PATNA ───────────────────────────────────────────
  {
    id: 17,
    name: "Dr. Umesh Prasad",
    department: "Gastroenterology",
    specialization: ["liver", "stomach", "gastroenterology", "hepatitis", "jaundice", "IBD", "ulcer", "gut", "digestive", "cirrhosis"],
    hospital: "AIIMS Patna",
    location: "Phulwarisharif, Patna, Bihar — 801507",
    designation: "Professor, Gastroenterology",
    availability: "Mon, Wed — 9AM to 12PM",
    opd: "GI OPD, Room 5",
    contact: "0612-2451070"
  },
  {
    id: 18,
    name: "Dr. Meena Kumari",
    department: "Paediatrics",
    specialization: ["children", "paediatrics", "infant", "child health", "vaccination", "growth", "neonatal", "fever child", "malnutrition"],
    hospital: "AIIMS Patna",
    location: "Phulwarisharif, Patna, Bihar — 801507",
    designation: "Professor, Paediatrics",
    availability: "Tue, Thu, Sat — 9AM to 12PM",
    opd: "Paediatrics OPD, Room 8",
    contact: "0612-2451070"
  },

  // ── AIIMS BHUBANESWAR ─────────────────────────────────────
  {
    id: 19,
    name: "Dr. Subrat Nanda",
    department: "Ophthalmology",
    specialization: ["eyes", "ophthalmology", "vision", "cataract", "glaucoma", "retina", "diabetic retinopathy", "eye infection", "cornea"],
    hospital: "AIIMS Bhubaneswar",
    location: "Sijua, Patrapada, Bhubaneswar, Odisha — 751019",
    designation: "Professor, Ophthalmology",
    availability: "Mon, Wed, Fri — 9AM to 1PM",
    opd: "Eye OPD, Block D",
    contact: "0674-2476789"
  },
  {
    id: 20,
    name: "Dr. Lipika Lipi",
    department: "ENT",
    specialization: ["ear", "nose", "throat", "ENT", "hearing loss", "sinusitis", "tonsils", "vertigo", "nasal", "throat infection"],
    hospital: "AIIMS Bhubaneswar",
    location: "Sijua, Patrapada, Bhubaneswar, Odisha — 751019",
    designation: "Associate Professor, ENT",
    availability: "Tue, Thu — 9AM to 12PM",
    opd: "ENT OPD, Block E",
    contact: "0674-2476789"
  }
];

/* ──────────────────────────────────────────────
   Legacy Doctor interface & DOCTORS_DB
   Used by BookAppointment.tsx and PatientDashboard.tsx
   DO NOT REMOVE — keeps existing pages working.
   ────────────────────────────────────────────── */
export interface Doctor {
  userId: string;
  fullName: string;
  specialization: string;
  experienceYears: number;
  consultationFee: number;
  location: string;
  bio: string;
  isVerified: boolean;
  rating: number;
  available: boolean;
  imageUrl?: string;
}

export const DOCTORS_DB: Doctor[] = [
  {
    userId: 'doc-cardio-1',
    fullName: 'Dr. Sarah Jenkins',
    specialization: 'Cardiologist',
    experienceYears: 15,
    consultationFee: 120,
    location: 'Central Medical Plaza, NY',
    bio: 'Board-certified cardiologist specializing in interventional cardiology and heart failure management.',
    isVerified: true,
    rating: 4.9,
    available: true,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBMiONSUBhXuPiLxNnIa7896LpTkNfjF85dSMAGQKI62xXuTFC1kyumk2_1-F71WSlUwlFfKPchvnUCWZLqiw0eW7jNm1-Yk8naLydUjFuDDzxfqE1L70A5Xr9ZMvlLFoPFFpjBRNTyPgW595bO_3k0pJhFF9TqDUDRQfwyHmlY0rV47Je5DLwwYgT_bs6o56zuw4RUvlneKJmFWkWKYa55td7NkLkuWABh74bHPVLB1D00vKiGYG49b3rFTjzNLBZyiIU9bimObNg'
  },
  {
    userId: 'doc-cardio-2',
    fullName: 'Dr. Michael Chen',
    specialization: 'Cardiologist',
    experienceYears: 12,
    consultationFee: 110,
    location: 'Eastside Heart Center, NY',
    bio: 'Expert in cardiac imaging and preventive cardiovascular medicine.',
    isVerified: true,
    rating: 4.7,
    available: true,
  },
  {
    userId: 'doc-neuro-1',
    fullName: 'Dr. Emily Rodriguez',
    specialization: 'Neurologist',
    experienceYears: 18,
    consultationFee: 150,
    location: 'Neuro Health Institute, NY',
    bio: 'Fellowship-trained neurologist with expertise in stroke and neurodegenerative disorders.',
    isVerified: true,
    rating: 4.8,
    available: true,
  },
  {
    userId: 'doc-gp-1',
    fullName: 'Dr. Thomas Brown',
    specialization: 'General Physician',
    experienceYears: 22,
    consultationFee: 80,
    location: 'Family Health Practice, NY',
    bio: 'Experienced general practitioner providing comprehensive primary care.',
    isVerified: true,
    rating: 4.8,
    available: true,
  },
];
