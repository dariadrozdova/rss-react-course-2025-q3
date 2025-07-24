function Loader() {
  return (
    <div
      aria-live="polite"
      className="
      flex flex-col items-center justify-center gap-[15px] p-[30px] box-border w-full max-w-[700px] mx-auto text-center
      "
      role="status"
    >
      <div
        className="
          border-[4px] border-[hsla(0,0%,0%,0.1)] border-t-[4px] border-t-[hsl(187,100%,38%)]
          rounded-full w-10 h-10
          sm:border-[5px] sm:w-[50px] sm:h-[50px]
          animate-spin
        "
      />
      <p>Loading Pokemon...</p>
    </div>
  );
}

export default Loader;
