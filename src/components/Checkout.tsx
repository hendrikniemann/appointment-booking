import { Heading, VStack } from '@chakra-ui/layout';
import {
  ButtonGroup,
  Button,
  FormControl,
  FormLabel,
  Input,
  FormHelperText,
  Portal,
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  CloseButton,
} from '@chakra-ui/react';
import * as React from 'react';
import { Reservation } from '../api';
import ReservationData from './ReservationData';

export type CheckoutProps = {
  reservation: Reservation;
  error?: string | null;
  onComplete: (payload: { name: string; email: string }) => void;
  onCancel: () => void;
};

export default function Checkout(props: CheckoutProps) {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');

  const onSubmit: React.FormEventHandler = (event) => {
    event.preventDefault();
    return props.onComplete({ name, email });
  };

  const start = new Date(props.reservation.bookings[0].startTime);
  const end = new Date(props.reservation.bookings[0].endTime);
  return (
    <VStack>
      {props.error && (
        <Portal>
          <Alert status="error">
            <AlertIcon />
            <AlertTitle mr={2}>There was an error:</AlertTitle>
            <AlertDescription>{props.error}</AlertDescription>
          </Alert>
        </Portal>
      )}
      <Heading size="sm">Confirm your reservation</Heading>
      <ReservationData start={start} end={end} />
      <VStack as="form" onSubmit={onSubmit} spacing="4" alignItems="flex-start">
        <FormControl id="name" isRequired isInvalid={name.length > 0 && name.length < 3}>
          <FormLabel>Name</FormLabel>
          <Input
            type="text"
            value={name}
            size="sm"
            onChange={(e) => setName(e.currentTarget.value)}
          />
          <FormHelperText>Put your name here so I know who you are!</FormHelperText>
        </FormControl>
        <FormControl id="email" isRequired>
          <FormLabel>Email</FormLabel>
          <Input
            type="email"
            value={email}
            size="sm"
            onChange={(e) => setEmail(e.currentTarget.value)}
          />
          <FormHelperText>Put your email here so I can send you a calendar invite!</FormHelperText>
        </FormControl>
        <ButtonGroup>
          <Button size="sm" type="submit" variant="solid" colorScheme="blue">
            Confirm
          </Button>
          <Button
            size="sm"
            type="button"
            variant="outline"
            colorScheme="gray"
            onClick={props.onCancel}
          >
            Cancel
          </Button>
        </ButtonGroup>
      </VStack>
    </VStack>
  );
}
