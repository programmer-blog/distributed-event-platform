import { Injectable, OnModuleInit } from '@nestjs/common';
import { connect, Channel, ChannelModel } from 'amqplib';

@Injectable()
export class RabbitMQService implements OnModuleInit {
  private connection!: ChannelModel;
  private channel!: Channel;

  async onModuleInit() {
    await this.connect();
  }

  async connect(retries = 5) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      this.connection = await connect('amqp://rabbitmq:5672');
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      this.channel = await this.connection.createChannel();
      console.log('✅ RabbitMQ connected');
    } catch (err) {
      console.error('❌ RabbitMQ connection failed, retrying...', err);

      if (retries === 0) {
        throw err;
      }

      await new Promise((res) => setTimeout(res, 5000)); // wait 5s
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return this.connect(retries - 1);
    }
  }

  async publish(queue: string, message: unknown) {
    await this.channel.assertQueue(queue);
    this.channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
  }
}
