import { useLogout } from "../hook/use-logout.hook";
import { useRouter } from "next/navigation";

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

  return <button onClick={onLogout}>LogoutButton</button>;
};

export default LogoutButton;
