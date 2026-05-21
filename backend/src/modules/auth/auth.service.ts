import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async register(data: {
    name: string;
    email?: string;
    phone?: string;
    password: string;
    role?: 'buyer' | 'seller';
  }) {
    const hashedPassword = await bcrypt.hash(data.password, 12);

    const user = await this.prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        passwordHash: hashedPassword,
        role: data.role || 'buyer',
      },
    });

    const token = this.generateToken(user.id, user.role);

    return {
      user: { id: user.id, name: user.name, email: user.email, phone: user.phone, role: user.role },
      token,
    };
  }

  async login(identifier: string, password: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: identifier }, { phone: identifier }],
      },
    });

    if (!user || !user.passwordHash) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.generateToken(user.id, user.role);

    return {
      user: { id: user.id, name: user.name, email: user.email, phone: user.phone, role: user.role },
      token,
    };
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        avatar: true,
        role: true,
        emailVerified: true,
        phoneVerified: true,
        createdAt: true,
      },
    });

    if (!user) throw new UnauthorizedException('User not found');
    return user;
  }

  private generateToken(userId: string, role: string): string {
    const secret = process.env.JWT_SECRET || 'kora-dev-secret-change-in-production';
    return jwt.sign({ sub: userId, role }, secret, { expiresIn: '7d' });
  }

  verifyToken(token: string): { sub: string; role: string } {
    const secret = process.env.JWT_SECRET || 'kora-dev-secret-change-in-production';
    return jwt.verify(token, secret) as { sub: string; role: string };
  }
}
