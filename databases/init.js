const knex = require("./knex");
const dotenv = require("dotenv");
dotenv.config();

knex.raw(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_DATABASE}\`;`)
  .then((result) => {
    if (result[0].warningStatus === 0) {
      console.log("Cơ sở dữ liệu đã tồn tại");
    } else {
      console.log("Đã tạo database");
      // Kết nối với cơ sở dữ liệu
      return knex.raw(`USE \`${process.env.DB_DATABASE}\`;`);
    }
  })
  .then(() => {
    return knex.schema.hasTable("pools").then((exists) => {
      if (!exists) {
        // Tạo bảng "polls"
        return knex.schema.createTable("pools", function (table) {
          table.increments("PollId").primary();
          table.string("voteTitle");
          table.string("Question");
          table.string("CreatedAt");
          table.string("CreateBy");
          // Thêm các trường khác cần thiết
        });
      } else {
        console.log('Bảng "pools" đã tồn tại');
      }
    });
  })
  .then(() => {
    // Tiếp tục kiểm tra và tạo các bảng khác
    return knex.schema.hasTable("options").then((exists) => {
      if (!exists) {
        // Tạo bảng "options"
        return knex.schema.createTable("options", function (table) {
          table.increments("option_id").primary();
          table.integer("PollId").unsigned();
          table.foreign("PollId").references("pools.PollId");
          table.string("voteOption");
          // Thêm các trường khác cần thiết
        });
      } else {
        console.log('Bảng "options" đã tồn tại');
      }
    });
  })
  .then(() => {
    // Tiếp tục kiểm tra và tạo các bảng khác
    return knex.schema.hasTable("users").then((exists) => {
      if (!exists) {
        // Tạo bảng "users"
        return knex.schema.createTable("users", function (table) {
          table.increments("id").primary();
          table.string("name");
          table.string("email");
          table.string("gender");
          table.string("username");
          table.integer("age");
          table.string("salt");
          table.string("password");
          table.string("role");
          table.string("CreatedAt");
          table.string("CreateBy");
          // Thêm các trường khác cần thiết
        });
      } else {
        console.log('Bảng "users" đã tồn tại');
      }
    });
  })
  .then(() => {
    // Tiếp tục kiểm tra và tạo các bảng khác
    return knex.schema.hasTable("UserOption").then((exists) => {
      if (!exists) {
        // Tạo bảng "user_options"
        return knex.schema.createTable("UserOption", function (table) {
          table.increments("UserOption_ID").primary();
          table.integer("UserID").unsigned();
          table.foreign("UserID").references("users.id");
          table.integer("option_id").unsigned();
          table.foreign("option_id").references("options.opion_id");
          table.integer("PollId").unsigned();
          table.foreign("PollId").references("pools.PollId");
          // Thêm các trường khác cần thiết
        });
      } else {
        console.log('Bảng "user_options" đã tồn tại');
      }
    });
  })
  .then(() => {
    console.log("database created successfully");
    knex.destroy();
  })
  .catch((error) => {
    console.log(error);
    knex.destroy();
  });
