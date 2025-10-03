# Aqua Trail Shipping Management System

A modern shipping management platform built with Next.js, designed to streamline maritime logistics and cargo tracking operations.

## Features

- Shipment bookings
- Customer registration
- User role management (TBA)

## Technology Stack

- **Frontend**: Next.js 14
- **Styling**: Tailwind CSS
- **Authentication**: NextAuth.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **API**: REST & tRPC

## Getting Started

1. Clone the repository:

```bash
git clone https://github.com/s-zankalony/aqua-trail-shipping.git
cd aqua-trail-shipping
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.example .env
```

4. Start the development server:

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to access the application.

## Environment Setup

Ensure you have the following environment variables configured:

- `DATABASE_URL`: PostgreSQL connection string
- `NEXTAUTH_SECRET`: Authentication secret key
- `NEXTAUTH_URL`: Your application URL

## Documentation

Detailed documentation for each feature can be found in the `/docs` directory:

- [API Documentation](docs/api.md)
- [Database Schema](docs/schema.md)
- [Deployment Guide](docs/deployment.md)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support and queries, please open an issue in the GitHub repository or contact the maintenance team.
