import { z } from "zod";
import parsePhoneNumber, { parsePhoneNumberFromString } from "libphonenumber-js";



const PaymentMethodEnum = z.enum(['cash', 'card', 'wallet']);

export const phoneNumberSuperRefineValidation = (data, ctx) => {
    const phoneNumber = parsePhoneNumberFromString(data.businessPhone, data.businessCountryCode);
    if (!phoneNumber?.isValid()) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["businessPhone"],
            message: "Invalid phone number",
        });
    } else if (data.businessCountryCode === "EG") {
        const national = phoneNumber.nationalNumber;
        const mobilePattern = /^(10|11|12|15)\d{8}$/; // Egypt mobile prefixes

        if (!mobilePattern.test(national)) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["businessPhone"],
                message: "Invalid phone number",
            });
        }
    }
}
const timeRangeSchema = z
    .array(z.string().min(1))
    .length(2, { message: "You must select both start and end time" }) // ✅ custom message
    .refine(([start, end]) => start !== end, {
        message: "Start and end time cannot be the same",
    });

const workScheduleSchema = z
    .record(z.string(), timeRangeSchema)
    .refine(obj => Object.keys(obj).length > 0, {
        message: "You must select at least one working day",
    });

export const branchSchema = z.object({
    businessName: z.string().min(1, "Business name is required"),
    businessCountryCode: z
        .string()
        .min(1, "Country code is required")
        .regex(/^[A-Z]{2}$/, "Country code must be a valid ISO 3166-1 alpha-2 code"),
    website: z.string().optional(),
    businessPhone: z.string().min(1, "Phone number is required"),
    businessEmail: z.string().email("Invalid email address"),
    pin: z
        .string()
        .min(6, "PIN must be 6 digits")
        .max(6, "PIN must be 6 digits")
        .regex(/^\d+$/, "PIN must contain only numbers"),
    country: z.object({
        id: z.number(),
        code: z.string(),
        name_en: z.string(),
        name_ar: z.string(),
    }),
    city: z.object({
        id: z.number(),
        name_en: z.string(),
        name_ar: z.string(),
    }),
    latitude: z.number({ invalid_type_error: "Latitude must be a number" }),
    longitude: z.number({ invalid_type_error: "Longitude must be a number" }),
    currency: z.string().min(1, "Currency is required"),
    businessType: z.string().min(1, "Business type is required"),
    menuLanguage: z.string().min(1, "Menu language is required"),
    mode: z.string().min(1, "Mode is required"),
    design: z.string().min(1, "Design is required"),
    servingWays: z.array(z.string()).min(1, "At least one serving way is required"),
    callWaiter: z.enum(["active", "inactive"], {
        required_error: "Please select call waiter status",
    }).default("inactive"),
    paymentMethods: z.array(PaymentMethodEnum).min(1, "At least one payment method is required"),
    paymentTime: z.string().min(1, "Payment time is required"),
    workschedules: workScheduleSchema,
    numberOfTable: z
        .coerce
        .number({ invalid_type_error: "Number of tables must be a number" })
        .optional(),

}).superRefine((data, ctx) => {
    if (data.servingWays.includes("dine_in") && (data.numberOfTable == null || isNaN(data.numberOfTable))) {
        ctx.addIssue({
            path: ["numberOfTable"],
            code: z.ZodIssueCode.custom,
            message: "Number of tables is required when serving way includes dinein",
        });
    }
}).superRefine(phoneNumberSuperRefineValidation);

export const branchesArraySchema = z.array(branchSchema).min(1, "At least one branch is required");

export const saveNewRegisterUserFormSchema = z
    .object({
        image: z
            .instanceof(File)
            .refine((file) => file.size > 0, "Image is required")
            .refine(
                (file) => ["image/jpeg", "image/png", "image/webp"].includes(file.type),
                "Only JPEG, PNG, or WebP images are allowed"
            ),

        fullName: z
            .string()
            .min(2, "Full name must be at least 2 characters")
            .max(100, "Full name must be less than 100 characters"),

        email: z.string().email("Invalid email address"),

        countryCode: z
            .string()
            .min(1, "Country code is required")
            .regex(/^[A-Z]{2}$/, "Country code must be a valid ISO 3166-1 alpha-2 code"),

        phone: z.string().min(1, "Phone number is required"),

        website: z
            .string()
            .url("Invalid website URL")
            .optional()
            .or(z.literal("")),

        month: z
            .string()
            .regex(/^(0?[1-9]|1[0-2])$/, "Invalid month"),

        day: z
            .string()
            .regex(/^(0?[1-9]|[12][0-9]|3[01])$/, "Invalid day"),

        year: z.coerce.string()
            .regex(/^\d{4}$/, "Invalid year")
            .refine((year) => {
                const y = Number(year);
                return y >= 1900 && y <= new Date().getFullYear();
            }, "Year must be between 1900 and current year"),

        country: z.union([z.string().min(1, "Country is required"), z.number()]),

        password: z
            .string()
            .min(8, "Password must be at least 8 characters")
            .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
            .regex(/[a-z]/, "Password must contain at least one lowercase letter")
            .regex(/\d/, "Password must contain at least one number")
            .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),

        confirmPassword: z.string().min(1, "Please confirm your password"),

        branches: branchesArraySchema
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    })
    .superRefine((data, ctx) => {
        const phoneNumber = parsePhoneNumberFromString(data.phone, data.countryCode);
        if (!phoneNumber?.isValid()) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["phone"],
                message: "Invalid phone number",
            });
        }
    });

export const passwordSchema = z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/\d/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character");