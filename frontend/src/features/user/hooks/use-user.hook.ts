import { useQuery } from "@tanstack/react-query";
import { user } from "@/services/auth.api";
import { User } from "@/types/auth.types";

export const useUser = () => {
  return useQuery({ queryKey: ["user"], queryFn: () => user<User>("/user") });
};
