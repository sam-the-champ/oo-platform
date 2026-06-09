import { Suspense } from 'react';
import PublicLayout from '@/components/layout/PublicLayout';
import HeroSection from '@/components/sections/HeroSection';
import AboutSection from '@/components/sections/AboutSection';
import SkillsSection from '@/components/sections/SkillsSection';
import CertificationsSection from '@/components/sections/CertificationsSection';
import ProjectsSection from '@/components/sections/ProjectsSection';
import TestimonialsSection from '@/components/sections/TestimonialsSection';
import ContactSection from '@/components/sections/ContactSection';
import NewsletterSection from '@/components/sections/NewsletterSection';
import VisionSection from '@/components/sections/VisionSection';
import { getProfile, getProjects, getSkills, getCertifications, getTestimonials } from '@/lib/firestore';

export default async function HomePage() {
  const [profile, projects, skills, certs, testimonials] = await Promise.all([
    getProfile(),
    getProjects(true),
    getSkills(),
    getCertifications(),
    getTestimonials(true),
  ]);

  return (
    <PublicLayout>
      <HeroSection profile={profile} />
      <AboutSection profile={profile} />
      <SkillsSection skills={skills} />
      <CertificationsSection certifications={certs} />
      <ProjectsSection projects={projects} />
      <TestimonialsSection testimonials={testimonials} />
      <VisionSection />
      <ContactSection />
      <NewsletterSection />
    </PublicLayout>
  );
}
