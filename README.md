## 環境已安裝套件

1. axios 
2. sass
3. bootstrap
4. react-router-dom

------------

## 資料夾結構說明[src]

### src/assets

* src/assets : 放樣式、圖片、icon、素材的地方，可自行新增在內層新增，屬於自己頁面要放素材的資料夾。
* src/assets/icon：放icon的地方。
* src/assets/images：放圖片的地方。
* src/assets/style：放每個頁面的獨立scss檔案，可自行新增，使用時須在all.scss檔案import才會生效。

-----------

### src/component

* src/component : 放共用元件的地方，如 Button、Card，元件形式使用大寫開頭。

-----------

### src/layout

* src/layout：放全頁面共用的layout區塊，如header、footer

-----------

### src/pages

* src/pages：放全部的頁面 (前台頁面)
* src/pages/admin：放"後台系統"全部的頁面

-----------

### src/routes

* src/routes：設定路由的地方
* src/routes/index： 路由的入口

-----------

### src/api

* src/api: api function集中區，使用時直接具名匯入使用

