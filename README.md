# Docsy AI


Docsy AI transforms your static PDF documents into interactive conversational partners. Upload your PDFs and ask questions, get summaries, and find information instantly using a powerful AI-driven chat interface. This project is built with Next.js, Convex, Clerk, UploadThing, and LangChain.

## Key Features

*   **Interactive Chat Interface**: Ask questions in natural language and get answers directly from your PDF content.
*   **Secure Document Uploads**: Upload PDF files safely using UploadThing.
*   **AI-Powered Document Analysis**: Leverages LangChain and Google Gemini to understand document context and provide accurate responses.
*   **User Authentication**: Secure user management and authentication powered by Clerk.
*   **Real-time Backend**: Built on Convex for a seamless, real-time database and backend experience.
*   **Modern UI**: A clean and responsive user interface built with Next.js, Tailwind CSS, and shadcn/ui.

## Tech Stack

*   **Framework**: Next.js (App Router)
*   **Backend & Database**: [Convex](https://convex.dev/)
*   **Authentication**: [Clerk](https://clerk.com/)
*   **File Uploads**: [UploadThing](https://uploadthing.com/)
*   **AI & LLM**: [LangChain](https://www.langchain.com/) with [Google Gemini](https://ai.google.dev/)
*   **Styling**: Tailwind CSS & [shadcn/ui](https://ui.shadcn.com/)
*   **Language**: TypeScript

## How It Works

1.  **Authentication**: Users sign up or sign in using Clerk. A corresponding user record is created in the Convex database.
2.  **Document Upload**: The user uploads a PDF file through the UploadThing widget.
3.  **Processing**: Upon a successful upload, the file URL is sent to a Next.js API route (`/api/process-document`).
    *   The API fetches the PDF and uses LangChain's `WebPDFLoader` to extract text.
    *   The text is split into manageable chunks using `RecursiveCharacterTextSplitter`.
    *   These chunks are saved to the `documentChunks` table in the Convex database.
    *   A new chat linked to the document is created.
4.  **Chat Interaction**:
    *   When the user sends a message, a request is made to the `/api/chat` route.
    *   The API fetches the relevant document chunks from Convex to build a context.
    *   The user's question and the context are sent to the Google Gemini model via a LangChain prompt template.
    *   The AI's response is returned and displayed in the chat UI, and the conversation is saved to Convex.

## Getting Started

Follow these instructions to get a local copy up and running.

### Prerequisites

*   Node.js (v18.0 or later)
*   pnpm (or your preferred package manager)
*   Accounts for:
    *   [Convex](https://convex.dev/)
    *   [Clerk](https://clerk.com/)
    *   [UploadThing](https://uploadthing.com/)
    *   [Google AI Studio](https://aistudio.google.com/)

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/usman-rizwan/docsy-ai.git
    cd docsy-ai
    ```

2.  **Install dependencies:**

    ```bash
    pnpm install
    ```

3.  **Set up Environment Variables:**

    Create a `.env.local` file in the root of the project and add the following variables. Obtain the values from your respective service dashboards.

    ```env
    # Convex
    NEXT_PUBLIC_CONVEX_URL= "https://<your-convex-project-name>.convex.cloud"

    # Clerk
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
    CLERK_SECRET_KEY=sk_test_...

    # UploadThing
    UPLOADTHING_SECRET=sk_live_...
    UPLOADTHING_APP_ID=<your-app-id>

    # Google Gemini API Key
    GOOGLE_API_KEY=AIza...
    ```


4.  **Set up Convex:**

    Run the Convex development server. This will sync your schema and functions with the Convex cloud.

    ```bash
    npx convex dev
    ```

    Follow the CLI prompts to link your project to your Convex account.

5.  **Run the development server:**

    In a new terminal window, start the Next.js development server with Turbopack.

    ```bash
    pnpm dev
    ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the running application.
