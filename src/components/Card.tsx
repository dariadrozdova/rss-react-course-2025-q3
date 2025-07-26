import type { CardProps } from '@types';
import { Link } from 'react-router-dom';

function Card({
  currentPage,
  isSelected = false,
  item,
  onPokemonClick,
}: CardProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onPokemonClick) {
      e.preventDefault();
      onPokemonClick(item.id);
    }
  };

  const imageUrl =
    item.imageUrl ||
    `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${item.id}.png`;

  const cardContent = (
    <>
      <strong
        className={`
          mb-2.5 capitalize font-bold text-base md:text-lg transition-colors
          ${
            isSelected
              ? 'text-teal-600'
              : 'text-gray-800 group-hover:text-teal-600'
          }
        `}
      >
        {item.name}
      </strong>

      <div className="mt-4">
        <img
          alt={item.name}
          className="
            rounded-lg h-auto block max-w-[100px]
            sm:max-w-[120px] mx-auto
          "
          height={150}
          loading="lazy"
          onError={(e) => {
            const fallbackUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${item.id}.png`;
            if (e.currentTarget.src === fallbackUrl) {
              e.currentTarget.style.display = 'none';
              e.currentTarget.nextElementSibling?.setAttribute(
                'style',
                'display: flex'
              );
            } else {
              e.currentTarget.src = fallbackUrl;
            }
          }}
          src={imageUrl}
          width={150}
        />
        <div
          className="
            rounded-lg h-[100px] sm:h-[120px] w-[100px] sm:w-[120px] bg-gray-200 items-center justify-center mx-auto text-gray-500 text-sm hidden
          "
          style={{ display: 'none' }}
        >
          No Image
        </div>
      </div>
    </>
  );

  return (
    <li key={item.id}>
      {onPokemonClick ? (
        <div
          className={`
            group bg-white p-4 sm:p-5 rounded-lg shadow-sm flex flex-col items-center text-center transition-all duration-300 ease-in-out h-full border cursor-pointer
            ${
              isSelected
                ? 'border-teal-400 shadow-lg ring-2 ring-teal-200 -translate-y-1'
                : 'border-gray-200 hover:-translate-y-1 hover:shadow-lg hover:border-teal-400'
            }
          `}
          onClick={handleClick}
        >
          {cardContent}
        </div>
      ) : (
        <Link
          className={`
            group bg-white p-4 sm:p-5 rounded-lg shadow-sm flex flex-col items-center text-center
            transition-all duration-300 ease-in-out h-full border
            ${
              isSelected
                ? 'border-teal-400 shadow-lg ring-2 ring-teal-200 -translate-y-1'
                : 'border-gray-200 hover:-translate-y-1 hover:shadow-lg hover:border-teal-400'
            }
          `}
          to={`/${currentPage}/${item.id}`}
        >
          {cardContent}
        </Link>
      )}
    </li>
  );
}

export default Card;
