import { classNames } from '@/utils/classNames';

function Loader() {
  return (
    <div
      aria-live="polite"
      className={classNames(
        'flex flex-col items-center justify-center gap-4 p-8 box-border text-center',
        'w-full max-w-2xl mx-auto'
      )}
      role="status"
    >
      <div
        className={classNames(
          'border-4 border-[hsla(0,0%,0%,0.1)] border-t-4 border-t-[var(--color-primary-green-light)] rounded-full',
          'w-10 h-10',
          'sm:border-4 sm:w-12 sm:h-12',
          'animate-spin'
        )}
      />
      <p>Loading Pokemon...</p>
    </div>
  );
}

export default Loader;
