
import { toast } from 'react-toastify';

export const notify = (type, msg, position = 'bottom-center') => {
    const toastTypes = {
        success: toast.success,
        error: toast.error,
        info: toast.info,
        warning: toast.warn,
    };

    // 根據 type 找到對應的函式，找不到就用預設的 toast
    const showToast = toastTypes[type] || toast;
    const showLocation = {
        position: position,
    };
    showToast(msg, showLocation);
};