import { Grid, TextField, Button, Box, Snackbar, Alert, MenuItem, Select, InputLabel, FormControl, InputAdornment, IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getUser, register } from "../../../Redux/Auth/Action";
import { useEffect, useState } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";

export default function RegisterUserForm({ handleNext }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { auth } = useSelector((store) => store);
  const handleClose = () => setOpenSnackBar(false);

  const jwt = localStorage.getItem("jwt");

  useEffect(() => {
    if (jwt) {
      dispatch(getUser(jwt))
    }
  }, [jwt]);

  useEffect(() => {
    if (auth.user || auth.error) setOpenSnackBar(true)
  }, [auth.user]);

  const handleEmailBlur = (event) => {
    const email = event.target.value;
    if (!email.includes('@') ) {
      setEmailError('Please enter a valid Gmail address.');
    } else {
      setEmailError('');
    }
  };

  const handlePasswordBlur = (event) => {
    const password = event.target.value;
    const specialCharPattern = /[!@#$%^&*(),.?":{}|<>]/;
    const numberPattern = /[0-9]/;
    const letterPattern = /[a-zA-Z]/;

    if (!specialCharPattern.test(password) || !numberPattern.test(password) || !letterPattern.test(password)) {
      setPasswordError('Password must contain at least one number, one special character, and one letter.');
    } else {
      setPasswordError('');
    }
  };

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = (event) => event.preventDefault();

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const userData = {
      firstName: data.get("firstName"),
      lastName: data.get("lastName"),
      email: data.get("email"),
      password: data.get("password"),
      role: data.get("role")
    }

    let valid = true;

    if (!userData.email.includes('@') || !userData.email.includes('gmail.com')) {
      setEmailError('Please enter a valid Gmail address.');
      valid = false;
    }

    const specialCharPattern = /[!@#$%^&*(),.?":{}|<>]/;
    const numberPattern = /[0-9]/;
    const letterPattern = /[a-zA-Z]/;
    if (!specialCharPattern.test(userData.password) || !numberPattern.test(userData.password) || !letterPattern.test(userData.password)) {
      setPasswordError('Password must contain at least one number, one special character, and one letter.');
      valid = false;
    }

    if (!valid) return;

    console.log("user data", userData);
    dispatch(register(userData));
  };

  return (
    <div className="">
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              id="firstName"
              name="firstName"
              label="First Name"
              fullWidth
              autoComplete="given-name"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              id="lastName"
              name="lastName"
              label="Last Name"
              fullWidth
              autoComplete="given-name"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              id="email"
              name="email"
              label="Email"
              fullWidth
              autoComplete="given-name"
              onBlur={handleEmailBlur}
              error={!!emailError}
              helperText={emailError}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Role</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Role"
                name="role"
              >
                <MenuItem value={"ROLE_ADMIN"}>Admin</MenuItem>
                <MenuItem value={"ROLE_CUSTOMER"}>Customer</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              id="password"
              name="password"
              label="Password"
              fullWidth
              autoComplete="given-name"
              type={showPassword ? "text" : "password"} 
              onBlur={handlePasswordBlur}
              error={!!passwordError}
              helperText={passwordError}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              className="bg-[#9155FD] w-full"
              type="submit"
              variant="contained"
              size="large"
              sx={{ padding: ".8rem 0" }}
            >
              Register
            </Button>
          </Grid>
        </Grid>
      </form>

      <div className="flex justify-center flex-col items-center">
        <div className="py-3 flex items-center ">
          <p className="m-0 p-0">If you already have an account?</p>
          <Button onClick={() => navigate("/login")} className="ml-5" size="small">
            Login
          </Button>
        </div>
      </div>

      <Snackbar open={openSnackBar} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
          {auth.error ? auth.error : auth.user ? "Register Success" : ""}
        </Alert>
      </Snackbar>
    </div>
  );
}
