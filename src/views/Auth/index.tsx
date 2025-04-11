import { Flex } from "@chakra-ui/react";
import SignIn from "@/views/Auth/SignIn";

const Auth = () => {
  return (
    <Flex alignItems="center" justifyContent="center" h="100%">
      <SignIn />
    </Flex>
  );
};

export default Auth;
