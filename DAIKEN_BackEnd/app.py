from flask import Flask, request, jsonify
from flask_mysqldb import MySQL
from flask_cors import CORS
import hashlib
from datetime import datetime

app = Flask(__name__)
CORS(app)  # 允许跨域请求

# MySQL configurations
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = 'Lancer778899'
app.config['MYSQL_DB'] = 'DAIKEN'

mysql = MySQL(app)


@app.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        print('Received data:', data)  # 调试输出

        phone_number = data['phone_number']
        password = hashlib.md5(data['password'].encode()).hexdigest()  # 密码使用MD5加密

        cur = mysql.connection.cursor()
        cur.execute("SELECT * FROM USER WHERE phone_number = %s", (phone_number,))
        user = cur.fetchone()

        if user:
            user_id = user[0]
            stored_password = user[2]
            login_count = user[3]  # 登录失败次数
            user_status = user[8]  # 用户状态

            print('Fetched user:', user)  # 调试输出

            if user_status == 'locked':
                print('User account is locked')
                return jsonify(
                    {'success': False, 'locked': True, 'failed_count': login_count, 'error': '账户已锁定，请联系管理员'})

            if stored_password == password:
                print('Password is correct, resetting login_count and updating last_login_time')
                cur.execute("UPDATE USER SET login_count = 0, last_login_time = %s WHERE user_id = %s",
                            (datetime.now(), user_id))
                mysql.connection.commit()
                return jsonify({'success': True, 'user_id': user_id})
            else:
                print('Password is incorrect, incrementing login_count')
                login_count += 1
                if login_count >= 5:
                    print('Login count exceeds limit, locking account')
                    cur.execute("UPDATE USER SET login_count = %s, user_status = 'locked' WHERE user_id = %s",
                                (login_count, user_id))
                else:
                    cur.execute("UPDATE USER SET login_count = %s WHERE user_id = %s", (login_count, user_id))
                mysql.connection.commit()
                print('Updated login_count to:', login_count)
                return jsonify({'success': False, 'failed_count': login_count, 'locked': login_count >= 5,
                                'error': '手机号或密码错误'})
        else:
            print('User not found')
            return jsonify({'success': False, 'failed_count': 0, 'error': '用户不存在'})
    except Exception as e:
        print('Error:', e)  # 打印错误信息
        return jsonify({'success': False, 'error': str(e)}), 500


@app.route('/adm_login', methods=['POST'])
def adm_login():
    try:
        data = request.get_json()
        print('Received admin login data:', data)  # 调试输出

        adm_name = data['adm_name']
        password = hashlib.md5(data['password'].encode()).hexdigest()  # 密码使用MD5加密

        cur = mysql.connection.cursor()
        cur.execute("SELECT * FROM ADMIN WHERE ADM_NAME = %s", (adm_name,))
        admin = cur.fetchone()

        if admin:
            adm_id = admin[0]
            stored_password = admin[2]

            print('Fetched admin:', admin)  # 调试输出

            if stored_password == password:
                print('Password is correct, updating last_login_time')
                cur.execute("UPDATE ADMIN SET LOGIN_TIME = %s WHERE ADM_ID = %s",
                            (datetime.now(), adm_id))
                mysql.connection.commit()
                return jsonify({'success': True, 'adm_id': adm_id})
            else:
                print('Password is incorrect')
                return jsonify({'success': False, 'error': '用户名或密码错误'})
        else:
            print('Admin not found')
            return jsonify({'success': False, 'error': '管理员不存在'})
    except Exception as e:
        print('Error:', e)  # 打印错误信息
        return jsonify({'success': False, 'error': str(e)}), 500


@app.route('/users', methods=['GET'])
def get_users():
    cur = mysql.connection.cursor()
    cur.execute("SELECT * FROM USER")
    users = cur.fetchall()
    user_list = []
    for user in users:
        user_dict = {
            'user_id': user[0],
            'phone_number': user[1],
            'password': user[2],
            'login_count': user[3],
            'last_login_time': user[4],
            'user_type': user[5],
            'user_region': user[6],
            'supervisor_id': user[7],
            'user_status': user[8],
            'company_name': user[9]
        }
        user_list.append(user_dict)
    return jsonify(user_list)


@app.route('/api/user', methods=['POST'])
def add_user():
    data = request.get_json()
    phone_number = data['phone_number']
    password = hashlib.md5(data['password'].encode()).hexdigest()
    company_name = data['company_name']
    user_type = data['user_type']
    user_region = data['user_region']
    supervisor_id = data['supervisor_id']
    user_status = data['user_status']
    user_location = data['user_location']

    # 检查并转换 supervisor_id
    if supervisor_id == '-':
        supervisor_id = None

    cur = mysql.connection.cursor()
    cur.execute(
        "INSERT INTO USER (phone_number, password, company_name, user_type, user_region, supervisor_id, user_status, user_location) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)",
        (phone_number, password, company_name, user_type, user_region, supervisor_id, user_status, user_location))
    mysql.connection.commit()
    return jsonify({'success': True}), 201


@app.route('/user/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    data = request.get_json()
    phone_number = data.get('phone_number')
    password = hashlib.md5(data['password'].encode()).hexdigest() if 'password' in data else None
    company_name = data.get('company_name')
    user_type = data.get('user_type')
    user_region = data.get('user_region')
    supervisor_id = data.get('supervisor_id')
    user_status = data.get('user_status')
    user_location = data.get('user_location')

    cur = mysql.connection.cursor()
    if phone_number:
        cur.execute("UPDATE USER SET phone_number = %s WHERE user_id = %s", (phone_number, user_id))
    if password:
        cur.execute("UPDATE USER SET password = %s WHERE user_id = %s", (password, user_id))
    if company_name:
        cur.execute("UPDATE USER SET company_name = %s WHERE user_id = %s", (company_name, user_id))
    if user_type:
        cur.execute("UPDATE USER SET user_type = %s WHERE user_id = %s", (user_type, user_id))
    if user_region:
        cur.execute("UPDATE USER SET user_region = %s WHERE user_id = %s", (user_region, user_id))
    if supervisor_id:
        cur.execute("UPDATE USER SET supervisor_id = %s WHERE user_id = %s", (supervisor_id, user_id))
    if user_status:
        cur.execute("UPDATE USER SET user_status = %s WHERE user_id = %s", (user_status, user_id))
    if user_location:
        cur.execute("UPDATE USER SET user_location = %s WHERE user_id = %s", (user_location, user_id))
    mysql.connection.commit()
    return jsonify({'success': True})


@app.route('/user/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    cur = mysql.connection.cursor()
    cur.execute("DELETE FROM USER WHERE user_id = %s", (user_id,))
    mysql.connection.commit()
    return jsonify({'success': True})


@app.route('/supervisors', methods=['POST'])
def get_supervisors():
    try:
        data = request.get_json()
        user_type = data.get('user_type')

        if user_type == '一级经销商':
            return jsonify([{'user_id': '-', 'company_name': '-'}])

        query_map = {
            '二级经销商': '一级经销商',
            '三级经销商': '二级经销商'
        }

        cur = mysql.connection.cursor()
        cur.execute("SELECT user_id, company_name FROM USER WHERE user_type = %s", (query_map.get(user_type),))
        supervisors = cur.fetchall()
        supervisor_list = []
        for supervisor in supervisors:
            supervisor_dict = {
                'user_id': supervisor[0],
                'company_name': supervisor[1]
            }
            supervisor_list.append(supervisor_dict)
        return jsonify(supervisor_list)
    except Exception as e:
        print('Error:', e)  # 打印错误信息
        return jsonify({'success': False, 'error': str(e)}), 500


@app.route('/ADM_login', methods=['POST'])
def admin_login():
    try:
        data = request.get_json()
        username = data['username']
        password = hashlib.md5(data['password'].encode()).hexdigest()

        cur = mysql.connection.cursor()
        cur.execute("SELECT * FROM ADMIN WHERE ADM_NAME = %s AND ADM_PWD = %s", (username, password))
        admin = cur.fetchone()

        if admin:
            return jsonify({'IsLogin': True, 'admin_id': admin[0]})
        else:
            return jsonify({'IsLogin': False, 'message': '用户名或密码错误'})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5005, debug=True)
