import { Suspense } from 'react';

import MainContent from '@/components/MainContent';

export default function MainPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MainContent />
    </Suspense>
  );
}
