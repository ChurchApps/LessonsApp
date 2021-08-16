import Image from "next/image";
import { Formik } from "formik";
import * as yup from "yup";
import { Form, Button, Alert } from "react-bootstrap";
import { Layout, PasswordField, ErrorMessages } from "@/components";
import { UserInterface } from "@/utils";
import { useAuth } from "@/hooks/useAuth";

const schema = yup.object().shape({
  email: yup
    .string()
    .required("Please enter your email address.")
    .email("Please enter a valid email address."),
  password: yup.string().required("Please enter your password."),
});

const APP_NAME = "Lessons";

export default function Login() {
  const initialValues: UserInterface = { email: "", password: "" };
  const { login, loading, error, isRelogin, user } = useAuth();

  function handleSubmit(data: UserInterface) {
    login(data);
  }

  return (
    <Layout withoutNavbar withoutFooter>
      <div className="smallCenterBlock">
        <div className="login-logo">
          <Image src="/images/logo.png" alt="logo" width={350} height={60} />
        </div>
        <ErrorMessages errors={!error ? null : [error]} />
        {isRelogin && loading && (
          <Alert variant="info">
            Welcome back, <b>{user.email}</b>! Please wait while we load your
            data.
          </Alert>
        )}
        <div id="loginBox">
          <h2>Please sign in</h2>
          <Formik
            validationSchema={schema}
            initialValues={initialValues}
            onSubmit={handleSubmit}
          >
            {({ handleSubmit, handleChange, values, touched, errors }) => (
              <Form noValidate onSubmit={handleSubmit}>
                <Form.Group>
                  <Form.Control
                    type="text"
                    aria-label="email"
                    id="email"
                    name="email"
                    value={values.email}
                    onChange={handleChange}
                    placeholder="Email address"
                    isInvalid={touched.email && !!errors.email}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.email}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group>
                  <PasswordField
                    value={values.password}
                    onChange={handleChange}
                    isInvalid={touched.password && !!errors.password}
                    errorText={errors.password}
                  />
                </Form.Group>
                <Button
                  type="submit"
                  size="lg"
                  variant="primary"
                  className="signin-button"
                  disabled={loading}
                >
                  {loading ? "Please wait..." : "Sign in"}
                </Button>
              </Form>
            )}
          </Formik>
          <br />
          <div className="text-right">
            <a href="/forgot">Forgot Password</a>&nbsp;
          </div>
        </div>
      </div>
    </Layout>
  );
}
