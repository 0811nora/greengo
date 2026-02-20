import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  login,
  closeModal,
  selectIsModalOpen,
} from '../../store/slices/userSlice';
import { useForm } from 'react-hook-form';
import { notify } from '../Notify';

const LoginModal = () => {
  const {
    register: registerLogin,
    handleSubmit: handleSubmitLogin,
    formState: { errors: loginErrors },
    reset: resetLogin,
  } = useForm(
    { mode: 'onSubmit' },
    {
      defaultValues: {
        email: '',
        password: '',
        rememberMe: false,
      },
    },
  );
  const {
    register: registerRegister,
    handleSubmit: handleSubmitRegister,
    formState: { errors: registerErrors },
    watch: watchRegister,
    reset: resetRegister,
  } = useForm(
    { mode: 'onSubmit' },
    {
      defaultValues: {
        email: '',
        password: '',
        confirmPassword: '',
      },
    },
  );

  const dispatch = useDispatch();
  const isModalOpen = useSelector(selectIsModalOpen);
  // 登入或註冊
  const [activeTab, setActiveTab] = useState('login');
  // const [isRegisterMode, setIsRegisterMode] = useState(false);

  // 登入
  const onLoginSubmit = (data) => {
    console.log('登入：', data);
    dispatch(login());
    resetAndClose();
  };

  // 註冊
  const onRegisterSubmit = (data) => {
    console.log('註冊：', data);
    dispatch(login());
    resetAndClose();
  };

  // 關 modal 或切換 tab 後清空
  const resetAndClose = () => {
    dispatch(closeModal());
    setActiveTab('login');
    // setIsRegisterMode(false);
    resetLogin();
    resetRegister();
  };
  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
    // setIsRegisterMode(!isRegisterMode);
    resetLogin();
    resetRegister();
  };

  // 點背景關 modal
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      resetAndClose();
    }
  };
  if (!isModalOpen) return null;

  return (
    <div
      className='header__modal-overlay d-flex justify-content-center align-items-center'
      onClick={handleBackdropClick}
    >
      <div
        className='header__modal-container d-flex align-items-stretch gap-0'
        style={{ width: '100%' }}
      >
        <div className='header__modal-img d-none d-lg-flex'>
          <img
            src={`${import.meta.env.BASE_URL}img/items/header-login-bg.png`}
            alt=''
          />
        </div>
        <div
          className='header__modal-header d-flex flex-column'
          style={{ width: '100%' }}
        >
          <button
            type='button'
            className='header__modal-close ms-auto fs-md btn-close border-none mt-3 me-4'
            onClick={resetAndClose}
            aria-label='關閉'
          ></button>{' '}
          <div className='header__modal-content'>
            {/* 登入或註冊 */}
            <div className='header__modal-tabs d-flex justify-content-center'>
              <button
                className={`header__tab ${activeTab === 'login' ? 'active' : ''}`}
                onClick={() => handleTabSwitch('login')}
              >
                登入
              </button>
              <button
                className={`header__tab ${activeTab === 'register' ? 'active' : ''}`}
                onClick={() => handleTabSwitch('register')}
              >
                註冊
              </button>
            </div>
            <div className='header__modal-body'>
              {/* 登入 */}
              {activeTab === 'login' && (
                <form onSubmit={handleSubmitLogin(onLoginSubmit)}>
                  <div className='mb-3'>
                    <label
                      htmlFor='loginEmail'
                      className='form-label fw-semibold text-gray-400'
                    >
                      電子信箱
                    </label>
                    <input
                      id='loginEmail'
                      name='loginEmail'
                      type='email'
                      className={`form-control rounded-3 ${
                        loginErrors.email ? 'is-invalid' : ''
                      }`}
                      placeholder='請輸入電子信箱'
                      {...registerLogin('email', {
                        required: '請輸入電子信箱',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: '電子信箱格式不正確',
                        },
                      })}
                    />
                    {loginErrors.email && (
                      <div className='invalid-feedback'>
                        {loginErrors.email.message}
                      </div>
                    )}
                  </div>
                  <div className='mb-3'>
                    <label
                      htmlFor='loginPassword'
                      className='form-label fw-semibold text-gray-400'
                    >
                      密碼
                    </label>
                    <input
                      id='loginPassword'
                      name='loginPassword'
                      type='password'
                      className={`form-control rounded-3 ${
                        loginErrors.password ? 'is-invalid' : ''
                      }`}
                      placeholder='請輸入密碼'
                      {...registerLogin('password', {
                        required: '請輸入密碼',
                        minLength: {
                          value: 8,
                          message: '密碼至少需要 8 個字元',
                        },
                      })}
                    />
                    {loginErrors.password && (
                      <div className='invalid-feedback'>
                        {loginErrors.password.message}
                      </div>
                    )}
                  </div>
                  <div className='d-flex justify-content-between align-items-center mb-3'>
                    <div className='form-check mb-0'>
                      <input
                        type='checkbox'
                        id='rememberMe'
                        className='form-check-input'
                        {...registerLogin('rememberMe')}
                      />
                      <label
                        className='form-check-label text-muted small'
                        htmlFor='rememberMe'
                      >
                        記住我
                      </label>
                    </div>
                    <button
                      type='button'
                      className='btn btn-link p-0 text-muted small text-decoration-none'
                      onClick={() => (
                        notify('success', '還沒做這功能QQ'),
                        console.log('忘記密碼')
                      )}
                    >
                      忘記密碼？
                    </button>
                  </div>
                  <button
                    type='submit'
                    className='home__btn-primary w-100 rounded-pill py-2'
                  >
                    登入
                  </button>
                  <p className='text-center fs-sm text-gray-400 mt-3 mb-0 d-flex justify-content-center align-items-center'>
                    還沒有帳號？
                    <button
                      type='button'
                      className='home__btn-link fs-sm p-0 text-decoration-none ms-1'
                      onClick={() => handleTabSwitch('register')}
                    >
                      立即註冊
                    </button>
                  </p>
                </form>
              )}

              {/* 註冊 */}
              {activeTab === 'register' && (
                <form onSubmit={handleSubmitRegister(onRegisterSubmit)}>
                  <div className='mb-3'>
                    <label
                      htmlFor='registerEmail'
                      className='form-label fw-semibold'
                    >
                      電子信箱
                    </label>
                    <input
                      id='registerEmail'
                      name='registerEmail'
                      type='email'
                      className={`form-control rounded-3 ${
                        registerErrors.email ? 'is-invalid' : ''
                      }`}
                      placeholder='請輸入電子信箱'
                      {...registerRegister('email', {
                        required: '請輸入電子信箱',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: '電子信箱格式不正確',
                        },
                      })}
                    />
                    {registerErrors.email && (
                      <div className='invalid-feedback'>
                        {registerErrors.email.message}
                      </div>
                    )}
                  </div>
                  <div className='mb-3'>
                    <label
                      htmlFor='registerPassword'
                      className='form-label fw-semibold'
                    >
                      密碼
                    </label>
                    <input
                      id='registerPassword'
                      name='registerPassword'
                      type='password'
                      className={`form-control rounded-3 ${
                        registerErrors.password ? 'is-invalid' : ''
                      }`}
                      placeholder='請輸入密碼'
                      {...registerRegister('password', {
                        required: '請輸入密碼',
                        minLength: {
                          value: 8,
                          message: '密碼至少需要 8 個字元',
                        },
                      })}
                    />
                    {registerErrors.password && (
                      <div className='invalid-feedback'>
                        {registerErrors.password.message}
                      </div>
                    )}
                  </div>
                  <div className='mb-3'>
                    <label
                      htmlFor='registerConfirmPassword'
                      className='form-label fw-semibold'
                    >
                      確認密碼
                    </label>
                    <input
                      id='registerConfirmPassword'
                      name='registerConfirmPassword'
                      type='password'
                      className={`form-control rounded-3 ${
                        registerErrors.confirmPassword ? 'is-invalid' : ''
                      }`}
                      placeholder='請再次輸入密碼'
                      {...registerRegister('confirmPassword', {
                        required: '請再次輸入密碼',
                        validate: (value) =>
                          value === watchRegister('password') ||
                          '密碼與確認密碼不相同',
                      })}
                    />
                    {registerErrors.confirmPassword && (
                      <div className='invalid-feedback'>
                        {registerErrors.confirmPassword.message}
                      </div>
                    )}
                  </div>
                  <button
                    type='submit'
                    className='home__btn-primary rounded-pill py-2'
                  >
                    註冊
                  </button>
                  <p className='text-center fs-sm text-gray-400 mt-3 mb-0 d-flex justify-content-center align-items-center'>
                    已有帳號？
                    <button
                      type='button'
                      className='home__btn-link fs-sm p-0 text-decoration-none ms-1'
                      onClick={() => handleTabSwitch('login')}
                    >
                      立即登入
                    </button>
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
