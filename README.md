  <p><strong>A note-taking app with an AI chatbot that can answer questions based on the user's notes using RAG (Retrieval Augmented Generation).</strong></p>

---

Built on top of [Turborepo](https://turborepo.org) and contains:

```text
.github
  └─ workflows
        └─ CI with Neon DB branching for PR previews
.vscode
  └─ Recommended extensions and settings for VSCode users
apps
  └─ nextjs
      ├─ Next.js 15
      ├─ React 19
      ├─ Tailwind CSS
      └─ E2E Typesafe API Server & Client
packages
  ├─ api
  |   └─ tRPC v11 router definition
  ├─ auth
  |   └─ Authentication using better-auth.
  ├─ db
  |   └─ Typesafe db calls using Drizzle & Supabase
  └─ ui
      └─ UI package for the webapp using shadcn-ui
tooling
  ├─ eslint
  |   └─ shared, fine-grained, eslint presets
  ├─ prettier
  |   └─ shared prettier configuration
  ├─ tailwind
  |   └─ shared tailwind configuration
  └─ typescript
      └─ shared tsconfig
```

## ✨ Features

- **AI-Powered Notes**: Utilizes the Vercel AI SDK for Retrieval-Augmented Generation.
- **End-to-End Typesafety**: Full-stack type safety with tRPC.
- **Modern Frontend**: Built with Next.js 15 App Router and React 19.
- **Scalable Architecture**: Monorepo managed with Turborepo for optimized builds and caching.
- **Optimized CI/CD**: Automated CI pipeline using GitHub Actions with pnpm caching for faster builds.
- **Preview Databases**: Automatically provisions a new Neon database instance for each pull request, ensuring isolated testing environments.
- **Secure Authentication**: Handled by `better-auth` for robust and secure user sessions.
- **Performant Database**: Typesafe SQL with Drizzle ORM connected to a Neon serverless Postgres database.
- **Rich Text Editing**: A Notion-style editor experience provided by Novel.
- **End-to-End Testing**: Comprehensive e2e tests using Playwright, including automated accessibility scanning with Axe.

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/) based on Radix UI for accessible UI components
- **API**: [tRPC](https://trpc.io/)
- **Authentication**: [better-auth](https://github.com/BetterAuth/better-auth)
- **Database**: [Neon](https://neon.tech/) Serverless Postgres
- **ORM**: [Drizzle ORM](https://orm.drizzle.team/)
- **AI**: [Vercel AI SDK](https://sdk.vercel.ai/)
- **Monorepo**: [Turborepo](https://turborepo.org/)

## 🚀 Quick Start

> **Note**
> The [db](./packages/db) package is preconfigured to use Neon and is **edge-bound**.

To get it running, follow the steps below:

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/emilcheva/ai-rag-notes.git
    cd ai-rag-notes
    ```

2.  **Install dependencies:**

    ```bash
    pnpm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root of the project by copying the example:

    ```bash
    cp .env.example .env
    ```

    Populate the `.env` file with your credentials for Neon, Google AI, etc.

4.  **Push database schema:**

    ```bash
    pnpm db:push
    ```

5.  **Run the development server:**
    ```bash
    pnpm dev
    ```

The application will be available at `http://localhost:3000`.

##

The stack originates from [create-t3-app](https://github.com/t3-oss/create-t3-app). Kudos to the author!
