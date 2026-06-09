// src/lib/firestore.ts
import {
  collection, doc, addDoc, updateDoc, deleteDoc,
  getDocs, getDoc, query, orderBy, where, limit,
  serverTimestamp, increment, Timestamp
} from 'firebase/firestore';
import { db } from './firebase';

// ─── Types ────────────────────────────────────────────────────

export interface Project {
  id?: string;
  title: string;
  category: string;
  description: string;
  tags: string[];
  status: 'live' | 'draft' | 'archived';
  coverImage?: string;
  githubUrl?: string;
  demoUrl?: string;
  featured: boolean;
  order: number;
  techStack: string[];
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface Article {
  id?: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  category: string;
  tags: string[];
  status: 'draft' | 'published';
  coverImage?: string;
  readTime?: string;
  seoTitle?: string;
  seoDescription?: string;
  views: number;
  featured: boolean;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
  publishedAt?: Timestamp;
}

export interface Skill {
  id?: string;
  name: string;
  category: string;
  level: number; // 0-100
  order: number;
}

export interface Certification {
  id?: string;
  name: string;
  issuer: string;
  level: string;
  year: string;
  credentialId?: string;
  credentialUrl?: string;
  imageUrl?: string;
  color: string;
  order: number;
}

export interface Testimonial {
  id?: string;
  name: string;
  role: string;
  company: string;
  text: string;
  avatarUrl?: string;
  featured: boolean;
  order: number;
  createdAt?: Timestamp;
}

export interface ContactRequest {
  id?: string;
  name: string;
  email: string;
  type: string;
  message: string;
  status: 'new' | 'read' | 'replied';
  createdAt?: Timestamp;
}

export interface MentorshipApplication {
  id?: string;
  name: string;
  email: string;
  plan: string;
  background: string;
  goals: string;
  status: 'pending' | 'approved' | 'declined';
  createdAt?: Timestamp;
}

export interface ProfileData {
  id?: string;
  name: string;
  title: string;
  tagline: string;
  bio: string;
  email: string;
  phone: string;
  location: string;
  linkedinUrl: string;
  githubUrl: string;
  twitterUrl?: string;
  instagramUrl?: string;
  avatarUrl?: string;
  yearsExp: number;
  projectsCount: number;
  mentoredCount: number;
  githubUsername: string;
  availableForWork: boolean;
  resumeUrl?: string;
}

export interface NewsletterSubscriber {
  id?: string;
  email: string;
  name?: string;
  subscribedAt?: Timestamp;
  active: boolean;
}

// ─── Profile ─────────────────────────────────────────────────

export async function getProfile(): Promise<ProfileData | null> {
  const ref = doc(db, 'config', 'profile');
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as ProfileData;
}

export async function saveProfile(data: Partial<ProfileData>): Promise<void> {
  const ref = doc(db, 'config', 'profile');
  await updateDoc(ref, { ...data, updatedAt: serverTimestamp() }).catch(async () => {
    // doc doesn't exist, create it
    const { setDoc } = await import('firebase/firestore');
    await setDoc(ref, { ...data, createdAt: serverTimestamp() });
  });
}

// ─── Projects ────────────────────────────────────────────────

export async function getProjects(publishedOnly = false): Promise<Project[]> {
  const col = collection(db, 'projects');
  const q = publishedOnly
    ? query(col, where('status', '==', 'live'), orderBy('order'))
    : query(col, orderBy('order'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Project));
}

export async function getProject(id: string): Promise<Project | null> {
  const snap = await getDoc(doc(db, 'projects', id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as Project;
}

export async function createProject(data: Omit<Project, 'id'>): Promise<string> {
  const ref = await addDoc(collection(db, 'projects'), {
    ...data, createdAt: serverTimestamp(), updatedAt: serverTimestamp()
  });
  return ref.id;
}

export async function updateProject(id: string, data: Partial<Project>): Promise<void> {
  await updateDoc(doc(db, 'projects', id), { ...data, updatedAt: serverTimestamp() });
}

export async function deleteProject(id: string): Promise<void> {
  await deleteDoc(doc(db, 'projects', id));
}

// ─── Articles ────────────────────────────────────────────────

export async function getArticles(publishedOnly = false): Promise<Article[]> {
  const col = collection(db, 'articles');
  const q = publishedOnly
    ? query(col, where('status', '==', 'published'), orderBy('publishedAt', 'desc'))
    : query(col, orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Article));
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const q = query(collection(db, 'articles'), where('slug', '==', slug), limit(1));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const d = snap.docs[0];
  return { id: d.id, ...d.data() } as Article;
}

export async function createArticle(data: Omit<Article, 'id'>): Promise<string> {
  const ref = await addDoc(collection(db, 'articles'), {
    ...data, views: 0, createdAt: serverTimestamp(), updatedAt: serverTimestamp()
  });
  return ref.id;
}

export async function updateArticle(id: string, data: Partial<Article>): Promise<void> {
  const update: Record<string, unknown> = { ...data, updatedAt: serverTimestamp() };
  if (data.status === 'published' && !data.publishedAt) {
    update.publishedAt = serverTimestamp();
  }
  await updateDoc(doc(db, 'articles', id), update);
}

export async function deleteArticle(id: string): Promise<void> {
  await deleteDoc(doc(db, 'articles', id));
}

export async function incrementArticleViews(id: string): Promise<void> {
  await updateDoc(doc(db, 'articles', id), { views: increment(1) });
}

// ─── Skills ──────────────────────────────────────────────────

export async function getSkills(): Promise<Skill[]> {
  const q = query(collection(db, 'skills'), orderBy('order'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Skill));
}

export async function createSkill(data: Omit<Skill, 'id'>): Promise<string> {
  const ref = await addDoc(collection(db, 'skills'), data);
  return ref.id;
}

export async function updateSkill(id: string, data: Partial<Skill>): Promise<void> {
  await updateDoc(doc(db, 'skills', id), data);
}

export async function deleteSkill(id: string): Promise<void> {
  await deleteDoc(doc(db, 'skills', id));
}

// ─── Certifications ──────────────────────────────────────────

export async function getCertifications(): Promise<Certification[]> {
  const q = query(collection(db, 'certifications'), orderBy('order'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Certification));
}

export async function createCertification(data: Omit<Certification, 'id'>): Promise<string> {
  const ref = await addDoc(collection(db, 'certifications'), data);
  return ref.id;
}

export async function updateCertification(id: string, data: Partial<Certification>): Promise<void> {
  await updateDoc(doc(db, 'certifications', id), data);
}

export async function deleteCertification(id: string): Promise<void> {
  await deleteDoc(doc(db, 'certifications', id));
}

// ─── Testimonials ─────────────────────────────────────────────

export async function getTestimonials(featuredOnly = false): Promise<Testimonial[]> {
  const q = featuredOnly
    ? query(collection(db, 'testimonials'), where('featured', '==', true), orderBy('order'))
    : query(collection(db, 'testimonials'), orderBy('order'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Testimonial));
}

export async function createTestimonial(data: Omit<Testimonial, 'id'>): Promise<string> {
  const ref = await addDoc(collection(db, 'testimonials'), {
    ...data, createdAt: serverTimestamp()
  });
  return ref.id;
}

export async function updateTestimonial(id: string, data: Partial<Testimonial>): Promise<void> {
  await updateDoc(doc(db, 'testimonials', id), data);
}

export async function deleteTestimonial(id: string): Promise<void> {
  await deleteDoc(doc(db, 'testimonials', id));
}

// ─── Contact Requests ─────────────────────────────────────────

export async function getContactRequests(): Promise<ContactRequest[]> {
  const q = query(collection(db, 'contacts'), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as ContactRequest));
}

export async function createContactRequest(data: Omit<ContactRequest, 'id' | 'status' | 'createdAt'>): Promise<void> {
  await addDoc(collection(db, 'contacts'), {
    ...data, status: 'new', createdAt: serverTimestamp()
  });
}

export async function updateContactStatus(id: string, status: ContactRequest['status']): Promise<void> {
  await updateDoc(doc(db, 'contacts', id), { status });
}

export async function deleteContactRequest(id: string): Promise<void> {
  await deleteDoc(doc(db, 'contacts', id));
}

// ─── Mentorship Applications ──────────────────────────────────

export async function getMentorshipApplications(): Promise<MentorshipApplication[]> {
  const q = query(collection(db, 'mentorship_applications'), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as MentorshipApplication));
}

export async function createMentorshipApplication(data: Omit<MentorshipApplication, 'id' | 'status' | 'createdAt'>): Promise<void> {
  await addDoc(collection(db, 'mentorship_applications'), {
    ...data, status: 'pending', createdAt: serverTimestamp()
  });
}

export async function updateMentorshipStatus(id: string, status: MentorshipApplication['status']): Promise<void> {
  await updateDoc(doc(db, 'mentorship_applications', id), { status });
}

// ─── Newsletter ───────────────────────────────────────────────

export async function subscribeNewsletter(email: string, name?: string): Promise<void> {
  // check for duplicate
  const q = query(collection(db, 'newsletter'), where('email', '==', email), limit(1));
  const snap = await getDocs(q);
  if (!snap.empty) return; // already subscribed
  await addDoc(collection(db, 'newsletter'), {
    email, name: name || '', active: true, subscribedAt: serverTimestamp()
  });
}

export async function getNewsletterSubscribers(): Promise<NewsletterSubscriber[]> {
  const q = query(collection(db, 'newsletter'), orderBy('subscribedAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as NewsletterSubscriber));
}

// ─── Analytics counters ───────────────────────────────────────

export async function getAnalytics(): Promise<Record<string, number>> {
  const snap = await getDoc(doc(db, 'config', 'analytics'));
  if (!snap.exists()) return {};
  return snap.data() as Record<string, number>;
}

export async function incrementPageView(page: string): Promise<void> {
  const { setDoc } = await import('firebase/firestore');
  const ref = doc(db, 'config', 'analytics');
  await updateDoc(ref, { [page]: increment(1), total: increment(1) }).catch(async () => {
    await setDoc(ref, { [page]: 1, total: 1 }, { merge: true });
  });
}
