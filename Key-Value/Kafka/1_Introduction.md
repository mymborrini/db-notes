# Kafka Introduction

Kafka has to support 3 features:

 * You can publish/write data and subscribe/read data
 * You can store events/messages/records/data as long as you want. Use replication and other features. It's reliable as any other database
 * You can process those events as soon as they arrive or later in time. 

All this functionality is provided as a distributed, scalable, elastic, fault tolerant, secure

## You can publish/write data and subscribe/read data

When you read or write data to kafka you do so in the form of events. An event has

 * key
 * value
 * headers (metadata)
 * Timestamp
 * Partition and offsetId

For example 

 * key => John
 * value => Added Iphone 15 Max to the cart
 * headers => "systemId" = "1234"
 * Timestamp => 2023-06-12T09:20:11
 * Paritition/Offest => Added once message is written to a topic

Messages can have any format: string, json, avro, protobuf. 

For example, referred to the example before you can send to kafka something like this in json

{"customer": "John", "action": "Added Iphone 15 Max to the cart"}

Messages/ Records are stored as serialized bytes 

    Application (kafka producer) => Serializer => Topic (100010001) => Deserializer => Application (kafka consumer)


So the message is sent in the following way:

 * The Application (kafka producer) sent to Serializer *{"customer": "John", "action": "Added Iphone 15 Max to the cart"}*
 * The Serializer sent to the Topic *100010001*. So the serializer serialize the message BEFORE publish it to kafka
 * The Topic stores *100010001* and sent to Deserializer *100010001*
 * The Deserializer receives *100010001*, deserialize and sent to the Application (kafka consumer) *{"customer": "John", "action": "Added Iphone 15 Max to the cart"}*

Instead of Json you can use protobuf to reduce the size so following the example before:

    message Event {
        string customer = 1;
        string action =2;
    }

Now let's talk about best practice for choosing the right key. If the order of the message matters to me, then choosing the right key is important. 
For example you have an order and receive several status update ("prepared","shipped","delivered") about the same order in the following situation

Message: Order
 * key: 1234
 * value: "prepared"

Topic: Shipping
 * Partition 1
 * Partition 2
 * Partition 3

Now the cosumer MUST consume the Shipping in the correct order, it should not delivered before it is shipped. *Kafka preserved order within parition*. The way to achieve this is to use the same key for all those messages. For example the key 1234