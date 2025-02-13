import { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import cn from 'classnames';
import { userService } from '../../services/userService.ts';
import { AxiosError } from 'axios';
import { usePageError } from '../../hooks/usePageError.ts';
import { useNavigate } from 'react-router-dom';
import { validatorService } from '../../utils/validators.ts';

type ChangeEmailError = AxiosError<{ message?: string; errors?: { password?: string; newEmail?: string } }>

export const ChangeEmailPage = () => {
  const navigate = useNavigate();
  const [error, setError] = usePageError('');
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    setTimeout(() => navigate('/profile'), 3000);

    return (
      <section className="box">
        <h1 className="title">Email Updated</h1>
        <p>Your email has been successfully updated. Redirecting...</p>
      </section>
    );
  }

  return (
    <div className="container is-max-desktop">
      <Formik
        initialValues={{ password: '', newEmail: '' }}
        validateOnMount={true}
        onSubmit={({ password, newEmail }, formikHelpers) => {
          formikHelpers.setSubmitting(true);
          userService
            .changeEmail(password, newEmail)
            .then(() => setSubmitted(true))
            .catch((error: ChangeEmailError) => {
              if (error.message) setError(error.message);
              if (!error.response?.data) return;

              const { errors, message } = error.response.data;
              formikHelpers.setFieldError('password', errors?.password);
              formikHelpers.setFieldError('newEmail', errors?.newEmail);
              if (message) setError(message);
            })
            .finally(() => formikHelpers.setSubmitting(false));
        }}
      >
        {({ touched, errors, isSubmitting }) => (
          <Form className="box">
            <h1 className="title">Change Email</h1>

            {/* Password Field */}
            <div className="field">
              <label htmlFor="password" className="label">Current Password</label>
              <div className="control has-icons-left has-icons-right">
                <Field
                  validate={validatorService.validatePassword}
                  name="password"
                  type="password"
                  id="password"
                  placeholder="Enter your current password"
                  className={cn('input', { 'is-danger': touched.password && errors.password })}
                />
                <span className="icon is-small is-left">
                  <i className="fa fa-lock"></i>
                </span>
                {touched.password && errors.password && (
                  <span className="icon is-small is-right has-text-danger">
                    <i className="fas fa-exclamation-triangle"></i>
                  </span>
                )}
              </div>
              {touched.password && errors.password && <p className="help is-danger">{errors.password}</p>}
            </div>

            {/* New Email Field */}
            <div className="field">
              <label htmlFor="newEmail" className="label">New Email</label>
              <div className="control has-icons-left has-icons-right">
                <Field
                  validate={validatorService.validateEmail}
                  name="newEmail"
                  type="email"
                  id="newEmail"
                  placeholder="Enter your new email"
                  className={cn('input', { 'is-danger': touched.newEmail && errors.newEmail })}
                />
                <span className="icon is-small is-left">
                  <i className="fa fa-envelope"></i>
                </span>
                {touched.newEmail && errors.newEmail && (
                  <span className="icon is-small is-right has-text-danger">
                    <i className="fas fa-exclamation-triangle"></i>
                  </span>
                )}
              </div>
              {touched.newEmail && errors.newEmail && <p className="help is-danger">{errors.newEmail}</p>}
            </div>

            <div className="field">
              <button
                type="submit"
                className={cn('button is-success has-text-weight-bold', { 'is-loading': isSubmitting })}
                disabled={isSubmitting || !!errors.password || !!errors.newEmail}
              >
                Update Email
              </button>
            </div>
          </Form>
        )}
      </Formik>
      {error && <p className="notification is-danger is-light">{error}</p>}
    </div>
  );
};
