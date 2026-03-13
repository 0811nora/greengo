import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  login,
  closeModal,
  selectIsModalOpen,
} from '../../store/slices/userSlice';
import { useForm } from 'react-hook-form';
import { notify } from '../Notify';

import { loginUser, registerUser } from '../../service/authService';

const LoginModal = () => {
  // show password (分成登入/註冊/註冊確認)
  const [showPassword, setShowPassword] = useState({
    login: false, // 登入
    register: false, // 註冊
    confirm: false, // 註冊確認
  });

  const passwordVisibility = (key) => {
    setShowPassword((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

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
    getValues,
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

  // 處理 firebase
  const [isLoading, setIsLoading] = useState(false);
  const [firebaseError, setFirebaseError] = useState('');
  // 切換 tab 或關 modal 時清空錯誤訊息
  const clearFirebaseError = () => setFirebaseError('');

  // 登入
  const onLoginSubmit = async (data) => {
    setIsLoading(true);
    clearFirebaseError();
    try {
      const result = await loginUser({
        email: data.email,
        password: data.password,
      });
      if (result.success) {
        dispatch(
          login({
            uid: result.data.user.uid,
            email: result.data.user.email,
            displayName: result.data.profile?.displayName ?? null,
            phone: result.data.profile?.phone ?? null,
            photoURL: result.data.profile?.photoURL ?? null,
          }),
        );
        resetAndClose();
      } else {
        setFirebaseError(result.error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 註冊
  const onRegisterSubmit = async (data) => {
    setIsLoading(true);
    clearFirebaseError();
    try {
      const result = await registerUser(data);
      if (result.success) {
        // 成功
        dispatch(
          login({
            uid: result.data.uid,
            email: result.data.email,
            displayName: data.displayName,
            phone: data.phone,
            photoURL: null,
          }),
        );
        resetAndClose();
      } else {
        // 如果失敗
        setFirebaseError(result.error);
      }
    } finally {
      setIsLoading(false);
    }
  };
  // 關 modal 或切換 tab 後清空
  const resetAndClose = () => {
    dispatch(closeModal());
    setActiveTab('login');
    resetLogin();
    resetRegister();
    // 重設密碼顯示狀態
    setShowPassword({ login: false, register: false, confirm: false });
  };

  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
    resetLogin();
    resetRegister();
    clearFirebaseError();
  };

  // 點背景關 modal
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      resetAndClose();
    }
  };
  if (!isModalOpen) return null;

  return (
    <>
      <div
        className='header__modal-overlay d-flex justify-content-center align-items-center'
        onClick={handleBackdropClick}
      >
        <div
          className='header__modal-container d-flex align-items-stretch gap-0'
          style={{ width: '100%' }}
          role='dialog'
          aria-modal='true'
        >
          <div className='header__modal-img d-none d-lg-flex'>
            <img
              loading='lazy'
              src={`${import.meta.env.BASE_URL}img/items/header-login-bg.webp`}
              alt='login-bg'
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
                  type='button'
                  className={`header__tab ${activeTab === 'login' ? 'active' : ''}`}
                  onClick={() => handleTabSwitch('login')}
                >
                  登入
                </button>
                <button
                  type='button'
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
                    <div className='mb-3 position-relative'>
                      <div className='d-flex justify-content-between align-items-center'>
                        <label
                          htmlFor='loginPassword'
                          className='form-label fw-semibold text-gray-400'
                        >
                          密碼
                        </label>
                        <button
                          type='button'
                          onClick={() => passwordVisibility('login')}
                          className='home__btn-link mb-2'
                        >
                          {showPassword.login ? (
                            <span className=''>隱藏密碼</span>
                          ) : (
                            <span className=''>顯示密碼</span>
                          )}
                        </button>
                      </div>
                      <input
                        id='loginPassword'
                        name='loginPassword'
                        type={showPassword.login ? 'text' : 'password'}
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
                          className='form-check-label text-gray-400 fs-sm'
                          htmlFor='rememberMe'
                        >
                          記住我
                        </label>
                      </div>
                      <button
                        type='button'
                        className='btn btn-link p-0 text-gray-400 fs-sm text-decoration-none'
                        onClick={() => notify('success', '還沒做這功能QQ')}
                      >
                        忘記密碼？
                      </button>
                    </div>

                    {firebaseError && (
                      <div className='text-white bg-warning rounded-1 py-2 text-center fs-sm mb-3'>
                        {firebaseError}
                      </div>
                    )}

                    <div className='d-flex flex-column justify-content-center align-items-center'>
                      <button
                        type='submit'
                        className='home__btn-primary w-100 rounded-pill py-2'
                        disabled={isLoading}
                      >
                        {isLoading ? '登入中...' : '登入'}
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
                    </div>
                  </form>
                )}

                {/* 註冊 */}
                {activeTab === 'register' && (
                  <form onSubmit={handleSubmitRegister(onRegisterSubmit)}>
                    {/* 名字 */}
                    <div className='mb-3'>
                      <label
                        htmlFor='registerDisplayName'
                        className='form-label fw-semibold text-gray-400'
                      >
                        顯示名稱
                      </label>
                      <input
                        id='registerDisplayName'
                        type='text'
                        className={`form-control rounded-3 ${registerErrors.displayName ? 'is-invalid' : ''}`}
                        placeholder='請輸入您的名稱'
                        {...registerRegister('displayName', {
                          required: '請輸入顯示名稱',
                          minLength: {
                            value: 2,
                            message: '名稱至少需要 2 個字元',
                          },
                        })}
                      />
                      {registerErrors.displayName && (
                        <div className='invalid-feedback'>
                          {registerErrors.displayName.message}
                        </div>
                      )}
                    </div>
                    {/* 手機 */}
                    <div className='mb-3'>
                      <label
                        htmlFor='registerPhone'
                        className='form-label fw-semibold text-gray-400'
                      >
                        連絡電話
                      </label>
                      <input
                        id='registerPhone'
                        type='tel'
                        className={`form-control rounded-3 ${registerErrors.phone ? 'is-invalid' : ''}`}
                        placeholder='請輸入手機號碼'
                        {...registerRegister('phone', {
                          required: '請輸入手機號碼',
                          pattern: {
                            value: /^09\d{8}$/,
                            message: '手機格式不正確（範例：0912345678）',
                          },
                        })}
                      />
                      {registerErrors.phone && (
                        <div className='invalid-feedback'>
                          {registerErrors.phone.message}
                        </div>
                      )}
                    </div>

                    <div className='mb-3'>
                      <label
                        htmlFor='registerEmail'
                        className='form-label fw-semibold text-gray-400'
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
                      <div className='d-flex justify-content-between align-items-center'>
                        <label
                          htmlFor='registerPassword'
                          className='form-label fw-semibold text-gray-400'
                        >
                          密碼
                        </label>
                        <button
                          type='button'
                          onClick={() => passwordVisibility('register')}
                          className='home__btn-link mb-2'
                        >
                          {showPassword.register ? (
                            <span className=''>隱藏密碼</span>
                          ) : (
                            <span className=''>顯示密碼</span>
                          )}
                        </button>
                      </div>
                      <input
                        id='registerPassword'
                        name='registerPassword'
                        type={showPassword.register ? 'text' : 'password'}
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
                      <div className='d-flex justify-content-between align-items-center'>
                        <label
                          htmlFor='registerConfirmPassword'
                          className='form-label fw-semibold text-gray-400'
                        >
                          確認密碼
                        </label>
                        <button
                          type='button'
                          onClick={() => passwordVisibility('confirm')}
                          className='home__btn-link mb-2'
                        >
                          {showPassword.confirm ? (
                            <span className=''>隱藏密碼</span>
                          ) : (
                            <span className=''>顯示密碼</span>
                          )}
                        </button>
                      </div>
                      <input
                        id='registerConfirmPassword'
                        name='registerConfirmPassword'
                        type={showPassword.confirm ? 'text' : 'password'}
                        className={`form-control rounded-3 ${
                          registerErrors.confirmPassword ? 'is-invalid' : ''
                        }`}
                        placeholder='請再次輸入密碼'
                        {...registerRegister('confirmPassword', {
                          required: '請再次輸入密碼',
                          validate: (value) =>
                            value === getValues('password') ||
                            '密碼與確認密碼不相同',
                        })}
                      />

                      {registerErrors.confirmPassword && (
                        <div className='invalid-feedback'>
                          {registerErrors.confirmPassword.message}
                        </div>
                      )}
                    </div>

                    {firebaseError && (
                      <div className='text-white bg-warning rounded-1 py-2 text-center fs-sm mb-3'>
                        {firebaseError}
                      </div>
                    )}

                    <div className='d-flex flex-column justify-content-center align-items-center'>
                      <button
                        type='submit'
                        className='home__btn-primary rounded-pill py-2'
                        disabled={isLoading}
                      >
                        {isLoading ? '註冊資料處理中...' : '註冊'}
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
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginModal;
