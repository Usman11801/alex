import { Flex, Text, Box } from "@chakra-ui/react";
import UserMenu from "@/components/Layout/Topbar/UserMenu";
import { useCurrentChatSelector } from "@/store/slices/user";

const Topbar = () => {
  const currentChat = useCurrentChatSelector();

  return (
    <Flex p="0.5rem 2rem" alignItems="center" justifyContent="space-between">
      <Flex>
        {!!currentChat && (
          <Box
            color="#EA4335"
            border={`1px solid #EA4335`}
            borderRadius="lg"
            px="1rem"
            userSelect="none"
            display={{
              base: "none",
              sm: "none",
              md: "none",
              xl: "flex",
              "2xl": "flex",
            }}
          >
            <Text fontSize="11px" fontWeight="500">
              {currentChat?.name}
            </Text>
          </Box>
        )}
      </Flex>
      <UserMenu />
    </Flex>
  );
};

export default Topbar;
