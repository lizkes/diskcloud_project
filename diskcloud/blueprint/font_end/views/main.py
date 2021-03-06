from flask import redirect,url_for,request,render_template
from diskcloud.libs.session import valid_session,create_session
from diskcloud.libs.cookie import get_username_cookie

def Main(username):
    if valid_session('username',username):
        return render_template('main.html',username = username)
    cookie_id = request.cookies.get('login_id')
    if cookie_id:
        cookie_username = get_username_cookie(cookie_id)
        if cookie_username == username:
            create_session('username',username)
            return render_template('main.html',username = username)
        else:
            response = redirect(url_for('FontEnd.Login'))
            response.delete_cookie('login_id')
            return response
    return redirect(url_for('FontEnd.Login'))
