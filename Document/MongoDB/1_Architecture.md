# Mongo DB Architecture

It becomes really popular because of its schemaless way of storing document.

## NoSql vs SQL

Every database has two pieces

 * Frontend (API) aka SQL language, or redis or mongo
 * Storage Engine, storage indexes data files, transactions, WAL

In the frontend API a very important aspect is the dataformat, in which format I send you data, in which format I send you data to store, in which format I fetch them. Table and rows is the dataformat of sql, which is commonly (MYSQL, PSQL) a row stored database. During the year new dataformat come into play like documnet (MONGODB). Since Row storage database it's really constrained document database is more flexible.  

The storage engine is the most important part, for the storage engine is not really important what you store and in whiche format, the only thing it cares is is the page. In the page you have bytes, this is all what it cares about. In case of sql is the frontend who say "In this buch of bytes we have a row".

In the storage engine there is a property called the page size. In mongo db the frontend api receives a json to store, they transoform the json into a bucnh of bytes and then flush them onto a page. This is  the base for every database, the frontend write/extract the information from a bunch of bytes. It's all about organize the bytes in a certain way so "when i read that page, I want to read the information I need in the fastest and most efficient way possible". How we store them. It's just a buch of file? each file represents a table or a collection? We'll see about that in a few.


Indexes is part of the storage engine and it will fast track what I was looking for, it helps you pinpoint which page you are about to read. The storage engine can decide to compress something because the document is too large and the frontend does not even know about that compression. 



## MongoDB first version MMAPV1

## MongoDB Wired Tiger

## Clustered Collections