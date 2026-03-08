import React from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import Layout from "../components/Layout";
import { registerUser } from "../services/authServices";
import { useNavigate } from "react-router-dom";
import "../styles/register.css";




const passwordRegex =
  /^(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])(?=(?:[^0-9]*[0-9]){0,2}[^0-9]*$).{8,20}$/;




const schema = yup.object().shape({
  firstName: yup.string().required("First Name is required"),
  lastName: yup.string(),
  mobile: yup
    .string()
    .required("Mobile number is required")
    .transform((value) => value.slice(-10))
    .matches(/^[0-9]{10}$/, "Mobile number must be exactly 10 digits"),
  email: yup.string().email("Enter valid email").required("Email is required"),
  password: yup
    .string()
    .required("Password is required")
    .matches(
      passwordRegex,
      "Password must have 1 uppercase, lowercase, special char, max 2 digits"
    ),
});




const Register = () => {
  const navigate = useNavigate();




  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });




  const onSubmit = async (data) => {
    try {
      const mobileNumber = data.mobile.slice(-10);




      const payload = {
        firstName: data.firstName,
        lastName: data.lastName || "",
        email: data.email,
        password: data.password,
        countryCode: "91",
        mobile: mobileNumber,
        role: "customer",
      };




      // Register user (Firestore doc ID = auth.uid)
      const registeredUser = await registerUser(payload);




      alert(`User registered successfully! Your ID: ${registeredUser.customId}`);
      reset();




      // Optional: Directly navigate to login or auto-login
      navigate("/login/user");
    } catch (err) {
      // Show proper error messages
      if (err.message.includes("email-already-in-use")) {
        alert("Email already registered. Please login.");
      } else {
        alert(err.message);
      }
    }
  };




  return (
    <Layout>
      <div className="register-container">
        <h2>Register</h2>




        <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
          {/* Hidden input to prevent browser autofill */}
          <input type="text" style={{ display: "none" }} />




          <input placeholder="First Name" {...register("firstName")} autoComplete="off" />
          <p className="error">{errors.firstName?.message}</p>




          <input placeholder="Last Name (Optional)" {...register("lastName")} autoComplete="off" />
          <p className="error">{errors.lastName?.message}</p>




          <Controller
            name="mobile"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <PhoneInput
                country={"in"}
                onlyCountries={["in"]}
                countryCodeEditable={false}
                disableDropdown
                value={field.value}
                onChange={field.onChange}
                inputStyle={{ width: "100%" }}
                inputProps={{ autoComplete: "off", required: true }}
              />
            )}
          />
          <p className="error">{errors.mobile?.message}</p>




          <input placeholder="Email" {...register("email")} autoComplete="off" />
          <p className="error">{errors.email?.message}</p>




          <input
            type="password"
            placeholder="Password"
            {...register("password")}
            autoComplete="new-password"
          />
          <p className="error">{errors.password?.message}</p>




          <button type="submit" className="primary-btn">Register</button>
        </form>
      </div>
    </Layout>
  );
};




export default Register;
