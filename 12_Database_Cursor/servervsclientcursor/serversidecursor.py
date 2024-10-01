# Let's make some queries for the rows, and measure the times of the query.
# The first fifty rows

import psycopg2
import time as t

conn = psycopg2.connect(host = "localhost", user = "postgres", password="postgres")

# Server side cursor if you give a name to your cursor
s = t.time()
cur = conn.cursor("mattia")

e = (t.time() - s ) * 1000
print(f"Cursor established in {e}ms")


# This won't return any rows, it just planning
s = t.time()
cur.execute("select * from employees")

e = (t.time() - s ) * 1000
print(f"Execute the query in {e}ms")

s = t.time()
rows = cur.fetchmany(50)

e = (t.time() - s ) * 1000
print(f"Fetching first 50 rows in {e}ms")

#Commit 
cur.close()

#Close
conn.close()
