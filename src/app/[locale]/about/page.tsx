'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';

import favicon from '@/app/icon.svg';
import { classNames } from '@/utils/classNames';

const sectionClasses = 'space-y-6 mb-10';
const headingClasses = 'text-2xl lg:text-3xl font-semibold text-theme-primary';
const linkClasses = 'text-green-600 hover:underline font-semibold';

export default function AboutPage() {
  const t = useTranslations('AboutPage');
  const courseName = useTranslations('CourseNames')('rsSchoolReact');

  return (
    <div
      className={classNames(
        'theme-card p-6 rounded-lg shadow-md',
        'text-center flex flex-col items-center justify-start',
        'w-full box-border font-["Inter"] min-h-[64rem]'
      )}
    >
      <div className={classNames('max-w-4xl w-full py-6 md:py-10')}>
        <Image
          alt="App Logo"
          className={classNames('mb-6 mx-auto')}
          height={96}
          src={favicon}
          width={96}
        />

        <h1 className="text-4xl lg:text-5xl font-bold mb-8 text-theme-primary">
          {t('title')}
        </h1>

        <div className={classNames(sectionClasses)}>
          <h2 className={classNames(headingClasses)}>
            {t('overviewSection.title')}
          </h2>
          <p className="text-lg leading-relaxed max-w-prose mx-auto text-theme-secondary">
            {t.rich('overviewSection.text', {
              courseLink: (chunks) => (
                <a
                  className={classNames(linkClasses)}
                  href="https://rs.school/courses/reactjs"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {chunks}
                </a>
              ),
              courseName,
            })}
          </p>
        </div>

        <div className={classNames(sectionClasses)}>
          <h2 className={classNames(headingClasses)}>
            {t('authorSection.title')}
          </h2>
          <p className="text-xl font-medium text-theme-primary">
            Daria Tkachenko
          </p>
          <p className="text-lg">
            <a
              className={classNames(linkClasses)}
              href="https://github.com/dariadrozdova"
              rel="noopener noreferrer"
              target="_blank"
            >
              {t('authorSection.githubProfile')}
            </a>
          </p>
        </div>

        <div className="space-y-6">
          <h2 className={classNames(headingClasses)}>
            {t('courseSection.title')}
          </h2>
          <p className="text-lg leading-relaxed max-w-prose mx-auto text-theme-secondary">
            {t.rich('courseSection.text', {
              courseLink: (chunks) => (
                <a
                  className={classNames(linkClasses)}
                  href="https://rs.school/courses/reactjs"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {chunks}
                </a>
              ),
              courseName,
            })}
          </p>
        </div>
      </div>
    </div>
  );
}
