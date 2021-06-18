import { Alert, AlertIcon, AlertTitle, AlertDescription } from '@chakra-ui/react';
import * as React from 'react';

export type ErrorDisplayProps = {
  error: string;
};

export default function ErrorDisplay(props: ErrorDisplayProps) {
  return (
    <Alert
      status="error"
      variant="subtle"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      textAlign="center"
      height="100%"
    >
      <AlertIcon boxSize="40px" mr={0} />
      <AlertTitle mt={4} mb={1} fontSize="lg">
        There was an error
      </AlertTitle>
      <AlertDescription maxWidth="sm">
        {/* @ts-expect-error */}
        {process.env.NODE_ENV === 'production' ? (
          <>
            This was not supposed to happen. Could you{' '}
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://github.com/hendrikniemann/appointment-booking/issues/new"
            >
              open an issue
            </a>
            ?
          </>
        ) : (
          props.error
        )}
      </AlertDescription>
    </Alert>
  );
}
