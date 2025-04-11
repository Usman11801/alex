import { useToast, UseToastOptions } from "@chakra-ui/react";

const useCustomToast = (options?: UseToastOptions) => {
  const toast = useToast({
    duration: 3000,
    isClosable: true,
    position: "top",
    ...options,
  });
  return (message: string, status: UseToastOptions["status"]) =>
    toast({
      description: message,
      status: status,
    });
};

export default useCustomToast;
