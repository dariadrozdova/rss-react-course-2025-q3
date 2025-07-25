import { PokemonContent } from '@components/PokemonContent';
import Search from '@components/Search';
import { usePaginationAndSearch } from '@hooks/usePaginationAndSearch';
import { usePokemonData } from '@hooks/usePokemonData';

const ITEMS_PER_PAGE = 20;

function MainPage() {
  const { currentPage, effectiveSearchTerm, handlePageChange, handleSearch } =
    usePaginationAndSearch();

  const { error, isLoading, pokemonItems, totalItems } = usePokemonData(
    effectiveSearchTerm,
    currentPage,
    ITEMS_PER_PAGE
  );

  const totalPages = totalItems ? Math.ceil(totalItems / ITEMS_PER_PAGE) : 0;

  return (
    <div
      className="
        flex flex-col min-h-screen
        p-[30px] pb-[70px]
        md:p-[20px] md:pb-[60px]
        lg:p-[30px] lg:pb-[70px]
        font-['Inter']

        text-[var(--color-text-dark-blue-gray)]

        bg-gradient-to-br from-[var(--color-gradient-start-light-blue)] to-[var(--color-gradient-end-light-blue)]

        rounded-xl shadow-[var(--color-black-alpha-15)]
        box-border relative
        w-full
      "
    >
      <section
        className="
          bg-white p-[25px] mb-[30px]
          rounded-lg shadow-[var(--color-black-alpha-10)]
          text-center flex flex-col items-center gap-[20px]
          box-border w-full
          md:p-[20px] md:mb-[20px]
        "
      >
        <Search
          initialSearchTerm={effectiveSearchTerm}
          onSearch={handleSearch}
        />
      </section>

      <section
        className="
          flex-grow bg-white p-[30px]
          rounded-lg shadow-[var(--color-black-alpha-10)]
          flex flex-col items-center justify-center
          min-h-[250px] box-border w-full
          md:p-[20px] md:mb-[20px]
        "
      >
        <PokemonContent
          currentPage={currentPage}
          effectiveSearchTerm={effectiveSearchTerm}
          error={error}
          isLoading={isLoading}
          onPageChange={handlePageChange}
          pokemonItems={pokemonItems}
          totalItems={totalItems}
          totalPages={totalPages}
        />
      </section>
    </div>
  );
}

export default MainPage;
