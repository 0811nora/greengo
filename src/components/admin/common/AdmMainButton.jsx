/*
props說明：
className = 字串，客製化class，例如：mx-auto
onClick = 點擊後執行的函式
buttonText = 字串，按鈕名稱
icon = 圖片完整標籤，例如: <i className="bi bi-plus-lg ms-1"></i>
type = 預設button，根據需求更改
disabled = 布林值，預設false，根據需求更改
children = 優先顯示 children，若無則顯示 buttonText，增加元件使用彈性
*/

export default function AdmMainButton({
  className = '',
  onClick,
  buttonText = '確認',
  icon,
  type = 'button',
  disabled = false,
  children,
}) {
  return (
    <button
      type={type}
      className={`btn adm-button ${className} ${disabled ? 'opacity-50' : ''}`}
      onClick={!disabled ? onClick : undefined}
      disabled={disabled}
    >
      {children || <span>{buttonText}</span>}

      {icon}

      <div className="hoverEffect" aria-hidden="true">
        <div></div>
      </div>
    </button>
  );
}
