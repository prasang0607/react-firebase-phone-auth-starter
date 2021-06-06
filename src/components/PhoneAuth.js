import React, { useState, useRef, useEffect } from 'react';
import { firebase } from '../firebase/config';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const PhoneAuth = () => {
  const phone = useRef();
  const otp = useRef();
  const [error, setError] = useState('');
  const [otpError, setOtpError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [message, setMessage] = useState('');
  const [sendingOtp, setSendingOtp] = useState(false);
  const [signingIn, setSigningIn] = useState(false);
  const [recaptchaVerifier, setRecaptchaVerifier] = useState(undefined);
  const [confirmationResult, setConfirmationResult] = useState(undefined);
  const history = useHistory();

  const { sendOtp, verifyOtp } = useAuth();

  useEffect(() => {
    setRecaptchaVerifier(
      new firebase.auth.RecaptchaVerifier('recaptcha-container')
    );
  }, []);

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setOtpError('');
    setMessage('');

    const otpInput = otp.current.value.trim();

    if (otpInput.length !== 6 || !/^\d+$/.test(otpInput)) {
      setOtpError('OTP should be of 6 digits');
      return;
    }

    setSigningIn(true);

    try {
      // eslint-disable-next-line
      const result = await verifyOtp(confirmationResult, otpInput);
      // const user = result.user;
      // console.log(user);
      setMessage('Logged in successfully.');
      setSigningIn(false);
      history.push('/');
    } catch (err) {
      // console.error('something went wrong.', err);
      setSigningIn(false);
      setError('Incorrect OTP.');
    }
  };

  const handleSendOtp = async () => {
    setError('');
    setMessage('');
    setPhoneError('');

    let phoneNumber = phone.current.value.trim();

    if (phoneNumber.length !== 10 || !/^\d+$/.test(phoneNumber)) {
      setPhoneError('Phone number should be of 10 digits');
      return;
    }

    setSendingOtp(true);

    try {
      const result = await sendOtp('+91' + phoneNumber, recaptchaVerifier);
      setMessage('OTP sent successfully.');
      setConfirmationResult(result);
    } catch (err) {
      // console.error('something went wrong', err);
      setError("Couldn't send OTP.");
    } finally {
      setSendingOtp(false);
    }
  };

  return (
    <div className="columns is-centered">
      <div className="column is-half">
        <div className="box">
          <p className="title">Phone Auth</p>
          {error && <div className="notification is-danger p-3">{error}</div>}
          {message && (
            <div className="notification is-success p-3">{message}</div>
          )}
          <form noValidate autoComplete="off" onSubmit={handleSubmit}>
            <div className="field">
              <div className="field has-addons">
                <p className="control">
                  <span className="button is-static">+91</span>
                </p>
                <p className="control is-expanded">
                  <input
                    className={`input ${phoneError ? 'is-danger' : ''}`}
                    type="text"
                    ref={phone}
                    placeholder="Enter Phone Number"
                  />
                </p>
                <p className="control">
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    className={`button is-outlined ${
                      sendingOtp ? 'is-loading' : ''
                    }`}
                  >
                    Send OTP
                  </button>
                </p>
              </div>
              {phoneError && <p className="help is-danger">{phoneError}</p>}
            </div>
            <div className="field">
              <div
                className="is-flex is-justify-content-center"
                id="recaptcha-container"
              ></div>
            </div>
            <div className="field">
              <div className="control ">
                <input
                  className={`input ${otpError ? 'is-danger' : ''}`}
                  ref={otp}
                  type="text"
                  placeholder="Enter OTP"
                />
              </div>
              {otpError && <p className="help is-danger">{otpError}</p>}
            </div>
            <button
              type="submit"
              className={`button is-fullwidth mt-5 is-light ${
                signingIn ? 'is-loading' : ''
              }`}
            >
              Verify OTP
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PhoneAuth;
