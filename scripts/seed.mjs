#!/usr/bin/env node
/**
 * SEED SCRIPT — run once to populate your Firestore with initial data
 * 
 * Usage:
 *   1. Copy .env.local.example to .env.local and fill in your Firebase config
 *   2. npm install
 *   3. node scripts/seed.mjs
 */

import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { readFileSync } from 'fs';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: join(__dirname, '../.env.local') });

// ── Initialise Firebase Admin ─────────────────────────────────────────────
// For seeding you can use the Admin SDK with a service account JSON, OR
// simply set GOOGLE_APPLICATION_CREDENTIALS env var to your service-account path.
// Alternatively paste your web config and use the client SDK if you prefer.
let app;
try {
  app = initializeApp({
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  });
} catch (e) {
  // already initialised
  app = initializeApp({ projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID }, 'seed');
}

const db = getFirestore(app);

// ── Seed data ─────────────────────────────────────────────────────────────

const profile = {
  name: 'Olalekan Ogundimu',
  title: 'Full Stack Engineer & AWS Cloud Architect',
  tagline: 'Building the future of African tech',
  bio: "I'm a Full Stack Software Engineer and AWS Cloud Architect with 4+ years of experience building systems that scale. From Lagos to the global stage, I've architected platforms serving hundreds of thousands of users across healthcare, fintech, and education.",
  email: 'ogundimuolalekan55@gmail.com',
  phone: '+234 812 942 4016',
  location: 'Lagos, Nigeria',
  linkedinUrl: 'https://www.linkedin.com/in/olalekanogundimu',
  githubUrl: 'https://github.com/',
  instagramUrl: 'https://www.instagram.com/mr_sams01',
  twitterUrl: '',
  avatarUrl: '',
  yearsExp: 4,
  projectsCount: 50,
  mentoredCount: 2,
  githubUsername: '',
  availableForWork: true,
  resumeUrl: '',
};

const skills = [
  { name: 'React / Next.js', category: 'Frontend', level: 95, order: 0 },
  { name: 'TypeScript', category: 'Frontend', level: 92, order: 1 },
  { name: 'Tailwind CSS', category: 'Frontend', level: 90, order: 2 },
  { name: 'Node.js / Express', category: 'Backend', level: 93, order: 3 },
  { name: 'Python / FastAPI', category: 'Backend', level: 82, order: 4 },
  { name: 'GraphQL', category: 'Backend', level: 80, order: 5 },
  { name: 'EC2, ECS, Lambda', category: 'AWS Cloud', level: 92, order: 6 },
  { name: 'CloudFormation / CDK', category: 'AWS Cloud', level: 85, order: 7 },
  { name: 'RDS / DynamoDB', category: 'AWS Cloud', level: 88, order: 8 },
  { name: 'S3 / CloudFront', category: 'AWS Cloud', level: 90, order: 9 },
  { name: 'Docker / Kubernetes', category: 'DevOps', level: 87, order: 10 },
  { name: 'CI/CD Pipelines', category: 'DevOps', level: 90, order: 11 },
  { name: 'Terraform', category: 'DevOps', level: 82, order: 12 },
  { name: 'PostgreSQL / MySQL', category: 'Database', level: 88, order: 13 },
  { name: 'Redis', category: 'Database', level: 82, order: 14 },
];

const certifications = [
  { name: 'AWS Solutions Architect', issuer: 'Amazon Web Services', level: 'Professional', year: '2024', color: '#f5a623', order: 0, credentialId: '', credentialUrl: '', imageUrl: '' },
  { name: 'AWS Developer Associate', issuer: 'Amazon Web Services', level: 'Associate', year: '2023', color: '#00e5ff', order: 1, credentialId: '', credentialUrl: '', imageUrl: '' },
  { name: 'AWS Cloud Practitioner', issuer: 'Amazon Web Services', level: 'Foundational', year: '2022', color: '#00d68f', order: 2, credentialId: '', credentialUrl: '', imageUrl: '' },
];

async function seed() {
  console.log('🌱 Seeding Firestore...\n');

  // Profile
  await db.collection('config').doc('profile').set(profile);
  console.log('✅ Profile saved');

  // Skills
  for (const skill of skills) {
    await db.collection('skills').add(skill);
  }
  console.log(`✅ ${skills.length} skills saved`);

  // Certifications
  for (const cert of certifications) {
    await db.collection('certifications').add(cert);
  }
  console.log(`✅ ${certifications.length} certifications saved`);

  console.log('\n🎉 Seed complete! Open your Admin Dashboard to add projects, articles, and more.');
  process.exit(0);
}

seed().catch(err => {
  console.error('Seed failed:', err);
  process.exit(1);
});
