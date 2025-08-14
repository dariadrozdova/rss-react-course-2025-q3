'use client';

import Image from 'next/image';

import favicon from '@/app/favicon.svg';
import { cn } from '@/utils/cn';

function AboutPage() {
  return (
    <div
      className={cn(`theme-card p-6 rounded-lg shadow-md
        text-center flex flex-col items-center justify-start
        w-full box-border font-['Inter']
        min-h-[1016px]`)}
    >
      <div className={cn('max-w-4xl w-full py-6 md:py-10')}>
        <Image
          alt="App Logo"
          className={cn('mb-6 mx-auto')}
          height={96}
          src={favicon}
          width={96}
        />

        <h1
          className={cn(
            'text-4xl lg:text-5xl font-bold mb-8 text-theme-primary'
          )}
        >
          About This App
        </h1>

        <div className={cn('space-y-6 mb-10')}>
          <h2
            className={cn(
              'text-2xl lg:text-3xl font-semibold text-theme-primary'
            )}
          >
            App Overview
          </h2>
          <p
            className={cn(
              'text-lg leading-relaxed max-w-prose mx-auto text-theme-secondary'
            )}
          >
            This is a Pokémon Explorer application, built as part of the{' '}
            <a
              className={cn('text-green-600 hover:underline font-semibold')}
              href="https://rs.school/courses/reactjs"
              rel="noopener noreferrer"
              target="_blank"
            >
              RS School React Course
            </a>
            . It allows users to search for Pokémon by name, view their details,
            and see their images, all powered by the Pokémon API.
          </p>
        </div>

        <div className={cn('space-y-6 mb-10')}>
          <h2
            className={cn(
              'text-2xl lg:text-3xl font-semibold text-theme-primary'
            )}
          >
            Author
          </h2>
          <p className={cn('text-xl font-medium text-theme-primary')}>
            Daria Tkachenko
          </p>
          <p className={cn('text-lg')}>
            <a
              className={cn('text-green-600 hover:underline font-semibold')}
              href="https://github.com/dariadrozdova"
              rel="noopener noreferrer"
              target="_blank"
            >
              GitHub Profile
            </a>
          </p>
        </div>

        <div className={cn('space-y-6')}>
          <h2
            className={cn(
              'text-2xl lg:text-3xl font-semibold text-theme-primary'
            )}
          >
            The Course
          </h2>
          <p
            className={cn(
              'text-lg leading-relaxed max-w-prose mx-auto text-theme-secondary'
            )}
          >
            This project is a practical assignment from the{' '}
            <a
              className={cn('text-green-600 hover:underline font-semibold')}
              href="https://rs.school/courses/reactjs"
              rel="noopener noreferrer"
              target="_blank"
            >
              RS School React Course
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}

export default AboutPage;
