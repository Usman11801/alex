import {
  Flex,
  Input,
  Text,
  InputGroup,
  InputProps,
  Box,
  Button,
  Divider,
} from "@chakra-ui/react";
import { FC, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  createUserWithEmailAndPassword,
  AuthError,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";

import { getAuth } from "@/utils/firebase";
import { ROUTES } from "@/utils/constants";
import SignupHeader from "@/views/Signup/SignUpHeader";
import useCustomToast from "@/hooks/useCustomToast";
import { FcGoogle } from "react-icons/fc";
import { useCurrentUserSelector } from "@/store/slices/user";

interface Props {
  onDone: () => void;
}

const SignupSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string()
    .matches(
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
      "Password must contain at least 8 characters, one uppercase, and one number"
    )
    .required("Required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Required"),
});

const SignIn: React.FC<Props> = ({ onDone }) => {
  const [isResetting, setIsResetting] = useState(false);
  const router = useRouter();
  const toast = useCustomToast();
  const currentUser = useCurrentUserSelector();

  useEffect(() => {
    if (currentUser) {
      onDone();
    }
  }, [currentUser, onDone]);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: SignupSchema,
    onSubmit: async (values) => {
      const auth = getAuth();
      const { email, password, confirmPassword } = values;
      try {
        if (password !== confirmPassword) return;
        const res = await createUserWithEmailAndPassword(auth, email, password);
        if (res.user) {
          onDone();
        }
      } catch (err) {
        const { message } = err as AuthError;
        toast(message, "error");
      }
    },
  });

  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleSubmit,
    handleChange,
    handleBlur,
  } = formik;

  const handleClickLogin = () => {
    router.push(ROUTES.LOGIN);
  };

  const handleSignInWithGoogle = async () => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    const res = await signInWithPopup(auth, provider);
    if (res.user) {
      onDone();
    }
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
            <EmailInput
              value={values.email}
              id="email"
              name="email"
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.email && touched.email && (
              <Text fontSize={11} color="red.300">
                {errors.email}
              </Text>
            )}
            <PasswordInput
              value={values.password}
              id="password"
              name="password"
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.password && touched.password && (
              <Text fontSize={11} color="red.300">
                {errors.password}
              </Text>
            )}
            <ConfirmPasswordInput
              value={values.confirmPassword}
              id="confirmPassword"
              name="confirmPassword"
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.confirmPassword && touched.confirmPassword && (
              <Text fontSize={11} color="red.300">
                {errors.confirmPassword}
              </Text>
            )}
            <Button
              variant="solid"
              backgroundColor="#EA4335"
              mt="1"
              color="white"
              type="submit"
              isLoading={isSubmitting}
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

      <Flex justifyContent="center" alignItems="center">
        <Divider width={20} orientation="horizontal" color="black" mr={2} />
        or
        <Divider width={20} orientation="horizontal" color="black" ml={2} />
      </Flex>
      <Box w="100%">
        <Button
          variant="ghost"
          borderWidth={1}
          borderColor="gray.200"
          borderStyle="solid"
          color="black"
          w="100%"
          onClick={handleSignInWithGoogle}
        >
          <Flex w="100%" alignItems="center">
            <FcGoogle size={24} />
            <Text ml={6} fontWeight="normal">
              Continue with Google
            </Text>
          </Flex>
        </Button>
      </Box>
    </Flex>
  );
};

type EmailInputProps = InputProps & {};
const EmailInput: FC<EmailInputProps> = ({ ...inputProps }) => {
  return (
    <InputGroup>
      <Input placeholder="Email address" type="email" {...inputProps} />
    </InputGroup>
  );
};

type PasswordInputProps = InputProps & {};
const PasswordInput: FC<PasswordInputProps> = ({ ...inputProps }) => {
  return (
    <InputGroup>
      <Input placeholder="Password" type="password" {...inputProps} />
    </InputGroup>
  );
};

type ConfirmPasswordInputProps = InputProps & {};
const ConfirmPasswordInput: FC<ConfirmPasswordInputProps> = ({
  ...inputProps
}) => {
  return (
    <InputGroup>
      <Input placeholder="Confirm password" type="password" {...inputProps} />
    </InputGroup>
  );
};

export default SignIn;
