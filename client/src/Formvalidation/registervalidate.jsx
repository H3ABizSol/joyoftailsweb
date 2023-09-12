import * as Yup from "yup";

export const SignupSchema = Yup.object().shape({
  username: Yup.string()
    .min(2, "name is too short!")
    .max(50, "name is too Long!")
    .required("Name is required"),
  email: Yup.string().email("Invalid email").required("email is required"),
  password: Yup.string()
    .min(8)
    .required("password should be 8 character minimum,"),
  confirmpassword: Yup.string().oneOf(
    [Yup.ref("password"), null],
    "Passwords must match"
  ),
});
