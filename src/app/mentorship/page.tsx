import { Metadata } from 'next';
import MentorshipClient from './MentorshipClient';
import PublicLayout from '@/components/layout/PublicLayout';

export const metadata: Metadata = {
  title: 'Mentorship',
  description: 'Join 3,000+ engineers mentored by Olalekan. 1-on-1 mentorship plans, courses, and career coaching.',
};

export default function MentorshipPage() {
  return (
    <PublicLayout>
      <MentorshipClient />
    </PublicLayout>
  );
}
