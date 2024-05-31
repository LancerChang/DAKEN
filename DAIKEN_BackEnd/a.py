import mysql.connector
import hashlib

# 连接到MySQL数据库
conn = mysql.connector.connect(
    host='localhost',
    user='root',
    password='Lancer778899',
    database='DAIKEN'
)

cursor = conn.cursor()

# 插入记录
admin_name = 'admin'
admin_pwd = hashlib.md5('pwd'.encode()).hexdigest()
login_time = 'NOW()'  # Use the current time for the login time
login_location = 'initial'

insert_query = """
INSERT INTO ADMIN (ADM_NAME, ADM_PWD, LOGIN_TIME, LOGIN_LOCATION)
VALUES (%s, %s, NOW(), %s)
"""

cursor.execute(insert_query, (admin_name, admin_pwd, login_location))

# 提交事务
conn.commit()

# 关闭连接
cursor.close()
conn.close()

print("管理员记录已成功插入。")
