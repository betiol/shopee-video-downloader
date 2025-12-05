import * as React from "react";
import {
    Html,
    Head,
    Body,
    Container,
    Section,
    Text,
    Link,
    Hr,
} from "@react-email/components";

interface ThankYouEmailProps {
    userName?: string;
    userEmail: string;
}

export const ThankYouEmail: React.FC<ThankYouEmailProps> = ({
    userName,
    userEmail,
}) => (
    <Html>
        <Head />
        <Body style={main}>
            <Container style={container}>
                {/* Header */}
                <Section style={header}>
                    <Text style={emoji}>🎉</Text>
                    <Text style={headerTitle}>Bem-vindo ao Premium!</Text>
                </Section>

                {/* Content */}
                <Section style={content}>
                    <Text style={paragraph}>
                        Olá{userName ? ` ${userName}` : ""}! 👋
                    </Text>

                    <Text style={paragraph}>
                        <strong>Obrigado por fazer upgrade para o plano Premium!</strong> Estamos muito felizes em tê-lo(a) conosco.
                    </Text>

                    <Text style={paragraph}>
                        Seu pagamento foi confirmado com sucesso e agora você tem acesso a todos os benefícios premium:
                    </Text>

                    {/* Features */}
                    <Section style={feature}>
                        <Text style={featureTitle}>✨ Downloads Ilimitados</Text>
                        <Text style={featureDescription}>
                            Baixe quantos vídeos quiser, sem limites diários!
                        </Text>
                    </Section>

                    <Section style={feature}>
                        <Text style={featureTitle}>💧 Sem Marca d'Água</Text>
                        <Text style={featureDescription}>
                            Todos os vídeos sem marca d'água da Shopee.
                        </Text>
                    </Section>

                    <Section style={feature}>
                        <Text style={featureTitle}>⚡ Acesso Vitalício</Text>
                        <Text style={featureDescription}>
                            Pagamento único, acesso para sempre!
                        </Text>
                    </Section>

                    {/* CTA Button */}
                    <Section style={buttonContainer}>
                        <Link
                            href={process.env.NEXT_PUBLIC_APP_URL || 'https://shopeevideodownloader.com'}
                            style={button}
                        >
                            Começar a Baixar Vídeos
                        </Link>
                    </Section>

                    <Text style={paragraph}>
                        Se tiver qualquer dúvida ou precisar de ajuda, não hesite em nos contatar. Estamos aqui para ajudar!
                    </Text>

                    <Text style={paragraph}>
                        Aproveite seu acesso premium! 🚀
                    </Text>

                    <Text style={signature}>
                        Atenciosamente,<br />
                        <strong>Equipe Shopee Video Downloader</strong>
                    </Text>
                </Section>

                {/* Footer */}
                <Section style={footer}>
                    <Text style={footerText}>
                        Este email foi enviado para <strong>{userEmail}</strong>
                    </Text>
                    <Text style={footerCopyright}>
                        © {new Date().getFullYear()} Shopee Video Downloader. Todos os direitos reservados.
                    </Text>
                </Section>
            </Container>
        </Body>
    </Html>
);

// Styles
const main = {
    backgroundColor: '#f6f9fc',
    fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
    backgroundColor: '#ffffff',
    margin: '0 auto',
    padding: '20px 0',
    marginBottom: '64px',
};

const header = {
    background: 'linear-gradient(135deg, #9333ea 0%, #a855f7 100%)',
    borderRadius: '10px 10px 0 0',
    padding: '40px 20px',
    textAlign: 'center' as const,
};

const emoji = {
    fontSize: '48px',
    margin: '20px 0',
    textAlign: 'center' as const,
};

const headerTitle = {
    color: '#ffffff',
    fontSize: '28px',
    fontWeight: 'bold',
    margin: '0',
    textAlign: 'center' as const,
};

const content = {
    padding: '40px 30px',
};

const paragraph = {
    color: '#333',
    fontSize: '16px',
    lineHeight: '26px',
    margin: '16px 0',
};

const feature = {
    backgroundColor: '#f9fafb',
    borderLeft: '4px solid #9333ea',
    borderRadius: '4px',
    padding: '15px',
    margin: '10px 0',
};

const featureTitle = {
    color: '#9333ea',
    fontSize: '16px',
    fontWeight: '600',
    margin: '0 0 5px 0',
};

const featureDescription = {
    color: '#666',
    fontSize: '14px',
    margin: '0',
};

const buttonContainer = {
    textAlign: 'center' as const,
    margin: '30px 0',
};

const button = {
    backgroundColor: '#9333ea',
    borderRadius: '8px',
    color: '#fff',
    fontSize: '16px',
    fontWeight: '600',
    textDecoration: 'none',
    textAlign: 'center' as const,
    display: 'inline-block',
    padding: '15px 30px',
};

const signature = {
    color: '#333',
    fontSize: '16px',
    lineHeight: '26px',
    marginTop: '30px',
    marginBottom: '0',
};

const footer = {
    backgroundColor: '#f9fafb',
    borderRadius: '0 0 10px 10px',
    padding: '30px',
    textAlign: 'center' as const,
};

const footerText = {
    color: '#6b7280',
    fontSize: '14px',
    margin: '0 0 10px 0',
};

const footerCopyright = {
    color: '#6b7280',
    fontSize: '12px',
    margin: '10px 0 0 0',
};

export default ThankYouEmail;

