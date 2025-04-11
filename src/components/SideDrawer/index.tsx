import React from "react";
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from "@chakra-ui/react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  children?: React.ReactNode;
}

const SideDrawer: React.FC<Props> = ({isOpen, onClose, children}) => {
  return (
    <Drawer isOpen={isOpen} onClose={onClose} placement="left">
      <DrawerContent>
        {children}
      </DrawerContent>
    </Drawer>
  );
};

export default SideDrawer;
