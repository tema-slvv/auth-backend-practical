import { Body, Heading, Link, Text } from '@react-email/components';
import { Html } from '@react-email/html';
import * as React from 'react';

interface ConfirmationTemplateProps {
  domain: string;
  token: string;
}

export function ConfirmationTemplate({
  domain,
  token,
}: ConfirmationTemplateProps) {
  const confirmLink = `${domain}/auth/new-verification?token=${token}`;

  return (
    <Html>
      <Body>
        <Heading>Confirmation email</Heading>
        <Text>Hi! Please confirm your email.</Text>
        <Link href={confirmLink}>Confirm email</Link>
        <Text>Thank you!</Text>
      </Body>
    </Html>
  );
}
