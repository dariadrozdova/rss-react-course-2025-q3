function AboutPage() {
  return (
    <div
      className="
        bg-white p-8 mb-8 rounded-xl shadow-md shadow-[hsla(0,0%,0%,0.1)]
        text-center flex flex-col items-center justify-center
        w-full mx-auto box-border
        md:p-10 lg:p-12
        text-[hsl(200,15%,30%)] font-['Inter']
      "
    >
      <img alt="App Logo" className="w-24 h-24 mb-6" src="/icons/favicon.svg" />

      <h1 className="text-4xl lg:text-5xl font-bold text-[hsl(200,25%,18%)] mb-8">
        About This App
      </h1>

      <div className="space-y-6 mb-10">
        <h2 className="text-2xl lg:text-xl font-semibold text-[hsl(200,25%,18%)]">
          App Overview
        </h2>
        <p className="text-lg leading-relaxed max-w-prose mx-auto">
          This is a Pokémon Explorer application, built as part of the{' '}
          <a
            className="text-[hsl(173,100%,23%)] hover:underline font-semibold"
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

      <div className="space-y-6 mb-10">
        <h2 className="text-2xl lg:text-3xl font-semibold text-[hsl(200,25%,18%)]">
          Author
        </h2>
        <p className="text-xl font-medium">Daria Tkachenko</p>
        <p className="text-lg">
          <a
            className="text-[hsl(173,100%,23%)] hover:underline font-semibold"
            href="https://github.com/dariadrozdova"
            rel="noopener noreferrer"
            target="_blank"
          >
            GitHub Profile
          </a>
        </p>
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl lg:text-3xl font-semibold text-[hsl(200,25%,18%)]">
          The Course
        </h2>
        <p className="text-lg leading-relaxed max-w-prose mx-auto">
          This project is a practical assignment from the{' '}
          <a
            className="text-[hsl(173,100%,23%)] hover:underline font-semibold"
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
  );
}

export default AboutPage;
