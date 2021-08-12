import Image from "next/image";
import { Formik } from "formik";
import * as yup from "yup";
import { Form, Button } from "react-bootstrap";
import { Layout, PasswordField } from "@/components";
import Logo from "@/public/images/logo.png";

const schema = yup.object().shape({
  email: yup
    .string()
    .required("Please enter your email address.")
    .email("Please enter a valid email address."),
  password: yup.string().required("Please enter your password."),
});

export default function Login() {
  const initialValues = { email: "", password: "" };

  return (
    <Layout withoutNavbar withoutFooter>
      <div className="smallCenterBlock">
        <div className="login-logo">
          <Image src={Logo} alt="logo" width={350} height={60} />
        </div>
        <div id="loginBox">
          <h2>Please sign in</h2>
          <Formik
            validationSchema={schema}
            initialValues={initialValues}
            onSubmit={console.log}
          >
            {({
              handleSubmit,
              handleChange,
              values,
              touched,
              errors,
              isSubmitting,
            }) => (
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
                    onKeyDown={(e) =>
                      e.key === "Enter" && console.log("enter clicked...")
                    }
                    isInvalid={touched.password && !!errors.password}
                    errorText={errors.password}
                  />
                </Form.Group>
                <Button
                  type="submit"
                  size="lg"
                  variant="primary"
                  className="signin-button"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Please wait..." : "Sign in"}
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
