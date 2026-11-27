# Gym Bro

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.1.4.

## Setup

Enable pnpm through Corepack, then install dependencies:

```bash
corepack enable
pnpm install
```

## Development server

To start a local development server, run:

```bash
pnpm start
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.
The development configuration sends API requests to `http://localhost:55555/api`.

## Languages

The sign-in screen and dashboard offer an **ES / CA / EN** switcher. The app initially uses the browser language (Spanish for `es`, Catalan for `ca`, English otherwise), remembers your selection in local storage, and updates dates and page language immediately. UI text lives in `src/app/services/language.service.ts`. Class names, instructor names, room names, and unrecognized messages returned by the API are displayed as supplied by the server.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
pnpm exec ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
pnpm exec ng generate --help
```

## Building

To build the project run:

```bash
pnpm build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.
Production builds use `https://gymbro-api.-romanboix.dev/api` for API requests. Use `pnpm exec ng build --configuration development` to build with the development API URL. These URLs are defined in `src/environments/`.

## Docker deployment

From the project root, build and run the production image:

```bash
docker build -f docker/Dockerfile -t gym-bro-bot-ui .
docker run --rm -p 8080:80 gym-bro-bot-ui
```

The app is available at `http://localhost:8080`. The image uses the production API URL, which must be reachable from the user's browser.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
pnpm test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
pnpm exec ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
