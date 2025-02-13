import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import cn from 'classnames';

import { authService } from '../../services/authService.ts';
import { AxiosError } from 'axios';
import { usePageError } from '../../hooks/usePageError.ts';
import { validatorService } from '../../utils/validators.ts';


export const ResetPasswordPage = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [error, setError] = usePageError('');
  const [success, setSuccess] = useState(false);

  if (success) {
    setTimeout(() => navigate('/login'), 3000);
    return (
      <section className="box">
        <h1 className="title">Password Reset Successful</h1>
        <p>You can now log in with your new password. Redirecting...</p>
      </section>
    );
  }

  return (
    <Formik
      initialValues={{ newPassword: '', confirmPassword: '' }}
      validateOnMount={true}
      onSubmit={({ newPassword, confirmPassword }, formikHelpers) => {
        formikHelpers.setSubmitting(true);

        if (!token) {
          setError("Token is not provided.");
          formikHelpers.setSubmitting(false);
          return;
        }

        authService
          .resetPassword(token, newPassword, confirmPassword)
          .then(() => setSuccess(true))
          .catch((error: AxiosError<{ message?: string }>) => {
            setError(error.response?.data?.message ?? '');
          })
          .finally(() => formikHelpers.setSubmitting(false));
      }}
    >
      {({ touched, errors, isSubmitting }) => (
        <Form className="box">
          <h1 className="title">Reset Password</h1>
          {error && <p className="notification is-danger is-light">{error}</p>}
          <div className="field">
            <label htmlFor="newPassword" className="label">New Password</label>
            <div className="control has-icons-left has-icons-right">
              <Field
                validate={validatorService.validatePassword}
                name="newPassword"
                type="password"
                id="newPassword"
                placeholder="*******"
                className={cn('input', {
                  'is-danger': touched.newPassword && errors.newPassword,
                })}
              />
              <span className="icon is-small is-left">
                <i className="fa fa-lock"></i>
              </span>
            </div>
            {touched.newPassword && errors.newPassword && <p className="help is-danger">{errors.newPassword}</p>}
          </div>

          <div className="field">
            <label htmlFor="confirmPassword" className="label">Confirm Password</label>
            <div className="control has-icons-left has-icons-right">
              <Field
                validate={validatorService.validatePassword}
                name="confirmPassword"
                type="password"
                id="confirmPassword"
                placeholder="*******"
                className={cn('input', {
                  'is-danger': touched.confirmPassword && errors.confirmPassword,
                })}
              />
              <span className="icon is-small is-left">
                <i className="fa fa-lock"></i>
              </span>
            </div>
            {touched.confirmPassword && errors.confirmPassword && <p className="help is-danger">{errors.confirmPassword}</p>}
          </div>

          <div className="field">
            <button
              type="submit"
              className={cn('button is-success has-text-weight-bold', {
                'is-loading': isSubmitting,
              })}
              disabled={isSubmitting || !!errors.newPassword || !!errors.confirmPassword}
            >
              Reset Password
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};
