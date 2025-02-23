# Telegram bot on a Clean Architecture

An example of a Telegram bot built on clean architecture principles.

### Application structure
```
# src/  
├── # core/  
│   ├── # entities/           Business entities
│   ├── # ports/              Interfaces to the outside world
│   ├── # usecases/           Use cases
│   ├── # mappers/            Data conversion between layers
│   ├── # schemas/            Validation and types for customizations
│   └── # services/           Domain logic services
├── # infrastructure/  
│   ├── # config/             Application configuration
│   ├── # database/           Database implementations
│   ├── # llm/                LLM providers
│   ├── # cache/              Caching implementations 
│   ├── # di/                 DI container
│   ├── # scheduler/          Task Scheduler (Cron)
│   └── # telegram/           Telegram bot
├── # application/            Build and Run
└── * index.ts                Entry point
```
