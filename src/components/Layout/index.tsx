import { PropsWithChildren, FC } from "react";
import { useRouter } from "next/router";
import { Box, Flex, Button, useDisclosure } from "@chakra-ui/react";
import { GiHamburgerMenu } from "react-icons/gi";

import useAuth from "@/hooks/useAuth";
import Topbar from "@/components/Layout/Topbar";
import Sidebar from "@/components/Sidebar";
import { useCurrentUserSelector } from "@/store/slices/user";
import { ROUTES } from "@/utils/constants";
import SideDrawer from "../SideDrawer";

type LayoutProps = PropsWithChildren & {};
const Layout: FC<LayoutProps> = ({ children }) => {
  useAuth();
  const pathsWithLayOut = [ROUTES.HOME];
  const currentUser = useCurrentUserSelector();
  const router = useRouter();
  const showTopAndSideBar =
    !!currentUser && pathsWithLayOut.includes(router.pathname);

  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Flex w="100vw" h="100vh" flexDir="column">
      <Flex w="100vw" h="100%">
        {showTopAndSideBar && (
          <SideDrawer isOpen={isOpen} onClose={onClose}>
            <Sidebar />
          </SideDrawer>
        )}
        {showTopAndSideBar && (
          <Box
            flex="2"
            display={{
              base: "none",
              sm: "none",
              md: "none",
              xl: "flex",
              "2xl": "flex",
            }}
          >
            <Sidebar />
          </Box>
        )}
        <Flex flex="10" h="100vh" flexDir="column">
          {showTopAndSideBar && <Topbar />}
          {showTopAndSideBar && (
            <Button
              display={{ xl: "none", "2xl": "none" }}
              w="fit-content"
              position="absolute"
              top="0.5rem"
              left="0.5rem"
              onClick={onOpen}
            >
              <GiHamburgerMenu />
            </Button>
          )}
          <Box flex="1" flexGrow="1" minH="0">
            {children}
          </Box>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default Layout;
