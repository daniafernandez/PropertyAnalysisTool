from flask import Blueprint, request, jsonify
from collections import OrderedDict
import pandas as pd
import os
from io import BytesIO

file_handler = Blueprint('file_handler', __name__)

@file_handler.route('/uploadFile', methods=['POST'])
def upload_file():
    file = request.files.get('files[]')
    try:
        file_content = file.read()  # Read the file's content as bytes
        df = pd.read_csv(BytesIO(file_content))
        if df.shape[0] != 1:
            raise ValueError(f"The CSV provided must have exactly one row. Found {df.shape[0]} rows.")
        df = df.fillna('N/A')
        subject_prop_dict = df.iloc[0].to_dict()
        return jsonify(subject_prop_dict), 200
    except FileNotFoundError:
        return jsonify({'error': 'No file provided.'}), 400
    except ValueError as ve:
        return jsonify({'error': str(ve)}), 400
    except Exception as e:
        return jsonify({'error': f'An unexpected error occurred: {str(e)}'}), 500


@file_handler.route('/demoFiles', methods=['GET'])
def get_demo_files():
    DEMO_FILES_DIR = './demo_files'
    try:
        files = os.listdir(DEMO_FILES_DIR)
        return jsonify(files), 200
    except FileNotFoundError:
        return jsonify({'error': 'Directory not found'}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@file_handler.route('/readDemoFile', methods=['GET'])
def read_demo_file():
    demo_directory = './demo_files'
    file_name = request.args.get('file')
    try:
        file_path = os.path.join(demo_directory, file_name)
        df = pd.read_csv(file_path)
        if df.shape[0] != 1:
            raise ValueError("There is an issue with the chosen property file. Please try another one.")
        df = df.fillna('N/A')
        subject_prop_dict = df.iloc[0].to_dict()
        return jsonify(subject_prop_dict), 200
    except ValueError as ve:
        return jsonify({'error': str(ve)}), 400
    except Exception as e:
        return jsonify({'error': f'An unexpected error occurred: {str(e)}'}), 500

