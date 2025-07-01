import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {useDispatch, useSelector} from 'react-redux';
import { resetPasswordAsync, selectError, selectPasswordReset } from '../authSlice';

export default function ResetPassword() {

  const passwordReset = useSelector(selectPasswordReset);
  const error = useSelector(selectError)
  const query = new URLSearchParams(window.location.search);
  const token = query.get('token')
  const email = query.get('email')

  const dispatch = useDispatch()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  console.log(errors);
  console.log(email, token)

  return (
    <>
      {(email && token) ? (
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <img className="mx-auto h-10 w-auto" src="/logo.svg" alt="Logo" />
            <h2 className="section-title">Reset your password</h2>
          </div>
          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form className="space-y-6" onSubmit={handleSubmit((data) => {
              console.log(data);
              dispatch(resetPasswordAsync({email, token, password:data.password}))
            })}>
              <div>
                <label htmlFor="password" className="label">New Password</label>
                <div className="mt-2">
                  <input id="password" name="password" type="password" autoComplete="new-password" required className="input-field" {...register('password', {
                    required: 'password is required',
                    pattern: {
                      value:
                        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm,
                      message: `- at least 8 characters\n
                      - must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number\n
                      - Can contain special characters`,
                    },
                  })} />
                  {errors.password && <p className="text-error">{errors.password.message}</p>}
                </div>
              </div>
              <div>
                <label htmlFor="confirmPassword" className="label">Confirm New Password</label>
                <div className="mt-2">
                  <input id="confirmPassword" name="confirmPassword" type="password" autoComplete="new-password" required className="input-field" {...register('confirmPassword', {
                    required: 'confirm password is required',
                    validate: (value, formValues) =>
                      value === formValues.password || 'password not matching',
                  })} />
                  {errors.confirmPassword && <p className="text-error">{errors.confirmPassword.message}</p>}
                </div>
              </div>
              {passwordReset && <p className="text-success">Password Reset</p>}
              {error && <p className="text-error">{error}</p>}
              <div>
                <button type="submit" className="btn-primary">Reset Password</button>
              </div>
            </form>
            <p className="mt-10 text-center text-sm text-gray-500">
              Go back to{' '}
              <a href="/login" className="link-primary">Login</a>
            </p>
          </div>
        </div>
      ) : <p>Incorrect Link</p>}
    </>
  );
}
