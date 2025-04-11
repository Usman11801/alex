import {
  Flex,
  Input,
  Text,
  InputGroup,
  InputProps,
  Box,
  Button,
} from "@chakra-ui/react";
import { FC, useState } from "react";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import { AuthError, User } from "firebase/auth";

import { useCurrentUserSelector } from "@/store/slices/user";
import { ROUTES } from "@/utils/constants";
import Switch from "@/components/Switch";
import SignupHeader from "@/views/Signup/SignUpHeader";
import {
  useSetDefaultRemainingTokensMutation,
  useSetIsCompletedSignupMutation,
  useUpdateUserDepartmentMutation,
} from "@/store/apis/db";
import useCustomToast from "@/hooks/useCustomToast";

const Verification: React.FC = () => {
  const router = useRouter();
  const [updateUserDepartment, { isLoading: isUpdateUserDepartmentLoading }] =
    useUpdateUserDepartmentMutation();
  const [setDefaultRemainingTokens] = useSetDefaultRemainingTokensMutation();
  const [setIsCompletedSignup] = useSetIsCompletedSignupMutation();
  const toast = useCustomToast();
  const [isInDepartment, setInIsDepartment] = useState(true);
  const [error, setError] = useState("");
  const user = useCurrentUserSelector() as User;

  const formik = useFormik({
    initialValues: {
      department: "",
    },
    onSubmit: async (values) => {
      const { department } = values;
      try {
        if (!isInDepartment) {
          await setIsCompletedSignup({ userId: user.uid });
          await setDefaultRemainingTokens({ userId: user.uid });

          toast("Welcome!", "success");

          router.push(ROUTES.HOME);
          return;
        }
        if (!department) {
          setError("Please enter your department.");
          return;
        }

        if (!user?.uid) {
          setError("User not found.");
          return;
        }

        await updateUserDepartment({
          userId: user.uid,
          departmentName: department,
        });
        await setIsCompletedSignup({ userId: user.uid });
        await setDefaultRemainingTokens({ userId: user.uid });

        toast("Welcome!", "success");

        router.push(ROUTES.HOME);
      } catch (err) {
        const { message } = err as AuthError;
        toast(message, "error");
      }
    },
  });

  const { values, handleSubmit, handleChange, handleBlur } = formik;

  const handleClickLogin = () => {
    router.push(ROUTES.LOGIN);
  };

  const handleSwitchChange = (value: boolean) => {
    setInIsDepartment(value);
  };

  const handleChangeDepartment = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleChange(e);
    setError("");
  };

  return (
    <Flex
      flexDir="column"
      w="20rem"
      minH="10rem"
      alignItems="center"
      gap="1rem"
    >
      <SignupHeader />
      <Box w="100%">
        <form onSubmit={handleSubmit}>
          <Flex flexDir="column" w="100%" gap="1rem">
            <DepartmentSwitch
              isInDepartment={isInDepartment}
              onSelect={handleSwitchChange}
            />
            <DeparmentInput
              value={values.department}
              id="department"
              name="department"
              onChange={handleChangeDepartment}
              onBlur={handleBlur}
              visibility={isInDepartment ? "visible" : "hidden"}
              errorBorderColor="red.500"
              boxShadow={error ? "none !important" : ""}
              isInvalid={!!error}
            />
            <Text
              fontSize="0.75rem"
              visibility={error ? "visible" : "hidden"}
              color="red.500"
            >
              {error}
            </Text>
            <Button
              mt={20}
              variant="solid"
              backgroundColor="#EA4335"
              color="white"
              type="submit"
              isLoading={isUpdateUserDepartmentLoading}
            >
              Continue
            </Button>
          </Flex>
        </form>
      </Box>
      <Flex>
        <Text mr="1">Already have an account?</Text>
        <Button variant="link" color="#EA4335" onClick={handleClickLogin}>
          Log in
        </Button>
      </Flex>
    </Flex>
  );
};

type DeparmentSwitchProps = {
  isInDepartment: boolean;
  onSelect: (value: boolean) => void;
};
const DepartmentSwitch: React.FC<DeparmentSwitchProps> = ({
  onSelect,
  isInDepartment,
}) => {
  return (
    <Box borderColor="gray.200" borderWidth="1px" borderRadius={6}>
      <Flex
        height="38px"
        justify="space-between"
        alignItems="center"
        padding="0 1rem"
      >
        <Text color="gray.500">Part of a department?</Text>
        <Switch onSelect={onSelect} isInDepartment={isInDepartment} />
      </Flex>
    </Box>
  );
};

type DeparmentInputProps = InputProps & {};
const DeparmentInput: FC<DeparmentInputProps> = ({ ...inputProps }) => {
  return (
    <InputGroup>
      <Input placeholder="Department name" type="text" {...inputProps} />
    </InputGroup>
  );
};

export default Verification;
