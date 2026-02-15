// 頁面 router
export const PageLinks = {
  productLink: { title: '綠果精選系列', url: '/product' },
  customLink: { title: '客製化點餐', url: '/custom' },
  aboutLink: { title: '關於綠果', url: '/about' },
  articleLink: { title: '綠果專欄', url: '/article' },
};

// Hero Section
export const HeroDecors = [
  {
    id: 'left',
    src: `${import.meta.env.BASE_URL}img/items/bowl-2.png`,
    alt: 'bowl-2',
    posX: 'start-0',
    posY: 'top-10',
  },
  {
    id: 'right',
    src: `${import.meta.env.BASE_URL}img/items/bowl-1.png`,
    alt: 'bowl-1',
    posX: 'start-100',
    posY: 'top-50',
  },
];

// Hero Section 果菜區
export const VeggieItems = [
  { name: 'tomato', angle: '-120deg', delay: '-2s', dur: '20s' },
  { name: 'broccoli', angle: '45deg', delay: '-15s', dur: '25s' },
  { name: 'cabbage', angle: '150deg', delay: '-5s', dur: '22s' },
  { name: 'carrot', angle: '90deg', delay: '-8s', dur: '20s' },
  { name: 'eggplant', angle: '-45deg', delay: '-10s', dur: '20s' },
  { name: 'scallion', angle: '-90deg', delay: '-10s', dur: '20s' },
  { name: 'spinach', angle: '-120deg', delay: '-4s', dur: '30s' },
  { name: 'bellPepper', angle: '30deg', delay: '-8s', dur: '25s' },
];

// Nutrition Section 痛點區
export const TroubleCards = [
  {
    id: 1,
    text: '「不是不想吃健康，而是怕一個不小心，就吃錯、算錯、白努力。」',
    align: 'ms-auto',
    tailSide: 'right', // 對話框右
  },
  {
    id: 2,
    text: '「一般的健康餐只有固定的營養標示，但我今天多加了一份肉、少吃一點飯，熱量到底變多少？對正在飲控的我來說，真的很難計算...」',
    align: 'me-auto',
    tailSide: 'left', // 對話框左
  },
  {
    id: 3,
    text: '「每次打開外送平台，看著一堆標榜『健康』的餐盒，卻發現成分寫得模模糊糊：少了幾克蛋白？多了一匙醬料？到底差多少熱量完全不知道。為什麼好好吃一餐這麼困難呢？」',
    align: 'ms-auto',
    tailSide: 'right',
  },
];

// Signature Section 配菜區
export const Ingredients = [
  {
    id: 'salmon',
    name: '鮭魚',
    nur: '蛋白質',
    protein: '26g',
    percentage: 0.65,
    color: '#ffa43b',
    pos: 'pos-btm-left',
    img: `${import.meta.env.BASE_URL}img/items/salmon.png`,
  },
  // 熱量：約 250 kcal/蛋白質：約 26 g/脂肪：約 16 g
  {
    id: 'tomato',
    name: '番茄',
    nur: '膳食纖維',
    protein: '0.8g',
    percentage: 0.06,
    color: '#6FA9BB',
    pos: 'pos-top-mid',
    img: `${import.meta.env.BASE_URL}img/items/tomato.png`,
  },
  // 熱量：約 11 kcal/碳水化合物：約 2.5 g/膳食纖維：約 0.8 g
  {
    id: 'pumpkin',
    name: '南瓜',
    nur: '膳食纖維',
    protein: '2g',
    percentage: 0.17,
    color: '#6FA9BB',
    pos: 'pos-top-mid-left',
    img: `${import.meta.env.BASE_URL}img/items/pumpkin.png`,
  },
  // 熱量：約 45 kcal/碳水化合物：約 11 g/膳食纖維：約 2 g
  {
    id: 'broccoli',
    name: '花椰菜',
    nur: '蛋白質',
    protein: '2.5g',
    percentage: 0.06,
    color: '#ffa43b',
    pos: 'pos-top-right',
    img: `${import.meta.env.BASE_URL}img/items/broccoli.png`,
  },
  // 熱量：約 28 kcal/碳水化合物：約 5 g/蛋白質：約 2.5 g/膳食纖維：約 2.2 g
  {
    id: 'cucumber',
    name: '小黃瓜',
    nur: '碳水化合物',
    protein: '2g',
    percentage: 0.02,
    color: '#C54F2D',
    pos: 'pos-btm-right',
    img: `${import.meta.env.BASE_URL}img/items/cucumber.png`,
  },
  // 熱量：約 9 kcal/碳水化合物：約 2 g
];

// step card
// 步驟區
export const StepCards = [
  {
    id: 1,
    step_title: '選擇基底',
    step_content: '白米、糙米、紫米、藜麥、生菜',
    img: `${import.meta.env.BASE_URL}img/items/step1.png`,
    icon: 'bi bi-1-circle-fill',
  },
  {
    id: 2,
    step_title: '挑選主食',
    step_content: '雞胸肉、牛肉、鮭魚、蝦仁，為你包山包海',
    img: `${import.meta.env.BASE_URL}img/items/step2.png`,
    icon: 'bi bi-2-circle-fill',
  },
  {
    id: 3,
    step_title: '搭配蔬果',
    step_content: '配角可以比主角搶戲，季節時蔬任選 5 種',
    img: `${import.meta.env.BASE_URL}img/items/step3.png`,
    icon: 'bi bi-3-circle-fill',
  },
  {
    id: 4,
    step_title: '淋上醬汁',
    step_content: '為你的餐盒來點靈魂',
    img: `${import.meta.env.BASE_URL}img/items/step4.png`,
    icon: 'bi bi-4-circle-fill',
  },
];
