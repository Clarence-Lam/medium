10.27增加textract 更新时需npm install textract

11.13增加代写上传表，更新时需运行：
CREATE TABLE order_upload(
    id VARCHAR(64) NOT NULL   COMMENT 'id' ,
    order_id VARCHAR(64)    COMMENT '订单id' ,
    order_name VARCHAR(128)    COMMENT '订单名称' ,
    name VARCHAR(128)    COMMENT '完成名称' ,
    add_name VARCHAR(128)    COMMENT '补单名称' ,
    file_url VARCHAR(1024)    COMMENT '文件地址' ,
    add_file_url VARCHAR(1024)    COMMENT '补单文件地址' ,
    is_add VARCHAR(1)   DEFAULT 0 COMMENT '是否申请补档' ,
    added VARCHAR(1)   DEFAULT 0 COMMENT '是否补过档' ,
    reason VARCHAR(3072)    COMMENT '补档理由' ,
    status VARCHAR(1)   DEFAULT 1 COMMENT '状态 启用为1，删除为0' ,
    created_by VARCHAR(32)    COMMENT '创建人' ,
    created_time DATETIME    COMMENT '创建时间' ,
    updated_by VARCHAR(32)    COMMENT '更新人' ,
    updated_time DATETIME    COMMENT '更新时间' ,
    PRIMARY KEY (id)
) COMMENT = '代写上传表 ';


2020.1.13 
npm install vue-seamless-scroll --save
npm install emoji  同时public引入emoji.css
npm i emoji-vue --save

（
emoji-vue包中jquery.emojiarea.js780行
  EmojiMenu.prototype.reposition = function () {
    if (!this.tether) {
      this.tether = new Tether({
        element: '[data-id="' + this.id + '"][data-type="menu"]',
        target: '[data-id="' + this.id + '"][data-type="picker"]',
        attachment: 'bottom left',
        targetAttachment: 'top left',
        offset: '200px 230px',
      })
    }
  }

）

增加数据库
CREATE TABLE ad(
    id VARCHAR(64) NOT NULL   COMMENT 'id' ,
    user_name VARCHAR(128)    COMMENT '填写人姓名' ,
    user_id VARCHAR(64)    COMMENT '填写人id' ,
    content MEDIUMTEXT    COMMENT '广告内容' ,
    state VARCHAR(32)   DEFAULT 'unaudited' COMMENT '广告状态 未审核：unaudited，已审核：audited，不通过：fail，已下线：offline' ,
    start_time DATETIME    COMMENT '广告开始时间' ,
    end_time DATETIME    COMMENT '广告下线时间' ,
    status VARCHAR(1)   DEFAULT 1 COMMENT '状态 启用为1，删除为0' ,
    created_by VARCHAR(32)    COMMENT '创建人' ,
    created_time DATETIME    COMMENT '创建时间' ,
    updated_by VARCHAR(32)    COMMENT '更新人' ,
    updated_time DATETIME    COMMENT '更新时间' ,
    PRIMARY KEY (id)
) COMMENT = '广告表 ';;

ALTER TABLE ad ADD INDEX id(id);;
ALTER TABLE ad ADD INDEX state(state);;
ALTER TABLE ad ADD INDEX create_time(created_time);;
ALTER TABLE ad ADD INDEX end_time(end_time);;
ALTER TABLE ad COMMENT '广告表';;