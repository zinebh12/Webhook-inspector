import { useLogout } from "../hook/use-logout.hook";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";

const LogoutButton = () => {
  const router = useRouter();

  const logoutMutation = useLogout();

  const onLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess() {
        console.log("Logged out!");
        router.push("/register");
      },
    });
  };

  return (
    <button
      type="button"
      onClick={onLogout}
      className="flex shrink-0 cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-button-primary transition hover:text-button-primary-active active:scale-95 sm:px-4 sm:py-2.5"
    >
      <FontAwesomeIcon
        icon={faRightFromBracket}
        className="text-sm sm:text-sm"
      />
    </button>
  );
};

export default LogoutButton;
