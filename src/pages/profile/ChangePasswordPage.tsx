import { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import cn from 'classnames';
import { userService } from '../../services/userService.ts';
import { usePageError } from '../../hooks/usePageError.ts';
import { useNavigate } from 'react-router-dom';
import { validatorService } from '../../utils/validators.ts';
import { ChangePasswordError } from '../../utils/errors.ts';


export const ChangePasswordPage = () => {
  const navigate = useNavigate();
  const [error, setError] = usePageError('');
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    setTimeout(() => navigate('/profile'), 3000);

    return (
      <section className="box">
        <h1 className="title">Password Updated</h1>
        <p>Your password has been successfully updated. Redirecting...</p>
      </section>
    );
  }

  return (
    <div className="container is-max-desktop">
      <Formik
        initialValues={{ oldPassword: '', newPassword: '', confirmPassword: '' }}
        validateOnMount={true}
        onSubmit={({ oldPassword, newPassword, confirmPassword }, formikHelpers) => {
          formikHelpers.setSubmitting(true);
          userService
            .changePassword(oldPassword, newPassword, confirmPassword)
            .then(() => setSubmitted(true))
            .catch((error: ChangePasswordError) => {
              if (error.message) setError(error.message);
              if (!error.response?.data) return;

              const { errors, message } = error.response.data;
              formikHelpers.setFieldError('oldPassword', errors?.oldPassword);
              formikHelpers.setFieldError('newPassword', errors?.newPassword);
              formikHelpers.setFieldError('confirmPassword', errors?.confirmPassword);
              if (message) setError(message);
            })
            .finally(() => formikHelpers.setSubmitting(false));
        }}
      >
        {({ touched, errors, isSubmitting }) => (
          <Form className="box">
            <h1 className="title">Change Password</h1>

            {/* Old Password Field */}
            <div className="field">
              <label htmlFor="oldPassword" className="label">Current Password</label>
              <div className="control has-icons-left has-icons-right">
                <Field
                  validate={validatorService.validatePassword}
                  name="oldPassword"
                  type="password"
                  id="oldPassword"
                  placeholder="Enter your current password"
                  className={cn('input', { 'is-danger': touched.oldPassword && errors.oldPassword })}
                />
                <span className="icon is-small is-left">
                  <i className="fa fa-lock"></i>
                </span>
                {touched.oldPassword && errors.oldPassword && (
                  <span className="icon is-small is-right has-text-danger">
                    <i className="fas fa-exclamation-triangle"></i>
                  </span>
                )}
              </div>
              {touched.oldPassword && errors.oldPassword && <p className="help is-danger">{errors.oldPassword}</p>}
            </div>

            {/* New Password Field */}
            <div className="field">
              <label htmlFor="newPassword" className="label">New Password</label>
              <div className="control has-icons-left has-icons-right">
                <Field
                  validate={validatorService.validatePassword}
                  name="newPassword"
                  type="password"
                  id="newPassword"
                  placeholder="Enter your new password"
                  className={cn('input', { 'is-danger': touched.newPassword && errors.newPassword })}
                />
                <span className="icon is-small is-left">
                  <i className="fa fa-lock"></i>
                </span>
                {touched.newPassword && errors.newPassword && (
                  <span className="icon is-small is-right has-text-danger">
                    <i className="fas fa-exclamation-triangle"></i>
                  </span>
                )}
              </div>
              {touched.newPassword && errors.newPassword && <p className="help is-danger">{errors.newPassword}</p>}
            </div>

            {/* Confirm Password Field */}
            <div className="field">
              <label htmlFor="confirmPassword" className="label">Confirm New Password</label>
              <div className="control has-icons-left has-icons-right">
                <Field
                  validate={validatorService.validatePassword}
                  name="confirmPassword"
                  type="password"
                  id="confirmPassword"
                  placeholder="Confirm your new password"
                  className={cn('input', { 'is-danger': touched.confirmPassword && errors.confirmPassword })}
                />
                <span className="icon is-small is-left">
                  <i className="fa fa-lock"></i>
                </span>
                {touched.confirmPassword && errors.confirmPassword && (
                  <span className="icon is-small is-right has-text-danger">
                    <i className="fas fa-exclamation-triangle"></i>
                  </span>
                )}
              </div>
              {touched.confirmPassword && errors.confirmPassword && <p className="help is-danger">{errors.confirmPassword}</p>}
            </div>

            <div className="field">
              <button
                type="submit"
                className={cn('button is-success has-text-weight-bold', { 'is-loading': isSubmitting })}
                disabled={isSubmitting || !!errors.oldPassword || !!errors.newPassword || !!errors.confirmPassword}
              >
                Update Password
              </button>
            </div>
          </Form>
        )}
      </Formik>
      {error && <p className="notification is-danger is-light">{error}</p>}
    </div>
  );
};
