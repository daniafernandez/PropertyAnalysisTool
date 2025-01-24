from flask import Blueprint, request, jsonify
from collections import OrderedDict
import pandas as pd
import os
from io import BytesIO

file_handler = Blueprint('file_handler', __name__)

@file_handler.route('/uploadFile', methods=['POST'])
def upload_file():
    file = request.files.get('files[]')
    if file:
        # Read the file content into a pandas DataFrame
        file_content = file.read()  # Read the file's content as bytes
        df = pd.read_csv(BytesIO(file_content))  # Use BytesIO to read the bytes into pandas
        if df.shape[0] > 1:
            return jsonify({"error": "The CSV provided has more than one row. Please provide a csv with only one "
                                     "property."}), 400
        elif df.shape[0] < 1:
            return jsonify({"error": "The CSV provided is empty. Please provide a csv with one property."}), 400
        else:
            df = df.fillna('N/A')
            subject_prop_dict = df.iloc[0].to_dict()
            return jsonify(subject_prop_dict), 200
    else:
        return jsonify({"error": "No file provided."}), 400

@file_handler.route('/demoFiles', methods=['GET'])
def get_demo_files():
    DEMO_FILES_DIR = './demo_files'
    try:
        files = os.listdir(DEMO_FILES_DIR)
        return jsonify(files), 200
    except FileNotFoundError:
        return jsonify({'error': 'Directory not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@file_handler.route('/readDemoFile', methods=['GET'])
def read_demo_file():
    demo_directory = './demo_files'
    file_name = request.args.get('file')
    file_path = os.path.join(demo_directory, file_name)
    df = pd.read_csv(file_path)
    if df.shape[0] != 1:
        return jsonify({"error": "There is an issue with the chosen property file. Please try another one."}), 400
    else:
        df = df.fillna('N/A')
        subject_prop_dict = df.iloc[0].to_dict()
        return jsonify(subject_prop_dict), 200
