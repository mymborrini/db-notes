import psycopg2


conn = psycopg2.connect(host = "localhost", user = "postgres", password="postgres")

cur = conn.cursor()

for i in range(1000000):
  cur.execute("insert into employees (id, name) values(%s,%s) ", (i, f"test{i}"))

#Commit 
conn.commit()

#Close
conn.close()