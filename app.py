from flask import Flask, render_template, jsonify, request
from components.control.file_handler import file_handler
from components.control.property_analyzer import property_analyzer
app = Flask(__name__)
app.register_blueprint(file_handler)
app.register_blueprint(property_analyzer)
# Register the blueprint
@app.route('/', defaults={'path': ''}, methods=['GET'])
@app.route('/<path:path>')
def catch_all(path):
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)