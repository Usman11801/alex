import { Flex, Text } from "@chakra-ui/react";

const SignupHeader = () => {
  return (
    <Flex flexDir="column" alignItems="center" gap="0.5rem">
      <Text fontSize="1.75rem" textAlign="center" fontWeight="700">
        Create you account
      </Text>
      <Text color="#2D333A" fontSize="13px" textAlign="center">
        Please note that verification is required for <br /> signup.
      </Text>
    </Flex>
  );
};

export default SignupHeader;
