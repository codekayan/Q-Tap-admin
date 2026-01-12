import {
  Box,
  Button,
  Card,
  CardContent,
  IconButton,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";
import { useChatDataStore } from "../../store/zustand-store/user-chat-data-store";
import { useTranslation } from "react-i18next";

export function UserInfoForm({ toggleChat }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const [errors, setErrors] = useState({ email: "", phone: "", name: "" });
  const theme = useTheme();
  const { t } = useTranslation();
  const registerUserChatData = useChatDataStore((state) => state.loggedIn);
  const { isLogged } = useChatDataStore();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleCloseUserInfoForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      address: "",
    });
    setErrors({ email: "", phone: "", name: "" });
    toggleChat();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let valid = true;
    let newErrors = { email: "", phone: "", name: "" };

    if (!formData.email.trim()) {
      newErrors.email = t("chat.form.validation.emailRequired");
      valid = false;
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = t("chat.form.validation.emailInvalid");
      valid = false;
    }
    if (!formData.name.trim()) {
      newErrors.name = t("chat.form.validation.nameRequired");
      valid = false;
    }
    if (!formData.phone.trim()) {
      newErrors.phone = t("chat.form.validation.phoneRequired");
      valid = false;
    } else if (!isValidEgyptianPhone(formData.phone)) {
      newErrors.phone = t("chat.form.validation.phoneInvalid");
      valid = false;
    }

    setErrors(newErrors);

    if (valid) {
      console.log("Submitted data:", formData);
      const payload = {
        name: formData.name,
        email: formData.email,
        address: formData.address,
        phone: formData.phone,
      };
      registerUserChatData(payload);
    }
  };

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const isValidEgyptianPhone = (phone) => {
    return /^01[0125][0-9]{8}$/.test(phone);
  };

  return (
    <Card sx={{ width: 320, boxShadow: 6, borderRadius: 2 }}>
      <CardContent sx={{ display: "flex", flexDirection: "column" }}>
        {/* <Paper elevation={3} sx={{ p: 4, maxWidth: 500, mx: 'auto' }}> */}
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
          <Typography variant="h5">{t("chat.form.title")}</Typography>
          <IconButton
            sx={{ marginInlineStart: "auto" }}
            onClick={handleCloseUserInfoForm}
          >
            {" "}
            <CloseIcon />
          </IconButton>
        </Box>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <TextField
            label={t("chat.form.fields.name")}
            name="name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
            // required
            error={!!errors.name}
            helperText={errors.name}
          />
          <TextField
            label={t("chat.form.fields.email")}
            name="email"
            type="text"
            value={formData.email}
            onChange={handleChange}
            fullWidth
            // required
            error={!!errors.email}
            helperText={errors.email}
          />
          <TextField
            label={t("chat.form.fields.phone")}
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            fullWidth
            // required
            error={!!errors.phone}
            helperText={errors.phone}
          />
          <TextField
            label={t("chat.form.fields.address")}
            name="address"
            value={formData.address}
            onChange={handleChange}
            fullWidth
            multiline
            rows={2}
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{
              backgroundColor: theme.palette.orangePrimary.main,
              "&:hover": {
                backgroundColor: theme.palette.orangePrimary.secondary,
              },
            }}
          >
            {t("chat.form.submit")}
          </Button>
        </Box>
        {/* </Paper> */}
      </CardContent>
    </Card>
  );
}
