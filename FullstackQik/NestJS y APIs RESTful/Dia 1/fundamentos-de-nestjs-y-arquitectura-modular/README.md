# Library Management System

A NestJS-based library management system demonstrating clean architecture and modular design.

## Features

- Book management (create, retrieve, check availability)
- Member management (register members, track borrowing)
- Library operations (borrow and return books)
- Swagger API documentation
- Validation and error handling
- In-memory data storage

## Installation

```bash
npm install
```

## Running the app

```bash
# development
npm run start

# watch mode
npm run start:dev

# production mode
npm run start:prod
```

## API Documentation

Once the application is running, visit:

- Application: http://localhost:3000
- Swagger UI: http://localhost:3000/api

## Architecture

The project follows a modular architecture with:

- **Domain entities**: Book and Member classes with business logic
- **Repositories**: Abstract interfaces with in-memory implementations
- **Services**: Business logic layer
- **Controllers**: HTTP endpoints
- **DTOs**: Data transfer objects with validation

## Modules

- **BooksModule**: Book management
- **MembersModule**: Member management
- **LibraryModule**: Library operations (borrow/return)
