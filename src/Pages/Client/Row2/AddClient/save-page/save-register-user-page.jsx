import BranchForm from "./save-page-branch-data-from";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Button, useTheme } from "@mui/material";
import PersonalInfoForm from "./save-page-person-data-from";
import { CheckOutlined } from "@mui/icons-material";
import {
  saveNewRegisterUserFormSchema,
} from "./saveNewRegisterUserFormSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSelector } from "react-redux";
import { selectRegisterPersonalData } from "../../../../../store/register/personalSlice";
import { useRegisterNewUser } from "../../../../../Hooks/Queries/ClientRegister/actions/useRegisterNewUser";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import useBranchStore from "../../../../../store/zustand-store/register-client-branch-store";

export const preparePersonalInfoInFormDataObject = ({
  personalData,
  formData,
}) => {
  formData.append("name", personalData.fullName?.trim() || "");
  formData.append("mobile", personalData.phone?.trim() || "");
  formData.append("email", personalData.email?.trim().toLowerCase() || "");
  formData.append(
    "birth_date",
    personalData.year && personalData.month && personalData.day
      ? `${personalData.year}-${personalData.month}-${personalData.day}`
      : ""
  );
  formData.append("country", personalData.country || "");
  formData.append("password", personalData.password || "1");
  formData.append("user_type", "qtap_clients");

  if (personalData.affiliate_code)
    formData.append("affiliate_code", personalData.affiliate_code);

  // Append image if it exists
  if (personalData.image instanceof File) {
    formData.append("img", personalData.image);
  }
  if (sessionStorage.getItem("affiliate_code")) {
    formData.append("affiliate_code", sessionStorage.getItem("affiliate_code"));
  }
};

export const prepareBrunchDataInFormDataObject = ({
  prefix,
  data,
  formData,
}) => {
  try {
    formData.append(`${prefix}[pin]`, data.pin);

    // Contact info
    formData.append(
      `${prefix}[contact_info][business_phone][]`,
      data.businessCountryCode + data.businessPhone
    );
    formData.append(
      `${prefix}[contact_info][business_email][]`,
      data.businessEmail
    );
    formData.append(`${prefix}[contact_info][facebook][]`, "-");
    formData.append(`${prefix}[contact_info][twitter][]`, "-");
    formData.append(`${prefix}[contact_info][instagram][]`, "-");
    formData.append(`${prefix}[contact_info][address][]`, "-");
    formData.append(`${prefix}[contact_info][website][]`, "-");

    // Work schedules
    // Object.entries(data.workschedules).forEach(([day, times]) => {
    //   times.forEach((time) => {
    //     formData.append(`${prefix}[workschedules][${day}][]`, time);
    //   });
    // });
    formData.append(`${prefix}[workschedules][Saturday][]`, "9am");
    formData.append(`${prefix}[workschedules][Saturday][]`, "7pm");
    // Serving ways
    data.servingWays.forEach((value) => {
      formData.append(`${prefix}[serving_ways][]`, value);
    });

    // Payment services
    data.paymentMethods.forEach((value) => {
      formData.append(`${prefix}[payment_services][]`, value);
    });

    // Other fields
    console.log("branch data", data);
    if (
      data.numberOfTable &&
      Array.isArray(data.servingWays) &&
      data.servingWays.some((item) => item === "dine_in")
    )
      formData.append(`${prefix}[tables_number]`, data.numberOfTable);

    formData.append(`${prefix}[currency_id]`, data.currency);

    formData.append(`${prefix}[business_name]`, data.businessName);
    formData.append(`${prefix}[business_country]`, data.country?.id);
    formData.append(`${prefix}[business_city]`, data.city?.id);

    formData.append(`${prefix}[latitude]`, data.latitude);
    formData.append(`${prefix}[longitude]`, data.longitude);
    formData.append(`${prefix}[business_format]`, "uk");
    formData.append(`${prefix}[menu_design]`, data.design);
    formData.append(`${prefix}[default_mode]`, data.mode);
    formData.append(`${prefix}[payment_time]`, data.paymentTime);
    formData.append(`${prefix}[call_waiter]`, data.callWaitter ?? "inactive");
  } catch (error) {
    throw new Error(`${prefix} missing required fields: ${error.message}`);
  }
};

const SaveRegisterUserDataPage = () => {
  const theme = useTheme();
  const { t, i18n } = useTranslation();
  const branches = useBranchStore((state) => state.branches);
  const personalData = useSelector(selectRegisterPersonalData);
  const { mutate, isPending } = useRegisterNewUser();
  const navigate = useNavigate();
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { errors },
    trigger,
    reset,
  } = useForm({
    resolver: zodResolver(saveNewRegisterUserFormSchema),
    mode: "onBlur",
    defaultValues: {
      image: personalData?.image || "",
      fullName: personalData?.fullName || "",
      countryCode: personalData?.countryCode || "",
      phone: personalData?.phone || "",
      email: personalData?.email || "",
      pin: "",
      website: personalData?.website || "",
      country: personalData?.country || "",
      day: personalData?.day || "",
      month: personalData?.month || "",
      year: personalData?.year || "",
      password: personalData?.password || "",
      confirmPassword: personalData?.confirmPassword || "",
      branches: branches || [],
    },
  });

  const onSubmit = (data) => {
    console.log("Form data:", data);

    const formData = new FormData();
    preparePersonalInfoInFormDataObject({ personalData: data, formData });

    if (data.branches && Array.isArray(data.branches)) {
      // eslint-disable-next-line array-callback-return
      data.branches.map((branch, index) => {
        prepareBrunchDataInFormDataObject({
          data: branch,
          formData,
          prefix: `brunch${index + 1}`,
        });
      });
    }
    formData.append(`pricing_id`, personalData.pricing_id);

    if (personalData.pricing_way === "monthly")
      formData.append(`pricing_way`, "monthly_price");
    else if (personalData.pricing_way === "yearly")
      formData.append(`pricing_way`, "yearly_price");

    formData.append(`payment_method`, personalData.payment_method);
    if (personalData.discount_id)
      formData.append(`coupn_plan_code`, personalData.discount_id.code);

    mutate(
      { data: formData },
      {
        onSuccess: (res) => {
          console.log("onsuccess");
          navigate("/otp-signup");
          toast.success(
            t(false ? "dataUpdatedSuccessfully" : "dataSavedSuccessfully")
          );
        },
        onError: (error) => {
          toast.error(
            error.response.data.error_details ||
              error.response.data.message ||
              t("errorWhileSavingData")
          );
        },
      }
    );
  };

  console.log("fromError ", errors);

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-wrap w-full min-h-[100vh] p-2 md:p-0">
          <div className="w-full md:w-1/2  md:border-e md:pe-2">
            <PersonalInfoForm
              control={control}
              errors={errors}
              i18n={i18n}
              setValue={setValue}
              t={t}
              watch={watch}
              getValues={getValues}
              trigger={trigger}
            />
          </div>
          <div className="w-full md:w-1/2 md:pe-1 md:ps-2">
            <BranchForm
              control={control}
              errors={errors}
              i18n={i18n}
              setValue={setValue}
              t={t}
              watch={watch}
              getValues={getValues}
              reset={reset}
              pricing_id={personalData.pricing_id}
            />
          </div>
          <div className="mx-auto mt-auto ">
            <Button
              type="submit"
              sx={{
                width: "160px",
                textTransform: "capitalize",
                backgroundColor: theme.palette.orangePrimary.main,
                color: "white",
                borderRadius: "20px",
                padding: "5px",
                "&:hover": { backgroundColor: "#ef7d10" },
              }}
              disabled={isPending}
            >
              {isPending ? (
                t("loading")
              ) : (
                <>
                  <CheckOutlined sx={{ fontSize: "22px", mr: 1 }} /> {t("save")}
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SaveRegisterUserDataPage;
