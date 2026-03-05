import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: parseInt(process.env.MAIL_PORT || '587'),
      secure: false, // TLS
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
      },
    });
  }

  async sendEmail(options: EmailOptions): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: process.env.MAIL_FROM,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
      });
    } catch (error) {
      const err = error as { message?: string };
      console.error('Erro ao enviar email:', error);
      throw new Error(`Erro ao enviar email: ${err.message || 'desconhecido'}`);
    }
  }

  // Email de reset de senha
  async sendResetPasswordEmail(
    email: string,
    resetLink: string,
  ): Promise<void> {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(to right, #2563eb, #7c3aed); color: white; padding: 20px; border-radius: 10px; text-align: center;">
          <h1>🔐 Redefinir Senha</h1>
        </div>
        
        <div style="padding: 30px; background-color: #f8f9fa; border-radius: 10px; margin-top: 20px;">
          <p>Olá,</p>
          <p>Você solicitou a redefinição de senha para sua conta no <strong>CargaLog</strong>.</p>
          
          <p style="margin-top: 30px; text-align: center;">
            <a href="${resetLink}" style="background-color: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
              Redefinir Senha
            </a>
          </p>
          
          <p style="color: #666; font-size: 12px; margin-top: 20px;">
            Este link expira em 1 hora por questões de segurança.
          </p>
          
          <p style="color: #666; font-size: 12px;">
            Se você não solicitou esta redefinição, ignore este email.
          </p>
        </div>
        
        <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
          <p>© 2026 CargaLog. Todos os direitos reservados.</p>
        </div>
      </div>
    `;

    await this.sendEmail({
      to: email,
      subject: '🔐 Redefinir sua senha - CargaLog',
      html,
      text: `Clique neste link para redefinir sua senha: ${resetLink}\n\nEste link expira em 1 hora.`,
    });
  }

  // Email de confirmação de mudança de senha
  async sendPasswordChangedEmail(email: string): Promise<void> {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(to right, #10b981, #059669); color: white; padding: 20px; border-radius: 10px; text-align: center;">
          <h1>✅ Senha Alterada com Sucesso</h1>
        </div>
        
        <div style="padding: 30px; background-color: #f8f9fa; border-radius: 10px; margin-top: 20px;">
          <p>Sua senha foi alterada com sucesso!</p>
          
          <p style="color: #666; margin-top: 20px;">
            Se você não fez esta alteração, entre em contato conosco imediatamente.
          </p>
        </div>
        
        <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
          <p>© 2026 CargaLog. Todos os direitos reservados.</p>
        </div>
      </div>
    `;

    await this.sendEmail({
      to: email,
      subject: '✅ Sua senha foi alterada - CargaLog',
      html,
    });
  }

  // Email de perfil atualizado
  async sendProfileUpdatedEmail(email: string, nome: string): Promise<void> {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(to right, #2563eb, #7c3aed); color: white; padding: 20px; border-radius: 10px; text-align: center;">
          <h1>👤 Perfil Atualizado</h1>
        </div>
        
        <div style="padding: 30px; background-color: #f8f9fa; border-radius: 10px; margin-top: 20px;">
          <p>Olá ${nome},</p>
          <p>Seu perfil foi atualizado com sucesso no <strong>CargaLog</strong>.</p>
        </div>
        
        <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
          <p>© 2026 CargaLog. Todos os direitos reservados.</p>
        </div>
      </div>
    `;

    await this.sendEmail({
      to: email,
      subject: '👤 Seu perfil foi atualizado - CargaLog',
      html,
    });
  }
}
