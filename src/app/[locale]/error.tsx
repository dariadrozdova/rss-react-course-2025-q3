'use client';

import { useTranslations } from 'next-intl';
import { useEffect } from 'react';

import Button from '@/components/Button';
import { classNames } from '@/utils/classNames';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  const t = useTranslations('ErrorPage');

  useEffect(() => {
    console.warn('An unexpected error occurred:', error);
  }, [error]);

  return (
    <div
      className={classNames(
        'flex flex-col items-center justify-center w-full min-h-[80vh] p-5 text-center font-sans',
        'bg-error-background border-2 border-error-border rounded-lg',
        'shadow-md shadow-black-alpha-10'
      )}
    >
      <h1
        className={classNames('text-error-text-dark text-[2.5em] mb-[0.9em]')}
      >
        {t('title')}
      </h1>
      <p
        className={classNames(
          'text-error-text-medium text-[1.2em] mb-[1.56em] max-w-xl leading-relaxed'
        )}
      >
        {t('description')}
      </p>
      <Button
        className={classNames(
          'px-6 py-3 rounded-lg text-[1.1em] normal-case',
          'shadow-md shadow-black-alpha-15 hover:-translate-y-0.5 active:shadow-black-alpha-15'
        )}
        color="green"
        onClick={reset}
      >
        {t('button')}
      </Button>
    </div>
  );
}
