*Khi mới clone về, cd vào rồi nhập `npm i` để tải package trước.

Vào file (ctrl + click vào cái link sau chữ href cho nhanh) <a href="model/database/database.js">model/database/database.js</a>
    - Trong constructor của class `Database`, sửa lại `host`, `user`, `password` cho phù hợp.
    - Lần lượt chạy 3 file sql theo thứ tự:
        - <a href="model/database/sql_files/tables.sql">model/database/tables.js</a>
        - <a href="model/database/sql_files/triggers.sql">model/database/triggers.js</a>
        - <a href="model/database/sql_files/procedures.sql">model/database/procedures.js</a>

Chạy bằng: `npm start`
Nếu cần debug, chạy: `npm test`