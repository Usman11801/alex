import React, { useState } from "react";
import { Flex } from "@chakra-ui/react";
import Signup from "./Signup";
import Verification from "./Verification";

enum Step {
  SIGNUP = 1,
  VERIFICATION = 2,
}

const SignupPage = () => {
  const [step, setStep] = useState(Step.SIGNUP);
  return (
    <Flex alignItems="center" justifyContent="center" h="100%">
      {step === Step.SIGNUP && (
        <Signup
          onDone={() => {
            setStep(Step.VERIFICATION);
          }}
        />
      )}
      {step === Step.VERIFICATION && <Verification />}
    </Flex>
  );
};

export default SignupPage;
