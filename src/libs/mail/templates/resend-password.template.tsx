import { Body, Heading, Link, Text } from '@react-email/components';
import { Html } from '@react-email/html';
import * as React from 'react';

interface ResetPasswordTemplateProps {
  domain: string;
  token: string;
}

export function ResetPasswordTemplate({
  domain,
  token,
}: ResetPasswordTemplateProps) {
  const confirmLink = `${domain}/auth/new-password?token=${token}`;

  return (
    <Html>
      <Body>
        <Heading>Reset password</Heading>
        <Text>Hi! Please confirm reset your password.</Text>
        <Link href={confirmLink}>Confirm reset password</Link>
        <Text>Thank you!</Text>
      </Body>
    </Html>
  );
}
