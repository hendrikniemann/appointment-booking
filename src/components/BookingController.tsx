import * as React from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { createReservation, completeReservation, cancelReservation } from '../api';
import BookingConfirmation from './BookingConfirmation';
import Calendar from './Calendar';
import Checkout from './Checkout';

export type BookingControllerProps = {
  resourceId: string;
};

export default function BookingController(props: BookingControllerProps) {
  const queryClient = useQueryClient();
  const createReservationMutation = useMutation(createReservation);
  const completeReservationMutation = useMutation(completeReservation);
  const cancelReservationMutation = useMutation(cancelReservation, {
    onSuccess: () => createReservationMutation.reset(),
    onSettled: () => queryClient.invalidateQueries(),
  });
  const reservation = completeReservationMutation.data ?? createReservationMutation.data ?? null;

  function onAppointmentSelect(selection: { startTime: string; endTime: string }) {
    return createReservationMutation.mutateAsync(selection);
  }

  function onCompleteReservation(payload: { name: string; email: string }) {
    if (reservation) {
      return completeReservationMutation.mutateAsync({
        reservationId: reservation?.id,
        ...payload,
      });
    }
    throw new Error('Cannot complete reservation without selecting a reservation first.');
  }

  function onCancelRerservation() {
    // We can only cancel a reservation if it has not been completed yet
    if (reservation && reservation.completedAt === null) {
      return cancelReservationMutation.mutateAsync({ reservationId: reservation.id });
    }
  }

  if (reservation === null) {
    return <Calendar resourceId={props.resourceId} onAppointmentSelect={onAppointmentSelect} />;
  } else if (reservation.completedAt === null) {
    return (
      <Checkout
        // @ts-expect-error
        error={completeReservationMutation.error?.message}
        reservation={reservation}
        onComplete={onCompleteReservation}
        onCancel={onCancelRerservation}
      />
    );
  } else {
    return (
      <BookingConfirmation
        start={new Date(reservation.bookings[0].startTime)}
        end={new Date(reservation.bookings[0].endTime)}
      />
    );
  }
}
