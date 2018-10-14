drop database if exists clistore_DB;
create database clistore_DB;
use clistore_DB;

create table products (
    item_id int not null auto_increment,
    product_name varchar(50) null,
    dep varchar(50) null,
    price  decimal(18,4) null,
    quant_in_stock int null,
    primary key (item_id)
);