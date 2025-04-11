import {
  Flex,
  Input,
  Text,
  InputGroup,
  InputLeftAddon,
  InputLeftElement,
  InputProps,
  Box,
  Button,
  Divider,
} from "@chakra-ui/react";
import { FC, useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { MdEmail, MdPassword } from "react-icons/md";
import { FcGoogle } from "react-icons/fc";
import { useFormik } from "formik";
import {
  signInWithEmailAndPassword,
  AuthError,
  sendPasswordResetEmail,
  signInWithPopup,
  signInWithCredential,
  GoogleAuthProvider,
} from "firebase/auth";
import useCustomToast from "@/hooks/useCustomToast";

import { getAuth } from "@/utils/firebase";
import { ROUTES } from "@/utils/constants";
import { useGetIsCompletedSignupMutation } from "@/store/apis/db";

const SignIn = () => {
  const [isResetting, setIsResetting] = useState(false);
  const router = useRouter();
  const toast = useCustomToast();
  const [getIsCompletedSignup] = useGetIsCompletedSignupMutation();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: async (values) => {
      const auth = getAuth();
      const { email, password } = values;
      try {
        await signInWithEmailAndPassword(auth, email, password);
        toast("Welcome!", "success");
        router.push(ROUTES.HOME);
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

  const handleForgotPassword = useCallback(async () => {
    if (!values.email) {
      return toast("Email is required!", "error");
    }
    const auth = getAuth();
    setIsResetting(true);
    try {
      await sendPasswordResetEmail(auth, values.email);
      toast(`We sent a password reset email to ${values.email}`, "success");
    } catch (err) {
      const { message } = err as AuthError;
      toast(message, "error");
    } finally {
      setIsResetting(false);
    }
  }, [values, toast]);

  const handleSignInWithGoogle = async () => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    const res = await signInWithPopup(auth, provider);
    if (res.user) {
      const isCompletedSignup = (await getIsCompletedSignup({
        userId: res.user.uid,
      })) as { data: boolean };

      if (!isCompletedSignup.data) {
        router.push(ROUTES.SIGNUP);
      } else {
        toast("Welcome!", "success");
        router.push(ROUTES.HOME);
      }
    }
  };

  const handleClickSignUp = () => {
    router.push(ROUTES.SIGNUP);
  };

  return (
    <Flex
      flexDir="column"
      w="20rem"
      minH="10rem"
      alignItems="center"
      gap="1rem"
    >
      <Text
        fontSize="1.75rem"
        textAlign="center"
        fontWeight="700"
        w="30rem"
        mb="2rem"
      >
        Welcome to your AI powered building code assistant
      </Text>
      <Box w="100%">
        <form onSubmit={handleSubmit}>
          <Flex flexDir="column" w="100%" gap="3rem">
            <Flex flexDir="column" w="100%" gap="1rem">
              <EmailInput
                value={values.email}
                id="email"
                name="email"
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <PasswordInput
                value={values.password}
                id="password"
                name="password"
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </Flex>
            <Button
              variant="solid"
              backgroundColor="#EA4335"
              color="white"
              type="submit"
              isLoading={isSubmitting}
            >
              Sign in
            </Button>
          </Flex>
        </form>
      </Box>
      <Flex>
        <Text mr="1">Don&apos;t have an account?</Text>
        <Button variant="link" color="#EA4335" onClick={handleClickSignUp}>
          Sign up
        </Button>
      </Flex>
      <Button
        variant="ghost"
        onClick={handleForgotPassword}
        isLoading={isResetting}
      >
        Forgot password?
      </Button>

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
      <InputLeftElement>
        <MdEmail />
      </InputLeftElement>
      <Input placeholder="Email" type="email" {...inputProps} />
    </InputGroup>
  );
};

type PasswordInputProps = InputProps & {};
const PasswordInput: FC<PasswordInputProps> = ({ ...inputProps }) => {
  return (
    <InputGroup>
      <InputLeftElement>
        <MdPassword />
      </InputLeftElement>
      <Input placeholder="Password" type="password" {...inputProps} />
    </InputGroup>
  );
};

export default SignIn;
