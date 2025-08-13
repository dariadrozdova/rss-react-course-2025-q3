import { cn } from '@/utils/cn';

function Loader() {
  return (
    <div
      aria-live="polite"
      className={cn(
        `      flex flex-col items-center justify-center gap-[15px] p-[30px] box-border w-full max-w-2xl mx-auto text-center`
      )}
      role="status"
    >
      <div
        className={cn(`border-[4px] border-[hsla(0,0%,0%,0.1)] border-t-[4px] border-t-[var(--color-primary-green-light)]
          rounded-full w-10 h-10
          sm:border-[5px] sm:w-[50px] sm:h-[50px]
          animate-spin`)}
      />
      <p>Loading Pokemon...</p>
    </div>
  );
}

export default Loader;
