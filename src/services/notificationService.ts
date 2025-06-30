import { FEATURES } from '../config/integrations';

export interface NotificationConfig {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  requireInteraction?: boolean;
}

export class NotificationService {
  private static instance: NotificationService;
  private permission: NotificationPermission = 'default';

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  async initialize(): Promise<void> {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications');
      return;
    }

    this.permission = await Notification.requestPermission();
  }

  async sendNotification(config: NotificationConfig): Promise<void> {
    if (this.permission !== 'granted') {
      console.warn('Notification permission not granted');
      return;
    }

    try {
      const notification = new Notification(config.title, {
        body: config.body,
        icon: config.icon || '/favicon.ico',
        badge: config.badge || '/favicon.ico',
        tag: config.tag,
        requireInteraction: config.requireInteraction || false,
      });

      // Auto-close after 5 seconds unless requireInteraction is true
      if (!config.requireInteraction) {
        setTimeout(() => notification.close(), 5000);
      }
    } catch (error) {
      console.error('Failed to send notification:', error);
    }
  }

  // Financial event notifications
  async notifyBudgetAlert(category: string, percentage: number): Promise<void> {
    await this.sendNotification({
      title: '💰 Budget Alert',
      body: `You've spent ${percentage}% of your ${category} budget this month`,
      tag: 'budget-alert',
      requireInteraction: true,
    });
  }

  async notifyGoalProgress(goalName: string, progress: number): Promise<void> {
    await this.sendNotification({
      title: '🎯 Goal Progress',
      body: `${goalName} is ${progress}% complete! Keep going!`,
      tag: 'goal-progress',
    });
  }

  async notifyInvestmentUpdate(symbol: string, change: number): Promise<void> {
    const emoji = change >= 0 ? '📈' : '📉';
    await this.sendNotification({
      title: `${emoji} Investment Update`,
      body: `${symbol} is ${change >= 0 ? 'up' : 'down'} ${Math.abs(change).toFixed(2)}% today`,
      tag: 'investment-update',
    });
  }

  async notifyTransactionAdded(amount: number, type: 'income' | 'expense'): Promise<void> {
    const emoji = type === 'income' ? '💰' : '💸';
    await this.sendNotification({
      title: `${emoji} Transaction Added`,
      body: `${type === 'income' ? 'Income' : 'Expense'} of ₹${amount.toLocaleString()} recorded`,
      tag: 'transaction-added',
    });
  }
}