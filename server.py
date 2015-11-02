from flask import Flask
from flask import request
from flask.ext.cors import CORS
import requests
import json
app = Flask(__name__)
cors = CORS(app)


@app.route('/emailsubscribe', methods=['POST'])
def hello_world():
    try:
        email = request.form['email']
    except:
        print('Stahp')
    try:
        req = requests.post(
            url="https://us12.api.mailchimp.com/3.0/lists/2aa8d22e6b/members/",
            data=json.dumps({
                "email_address": email,
                "status": "subscribed"
            }),
            headers={
                "Content-Type": "application/json",
                "Authorization":
                "apikey d12bb3bb8637a277c121fee289e2db0a-us12"
            })
        req.raise_for_status()
        print('Successfully subscribing', email)
    except requests.exceptions.HTTPError:
        print('Error when subscribing', email)
    return 'OK'

if __name__ == '__main__':
    app.run()
