from testApp.fake_data.fake import main
from flask import Flask, render_template

# create fake data
main()

app = Flask(__name__)

@app.route('/test')
def loadFakeHomePage():
    return render_template('homePageTest.html')

@app.route('/')
def loadHomePage():
    return render_template('homePage.html')


if __name__ == '__main__':
    app.run(debug=True)
