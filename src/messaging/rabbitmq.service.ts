import { Injectable, OnModuleInit } from '@nestjs/common';
import { connect, Channel, ChannelModel } from 'amqplib';

@Injectable()
export class RabbitMQService implements OnModuleInit {
  private connection!: ChannelModel;
  private channel!: Channel;

  async onModuleInit() {
    this.startConnection(); // ❗ do NOT block app startup
  }

  private async startConnection() {
    let retries = 10;

    while (retries > 0) {
      try {
        this.connection = await connect('amqp://rabbitmq:5672');
        this.channel = await this.connection.createChannel();

        console.log('✅ RabbitMQ connected');
        return;
      } catch (err) {
        retries--;

        console.log(`❌ RabbitMQ retrying... (${retries} left)`);

        await new Promise((res) => setTimeout(res, 5000));
      }
    }

    console.error('❌ RabbitMQ failed to connect after retries');
  }

  async publish(queue: string, message: unknown) {
    if (!this.channel) {
      console.log('⚠️ RabbitMQ not ready, skipping publish');
      return;
    }

    await this.channel.assertQueue(queue);
    this.channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
  }
}
