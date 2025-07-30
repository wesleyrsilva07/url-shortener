# URL Shortener API

This project is a RESTful API for URL shortening, built with NestJS and TypeScript. It allows users to create short links, manage their URLs, track analytics (clicks), and supports authentication and user management.

## Features

- Shorten long URLs to compact, shareable links
- User registration and authentication (JWT)
- Analytics: track number of clicks per short URL
- User can manage (list, update, delete) their own URLs
- Swagger documentation available at `/api`
- Docker support for easy deployment

## Getting Started

### Prerequisites

- Node.js >= 22.17.1 <24.4.1"
- Docker & Docker Compose (for containerized setup)

# Copy file environments

copy .env.example .env
-- or if linux --
cp .env.example .env

### Running with Docker

```bash
docker-compose up -d
```

The API will be available at `http://localhost:3010` by default.

## API Documentation

Swagger UI: [http://localhost:3010/api](http://localhost:3010/api)

## Example Endpoints

### Shorten a URL (Authenticated)

`POST /shortener`

```json
{
  "url": "https://example.com"
}
```

Response:

```json
{
  "shortenUrl": "http://localhost:3010/abc123"
}
```

### Redirect

`GET /:shortCode`

### List User URLs (Authenticated)

`GET /shortener/user`

### User Registration

`POST /users`

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "yourpassword"
}
```

## Environment Variables

See `.env.example` for all configuration options.

## Testing

```bash
# unit tests
npm run test

# e2e tests
npm run test:e2e
```

## License

MIT
