from flask import Flask,render_template,request,redirect,url_for,session
import mysql.connector
from flask import jsonify
app = Flask(__name__,
            static_folder="static")
app.secret_key = "It's a secret"

linker = mysql.connector.connect(
    user = "root",
    password = "password",
    host = "localhost",
    database = "message_leaver"
)
cursor = linker.cursor()
cursor.execute("USE message_leaver")
linker.commit()

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/signup", methods=["POST"])
def signup():
    name = request.form["name"]
    account = request.form["account"]
    password = request.form["password"]
    cursor.execute("SELECT account, password FROM member WHERE account=%s",[account])
    existing_account = cursor.fetchone()
    if existing_account != None:
        error_message = "accountExists"
        return redirect(url_for("error",message = error_message))
    else:
        cursor.execute("INSERT INTO member(name,account,password) VALUES (%s,%s,%s)",(name,account,password))
        linker.commit()
        return redirect("/")
    
@app.route("/member")
def member():
    if "account" in session:
        cursor.execute("SELECT member.account,message.content FROM member \
                       INNER JOIN message ON member.id = message.member_id")
        element = cursor.fetchall()
        return render_template("member.html",name = session["account"],element=element)
    else:
        return redirect("/")

@app.route("/api/member",methods=["GET","PATCH"])
def search():
    if request.method == "GET":
        account = request.args.get("name")
        dict_cursor = linker.cursor(dictionary=True)
        dict_cursor.execute("SELECT id, account, name FROM member WHERE account=%s", [account])
        result = dict_cursor.fetchall()
        dict_cursor.close()
        if result:
            about_data = {"data": result[0]}   
        else:
            about_data = {"data": None} 
        return jsonify(about_data)
    else:
        account = session["account"]
        dict_cursor = linker.cursor(dictionary=True)
        update_data = request.json
        updateName = update_data.get("name")
        dict_cursor.execute("UPDATE member SET account=%s WHERE account=%s",(updateName,account))
        dict_cursor.execute("SELECT account FROM member WHERE account=%s",(updateName,))
        result = dict_cursor.fetchall()
        dict_cursor.close()
        if result:
            session["account"] = result[0]["account"]
            print(session["account"])
            return jsonify({"ok":True})
        else:
            return jsonify({"error":True})

@app.route("/createMessage",methods = ["POST"])
def message():
    content = request.form["content"]
    cursor.execute("INSERT INTO message(member_id,content) VALUES (%s,%s)",(session["id"],content))
    linker.commit()
    return redirect("/member")

@app.route("/error")
def error():
    message = request.args.get("message")
    if message == "accountExists":
        return render_template("error.html",error = "帳戶已被註冊")
    elif message == "accountError":
        return render_template("error.html",error = "帳號不存在")
    else:
        return render_template("error.html",error = "密碼錯誤")

@app.route("/signin", methods = ["POST"])
def signin():
    account = request.form["account"]
    password = request.form["password"]
    cursor.execute("SELECT id,name,account,password FROM member WHERE account=%s",(account,))
    existing_account = cursor.fetchone()
    if existing_account != None:
        correct_password = existing_account[3]
        if password == correct_password:
            session["id"] = existing_account[0]
            session["name"] = existing_account[1]
            session["account"] = existing_account[2]
            return redirect("/member")
        else:
            error_message = "passwordError"
            return redirect(url_for("error",message = error_message))
    else:
        error_message = "accountError"
        return redirect(url_for("error",message = error_message))

@app.route("/signout")
def signout():
    del session["id"]
    del session["name"]
    del session["account"]
    return redirect("/")

app.run(port = 3000,debug=True)
