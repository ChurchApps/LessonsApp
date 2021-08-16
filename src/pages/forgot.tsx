import { useState } from "react";
import { Formik, FormikHelpers } from "formik";
import { Form, Button } from "react-bootstrap";
import * as yup from "yup";
import { Layout, ErrorMessages } from "@/components";
import {
  ApiHelper,
  ResetPasswordRequestInterface,
  ResetPasswordResponseInterface,
  EnvironmentHelper,
} from "@/utils";

const schema = yup.object().shape({
  email: yup
    .string()
    .required("Please enter your email address.")
    .email("Please enter a valid email address."),
});

export default function Forgot() {
  const [errors, setErrors] = useState([]);
  const [successMessage, setSuccessMessage] =
    useState<React.ReactElement>(null);

  const reset = (
    { email }: { email: string },
    helpers?: FormikHelpers<any>
  ) => {
    let req: ResetPasswordRequestInterface = { userEmail: email };

    ApiHelper.postAnonymous("/users/forgot", req, "AccessApi")
      .then((resp: ResetPasswordResponseInterface) => {
        if (resp.emailed) {
          setErrors([]);
          setSuccessMessage(
            <div className="alert alert-success" role="alert">
              Password reset email sent
            </div>
          );
        } else {
          setErrors(["We could not find an account with this email address"]);
          setSuccessMessage(<></>);
        }
      })
      .finally(() => {
        helpers?.setSubmitting(false);
      });
  };

  const initialValues = { email: "" };

  return (
    <Layout withoutNavbar withoutFooter>
      <div className="smallCenterBlock">
        <ErrorMessages errors={errors} />
        {successMessage}
        <div id="loginBox">
          <h2>Reset Password</h2>
          <p>Enter your email address to request a password reset.</p>
          <Formik
            validationSchema={schema}
            initialValues={initialValues}
            onSubmit={reset}
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
                    onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) =>
                      e.key === "Enter" && reset
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.email}
                  </Form.Control.Feedback>
                </Form.Group>
                <Button
                  type="submit"
                  size="lg"
                  variant="primary"
                  className="w-100"
                  disabled={isSubmitting}
                >
                  Reset
                </Button>
              </Form>
            )}
          </Formik>
          <br />
          <div className="text-right">
            <a href={EnvironmentHelper.ChurchAppsUrl}>Register</a> &nbsp; |
            &nbsp;
            <a href="/login">Login</a>&nbsp;
          </div>
        </div>
      </div>
    </Layout>
  );
}
