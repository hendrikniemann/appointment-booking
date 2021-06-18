import { HStack, Box } from '@chakra-ui/react';
import { format } from 'date-fns';
import * as React from 'react';

export type ReservationDataProps = {
  start: Date;
  end: Date;
};

export default function ReservationData({ start, end }: ReservationDataProps) {
  return (
    <HStack maxWidth="200px">
      <Box p="2" fontWeight="semibold">
        {format(start, 'dd.MM')}
      </Box>
      <Box p="2" flexGrow={1} color="blackAlpha.700">
        {format(start, 'HH:mm') + ' - ' + format(end, 'HH:mm')}
      </Box>
    </HStack>
  );
}
