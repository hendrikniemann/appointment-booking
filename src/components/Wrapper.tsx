import { Center, Link, Text, VStack } from "@chakra-ui/layout";
import { ChakraProvider, Image } from "@chakra-ui/react";
import * as React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import theme from "../theme";
import BookingCard from "./BookingCard";

const client = new QueryClient();

export default class Wrapper extends React.Component<{}> {
  state: { error?: string } = {};

  componentDidCatch() {}

  render() {
    if (this.state.error) {
      return this.state.error;
    }
    return (
      <QueryClientProvider client={client}>
        <ChakraProvider theme={theme}>
          <Center minH="100vh" bg="gray.100">
            <VStack spacing="12" w={["100%", "auto"]}>
              <BookingCard />
              <Center display={["none", "flex"]}>
                <Text color="gray.600">
                  Open Source and powered by{" "}
                  <Link href="https://leasy.dev" isExternal>
                    <Image
                      pl="1"
                      display="inline"
                      h="4"
                      src="logo-dark.svg"
                      alt="Leasy"
                    />
                  </Link>
                </Text>
              </Center>
            </VStack>
          </Center>
        </ChakraProvider>
      </QueryClientProvider>
    );
  }
}
