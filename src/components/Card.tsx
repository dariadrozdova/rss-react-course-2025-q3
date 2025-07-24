import type { CardProps } from '@types';

function Card(props: CardProps) {
  const { item } = props;

  return (
    <li
      className="
        bg-[hsl(0,0%,99%)]
        p-[15px]
        sm:p-5
        md:p-[25px]
        rounded-lg
        shadow-md shadow-[hsla(0,0%,0%,0.08)]
        flex flex-col items-center text-center
        transition-all duration-300 ease-in-out
        border border-[hsl(207,17%,94%)] box-border
        hover:-translate-y-[5px]
        hover:shadow-lg hover:shadow-[hsla(0,0%,0%,0.15)]
      "
      key={item.id}
    >
      <strong
        className="
          text-[hsl(173,100%,23%)] mb-2.5 capitalize font-bold
          text-base
          sm:text-[1.2em]
          md:text-[1.3em]
        "
      >
        {item.name}
      </strong>
      {item.imageUrl && (
        <img
          alt={item.name}
          className="
            rounded-lg mt-4 h-auto block
            shadow-sm shadow-[hsla(0,0%,0%,0.1)]
            max-w-[100px]
            sm:max-w-[120px]
            md:max-w-[150px]
          "
          src={item.imageUrl}
        />
      )}
    </li>
  );
}

export default Card;
