# ⚙️ Vite + React + Typescript ⚙️

## ✨Features

This template is a minimalist starter template, it includes:

- ⚡️ [Vite](https://vitejs.dev/guide/) v5
- 🔥 [Vitest](https://vitest.dev/guide/)
- ⚛️ [React](https://react.dev/learn) v18
- 💎 [TypeScript](https://www.typescriptlang.org/) (of course)
- 🌈 [Antd](https://ant.design/docs/react/introduce) v5
- 🎨 [Scss](https://www.npmjs.com/package/sass)
- 🔨 [Eslint](https://www.npmjs.com/package/eslint)
- ⚙️ [Redux Toolkit](https://redux-toolkit.js.org/introduction/getting-started)
- 🐙 [Jest](https://jestjs.io) with [DOM Testing Library](https://testing-library.com/docs/dom-testing-library/intro)
- 🐶 [Husky](https://github.com/typicode/husky?tab=readme-ov-file)
- 💩 [lint-staged](https://www.npmjs.com/package/lint-staged)
- 👀 [Commitlint](https://commitlint.js.org/#/)
- 💻 [Sonar scanner](https://www.npmjs.com/package/sonarqube-scanner)

## Coding Style

- [ESLint](https://eslint.org/) - configured for [standard-with-typescript](https://www.npmjs.com/package/eslint-config-standard-with-typescript)
- [Prettier](https://prettier.io/)

## Prerequisites

- 📦 Node.js >=18
- 📦 Npm, Yarn, Pnpm

## Get the tools

1 - [Download Node.js and npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)

2 - Run this command

```bash
npm install -g vsts-npm-auth --registry https://registry.npmjs.com --always-auth false
```

## 👀 How to use

1 - Clone the project from the repository SSH

```bash
git clone git@ssh.dev.azure.com:v3/weare-dev/coe-wd-parent-base-ui/coe-wd-parent-base-ui coe-wd-parent-base-ui
```

2 - Use the directory

```bash
cd coe-wd-parent-base-ui
```

3 - Project setup

Add a .npmrc to the project, in the same directory where the package.json is located

```bash
registry=https://pkgs.dev.azure.com/weare-dev/_packaging/weare-dev/npm/registry/
always-auth=true
```

Then, run vsts-npm-auth to get an Azure Artifacts token added to your user-level .npmrc file

```bash
vsts-npm-auth -config .npmrc
```

4 - Install the dependency

```bash
npm install
```

5 - Add a .env.local to the project, ask the repository administrator for the information

6 - Start the project

```bash
npm run start
```

## Testing

### Jest with Testing Library

```bash
npm run test
```

## Linting

```bash
# run linter
npm run lint

# fix lint issues
npm run lint:fix
```

## Prettier

`.prettierrc.json`

```json
{
  "semi": false,
  "singleQuote": true,
  "jsxSingleQuote": true,
  "printWidth": 120,
  "tabWidth": 2,
  "trailingComma": "none"
}
```

```bash
# run prettier
npm run prettier
```

## This project uses the style guide [eslint-config-standard](https://www.npmjs.com/package/eslint-config-standard)

Using ESLint for React projects can help catch some common mistakes, code-smells, and define common conventions for a codebase.

Necessary dependencies for project:
[eslint-config-standard-with-typescript](https://www.npmjs.com/package/eslint-config-standard-with-typescript)
[eslint-plugin-promise](https://www.npmjs.com/package/eslint-plugin-promise)
[eslint-plugin-import](https://www.npmjs.com/package/eslint-plugin-import)
[eslint-plugin-n](https://www.npmjs.com/package/eslint-plugin-n)

[eslint-config-standard-jsx](https://www.npmjs.com/package/eslint-config-standard-jsx)
This Shareable Config adds extra JSX style rules to the baseline [JavaScript Standard Style](https://standardjs.com/) rules provided in [eslint-config-standard](https://www.npmjs.com/package/eslint-config-standard).

## Official React Plugin

[eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) along with their plugin:react/recommended rule set is a must.

`.eslintrc.js`

```json
  "rules": {
    "react/prop-types": "off",
    "react/react-in-jsx-scope": "off",
    "react/jsx-no-leaked-render": [
      "error",
      {
        "validStrategies": [
          "ternary"
        ]
      }
    ],
    "react/jsx-no-bind": "error",
    "react/no-unstable-nested-components": [
      "error",
      {
        "allowAsProps": true
      }
    ],
    "react/function-component-definition": [
      "warn",
      {
        "namedComponents": "arrow-function"
      }
    ],
    "react/jsx-sort-props": [
      "warn",
      {
        "ignoreCase": true,
        "callbacksLast": true
      }
    ],
    "react/no-multi-comp": "warn"
  }
```

[react/jsx-no-leaked-render](https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-no-leaked-render.md): prefer conditional rendering via ternary expressions - to avoid unexpected values being rendered from && or even crashes in rare cases.

[react/jsx-no-bind](https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-no-bind.md): has performance benefits, preventing functions declared in a component from being created again on every re-rende.

[react/no-unstable-nested-components](https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/no-unstable-nested-components.md): components with components are an anti-pattern since they lose state when their parent is re-rendered.

[react/function-component-definition](https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/function-component-definition.md): standardizes the way functional components are defined.

[react/no-multi-comp](https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/no-multi-comp.md): one component per file.

## Rules of Hooks

[react-hooks](https://www.npmjs.com/package/eslint-plugin-react-hooks) with the plugin:react-hooks/recommended importantly, you can't call hooks conditionally, and will be warned if you state dependencies aren't exhaustive

`.eslintrc.js`

```json
{
  "extends": ["eslint:recommended", "plugin:react/recommended"],
  "plugins": ["react"],
  "rules": {
    "react-hooks/rules-of-hooks": "error"
  }
}
```

## React Refresh

[react-refresh](https://github.com/ArnaudBarre/eslint-plugin-react-refresh). Requires that .tsx/.jsx files only export components. Why? Because this optimises the app for fash refresh to get a smoother development experience.

`.eslintrc.js`

```json
{
  "extends": ["eslint:recommended", "plugin:react/recommended"],
  "plugins": ["react-refresh"],
  "rules": {
    "react-refresh/only-export-components": "warn"
  }
}
```

## JSX Ally

[jsx-a11y](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y) This plugin does a static evaluation of the JSX to spot accessibility issues in React apps.
The is all about ensuring the DOM elements are accessible. The plugin will prompt you to include the correct [ARIA attributes](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA) such as labels and roles, in addition to things like alt text.
The jsx-a11y/recommended rule set has reasonable defaults, though ensure you map your [custom components to DOM elements](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y#component-mapping).

`.eslintrc.js`

```json
{
  "extends": ["plugin:jsx-a11y/recommended"],
  "plugins": ["jsx-a11y"]
}
```

Then we can enforce our file names to be PascalCase via [filename-rules](https://github.com/dolsem/eslint-plugin-filename-rules):

`.eslintrc.js`

```json
{
  "plugins": ["jsx-a11y"],
  "rules": {
    "filename-rules/match": [2, { ".ts": "camelcase", ".tsx": "pascalcase" }]
  }
}
```

​It is suggested to require named exports via import:

`.eslintrc.js`

```json
  "rules": {
    "import/no-default-export": "error"
  }
```

## Naming Conventions and Filename Rules

By convention, React components should be named in PascalCase. [@typescript-eslint](https://github.com/typescript-eslint/typescript-eslint) has the config we need:

```json
    "@typescript-eslint/naming-convention": [
      "warn",
      {
        "selector": "default",
        "format": [
          "camelCase"
        ],
        "leadingUnderscore": "allow"
      },
      {
        "selector": "variable",
        "format": [
          "PascalCase",
          "camelCase",
          "UPPER_CASE"
        ],
        "leadingUnderscore": "allow"
      },
      {
        "selector": "parameter",
        "format": [
          "camelCase"
        ],
        "leadingUnderscore": "allow"
      },
      {
        "selector": "parameter",
        "format": [
          "PascalCase"
        ],
        "leadingUnderscore": "allow",
        "filter": {
          "regex": "Component$",
          "match": true
        }
      },
      {
        "selector": "property",
        "format": null,
        "leadingUnderscore": "allow"
      },
      {
        "selector": "typeLike",
        "format": [
          "PascalCase"
        ]
      },
      {
        "selector": "enumMember",
        "format": [
          "UPPER_CASE"
        ]
      }
    ]
```

## TS/JSDoc

We want to ensure React components (and code more generally) is well documented.

Using [jsdoc](https://www.npmjs.com/package/eslint-plugin-jsdoc) we can specify formatting requirements for our documentation, with [tsdoc](https://www.npmjs.com/package/eslint-plugin-tsdoc) for some TS specific syntax.

`.eslintrc.js`

```json
{
  "extends": ["plugin:jsdoc/recommended-typescript"],
  "plugins": ["jsdoc", "eslint-plugin-tsdoc"]
}
```

## Other eslint plugins included in the project

- [eslint-plugin-jest](https://www.npmjs.com/package/eslint-plugin-jest)
- [eslint-plugin-testing-library](https://www.npmjs.com/package/eslint-plugin-testing-library)
- [eslint-plugin-sonarjs](https://www.npmjs.com/package/eslint-plugin-sonarjs)
- [eslint-import-resolver-typescript](https://www.npmjs.com/package/eslint-import-resolver-typescript)
- [eslint-plugin-filename-rules](https://www.npmjs.com/package/eslint-plugin-filename-rules)
- [eslint-plugin-sort-destructure-keys](https://www.npmjs.com/package/eslint-plugin-sort-destructure-keys)
- [eslint-plugin-sort-keys-fix](https://www.npmjs.com/package/eslint-plugin-sort-keys-fix)
- [eslint-plugin-typescript-sort-keys](https://www.npmjs.com/package/eslint-plugin-typescript-sort-keys)

## Recomendations extensions Visual Studio Code

- 📦 [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- 📦 [Linter](https://marketplace.visualstudio.com/items?itemName=fnando.linter)
- 📦 [SonarLint](https://marketplace.visualstudio.com/items?itemName=SonarSource.sonarlint-vscode)

After installing the extensions, you can configure them in the following way:
In Visual Studio Code Ctrl + P + Open User Settings

`settings.json`

```json
{
  "editor.formatOnSave": true,
  "editor.formatOnPaste": true,
  "editor.codeActionsOnSave": {
    "source.fixAll": true,
    "source.organizeImports": true
  },
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact"
  ],
  "eslint.format.enable": true,
  "typescript.updateImportsOnFileMove.enabled": "always",
  "typescript.format.insertSpaceAfterOpeningAndBeforeClosingEmptyBraces": false,
  "typescript.format.insertSpaceBeforeFunctionParenthesis": true,
  "typescript.format.insertSpaceAfterConstructor": true
}
```

Other:

- 📦 [Vitest](https://marketplace.visualstudio.com/items?itemName=ZixuanChen.vitest-explorer)
- 📦 [Redux DevTools](https://marketplace.visualstudio.com/items?itemName=jingkaizhao.vscode-redux-devtools)
- 📦 [Version Lens](https://marketplace.visualstudio.com/items?itemName=pflannery.vscode-versionlens)
- 📦 [Error Lens](https://marketplace.visualstudio.com/items?itemName=usernamehw.errorlens)
- 📦 [Import Cost](https://marketplace.visualstudio.com/items?itemName=wix.vscode-import-cost)
- 📦 [Path Intellisense](https://marketplace.visualstudio.com/items?itemName=christian-kohler.path-intellisense)
- 📦 [Todo Tree](https://marketplace.visualstudio.com/items?itemName=Gruntfuggly.todo-tree)
- 📦 [Material Icon Theme](https://marketplace.visualstudio.com/items?itemName=PKief.material-icon-theme)
- 📦 [Sass (.sass only)](https://marketplace.visualstudio.com/items?itemName=Syler.sass-indented)
- 📦 [commitlint](https://marketplace.visualstudio.com/items?itemName=joshbolduc.commitlint)
- 📦 [jsdoc](https://marketplace.visualstudio.com/items?itemName=lllllllqw.jsdoc)
- 📦 [IntelliCode](https://marketplace.visualstudio.com/items?itemName=VisualStudioExptTeam.vscodeintellicode)
- 📦 [Auto Import](https://marketplace.visualstudio.com/items?itemName=steoates.autoimport)
- 📦 [Pretty TypeScript Errors](https://marketplace.visualstudio.com/items?itemName=yoavbls.pretty-ts-errors)
- 📦 [TypeScript Importer](https://marketplace.visualstudio.com/items?itemName=pmneo.tsimporter)
- 📦 [TypeScript Import Sorter](https://marketplace.visualstudio.com/items?itemName=mike-co.import-sorter)
- 📦 [Move TS - Move TypeScript files and update relative imports](https://marketplace.visualstudio.com/items?itemName=stringham.move-ts)

- 📦 [Better Comments](https://marketplace.visualstudio.com/items?itemName=aaron-bond.better-comments)
- 📦 [Color Highlight](https://marketplace.visualstudio.com/items?itemName=naumovs.color-highlight)
- 📦 [Color Picker](https://marketplace.visualstudio.com/items?itemName=anseki.vscode-color)
- 📦 [colorize](https://marketplace.visualstudio.com/items?itemName=kamikillerto.vscode-colorize)
- 📦 [Color Highlight](https://marketplace.visualstudio.com/items?itemName=naumovs.color-highlight)
- 📦 [CSS Peek](https://marketplace.visualstudio.com/items?itemName=pranaygp.vscode-css-peek)
- 📦 [Image preview](https://marketplace.visualstudio.com/items?itemName=kisstkondoros.vscode-gutter-preview)

## Directory Structure

```text
wd-parent-base-ui
├─ .husky
│  ├─ commit-msg
│  ├─ pre-commit
│  ├─ pre-push
│  └─ _
│     ├─ .gitignore
│     └─ husky.sh
├─ public
│  ├─ css
│  ├─ fonts
│  ├─ images
│  │  └─ favicon.ico
│  └─ robots.txt
├─ src
│  ├─ App.tsx
│  ├─ assets
│  │  ├─ images
│  │  │  ├─ cropped-LogoAzulPaginaWeb-1-32x32
│  │  │  ├─ cropped-LogoAzulPaginaWeb-1-180x180.png
│  │  │  ├─ cropped-LogoAzulPaginaWeb-1-192x192.png
│  │  │  ├─ fondo.png
│  │  │  ├─ fondoMobil.png
│  │  │  ├─ LogoBLANCO-159x150.png
│  │  │  └─ user1.png
│  │  └─ styles
│  │     └─ globalStyles.ts
│  ├─ components
│  │  ├─ loader
│  │  │  ├─ Loader.tsx
│  │  │  └─ loaderStyles.ts
│  │  ├─ logo
│  │  │  └─ Logo.tsx
│  │  ├─ notification
│  │  │  └─ Notification.tsx
│  │  └─ suspense
│  │     └─ LazyLoad.tsx
│  ├─ config
│  │  ├─ icon.ts
│  │  └─ theme
│  │     ├─ config.ts
│  │     ├─ customTheme.ts
│  │     ├─ defaultTheme.ts
│  │     ├─ style.d.ts
│  │     └─ theme.ts
│  ├─ constants
│  │  └─ index.ts
│  ├─ containers
│  │  ├─ layout
│  │  │  ├─ app
│  │  │  │  ├─ Dashboard.tsx
│  │  │  │  └─ dashboardStyles.ts
│  │  │  ├─ footer
│  │  │  │  └─ Footer.tsx
│  │  │  ├─ sidebar
│  │  │  │  ├─ hooks
│  │  │  │  │  └─ useSidebar.ts
│  │  │  │  ├─ Sidebar.tsx
│  │  │  │  └─ sidebarStyles.ts
│  │  │  └─ topbar
│  │  │     ├─ TobarUser.tsx
│  │  │     ├─ Topbar.tsx
│  │  │     ├─ topbarStyles.ts
│  │  │     └─ topbarUserStyles.ts
│  │  ├─ pages
│  │  │  ├─ 404
│  │  │  ├─ 500
│  │  │  └─ signIn
│  │  │     ├─ SignIn.tsx
│  │  │     └─ signInStyles.ts
│  │  └─ views
│  │     ├─ error-boundary
│  │     │  └─ ErrorBoundary.tsx
│  │     └─ private-router
│  │        └─ PrivateRoute.tsx
│  ├─ helpers
│  │  └─ index.ts
│  ├─ hocs
│  │  └─ WithDirection.tsx
│  ├─ hooks
│  │  ├─ useApp.ts
│  │  ├─ useAuth.ts
│  │  ├─ useMenu.ts
│  │  └─ useTheme.ts
│  ├─ Index.tsx
│  ├─ interfaces
│  │  ├─ auth.ts
│  │  ├─ common.ts
│  │  ├─ index.ts
│  │  └─ menu.ts
│  ├─ providers
│  │  └─ AppProvider.tsx
│  ├─ redux
│  │  ├─ hooks.ts
│  │  ├─ rootReducer.ts
│  │  ├─ states
│  │  │  ├─ app.ts
│  │  │  ├─ auth.ts
│  │  │  ├─ index.ts
│  │  │  ├─ menu.ts
│  │  │  └─ theme.ts
│  │  └─ store.ts
│  ├─ Router.tsx
│  ├─ scss
│  ├─ services
│  │  ├─ authService.ts
│  │  └─ menuService.ts
│  ├─ types
│  └─ vite.env.d.ts
├─ test
│  ├─ App.test.tsx
│  └─ setupTests.ts
├─ .env.local
├─ .eslintignore
├─ .eslintrc.json
├─ .gitattributes
├─ .gitignore
├─ .npmrc
├─ .prettierrc.json
├─ commitlint.config.cjs
├─ index.html
├─ package-lock.json
├─ package.json
├─ readme.md
├─ sonar-project.properties
├─ tsconfig.json
├─ tsconfig.node.json
├─ tsconfig.paths.json
├─ vite.config.mts
├─ vitest.config.ts
```

## Auth for packages

Auth for azure artifacts require auth to access the packages

#### 1. Run

```bash
npm install -g vsts-npm-auth --registry https://registry.npmjs.com --always-auth false
```

#### 2. Copy the code below to your user ".npmrc"

```shell
//pkgs.dev.azure.com/weare-dev/_packaging/wearedev/npm/registry/:username=weare-dev
//pkgs.dev.azure.com/weare-dev/_packaging/wearedev/npm/registry/:_password=[BASE64_ENCODED_PERSONAL_ACCESS_TOKEN]
//pkgs.dev.azure.com/weare-dev/_packaging/wearedev/npm/registry/:email=[EMAIL]
//pkgs.dev.azure.com/weare-dev/_packaging/wearedev/npm/:username=weare-dev
//pkgs.dev.azure.com/weare-dev/_packaging/wearedev/npm/:_password=[BASE64_ENCODED_PERSONAL_ACCESS_TOKEN]
//pkgs.dev.azure.com/weare-dev/_packaging/wearedev/npm/:email=[EMAIL]
```

#### 3. Generate token from [Personal Access Tokens](https://dev.azure.com/weare-dev/_details/security/tokens)

#### 4. Generate base64 from personal access token

> Paste this in your terminal

```bash
node -e "require('readline') .createInterface({input:process.stdin,output:process.stdout,historySize:0}) .question('PAT> ',p => { b64=Buffer.from(p.trim()).toString('base64');console.log(b64);process.exit(); })"
```

```bash
PAT> personal_access_token
```

> Then press enter

#### 4. Replace [BASE64_ENCODED_PERSONAL_ACCESS_TOKEN], [EMAIL] and [PROJECT] values in your user .npmrc file with your personal access token in base64 format, your email and the project name

That is, with that setup the packages can be installed using

```bash
npm install
```
