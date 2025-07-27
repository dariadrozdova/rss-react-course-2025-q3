import { useTheme } from '@/context/ThemeContext';

function AboutPage() {
  const { isDark } = useTheme();

  return (
    <div
      className="
        theme-card p-6 rounded-lg shadow-md
        text-center flex flex-col items-center justify-start
        w-full box-border font-['Inter']
        min-h-[1016px]
      "
    >
      <div className="max-w-4xl w-full py-6 md:py-10">
        <img
          alt="App Logo"
          className="w-24 h-24 mb-6 mx-auto"
          src="/icons/favicon.svg"
        />

        <h1
          className={`text-4xl lg:text-5xl font-bold mb-8 ${isDark ? 'text-gray-100' : 'text-gray-800'}`}
        >
          About This App
        </h1>

        <div className="space-y-6 mb-10">
          <h2
            className={`text-2xl lg:text-3xl font-semibold ${isDark ? 'text-gray-100' : 'text-gray-800'}`}
          >
            App Overview
          </h2>
          <p className="text-lg leading-relaxed max-w-prose mx-auto text-theme-secondary">
            This is a Pokémon Explorer application, built as part of the{' '}
            <a
              className="text-green-600 hover:underline font-semibold"
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
          <h2
            className={`text-2xl lg:text-3xl font-semibold ${isDark ? 'text-gray-100' : 'text-gray-800'}`}
          >
            Author
          </h2>
          <p className="text-xl font-medium text-theme-primary">
            Daria Tkachenko
          </p>
          <p className="text-lg">
            <a
              className="text-green-600 hover:underline font-semibold"
              href="https://github.com/dariadrozdova"
              rel="noopener noreferrer"
              target="_blank"
            >
              GitHub Profile
            </a>
          </p>
        </div>

        <div className="space-y-6">
          <h2
            className={`text-2xl lg:text-3xl font-semibold ${isDark ? 'text-gray-100' : 'text-gray-800'}`}
          >
            The Course
          </h2>
          <p className="text-lg leading-relaxed max-w-prose mx-auto text-theme-secondary">
            This project is a practical assignment from the{' '}
            <a
              className="text-green-600 hover:underline font-semibold"
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
    </div>
  );
}

export default AboutPage;
