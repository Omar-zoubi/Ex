DROP TABLE IF EXISTS coll; 
CREATE TABLE coll (
    id SERIAL NOT NULL PRIMARY KEY,
    name VARCHAR(250),
    house VARCHAR(250),
patronus VARCHAR(250),
isalive BOOLEAN DEFAULT true 
)