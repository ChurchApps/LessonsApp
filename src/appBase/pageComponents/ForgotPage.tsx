import React from "react";
import "./Login.css";
import { ApiHelper } from "../helpers";
import { ErrorMessages } from "../components";
import { ResetPasswordRequestInterface, ResetPasswordResponseInterface } from "../interfaces";
import { Button, Form } from "react-bootstrap";
import * as yup from "yup"
import { Formik, FormikHelpers } from "formik"

const schema = yup.object().shape({
  email: yup.string().required("Please enter your email address.").email("Please enter a valid email address.")
})

interface Props {
    registerUrl?: string;
}

export const ForgotPage: React.FC<Props> = ({registerUrl}) => {
  const [errors, setErrors] = React.useState([]);
  const [successMessage, setSuccessMessage] = React.useState<React.ReactElement>(null);

  const reset = ({ email }: { email: string }, helpers?: FormikHelpers<any>) => {
    let req: ResetPasswordRequestInterface = { userEmail: email };

    ApiHelper.postAnonymous("/users/forgot", req, "AccessApi").then((resp: ResetPasswordResponseInterface) => {
      if (resp.emailed) {
        setErrors([]);
        setSuccessMessage(<div className="alert alert-success" role="alert">Password reset email sent</div>);
      } else {
        setErrors(["We could not find an account with this email address"]);
        setSuccessMessage(<></>);
      }
    }).finally(() => {
      helpers?.setSubmitting(false)
    });
  }

  const initialValues = { email: "" }

  return (
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
            isSubmitting
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
                  onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === "Enter" && reset}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.email}
                </Form.Control.Feedback>
              </Form.Group>
              <Button type="submit" size="lg" variant="primary" block disabled={isSubmitting}>Reset</Button>
            </Form>
          )}
        </Formik>
        <br />
        <div className="text-right"><a href={registerUrl}>Register</a> &nbsp; | &nbsp;<a href="/login">Login</a>&nbsp;</div>
      </div>
    </div>
  );

}
