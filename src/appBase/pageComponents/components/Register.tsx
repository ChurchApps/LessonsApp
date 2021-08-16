import React from "react";
import { LoginResponseInterface, RegisterUserInterface } from "../../interfaces";
import { ApiHelper } from "../../helpers";
import { Button, FormControl, Form } from "react-bootstrap";
import * as yup from "yup"
import { Formik, FormikHelpers } from "formik"

const schema = yup.object().shape({
  email: yup.string().required("Please enter your email address.").email("Please enter a valid email address."),
  firstName: yup.string().required("Please enter your first name."),
  lastName: yup.string().required("Please enter your last name.")
})

interface Props {
  appName?: string,
  appUrl?: string,
  updateErrors: (errors: string[]) => void
}


export const Register: React.FC<Props> = (props) => {
  const [registered, setRegistered] = React.useState(false);


  const handleRegisterErrors = (errors: string[]) => {
    props.updateErrors(["Invalid login. Please check your email or password."])
  }

  const handleRegisterSuccess = (resp: LoginResponseInterface) => {
    setRegistered(true);
  }

  const register = (data: RegisterUserInterface, helpers?: FormikHelpers<any>) => {
    ApiHelper.postAnonymous("/users/register", data, "AccessApi")
      .then((resp: any) => {
        if (resp.errors) handleRegisterErrors(resp.errors);
        else handleRegisterSuccess(resp);
      })
      .catch((e) => { props.updateErrors([e.toString()]); throw e; })
      .finally(() => {
        helpers?.setSubmitting(false)
      });
  };

  //React.useEffect(init, []);

  const initialValues = { firstName: "", lastName: "", email: "", appName: props.appName, appUrl: props.appUrl }

  const getThankYou = () => {
    return (<div id="loginBox">
      <h3>Thank You For Registering</h3>
      <p>Please check your email for your temporary password in order to get started.</p>
    </div>);
  }

  if (registered) return getThankYou();
  else return (

    <div id="loginBox">
      <h2>Create an account</h2>
      <Formik validationSchema={schema} initialValues={initialValues} onSubmit={register} >
        {({ handleSubmit, handleChange, values, touched, errors, isSubmitting }) => (
          <Form noValidate onSubmit={handleSubmit}>
            <Form.Group>
              <FormControl type="text" aria-label="firstName" id="firstName" name="firstName" value={values.firstName} onChange={handleChange} placeholder="First name" isInvalid={touched.firstName && !!errors.firstName} />
              <Form.Control.Feedback type="invalid">{errors.firstName}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group>
              <FormControl type="text" aria-label="lastName" id="lastName" name="lastName" value={values.lastName} onChange={handleChange} placeholder="Last name" isInvalid={touched.lastName && !!errors.lastName} />
              <Form.Control.Feedback type="invalid">{errors.lastName}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group>
              <FormControl type="text" aria-label="email" id="email" name="email" value={values.email} onChange={handleChange} placeholder="Email address" isInvalid={touched.email && !!errors.email} />
              <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
            </Form.Group>
            <Button type="submit" id="signInButton" size="lg" variant="primary" block disabled={isSubmitting}>
              {isSubmitting ? "Please wait..." : "Sign in"}
            </Button>
          </Form>
        )}
      </Formik>
    </div>

  );

};
