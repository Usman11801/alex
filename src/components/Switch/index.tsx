import React from "react";
import { Box, Button } from "@chakra-ui/react";

interface Props {
  isInDepartment: boolean;
  onSelect: (value: boolean) => void;
}

const DepartmentSwitch: React.FC<Props> = ({ onSelect, isInDepartment }) => {
  return (
    <Box display="flex">
      <Box
        backgroundColor={isInDepartment ? "green.400" : "gray.300"}
        padding="8px 16px"
        cursor="pointer"
        onClick={() => onSelect(true)}
      >
        Yes
      </Box>
      <Box
        backgroundColor={isInDepartment ? "gray.300" : "red.600"}
        padding="8px 16px"
        cursor="pointer"
        onClick={() => onSelect(false)}
      >
        No
      </Box>
    </Box>
  );
};

export default DepartmentSwitch;
