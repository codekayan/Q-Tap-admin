import { useMutation } from "@tanstack/react-query";
import { handleChangeRequest } from "../../../../../api/admin/plan/actions/handleChangeRequest.service";

export const useHandlePlanRequest = () => {
    return useMutation({
        mutationFn: ({ request_id, payload }) => handleChangeRequest(request_id, payload),
    });
};