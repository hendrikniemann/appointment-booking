import { Heading, Stack, Text } from '@chakra-ui/react';
import * as React from 'react';
import ReservationData from './ReservationData';

export type BookingConfirmationProps = {
  start: Date;
  end: Date;
};

export default function BookingConfirmation(props: BookingConfirmationProps) {
  return (
    <Stack
      w="100%"
      h="100%"
      justifyContent="center"
      alignItems="center"
      spacing="2"
      textAlign="center"
    >
      <Heading size="md">Booking complete!</Heading>
      <Text>
        I am looking forward to our meeting. I will probably send you a calendar invite later!
      </Text>
      <Text>Here is the date and time again:</Text>
      <ReservationData {...props} />
    </Stack>
  );
}
