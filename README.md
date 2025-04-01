# Amplify Gen2 Next.js Quickstart

This project is a quickstart template combining [AWS Amplify Gen2](https://docs.amplify.aws/gen2/) with [Next.js](https://nextjs.org/). It leverages Amplify Gen2's TypeScript-based infrastructure definitions and Next.js frontend framework to quickly build full-stack applications.

## Features

This quickstart includes the following features:

- **Authentication** - User authentication using Amplify Auth
- **Data Modeling** - Data modeling and API using Amplify Data

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [AWS Account](https://aws.amazon.com/)
- [AWS CLI](https://aws.amazon.com/cli/) (configured)

## Setup

1. Install dependencies:

```bash
npm install
```

2. Run the Amplify Gen2 backend locally:

```bash
npx ampx sandbox
```

3. In a separate terminal, start the Next.js development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

```
/
├── app/                  # Next.js application code
│   ├── _components/      # Shared components
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Main page
├── amplify/              # Amplify Gen2 backend definitions
│   ├── auth/             # Authentication resources
│   ├── data/             # Data model resources
│   └── backend.ts        # Backend definition
├── public/               # Static assets
└── ...
```

## Deployment

To deploy to AWS using Amplify Gen2:

https://docs.aws.amazon.com/amplify/latest/userguide/getting-started-next.html

## Learning Resources

- [Amplify Gen2 Documentation](https://docs.amplify.aws/gen2/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Amplify UI Components](https://ui.docs.amplify.aws/)

## Local Development

```bash
# Start development server
npm run dev

# Format code
npm run format

# Type checking
npm run tsc
```

## License

This project is released under the [MIT License](LICENSE).
