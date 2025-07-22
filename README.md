# RS School React Course: Functional Routing & Hooks

This project is a part of the [Rolling Scopes School (RS School) React Course](https://rs.school/courses/reactjs) focusing on building a simple React application with client-side routing using React Router. It demonstrates the use of functional components, React Hooks, and navigation between a Main Page, an About Page, and a Not Found Page. Each task in the course builds upon the previous one, allowing for incremental development and learning.

## Installation & Setup

To get this project up and running on your local machine, follow these steps:

1.  **Clone the repository:**

    ```bash
    git clone [https://github.com/dariadrozdova/rss-react-course-2025-q3.git](https://github.com/dariadrozdova/rss-react-course-2025-q3.git)
    cd rss-react-course-2025-q3
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    # or yarn install
    # or pnpm install
    ```

    This command will also automatically set up Husky Git hooks thanks to the `prepare` script in `package.json`.

3.  **Start the development server:**

    ```bash
    npm run dev
    ```

    The application will be available at `http://localhost:5173` (or another port if 5173 is in use).

## Available Scripts

In the project directory, you can run:

- `npm run dev`: Runs the app in development mode.

- `npm run build`: Builds the app for production to the `dist` folder.

- `npm run lint`: Runs ESLint to check for linting errors across the project.

- `npm run format:fix`: Runs Prettier to automatically format code files.

- `npm run test`: Executes unit and integration tests using Vitest.

- `npm run test:coverage`: Runs tests and generates a code coverage report.

- `npm run prepare`: Manually installs Husky Git hooks (usually run automatically by `npm install`).

## Git Hooks

This project uses Husky to enforce code quality and commit message standards:

- **`pre-commit`**: Runs `lint-staged` (which executes ESLint and Prettier on staged files) and checks for TypeScript errors (`tsc`).

- **`commit-msg`**: Validates commit messages using `commitlint` to ensure they follow conventional commit guidelines.

- **`pre-push`**: Runs all tests (`npm test`) before allowing a push to the remote repository.

## Author

**Daria Tkachenko**

- [GitHub Profile](https://github.com/dariadrozdova)

## RS School React Course

This project is developed as part of the comprehensive [RS School React Course](https://rs.school/courses/reactjs). The course provides in-depth knowledge and practical experience in building modern React applications
