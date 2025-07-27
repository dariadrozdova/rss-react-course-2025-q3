import { useEffect } from 'react';
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';

import { PokemonContent } from '@components/PokemonContent';
import Search from '@components/Search';
import { usePaginationAndSearch } from '@hooks/usePaginationAndSearch';
import { usePokemonData } from '@hooks/usePokemonData';
import NotFoundPage from '@pages/NotFoundPage';

const ITEMS_PER_PAGE = 20;

function MainPage() {
  const { detailsId } = useParams<{ detailsId: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    currentPage,
    effectiveSearchTerm,
    handlePageChange,
    handleSearch,
    isValidPage,
  } = usePaginationAndSearch();

  const { error, isLoading, pokemonItems, totalItems } = usePokemonData(
    effectiveSearchTerm,
    currentPage,
    ITEMS_PER_PAGE
  );

  const totalPages = totalItems ? Math.ceil(totalItems / ITEMS_PER_PAGE) : 0;

  const isValidPageParameter = () => {
    return isValidPage && (totalPages === 0 || currentPage <= totalPages);
  };

  const isValidPokemonId = () => {
    if (detailsId) {
      const pokemonId = Number.parseInt(detailsId, 10);
      if (Number.isNaN(pokemonId) || pokemonId < 1) {
        return false;
      }
    }
    return true;
  };

  useEffect(() => {
    if (!isValidPageParameter() || !isValidPokemonId()) {
      navigate('/404', { replace: true });
    }
  }, [location.search, detailsId, totalPages, navigate]);

  if (!isValidPageParameter() || !isValidPokemonId()) {
    return <NotFoundPage />;
  }

  const handlePokemonClick = (pokemonId: number) => {
    const searchParameters = new URLSearchParams(location.search);
    navigate(`/details/${pokemonId}?${searchParameters.toString()}`);
  };

  const handleCloseDetails = () => {
    const searchParameters = new URLSearchParams(location.search);
    navigate(`/?${searchParameters.toString()}`);
  };

  return (
    <div className="flex flex-row gap-8 w-full">
      <div
        className={`
          flex flex-col gap-5 w-full transition-all duration-300
          ${detailsId ? 'md:w-1/2 lg:w-2/3' : 'md:w-full'}
        `}
        onClick={detailsId ? handleCloseDetails : undefined}
      >
        <section
          className="
            theme-card p-6 rounded-lg shadow-md text-center
            flex flex-col items-center gap-5 box-border w-full
            flex-shrink-0
          "
        >
          <Search
            initialSearchTerm={effectiveSearchTerm}
            onSearch={handleSearch}
          />
        </section>

        <section
          className="
            flex-grow theme-card p-6 rounded-lg shadow-md
            flex flex-col items-center justify-start
            box-border w-full
            min-h-[900px]
          "
        >
          <PokemonContent
            currentPage={currentPage}
            effectiveSearchTerm={effectiveSearchTerm}
            error={error}
            isLoading={isLoading}
            onPageChange={handlePageChange}
            onPokemonClick={handlePokemonClick}
            pokemonItems={pokemonItems}
            {...(detailsId
              ? { selectedPokemonId: Number.parseInt(detailsId, 10) }
              : {})}
            totalItems={totalItems}
            totalPages={totalPages}
          />
        </section>
      </div>

      {detailsId && (
        <div className="hidden md:block md:w-1/2 lg:w-1/3 sticky top-8 self-start">
          <div className="theme-card rounded-lg shadow-md p-6 relative">
            <Outlet context={{ handleCloseDetails }} />
          </div>
        </div>
      )}
    </div>
  );
}

export default MainPage;
