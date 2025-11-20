// Definición de tipos y interfaces
interface NotificationStrategy {
  send(message: string): Promise<void>;
}

interface NotificationPreferences {
  email: boolean;
  sms: boolean;
  push: boolean;
  discord?: boolean;
  slack?: boolean;
}

interface User {
  id: string;
  email: string;
  phone: string;
  preferences: NotificationPreferences;
}

// SRP: Cada clase tiene una responsabilidad específica
class UserPreferencesValidator {
  validate(preferences: NotificationPreferences): boolean {
    return Object.values(preferences).some((pref) => pref === true);
  }
}

// OCP: Extensible para nuevos tipos de notificación
class PushNotification implements NotificationStrategy {
  async send(message: string): Promise<void> {
    console.log(`Enviando push notification: ${message}`);
  }
}

class EmailNotification implements NotificationStrategy {
  async send(message: string): Promise<void> {
    console.log(`Enviando email: ${message}`);
  }
}

class SMSNotification implements NotificationStrategy {
  async send(message: string): Promise<void> {
    console.log(`Enviando SMS: ${message}`);
  }
}

// Orquestador que usa ambos principios
class NotificationService {
  constructor(
    protected validator: UserPreferencesValidator,
    protected strategies: Map<string, NotificationStrategy>
  ) {}

  async notifyUser(user: User, message: string): Promise<void> {
    if (!this.validator.validate(user.preferences)) {
      throw new Error("Usuario no tiene preferencias de notificación válidas");
    }

    const notifications: Promise<void>[] = [];

    if (user.preferences.email) {
      notifications.push(
        this.strategies.get("email")?.send(message) || Promise.resolve()
      );
    }

    if (user.preferences.sms) {
      notifications.push(
        this.strategies.get("sms")?.send(message) || Promise.resolve()
      );
    }

    await Promise.all(notifications);
  }
}

// Ejercicio: Extiende el sistema agregando una nueva estrategia de notificación (Discord, Telegram, o Slack) sin modificar las clases existentes.

// 1. Nuevas Estrategias
class DiscordNotification implements NotificationStrategy {
  async send(message: string): Promise<void> {
    console.log(`Enviando mensaje a Discord: ${message}`);
  }
}
class SlackNotification implements NotificationStrategy {
  async send(message: string): Promise<void> {
    console.log(`Enviando mensaje a Slack: ${message}`);
  }
}

// 2. Extender el servicio de notificación para incluir la nueva estrategia

class ExtendedNotificationService extends NotificationService {
  async notifyUser(user: User, message: string): Promise<void> {
    // Llamamos a la lógica base para email/sms
    await super.notifyUser(user, message);

    // Agregamos la lógica nueva
    if (user.preferences.discord) {
      const discordStrategy = this.strategies.get("discord");
      if (discordStrategy) {
        await discordStrategy.send(message);
      }
    }
    if (user.preferences.slack) {
      const slackStrategy = this.strategies.get("slack");
      if (slackStrategy) {
        await slackStrategy.send(message);
      }
    }
  }
}

// Ejemplo de uso
async function main() {
  const validator = new UserPreferencesValidator();
  const strategies = new Map<string, NotificationStrategy>();

  strategies.set("email", new EmailNotification());
  strategies.set("sms", new SMSNotification());
  strategies.set("discord", new DiscordNotification());
  strategies.set("slack", new SlackNotification());

  const service = new ExtendedNotificationService(validator, strategies);

  const user: User = {
    id: "1",
    email: "test@test.com",
    phone: "123456789",
    preferences: {
      email: true,
      sms: false,
      push: false,
      discord: true,
      slack: true,
    },
  };

  console.log("Iniciando notificaciones...");
  await service.notifyUser(user, "Hola mundo!");
}

main().catch(console.error);
