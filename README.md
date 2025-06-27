# T3 + Next.js + NextAuth + tRPC Template

This is a simple starter template for Next.js that integrates:

- **NextAuth.js** for authentication
- **tRPC** for type-safe communication
- A **Prisma** schema (unused by default)
- Common **TypeScript** types and utilities

## Structure

- **`pages/`**: Next.js routes, including API routes.
- **`schemas/prisma.schema`**: Prisma schema example (not connected to any database yet).
- **`types/`**: Contains various TypeScript definitions for your app.
- **`server/`**: Where you can add backend logic using tRPC.

## Usage

1. **Install dependencies**
   ```
   npm install
   ```
2. **Run the development server**
   ```
   npm run dev
   ```
3. **Open** [http://localhost:3000](http://localhost:3000) in your browser.

## Authentication

NextAuth.js is configured but not fully wired to any database. Update the configuration in the `[...nextauth].ts` file to suit your needs.

## tRPC Integration

Use tRPC in your Next.js pages or components by importing the hooks provided in the `utils/trpc.ts` file.

## Prisma Schema

The `prisma.schema` file is included for reference. You can adapt it and set up your database when you decide to connect Prisma.

## Contributing

Feel free to submit pull requests or open issues on GitHub to improve this template.
