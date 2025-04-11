import {
  Avatar,
  Flex,
  Badge,
  Popover,
  PopoverContent,
  PopoverArrow,
  PopoverHeader,
  PopoverBody,
  useDisclosure,
  PopoverAnchor,
  Button,
  Spinner,
} from "@chakra-ui/react";
import { MdLogout } from "react-icons/md";
import { getAuth } from "@/utils/firebase";
import { signOut } from "firebase/auth";
import { useCurrentUserSelector } from "@/store/slices/user";
import { useDispatch } from "react-redux";
import { userActions } from "@/store/slices/user";
import {
  useGetRemainingTokensQuery,
  useGetUserSubscriptionPlanQuery,
} from "@/store/apis/db";
import { USER_TIERS, TIER_BAGDES, LIMIT_TOKENS } from "@/utils/constants";

const UserMenu = () => {
  const {
    isOpen: isMenuOpen,
    onOpen: openMenu,
    onClose: closeMenu,
  } = useDisclosure();
  const dispatch = useDispatch();
  const currentUser = useCurrentUserSelector();
  const showLogoutButton = !!currentUser;
  const displayName =
    currentUser?.displayName ?? currentUser?.email?.split("@")?.[0] ?? "User";
  const {
    data: currentUserSubscriptionPlan,
    isLoading: isGetUserSubscriptionPlanLoading,
    isFetching: isGetUserSubscriptionPlanFetching,
  } = useGetUserSubscriptionPlanQuery({ userId: currentUser?.uid as string });
  const {
    data: remainingTokens,
    isLoading: isRemainingTokensLoading,
    isFetching: isRemainingTokensFetching,
  } = useGetRemainingTokensQuery({
    userId: currentUser?.uid as string,
  });

  const handleLogout = () => {
    const auth = getAuth();
    closeMenu();
    signOut(auth);
    dispatch(userActions.setCurrentChat(null));
  };

  const displayTierBadge = () => {
    if (isGetUserSubscriptionPlanLoading || isGetUserSubscriptionPlanFetching) {
      return <Spinner />;
    }
    if (currentUserSubscriptionPlan === USER_TIERS.PAID) {
      return (
        <Badge fontSize="0.8em" colorScheme="green" px="0.5rem">
          {TIER_BAGDES.PAID}
        </Badge>
      );
    }
    return (
      <Badge fontSize="0.8em" colorScheme="green" px="0.5rem">
        {TIER_BAGDES.FREE}
      </Badge>
    );
  };

  const displayRemainingTokens = () => {
    if (isRemainingTokensLoading || isRemainingTokensFetching) {
      return <Spinner />;
    }

    if(remainingTokens && remainingTokens === LIMIT_TOKENS.PAID) {
      return (
        <Badge fontSize="0.8em" colorScheme="blue" px="0.5rem">
          Unlimited tokens
        </Badge>
      );
    }
    return (
      <Badge fontSize="0.8em" colorScheme="blue" px="0.5rem">
        {remainingTokens} tokens
      </Badge>
    );
  };

  if (showLogoutButton) {
    return (
      <>
        <Popover
          isOpen={isMenuOpen}
          onClose={closeMenu}
          placement="bottom-start"
        >
          <PopoverAnchor>
            <Flex alignItems="center" gap="1rem">
              {displayRemainingTokens()}
              {displayTierBadge()}
              <Avatar
                name={displayName}
                size="sm"
                cursor="pointer"
                userSelect="none"
                onClick={openMenu}
              />
            </Flex>
          </PopoverAnchor>
          <PopoverContent w="fit-content">
            <PopoverArrow />
            <PopoverHeader>{currentUser.email}</PopoverHeader>
            <PopoverBody>
              <Button
                w="100%"
                fontSize="13px"
                alignItems="center"
                variant="ghost"
                leftIcon={<MdLogout size="1rem" />}
                onClick={handleLogout}
              >
                Log out
              </Button>
            </PopoverBody>
          </PopoverContent>
        </Popover>
      </>
    );
  }
  return null;
};

export default UserMenu;
