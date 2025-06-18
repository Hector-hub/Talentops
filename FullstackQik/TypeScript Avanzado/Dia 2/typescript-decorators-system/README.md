# TypeScript Decorators System

Sistema completo de decorators para TypeScript que implementa patrones de programación orientada a aspectos (AOP).

## 🎯 Características

- ✅ **@Validate**: Validación automática de parámetros
- ✅ **@Cache**: Cache con TTL y key generation personalizada
- ✅ **@Log**: Logging con métricas de performance
- ✅ **@Retry**: Retry con backoff exponencial
- ✅ **@Transaction**: Manejo automático de transacciones con rollback

## 🚀 Instalación y Uso

```bash
npm install
npm run dev
```

## 📖 Conceptos Implementados

### Decorators Composition

```typescript
@Log({ level: 'info' })
@Transaction({ timeout: 5000 })
@Validate(CreateUserSchema)
@Cache({ ttl: 300 })
async createUser(data: CreateUserData): Promise<User> {
  // Solo lógica de negocio pura
}
```

### Transaction Management

- Inicio automático de transacciones
- Commit en caso de éxito
- Rollback automático en errores
- Soporte para transacciones anidadas

### Caching Strategy

- TTL configurable
- Key generation personalizada
- Invalidación automática
- Cache hits/misses logging

## 🏗️ Arquitectura

```
src/
├── decorators/
│   ├── transaction/
│   └── index.ts
├── examples/
│   └── user-service.ts
└── app.ts
```

## 👨‍💻 Autor

**Héctor David Reyes** - TalentOps Fullstack QIK
