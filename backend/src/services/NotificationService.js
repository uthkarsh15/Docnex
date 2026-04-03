class NotificationService {
    async sendNotification(userId, message) {
        console.log(`[Notification] To User ${userId}: ${message}`);
        // In a real app, integrate RabbitMQ/Email/SMS here
    }
}

module.exports = new NotificationService();
