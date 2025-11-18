import { PrismaClient } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate';
import { CreateUserInput } from '../types/services/prisma.type';

class PrismaService {
    private static instance: PrismaService;
    private client: any;

    private constructor() { }

    public static getInstance(): PrismaService {
        if (!PrismaService.instance) {
            PrismaService.instance = new PrismaService();
        }
        return PrismaService.instance;
    }

    public async initialize(): Promise<void> {
        if (!this.client) {
            this.client = new PrismaClient().$extends(withAccelerate());
        }
    }

    public getClient() {
        if (!this.client) {
            throw new Error('PrismaService not initialized. Call initialize() first.');
        }
        return this.client;
    }

    public async disconnect(): Promise<void> {
        if (this.client) {
            await this.client.$disconnect();
            this.client = null;
        }
    }

    public async createUser(data: CreateUserInput) {
        const client = this.getClient();

        const user = await client.user.create({
            data: {
                email: data.email,
                password: data.password,
                role: data.role,
                name: data.name,
                phone: data.phone,
                company: data.company,
            },
        });

        return user;
    }
}

export const primsaService = PrismaService.getInstance();
