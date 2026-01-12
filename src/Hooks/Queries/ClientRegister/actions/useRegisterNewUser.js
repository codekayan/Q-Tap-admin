import { useMutation } from "@tanstack/react-query";
import { registerNewUserApi } from "../../../../api/Client/register/registerNewUser.service";





export const useRegisterNewUser = () => {
  return useMutation({
    mutationFn: ({ data }) => registerNewUserApi({ data }),
  });
};