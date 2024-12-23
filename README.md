# WebDevFinalProject

1. tải từ google drive hoặc clone repo về folder tùy thích: 
# link github: https://github.com/phuczs/WebDevFinalProject
2. tải các modules cần thiết: 
# bscryptjs, body-parser, bulma, date-fns, dfa, dotenv, express-handlebars, express-handlebars-sections, express-session, express, fontkit, jsonwebtoken, knex, moment, multer, mysql2, nodemailer, numeral, pdfkit, streamsearch.
3. chạy server bằng xampp (mysql), mysql (tùy chọn)
# nhóm em chạy xampp không báo lỗi, nếu có chỉ cần stop  và chạy lại mysql, nhưng nếu chạy database (vd: trong navicat) mà báo không thể connect được local, thì có thể tải thẳng mysql về để sử dụng link mysql: https://dev.mysql.com/downloads/installer/ , chọn cái 300mb
# cài đặt dựa trên hướng dẫn trong installer, chọn server hay các lựa chọn tùy thích
# cài đặt xong chạy lệnh services.msc trong thanh search của windows, kéo xuống phần chữ M để xem MySQL có đang running không, nếu không thì run it.
4. chạy navicat để khởi động database (hoặc các phần mềm khác tùy chọn)
# tại vì nhóm em làm navivat, nên có hướng dẫn như sau:
# mở navicat, sẽ có 1 connection mặc định là local, nếu như không thì người dùng có thể tạo bằng cách bấm vào nút connection ở trên cùng bên trái
# đặt tên connection là local, có thể sử dụng mật khẩu hoặc không   
# bạn sẽ có 1 connection tên là local, double-click local để chạy connection
# right-click local, sau đó bấm vào new database để tạo database mới, đặt tên db là bao-dien-tu, character set và collation là utf8 (nếu không có utf8 thì xài utf8mb4)
# double-click bao-dien-tu, sau đó right-click, chọn execute sql file..., chọn file bao-dien-tu.sql và chạy thử xem có báo lỗi không, nếu không thì tiếp tục bước ở dưới
# nếu như bạn phải sử dụng utf8mb4, và chạy báo lỗi, close và chạy query sau: 
# ALTER DATABASE databasename CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci; (databasename = bao-dien-tu)
# ALTER TABLE tablename CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci; (tablename = article_content, article_subcategories, article_tags, articles, categories, comments, draft, tags, users) tách ra từng alter table riêng
# nếu chạy query thành công sẽ thông báo thành công
# execute lại thử file sql
# database mặc định sẽ không yêu cầu mật khẩu, nhưng nếu có thì có thể vào trong mục utils/db.js để thêm vào mật khẩu database của bạn
5. chạy lệnh npm run để chạy web
# nếu có báo lỗi, thì kiểm tra xem có thiếu modules hay không, nếu thiếu thì tải dựa trên list ở trên hoặc coi xem báo thiếu gì tải đó, và kiểm tra dựa trên các hướng dẫn trên
6. click vào đường link ở dưới


