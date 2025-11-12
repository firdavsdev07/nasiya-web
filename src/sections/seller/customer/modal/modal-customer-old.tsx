/* eslint-disable react-hooks/exhaustive-deps */
import type { FC } from "react";
import type { RootState } from "src/store";
import type { IAddCustomer } from "src/types/customer";

import { useSelector } from "react-redux";
import { useState, useEffect, useCallback } from "react";

import Grid from "@mui/material/Unstable_Grid2";
import {
  Box,
  Stack,
  Button,
  Dialog,
  TextField,
  IconButton,
  DialogTitle,
  DialogActions,
  DialogContent,
  Typography,
} from "@mui/material";
import { FaPassport } from "react-icons/fa";
import { FaRegFileLines } from "react-icons/fa6";
import { TbPhoto } from "react-icons/tb";
import { MdDelete, MdUpload } from "react-icons/md";

import { useAppDispatch } from "src/hooks/useAppDispatch";

import authApi from "src/server/auth";
import { closeModal } from "src/store/slices/modalSlice";
import { setCustomer } from "src/store/slices/customerSlice";
import {
  addCustomerSeller,
  updateCustomerSeller,
} from "src/store/actions/customerActions";

interface IForm {
  firstName: string;
  lastName: string;
  passportSeries: string;
  phoneNumber: string;
  address: string;
  birthDate: Date | null;
  passportFile: File | null;
  shartnomaFile: File | null;
  photoFile: File | null;
}

interface IProps {
  show?: boolean;
}

const ModalCustomer: FC<IProps> = ({ show = false }) => {
  const dispatch = useAppDispatch();
  const { customerModal } = useSelector((state: RootState) => state.modal);

  const [phoneError, setPhoneError] = useState(false);
  const [phoneHelper, setPhoneHelper] = useState("");
  const [passportError, setPassportError] = useState(false);
  const [passportHelper, setPassportHelper] = useState("");
  const [checking, setChecking] = useState(false);

  const defaultFormValues: IForm = {
    firstName: "",
    lastName: "",
    passportSeries: "",
    phoneNumber: "+998",
    address: "",
    birthDate: null,
    passportFile: null,
    shartnomaFile: null,
    photoFile: null,
  };

  const [formValues, setFormValues] = useState<IForm>(defaultFormValues);

  // Edit rejimida ma'lumotlarni yuklash
  useEffect(() => {
    if (customerModal?.type === "edit" && customerModal?.data) {
      const customer = customerModal.data;
      setFormValues({
        firstName: customer.firstName || "",
        lastName: customer.lastName || "",
        passportSeries: customer.passportSeries || "",
        phoneNumber: customer.phoneNumber || "+998",
        address: customer.address || "",
        birthDate: customer.birthDate ? new Date(customer.birthDate) : null,
        passportFile: null,
        shartnomaFile: null,
        photoFile: null,
      });
    }
  }, [customerModal]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    let newValue: string | Date = value;

    if (name === "birthDate") {
      newValue = new Date(value);
    }

    if (name === "passportSeries") {
      newValue = value.toUpperCase();
    }

    setFormValues((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;

    // Har doim +998 bilan boshlanishini ta'minlaymiz
    if (!input.startsWith("+998")) return;

    const formatted = input.replace(/[^\d+]/g, ""); // Raqamdan boshqa belgilarni olib tashlash

    // Maksimal uzunlikni cheklaymiz
    if (formatted.length > 13) return;

    console.log("formatted", formatted);

    setFormValues((prev) => ({
      ...prev,
      phoneNumber: formatted,
    }));
  };

  useEffect(() => {
    const phone = formValues.phoneNumber;

    if (/^\+998\d{9}$/.test(phone)) {
      setChecking(true);
      setPhoneError(false);
      setPhoneHelper("");

      // Simulyatsiya: telefonni tekshirish uchun API chaqiruv
      const checkPhone = async () => {
        try {
          console.log("res", phone);
          const phoneNumber = phone.replace("+", "");
          const res = await authApi.get(
            `/customer/check-phone?phone=${phoneNumber}`
          );
          if (res.data.exists) {
            setPhoneError(true);
            setPhoneHelper("Bu telefon raqam allaqachon mavjud");
          }
        } catch (err) {
          setPhoneError(true);
          setPhoneHelper("Server bilan bog‘lanishda xatolik");
        } finally {
          setChecking(false);
        }
      };

      checkPhone();
    } else {
      setPhoneError(false);
      setPhoneHelper("");
    }
  }, [formValues.phoneNumber]);

  const handlePhoneBlur = () => {
    const phone = formValues.phoneNumber;
    if (!/^\+998\d{9}$/.test(phone)) {
      setPhoneError(true);
      setPhoneHelper("Telefon raqam to‘liq va +998 bilan boshlanishi kerak");
    }
  };

  useEffect(() => {
    const passport = formValues.passportSeries;

    if (/^[A-Z]{2}\d{7}$/.test(passport)) {
      const checkPassport = async () => {
        try {
          const res = await authApi.get(
            `/customer/check-passport?passport=${passport}`
          );
          if (res.data.exists) {
            setPassportError(true);
            setPassportHelper("Bu passport seriyasi allaqachon mavjud");
          } else {
            setPassportError(false);
            setPassportHelper("");
          }
        } catch (err) {
          setPassportError(true);
          setPassportHelper("Server bilan bog‘lanishda xatolik");
        }
      };

      checkPassport();
    } else {
      setPassportError(false);
      setPassportHelper("");
    }
  }, [formValues.passportSeries]);

  const handlePassportBlur = () => {
    const passport = formValues.passportSeries;

    if (!/^[A-Z]{2}\d{7}$/.test(passport)) {
      setPassportError(true);
      setPassportHelper(
        "2 ta harf va 7 ta raqamdan iborat bo‘lishi kerak (masalan: AA1234567)"
      );
    }
  };

  const handleClose = useCallback(() => {
    setFormValues({
      firstName: "",
      lastName: "",
      passportSeries: "",
      phoneNumber: "+998",
      address: "",
      birthDate: null,
      passportFile: null,
      shartnomaFile: null,
      photoFile: null,
    });
    dispatch(closeModal("customerModal"));
    // setCustomer(null) ni olib tashladik - modal yopilganda customer ma'lumotlari saqlanadi
  }, [dispatch]);

  const handleSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      // FormData yaratish (file upload uchun)
      const formData = new FormData();
      formData.append("firstName", formValues.firstName);
      formData.append("lastName", formValues.lastName);
      formData.append("passportSeries", formValues.passportSeries);
      formData.append("phoneNumber", formValues.phoneNumber);
      formData.append("address", formValues.address);

      if (formValues.birthDate) {
        formData.append("birthDate", formValues.birthDate.toISOString());
      }

      // Fayllarni qo'shish
      if (formValues.passportFile) {
        formData.append("passport", formValues.passportFile);
      }
      if (formValues.shartnomaFile) {
        formData.append("shartnoma", formValues.shartnomaFile);
      }
      if (formValues.photoFile) {
        formData.append("photo", formValues.photoFile);
      }

      if (customerModal?.type === "edit" && customerModal?.data?._id) {
        dispatch(updateCustomerSeller(customerModal.data._id, formData));
      } else {
        dispatch(addCustomerSeller(formData, show));
      }
      handleClose();
    },
    [dispatch, formValues, handleClose, show, customerModal]
  );

  const isFormValid =
    formValues.firstName.trim() !== "" &&
    (formValues.passportSeries === "" ||
      /^[A-Z]{2}\d{7}$/.test(formValues.passportSeries)) &&
    (formValues.phoneNumber === "" ||
      /^\+998\d{9}$/.test(formValues.phoneNumber)) &&
    !phoneError &&
    !passportError &&
    !checking;

  return (
    <Dialog
      open={!!customerModal?.type}
      PaperProps={{
        component: "form",
        onSubmit: handleSubmit,
      }}
      fullWidth
    >
      {!!customerModal?.type && (
        <>
          <DialogTitle>
            {customerModal.type === "edit"
              ? "Mijozni tahrirlash"
              : "Yangi mijoz qo'shish"}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={1}>
              <Grid xs={12} md={6}>
                <TextField
                  value={formValues.firstName}
                  onChange={handleChange}
                  autoFocus
                  required
                  margin="dense"
                  id="firstName"
                  name="firstName"
                  label="Ismi"
                  fullWidth
                />
              </Grid>
              <Grid xs={12} md={6}>
                <TextField
                  value={formValues.lastName}
                  onChange={handleChange}
                  margin="dense"
                  id="lastName"
                  name="lastName"
                  label="Familiyasi"
                  fullWidth
                />
              </Grid>
              <Grid xs={12} md={4}>
                <TextField
                  // value={formValues.passportSeries}
                  // onChange={handleChange}
                  // margin="dense"
                  // id="passportSeries"
                  // name="passportSeries"
                  // label="Passport seriyasi"
                  // fullWidth
                  // error={
                  //   formValues.passportSeries.length > 0 &&
                  //   !/^[A-Z]{2}\d{7}$/.test(formValues.passportSeries)
                  // }
                  // helperText={
                  //   formValues.passportSeries.length > 0 &&
                  //   !/^[A-Z]{2}\d{7}$/.test(formValues.passportSeries)
                  //     ? "2 ta harf va 7 ta raqamdan iborat bo'lishi kerak (masalan: AA1234567)"
                  //     : ""
                  // }
                  value={formValues.passportSeries}
                  onChange={handleChange}
                  onBlur={handlePassportBlur}
                  margin="dense"
                  id="passportSeries"
                  name="passportSeries"
                  label="Passport seriyasi"
                  fullWidth
                  error={passportError}
                  helperText={passportHelper}
                  inputProps={{
                    maxLength: 9,
                  }}
                />
              </Grid>
              <Grid xs={12} md={4}>
                <TextField
                  // value={formValues.phoneNumber}
                  // onChange={handleChange}
                  // required
                  // margin="dense"
                  // id="phoneNumber"
                  // name="phoneNumber"
                  // label="Telefon raqam"
                  // fullWidth
                  // error={
                  //   formValues.phoneNumber.length > 0 &&
                  //   !/^\+998\d{9}$/.test(formValues.phoneNumber)
                  // }
                  // helperText={
                  //   formValues.phoneNumber.length > 0 &&
                  //   !/^\+998\d{9}$/.test(formValues.phoneNumber)
                  //     ? "Telefon raqam to'liq kiriting"
                  //     : ""
                  // }
                  // inputProps={{
                  //   // inputMode: "numeric",
                  //   // pattern: "[0-9]*",
                  //   maxLength: 13,
                  //   minLength: 13,
                  // }}
                  value={formValues.phoneNumber}
                  onChange={handlePhoneChange}
                  onBlur={handlePhoneBlur}
                  required
                  margin="dense"
                  id="phoneNumber"
                  name="phoneNumber"
                  label="Telefon raqam"
                  fullWidth
                  error={phoneError}
                  helperText={phoneHelper}
                  inputProps={{
                    maxLength: 13,
                  }}
                />
              </Grid>
              <Grid xs={12} md={4}>
                <TextField
                  value={
                    formValues.birthDate
                      ? formValues.birthDate.toISOString().split("T")[0]
                      : ""
                  }
                  onChange={handleChange}
                  margin="dense"
                  id="birthDate"
                  name="birthDate"
                  label="Tug'ilgan sana"
                  type="date"
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
            </Grid>

            <TextField
              value={formValues.address}
              onChange={handleChange}
              margin="dense"
              id="address"
              name="address"
              label="Manzil"
              fullWidth
              multiline
              rows={2}
            />

            {/* File Upload Section */}
            <Typography variant="subtitle2" sx={{ mb: 2, mt: 2 }}>
              Yuklangan hujjatlar (ixtiyoriy)
            </Typography>
            <Stack spacing={2}>
              {/* Passport */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  p: 1.5,
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 1,
                  "&:hover": {
                    borderColor: "primary.main",
                    bgcolor: "action.hover",
                  },
                }}
              >
                <FaPassport size={20} />
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2">
                    Passport
                    {formValues.passportFile
                      ? `.${formValues.passportFile.name.split(".").pop()}`
                      : ""}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {formValues.passportFile
                      ? formValues.passportFile.name
                      : "Fayl yuklanmagan"}
                  </Typography>
                </Box>
                <input
                  accept="image/*,application/pdf"
                  style={{ display: "none" }}
                  id="passport-file-input"
                  type="file"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const file = e.target.files?.[0] || null;
                    setFormValues((prev) => ({
                      ...prev,
                      passportFile: file,
                    }));
                  }}
                />
                <label htmlFor="passport-file-input">
                  <IconButton component="span" color="primary" size="small">
                    <MdUpload />
                  </IconButton>
                </label>
                {formValues.passportFile && (
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => {
                      setFormValues((prev) => ({
                        ...prev,
                        passportFile: null,
                      }));
                    }}
                  >
                    <MdDelete />
                  </IconButton>
                )}
              </Box>

              {/* Shartnoma */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  p: 1.5,
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 1,
                  "&:hover": {
                    borderColor: "primary.main",
                    bgcolor: "action.hover",
                  },
                }}
              >
                <FaRegFileLines size={20} />
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2">
                    Shartnoma
                    {formValues.shartnomaFile
                      ? `.${formValues.shartnomaFile.name.split(".").pop()}`
                      : ""}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {formValues.shartnomaFile
                      ? formValues.shartnomaFile.name
                      : "Fayl yuklanmagan"}
                  </Typography>
                </Box>
                <input
                  accept="image/*,application/pdf"
                  style={{ display: "none" }}
                  id="shartnoma-file-input"
                  type="file"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const file = e.target.files?.[0] || null;
                    setFormValues((prev) => ({
                      ...prev,
                      shartnomaFile: file,
                    }));
                  }}
                />
                <label htmlFor="shartnoma-file-input">
                  <IconButton component="span" color="primary" size="small">
                    <MdUpload />
                  </IconButton>
                </label>
                {formValues.shartnomaFile && (
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => {
                      setFormValues((prev) => ({
                        ...prev,
                        shartnomaFile: null,
                      }));
                    }}
                  >
                    <MdDelete />
                  </IconButton>
                )}
              </Box>

              {/* Photo */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  p: 1.5,
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 1,
                  "&:hover": {
                    borderColor: "primary.main",
                    bgcolor: "action.hover",
                  },
                }}
              >
                <TbPhoto size={20} />
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2">
                    Foto
                    {formValues.photoFile
                      ? `.${formValues.photoFile.name.split(".").pop()}`
                      : ""}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {formValues.photoFile
                      ? formValues.photoFile.name
                      : "Fayl yuklanmagan"}
                  </Typography>
                </Box>
                <input
                  accept="image/*,application/pdf"
                  style={{ display: "none" }}
                  id="photo-file-input"
                  type="file"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const file = e.target.files?.[0] || null;
                    setFormValues((prev) => ({
                      ...prev,
                      photoFile: file,
                    }));
                  }}
                />
                <label htmlFor="photo-file-input">
                  <IconButton component="span" color="primary" size="small">
                    <MdUpload />
                  </IconButton>
                </label>
                {formValues.photoFile && (
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => {
                      setFormValues((prev) => ({
                        ...prev,
                        photoFile: null,
                      }));
                    }}
                  >
                    <MdDelete />
                  </IconButton>
                )}
              </Box>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button color="error" onClick={handleClose}>
              Bekor qilish
            </Button>
            <Button type="submit" disabled={!isFormValid}>
              Saqlash
            </Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  );
};

export default ModalCustomer;
