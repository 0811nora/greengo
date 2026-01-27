/* Props說明
onClick = 函式，點擊後要執行的函式

text = 字串，按鈕名稱

color = 字串，按鈕顏色，預設 primary
    1. primary   2. secondary   3. tertiary 
    可代入adm-base.scss裡的顏色樣式

size = 字串，按鈕尺寸，預設 md
    1. lg   2. md   3. sm 
    可代入adm-base.scss裡的尺寸樣式

className = 字串，客製化class

type = 字串，根據需要的類型修改，預設 button


範本：

<AdmButton
    onClick={onClose}
    text={'取消'}
    color={'tertiary'}
    size={'lg'}
    className={'me-5'}
/>

<AdmButton
    onClick={onConfirm}
    text={mode === 'add' ? '新增' : '修改'}
    color={'secondary'}
    size={'lg'}
/>

*/

export default function AdmButton({
  onClick,
  text,
  color = 'primary',
  size = 'md',
  className = '',
  type = 'button',
}) {
  // 根據 color 決定顏色樣式
  const colorClasses = {
    primary: 'adm__button__primary',
    secondary: 'adm__button__secondary',
    tertiary: 'adm__button__tertiary',
  };

  const selectedClass = colorClasses[color] || colorClasses.primary;

  return (
    <button
      type={type}
      className={`btn  ${selectedClass} ${size} ${className}`}
      onClick={onClick}
    >
      {text}
    </button>
  );
}
