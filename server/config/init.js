const mysql = require('mysql')
const config = require('./config.js')
// const { query } = require('./index')

const initSql = `
CREATE TABLE types(
    id VARCHAR(64) NOT NULL   COMMENT 'id' ,
    dept VARCHAR(32) NOT NULL   COMMENT '所属类型 所属类型，例如平台推广/媒体推广/问答' ,
    name VARCHAR(32) NOT NULL   COMMENT '名称' ,
    status VARCHAR(1)   DEFAULT 1 COMMENT '状态' ,
    created_by VARCHAR(32)    COMMENT '创建人' ,
    created_time DATETIME    COMMENT '创建时间' ,
    updated_by VARCHAR(32)    COMMENT '更新人' ,
    updated_time DATETIME    COMMENT '更新时间' ,
    PRIMARY KEY (id)
) COMMENT = '类型 保存类型名称';

ALTER TABLE types ADD INDEX 查询(id);
ALTER TABLE types COMMENT '类型';
CREATE TABLE types_field(
    id VARCHAR(64) NOT NULL   COMMENT 'id' ,
    type VARCHAR(64) NOT NULL   COMMENT '类型 存放types的id' ,
    type_name VARCHAR(32) NOT NULL   COMMENT '类型名称 types的name' ,
    name VARCHAR(32) NOT NULL   COMMENT '名称' ,
    dept VARCHAR(32)    COMMENT '类型 区分平台、媒体、问答' ,
    status VARCHAR(1)   DEFAULT 1 COMMENT '状态 启用状态为1，删除为0' ,
    created_by VARCHAR(32)    COMMENT '创建人' ,
    created_time DATETIME    COMMENT '创建时间' ,
    updated_by VARCHAR(32)    COMMENT '更新人' ,
    updated_time DATETIME    COMMENT '更新时间' ,
    PRIMARY KEY (id)
) COMMENT = '文章配置 保存各类型下的内容';

ALTER TABLE types_field ADD INDEX 查询(id,type);
ALTER TABLE types_field COMMENT '文章配置';
CREATE TABLE article_cases(
    id VARCHAR(64) NOT NULL   COMMENT 'id' ,
    dept VARCHAR(32)    COMMENT '主题 类似cm008,platform为你平台、medium为媒体、question为问答' ,
    type_json VARCHAR(3072)    COMMENT '类型集合 以json形式进行存储，格式为{id1-1:id2-1,id1-2:id2-2}，id1-*为types表id，id2-*为type_name表id' ,
    name VARCHAR(128)    COMMENT '名称 名称与平台有可能合一，先按名称来做，需要再分开' ,
    platform VARCHAR(128)    COMMENT '平台' ,
    url VARCHAR(1024)    COMMENT '链接 案例链接' ,
    agent_price DECIMAL(32,8)    COMMENT '代理价格' ,
    general_price DECIMAL(32,8)    COMMENT '普通用户价格' ,
    baidu INT    COMMENT '百度权重' ,
    start_num VARCHAR(32)    COMMENT '起始下单量' ,
    fens_num VARCHAR(32)    COMMENT '参考粉丝数' ,
    maintain_time INT    COMMENT '维护时间' ,
    yiwenjida VARCHAR(32)    COMMENT '一问几答' ,
    mark VARCHAR(512)    COMMENT '备注' ,
    status VARCHAR(1)   DEFAULT 1 COMMENT '状态 启用为1，删除为0' ,
    created_by VARCHAR(32)    COMMENT '创建人' ,
    created_time DATETIME    COMMENT '创建时间' ,
    updated_by VARCHAR(32)    COMMENT '更新人' ,
    updated_time DATETIME    COMMENT '更新时间' ,
    PRIMARY KEY (id)
) COMMENT = '案例 推广案例，类似淘宝的宝贝';

ALTER TABLE article_cases ADD INDEX 查询(id);
ALTER TABLE article_cases COMMENT '案例';
CREATE TABLE article_type(
    id VARCHAR(64) NOT NULL   COMMENT 'id' ,
    cases_id VARCHAR(64) NOT NULL   COMMENT '案例id' ,
    types_id VARCHAR(64) NOT NULL   COMMENT '类型表id' ,
    types_name VARCHAR(32) NOT NULL   COMMENT '类型名称' ,
    type_field_id VARCHAR(64) NOT NULL   COMMENT '类型字段id' ,
    type_field_name VARCHAR(32) NOT NULL   COMMENT '类型字段名称' ,
    created_by VARCHAR(32)    COMMENT '创建人' ,
    created_time DATETIME    COMMENT '创建时间' ,
    updated_by VARCHAR(32)    COMMENT '更新人' ,
    updated_time DATETIME    COMMENT '更新时间' ,
    PRIMARY KEY (id)
) COMMENT = '案例类型集合 存放文章cases案例表中的类型集合';

ALTER TABLE article_type ADD INDEX 查询(id,cases_id);
ALTER TABLE article_type COMMENT '案例类型集合';
CREATE TABLE no_types_field(
    id VARCHAR(64) NOT NULL   COMMENT 'id' ,
    name VARCHAR(64)    COMMENT '名称' ,
    dept VARCHAR(32) NOT NULL   COMMENT '主题标识 类似cm008,platform为你平台、medium为媒体、question为问答' ,
    sign VARCHAR(32) NOT NULL   COMMENT '标识 类似cm008，
num为字数，genre为体裁' ,
    num INT    COMMENT '字数' ,
    money DECIMAL(32,8)    COMMENT '金额 若sign为num，则填写金额' ,
    status VARCHAR(1)   DEFAULT 1 COMMENT '状态 启用为1，删除为0' ,
    created_by VARCHAR(32)    COMMENT '创建人' ,
    created_time DATETIME    COMMENT '创建时间' ,
    updated_by VARCHAR(32)    COMMENT '更新人' ,
    updated_time DATETIME    COMMENT '更新时间' ,
    PRIMARY KEY (id)
) COMMENT = '问答配置 客户选择无文章时，显示这些。存放问答字数对应的金额，体裁的内容';

ALTER TABLE no_types_field COMMENT '问答配置';
CREATE TABLE user(
    id VARCHAR(64) NOT NULL   COMMENT 'id' ,
    name VARCHAR(128) NOT NULL   COMMENT '名称' ,
    phone VARCHAR(32)    COMMENT '手机' ,
    password VARCHAR(128)    COMMENT '密码' ,
    role VARCHAR(32)    COMMENT '权限' ,
    dept VARCHAR(64)    COMMENT '部门' ,
    position VARCHAR(64)    COMMENT '职位' ,
    status VARCHAR(1)   DEFAULT 1 COMMENT '状态 启用为1，删除为0' ,
    created_by VARCHAR(32)    COMMENT '创建人' ,
    created_time DATETIME    COMMENT '创建时间' ,
    updated_by VARCHAR(32)    COMMENT '更新人' ,
    updated_time DATETIME    COMMENT '更新时间' ,
    PRIMARY KEY (id)
) COMMENT = '用户表 ';

ALTER TABLE user COMMENT '用户表';
CREATE TABLE customer(
    id VARCHAR(64) NOT NULL   COMMENT 'id' ,
    name VARCHAR(128)    COMMENT '名称' ,
    account VARCHAR(64)    COMMENT '账号' ,
    phone VARCHAR(32) NOT NULL   COMMENT '手机' ,
    password VARCHAR(128) NOT NULL   COMMENT '密码' ,
    recommender VARCHAR(64)    COMMENT '推荐人' ,
    qq VARCHAR(32)    COMMENT 'QQ' ,
    wechat VARCHAR(32)    COMMENT '微信' ,
    company VARCHAR(128)    COMMENT '公司名' ,
    channel VARCHAR(128)    COMMENT '途径' ,
    first_time VARCHAR(1)   DEFAULT 1 COMMENT '是否第一次登录' ,
    level VARCHAR(32)    COMMENT '等级' ,
    status VARCHAR(1)   DEFAULT 1 COMMENT '状态 启用为1，删除为0' ,
    created_by VARCHAR(32)    COMMENT '创建人' ,
    created_time DATETIME    COMMENT '创建时间' ,
    updated_by VARCHAR(32)    COMMENT '更新人' ,
    updated_time DATETIME    COMMENT '更新时间' ,
    PRIMARY KEY (id)
) COMMENT = '客户表 ';

ALTER TABLE customer COMMENT '客户表';
CREATE TABLE orders(
    id VARCHAR(64) NOT NULL   COMMENT 'id' ,
    customer_id VARCHAR(64) NOT NULL   COMMENT '客户id' ,
    customer_name VARCHAR(128) NOT NULL   COMMENT '客户名称' ,
    title VARCHAR(128) NOT NULL   COMMENT '文章标题' ,
    url VARCHAR(1024)    COMMENT '文档地址 用于存放上传的word转化后的html' ,
    finish_time INT    COMMENT '希望多久完成' ,
    media VARCHAR(128)    COMMENT '媒体名称' ,
    case_id_json VARCHAR(3072)    COMMENT '案例id集合 存放案例的集合' ,
    case_name VARCHAR(128)    COMMENT '案例名称' ,
    num INT    COMMENT '数量 文章数量总数' ,
    money DECIMAL(32,8)    COMMENT '费用' ,
    state VARCHAR(32)    COMMENT '状态' ,
    published_time DATETIME    COMMENT '发布时间' ,
    status VARCHAR(1)   DEFAULT 1 COMMENT '状态 启用为1，删除为0' ,
    created_by VARCHAR(32)    COMMENT '创建人' ,
    created_time DATETIME    COMMENT '创建时间' ,
    updated_by VARCHAR(32)    COMMENT '更新人' ,
    updated_time DATETIME    COMMENT '更新时间' ,
    mark VARCHAR(255)    COMMENT '备注' ,
    PRIMARY KEY (id)
) COMMENT = '订单表 ';

ALTER TABLE orders ADD UNIQUE 主键(id);
ALTER TABLE orders ADD INDEX 查询(customer_id,state);
ALTER TABLE orders COMMENT '订单表';
CREATE TABLE order_url(
    id VARCHAR(64) NOT NULL   COMMENT 'id' ,
    order_id VARCHAR(64)    COMMENT '订单id' ,
    url VARCHAR(1024)    COMMENT '地址' ,
    add_url VARCHAR(1024)    COMMENT '补档地址' ,
    created_by VARCHAR(32)    COMMENT '创建人' ,
    created_time DATETIME    COMMENT '创建时间' ,
    updated_by VARCHAR(32)    COMMENT '更新人' ,
    updated_time DATETIME    COMMENT '更新时间' ,
    PRIMARY KEY (id)
) COMMENT = '订单链接地址 ';

ALTER TABLE order_url COMMENT '订单链接地址';
CREATE TABLE order_case(
    id VARCHAR(64) NOT NULL   COMMENT 'id' ,
    order_id VARCHAR(64)    COMMENT '订单id' ,
    case_id VARCHAR(64)    COMMENT '案例id' ,
    case_name VARCHAR(32)    COMMENT '案例名称' ,
    status VARCHAR(1)   DEFAULT 1 COMMENT '状态 启用为1，删除为0' ,
    created_by VARCHAR(32)    COMMENT '创建人' ,
    created_time DATETIME    COMMENT '创建时间' ,
    updated_by VARCHAR(32)    COMMENT '更新人' ,
    updated_time DATETIME    COMMENT '更新时间' ,
    PRIMARY KEY (id)
) COMMENT = '订单案例集合 存放下单时，客户选择的案例';

ALTER TABLE order_case COMMENT '订单案例集合';

`

var connection = mysql.createConnection({
  host: config.database.HOST,
  user: config.database.USERNAME,
  password: config.database.PASSWORD,
  database: config.database.DATABASE,
  port: config.database.PORT,
  timezone: config.database.timezone,
  multipleStatements: true // 支持执行多条 sql 语句
})

connection.query(initSql, (err, result) => {
  if (err) { console.log(err) }
//   console.log(result)
})
