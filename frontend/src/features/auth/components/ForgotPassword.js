import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {useDispatch, useSelector} from 'react-redux';
import { resetPasswordRequestAsync, selectMailSent } from '../authSlice';

export default function ForgotPassword() {

 const mailSent = useSelector(selectMailSent);
  const dispatch = useDispatch()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  console.log(errors);

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img className="mx-auto h-10 w-auto" src="/logo.svg" alt="Logo" />
          <h2 className="section-title">Forgot your password?</h2>
        </div>
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" onSubmit={handleSubmit((data) => {
            console.log(data);
            dispatch(resetPasswordRequestAsync(data.email))
          })}>
            <div>
              <label htmlFor="email" className="label">Email address</label>
              <div className="mt-2">
                <input id="email" name="email" type="email" autoComplete="email" required className="input-field" {...register('email', {
                  required: 'email is required',
                  pattern: {
                    value: /\b[\w\.-]+@[\w\.-]+\.\w{2,4}\b/gi,
                    message: 'email not valid',
                  },
                })} />
                {errors.email && <p className="text-error">{errors.email.message}</p>}
                {mailSent && <p className="text-success">Mail Sent</p>}
              </div>
            </div>
            <div>
              <button type="submit" className="btn-primary">Send Reset Link</button>
            </div>
          </form>
          <p className="mt-10 text-center text-sm text-gray-500">
            Remembered your password?{' '}
            <a href="/login" className="link-primary">Login</a>
          </p>
        </div>
      </div>
    </>
  );
}
