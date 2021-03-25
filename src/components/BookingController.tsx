import { isValid } from 'date-fns';
import * as React from 'react';

export type BookingControllerProps = {
  modelId: string;
}

export default function BookingController(props: BookingControllerProps) {
  const [reservation, setReservation] = useReservation();
  return (

  );
}

type Reservation = {
  id: string;
  startTime: string;
  endTime: string;
}

/**
 * Hook, that saves the current reservation to session storage
 */
function useReservation(): [Reservation | null, (reservation: Reservation) => void] {
  const [reservation, _setReservation] = React.useState<Reservation | null>(() => {
    try {
      const cachedReservationString = window.sessionStorage.getItem('reservation');
      if (cachedReservationString) {
        const cachedReservation = JSON.parse(cachedReservationString);
        if (
          typeof cachedReservation === 'object' &&
          cachedReservation !== null &&
          typeof cachedReservation.id === 'string' &&
          typeof cachedReservation.startTime === 'string' &&
          typeof cachedReservation.endTime === 'string' &&
          isValid(new Date(cachedReservation.startTime)) &&
          isValid(new Date(cachedReservation.endTime))
        ) {
          return cachedReservation;
        }
        console.warn('Existing cached reservation is invalid.');
      }
    } finally {
      return null;
    }
  });

  function setReservation(reservation: Reservation | null) {
    try {
      if (reservation === null) {
        window.sessionStorage.removeItem('reservation');
      } else {
        window.sessionStorage.setItem('reservation', JSON.stringify(reservation))
      }
    } catch {
      console.warn('Updating reservation in session storage failed.');
    }
    _setReservation(reservation);
  }

  return [reservation, setReservation];
}
