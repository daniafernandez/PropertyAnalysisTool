from flask import Blueprint, request, jsonify
import pandas as pd
from io import BytesIO

upload_handler = Blueprint('upload_handler', __name__)

@upload_handler.route('/uploadFile', methods=['POST'])
def upload_file():
    file = request.files.get('files[]')
    if file:
        # Read the file content into a pandas DataFrame
        file_content = file.read()  # Read the file's content as bytes
        df = pd.read_csv(BytesIO(file_content))  # Use BytesIO to read the bytes into pandas
        if df.shape[0] > 1:
            return jsonify({"error": "The CSV provided has more than one row. Please provide a csv with only the subject property's information."}), 400
        elif df.shape[0] < 1:
            return jsonify({"error": "The CSV provided is empty. Please provide a csv with the subject property's information"}), 400
        else:
            subject_prop_dict = df.iloc[0].to_dict()
            return jsonify(subject_prop_dict), 200
    else:
        return jsonify({"error": "No file provided."}), 400