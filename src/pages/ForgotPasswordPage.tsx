import { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import cn from 'classnames';
import { authService } from '../services/authService';
import { AxiosError } from 'axios';
import { usePageError } from '../hooks/usePageError';

type ForgotPasswordError = AxiosError<{ message?: string; errors?: { email?: string } }>

function validateEmail(value: string) {
  const EMAIL_PATTERN = /^[\w.+-]+@([\w-]+\.){1,3}[\w-]{2,}$/;
  if (!value) return 'Email is required';
  if (!EMAIL_PATTERN.test(value)) return 'Email is not valid';
}

export const ForgotPasswordPage = () => {
  const [error, setError] = usePageError('');
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <section className="box">
        <h1 className="title">Check your email</h1>
        <p>We have sent you a link to reset your password.</p>
      </section>
    );
  }

  return (
    <>
      <Formik
        initialValues={{ email: '' }}
        validateOnMount={true}
        onSubmit={({ email }, formikHelpers) => {
          formikHelpers.setSubmitting(true);
          authService
            .forgotPassword(email)
            .then(() => setSubmitted(true))
            .catch((error: ForgotPasswordError) => {
              if (error.message) setError(error.message);
              if (!error.response?.data) return;

              const { errors, message } = error.response.data;
              formikHelpers.setFieldError('email', errors?.email);
              if (message) setError(message);
            })
            .finally(() => formikHelpers.setSubmitting(false));
        }}
      >
        {({ touched, errors, isSubmitting }) => (
          <Form className="box">
            <h1 className="title">Forgot Password</h1>
            <div className="field">
              <label htmlFor="email" className="label">Email</label>
              <div className="control has-icons-left has-icons-right">
                <Field
                  validate={validateEmail}
                  name="email"
                  type="email"
                  id="email"
                  placeholder="e.g. bobsmith@gmail.com"
                  className={cn('input', { 'is-danger': touched.email && errors.email })}
                />
                <span className="icon is-small is-left">
                <i className="fa fa-envelope"></i>
              </span>
                {touched.email && errors.email && (
                  <span className="icon is-small is-right has-text-danger">
                  <i className="fas fa-exclamation-triangle"></i>
                </span>
                )}
              </div>
              {touched.email && errors.email && <p className="help is-danger">{errors.email}</p>}
            </div>
            <div className="field">
              <button
                type="submit"
                className={cn('button is-success has-text-weight-bold', { 'is-loading': isSubmitting })}
                disabled={isSubmitting || !!errors.email}
              >
                Reset Password
              </button>
            </div>
          </Form>
        )}
      </Formik>
      {error && <p className="notification is-danger is-light">{error}</p>}
    </>
  );
};
