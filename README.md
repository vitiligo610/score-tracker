# CricScore - Cricket Score Tracker

## Getting Started

Follow these instructions to set up and run the project.

### Prerequisites

- Node.js
- pnpm package manager

### Setting Up Environment Variables

1. Copy the `.env.example` file to `.env`:
   ```sh
   cp .env.example .env
   ```
2. Update the `.env` file with the appropriate values.

### Database Setup

1. Ensure the database listed in the `.env` file is created.
2. Update the database configuration in the `.env` file if necessary.

### Installing Dependencies

Install the project dependencies using pnpm:
```sh
pnpm install
```

### Seed Database

Run the following command to create database tables and seed initial values:
```sh
pnpm db:seed
```

### Running the Project

Run the development server:
```sh
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Building for Production

To build the project for production, run:
```sh
pnpm build
```

To start the production server, run:
```sh
pnpm start
```

### Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs)
- [Learn Next.js](https://nextjs.org/learn)
