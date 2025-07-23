import { useCallback, useState } from 'react';

import CardList from '@components/CardList';
import Loader from '@components/Loader';
import Search from '@components/Search';
import useLocalStorage from '@hooks/useLocalStorage';
import { usePokemonData } from '@hooks/usePokemonData';

function MainPage() {
  const [searchTerm, setSearchTerm] = useLocalStorage<string>(
    'lastSearchTerm',
    ''
  );

  const { error, isLoading, pokemonItems } = usePokemonData(searchTerm);

  const [throwError, setThrowError] = useState<boolean>(false);

  const handleSearch = useCallback(
    (newSearchTerm: string) => {
      setSearchTerm(newSearchTerm);
    },
    [setSearchTerm]
  );

  const triggerErrorState = useCallback(() => {
    setThrowError(true);
  }, []);

  if (throwError) {
    throw new Error('This is a test error thrown from the render method!');
  }

  return (
    <div
      className="
        flex flex-col min-h-screen
        p-[30px] pb-[70px]
        md:p-[20px] md:pb-[60px]
        lg:p-[30px] lg:pb-[70px]
        font-['Inter'] text-[hsl(200,25%,18%)]
        bg-gradient-to-br from-[hsl(187,72%,93%)] to-[hsl(187,71%,82%)]
        rounded-xl shadow-lg shadow-[hsla(0,0%,0%,0.15)]
        box-border relative
        w-full
      "
    >
      <section
        className="
          bg-white p-[25px] mb-[30px]
          rounded-lg shadow-md shadow-[hsla(0,0%,0%,0.1)]
          text-center flex flex-col items-center gap-[20px]
          box-border w-full
          md:p-[20px] md:mb-[20px]
        "
      >
        <Search initialSearchTerm={searchTerm} onSearch={handleSearch} />
      </section>

      <section
        className="
          flex-grow bg-white p-[30px]
          rounded-lg shadow-md shadow-[hsla(0,0%,0%,0.1)]
          flex flex-col items-center justify-center
          min-h-[250px] box-border w-full
          md:p-[20px] md:mb-[20px]
        "
      >
        {isLoading && <Loader />}

        {error && (
          <p
            className="
              text-[hsl(0,70%,39%)] bg-[hsl(0,100%,97%)]
              border border-[hsl(0,57%,76%)]
              p-[15px] rounded-md mt-[20px]
              font-semibold text-center w-full max-w-[550px]
              box-border
              md:p-[10px] md:text-[0.9em]
            "
          >
            Error: {error}
          </p>
        )}

        {!isLoading && !error && pokemonItems.length === 0 && (
          <p>No Pokemon found. Try a different search!</p>
        )}

        {!isLoading && !error && pokemonItems.length > 0 && (
          <CardList pokemonItems={pokemonItems} />
        )}
      </section>

      <button
        className="
          absolute bottom-[20px] right-[20px]
          p-[10px] px-[20px]
          bg-[hsl(1,84%,63%)] text-white
          border-none rounded-md text-base
          cursor-pointer
          transition-colors duration-200 ease-in-out
          transition-transform duration-100 ease-in-out
          shadow-sm shadow-[hsla(0,0%,0%,0.1)] z-10
          hover:bg-[hsl(0,70%,39%)] hover:-translate-y-px
          active:translate-y-0 active:shadow-xs
          md:bottom-[15px] md:right-[15px] md:p-[8px] md:px-[15px] md:text-[0.9em]
          lg:bottom-[20px] lg:right-[20px] lg:p-[10px] lg:px-[20px] lg:text-base
        "
        onClick={triggerErrorState}
      >
        Throw Test Error
      </button>
    </div>
  );
}

export default MainPage;
