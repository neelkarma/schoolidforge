_Note: This page is for those who want to develop code for School IDForge. You should probably go if you have no idea what I'm about to talk about._

## Setting up Development Environment

1. Make sure you have `npm`, `node` and `git` installed. To check whether you have these, type out these commands in a terminal window:

```sh
git --version
node -v
npm -v
```

If no error appears, then you can proceed to the next step.

2. Open a new terminal and `cd` to the directory where you want to clone the repo.
3. Run these commands in order:

```sh
git clone https://github.com/neelkarma/schoolidforge.git
cd schoolidforge
npm install
```

You can now start developing. `npm` scripts are listed below.

### `npm` Scripts

- `npm run develop` - Runs `gatsby develop`, which basically makes a development server at `localhost:8000`. _Note: This server doesn't have HTTPS enabled._
- `npm run build` - Builds a production version of the website in the `public` directory.
- `npm run serve` - Serves the `public` directory at `localhost:9000`. Usually used after `npm run build`. _Note: This server doesn't have HTTPS enabled, either._
- `npm run clean` - Deletes the `.cache` and `public` directories, freeing up space.
- `npm run format` - Uses `prettier` to format code.

## Pull Request Guidelines

- Don't delete the existing code and paste your own in. Git registers this as replacing the entire code, which makes reviewing your individual changes extremely difficult.
- Run `npm run format` before you submit your PR.
- Explain what your PR has done in the description of it. There's no use if I have no idea what your code is doing.
- Just use your common sense. This includes searching for duplicates before submitting, not introducing breaking changes, using a separate branch other than `master` for PRs, and the like.
