_Note: This page is for those who want to develop code for School IDForge. You should probably go if you have no idea what I'm about to talk about._

## Setting up Development Environment

1. Make sure you have NodeJS, Yarn and Git installed.
2. Run these commands:

```sh
git clone https://github.com/neelkarma/schoolidforge.git
cd schoolidforge
yarn install
```

### Yarn Scripts

- `yarn dev` - Runs the Vite dev server at `http://localhost:3000/`.
- `yarn build` - Builds a production version of the website in the `dist` directory.
- `yarn serve` - Serves the `dist` directory. Usually used after `yarn build`.
- `yarn format` - Uses Prettier to format code.

## Pull Request Guidelines

- Run `yarn format` before you submit your PR.
- Use common sense.
