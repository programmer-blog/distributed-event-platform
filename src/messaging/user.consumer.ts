import * as amqp from 'amqplib';

export class UserConsumer {
  private channel;

  async start() {
    const connection = await amqp.connect('amqp://rabbitmq:5672');
    this.channel = await connection.createChannel();

    const queue = 'user_created';

    await this.channel.assertQueue(queue);

    this.channel.consume(queue, async (msg) => {
      const retryCount = msg.properties.headers?.retry || 0;

      try {
        const data = JSON.parse(msg.content.toString());

        await this.handleUserCreated(data);

        this.channel.ack(msg);
      } catch (error) {
        if (retryCount >= 3) {
          console.log('Max retries reached, sending to DLQ');

          this.channel.nack(msg, false, false); // drop message
          return;
        }

        this.channel.sendToQueue(queue, msg.content, {
          headers: {
            retry: retryCount + 1,
          },
        });

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
