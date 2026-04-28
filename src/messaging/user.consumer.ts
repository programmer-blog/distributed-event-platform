import * as amqp from 'amqplib';

export class UserConsumer {
  private channel;

  async start() {
    const connection = await amqp.connect('amqp://rabbitmq:5672');
    this.channel = await connection.createChannel();

    const queue = 'user_created';

    await this.channel.assertQueue(queue);

    this.channel.consume(queue, (msg) => {
      if (msg) {
        const data = JSON.parse(msg.content.toString());

        console.log('User Created Event Received:', data);

        // simulate background processing
        this.handleUserCreated(data);

        this.channel.ack(msg);
      }
    });
  }

  async handleUserCreated(data: any) {
    // simulate async job
    console.log('Processing user:', data.email);

    // examples (future):
    // send email
    // log analytics
    // trigger other systems
  }
}
