import { Box, Center, Flex, HStack, IconButton, Spinner, Text, VStack } from '@chakra-ui/react';
import * as React from 'react';
import { addWeeks, eachWeekOfInterval, format, getWeek, getWeekYear } from 'date-fns';
import { endOfWeek } from 'date-fns/esm';
import { useQuery } from 'react-query';
import { ArrowForwardIcon } from '@chakra-ui/icons';
import { getSlotsInInterval } from '../api';
import ErrorDisplay from './ErrorDisplay';

export type CalendarProps = {
  resourceId: string;
  onAppointmentSelect: (appointment: { startTime: string; endTime: string }) => void;
};

const weekNumberingOptions: { weekStartsOn: 0 | 1 | 2 | 3 | 4 | 5 | 6 } = {
  weekStartsOn: 1,
};

export default function Calendar(props: CalendarProps) {
  const weeks = React.useMemo(() => {
    return eachWeekOfInterval(
      { start: Date.now(), end: addWeeks(Date.now(), 4) },
      weekNumberingOptions
    ).map((startOfWeek) => ({
      year: getWeekYear(startOfWeek, weekNumberingOptions),
      week: getWeek(startOfWeek, weekNumberingOptions),
      startOfWeek,
      endOfWeek: endOfWeek(startOfWeek, weekNumberingOptions),
    }));
  }, []);
  const [weekIndex, setWeekIndex] = React.useState(0);
  const currentWeek = weeks[weekIndex];
  const appointments = useQuery(['fetchWeek', currentWeek.year + '-' + currentWeek.week], () =>
    getSlotsInInterval(props.resourceId, {
      start: currentWeek.startOfWeek,
      end: currentWeek.endOfWeek,
    })
  );

  return (
    <Box>
      <HStack>
        {weeks.map((week, index) => (
          <WeekButton
            key={week.year + '-' + week.week}
            onClick={() => setWeekIndex(index)}
            calendarWeek={week.week}
            active={weekIndex === index}
          />
        ))}
      </HStack>
      <VStack py="4" height="300px" overflowY="auto">
        {(() => {
          if (appointments.isLoading) {
            return (
              <Center h="100%">
                <Spinner />
              </Center>
            );
          } else if (appointments.isError) {
            if (appointments.error instanceof Error) {
              return <ErrorDisplay error={appointments.error.message} />;
            }
            throw new Error('Unknown error type thrown in React Query fetch function');
          } else if (!appointments.data?.resource) {
            return <ErrorDisplay error="Resource was not found." />;
          } else if (!appointments.data.resource.slots.edges) {
            return <ErrorDisplay error="No calendar defined for resource." />;
          } else if (appointments.data.resource.slots.edges.length === 0) {
            return (
              <Center h="100%">
                <Text maxWidth="200px" textAlign="center" color="gray.600">
                  No apointments available for this week.
                </Text>
              </Center>
            );
          }
          return appointments.data?.resource?.slots.edges?.map((edge) => {
            if (!edge || !edge.node || !edge.node.available) {
              return null;
            }
            const appointment = edge.node;
            return (
              <AppointmentSlot
                key={appointment.startTime}
                start={appointment.startTime}
                end={appointment.endTime}
                onClick={() => props.onAppointmentSelect(appointment)}
              />
            );
          });
        })()}
      </VStack>
    </Box>
  );
}

type WeekButtonProps = {
  calendarWeek: number;
  active: boolean;
  onClick: React.EventHandler<React.SyntheticEvent<HTMLElement>>;
};

function WeekButton({ calendarWeek, onClick, active }: WeekButtonProps) {
  return (
    <Box
      as="button"
      display="flex"
      flexDirection="column"
      overflow="hidden"
      onClick={onClick}
      textAlign="center"
      rounded="md"
      bg={active ? 'blue.100' : 'none'}
      _hover={{ bg: 'blue.200' }}
      p="1"
    >
      <Box color="blue.800" px="3" fontSize="0.75rem">
        KW
      </Box>
      <Box color="blackAlpha.700" textAlign="center" w="100%">
        {calendarWeek}
      </Box>
    </Box>
  );
}

type AppointmentSlotProps = {
  start: string;
  end: string;
  onClick: React.EventHandler<React.SyntheticEvent<HTMLButtonElement>>;
};

function AppointmentSlot(props: AppointmentSlotProps) {
  const start = new Date(props.start);
  const end = new Date(props.end);
  return (
    <Flex
      width="100%"
      py="1"
      px="2"
      rounded="md"
      alignItems="center"
      border="1px solid"
      borderColor="gray.100"
    >
      <Box p="2" fontWeight="semibold">
        {format(start, 'dd.MM')}
      </Box>
      <Box p="2" flexGrow={1} color="blackAlpha.700">
        {format(start, 'HH:mm') + ' - ' + format(end, 'HH:mm')}
      </Box>
      <IconButton
        size="sm"
        colorScheme="blue"
        icon={<ArrowForwardIcon />}
        aria-label="Book Appointment"
        onClick={props.onClick}
      />
    </Flex>
  );
}
