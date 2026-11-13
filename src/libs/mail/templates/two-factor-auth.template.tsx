import { Body, Heading, Text } from '@react-email/components';
import { Html } from '@react-email/html';
import * as React from 'react';

interface TwoFactorTemplateProps {
  token: string;
}

export function TwoFactorTemplate({ token }: TwoFactorTemplateProps) {
  return (
    <Html>
      <Body>
        <Heading>Two-factor auth</Heading>
        <Text>
          Here is your code for two-factor authentication:{' '}
          <strong>{token}</strong>.
        </Text>
        <Text>
          Please enter this code in the app to complete authentication.
        </Text>
        <Text>If you did not request this code, simply ignore it.</Text>
      </Body>
    </Html>
  );
}
