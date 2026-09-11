export declare class EmailService {
    private readonly logger;
    private transporter;
    sendEmail(to: string, subject: string, template: string): Promise<void>;
}
