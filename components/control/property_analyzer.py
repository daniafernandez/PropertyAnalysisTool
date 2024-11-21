from flask import Blueprint, request, jsonify
import pandas as pd
from io import BytesIO

property_analyzer = Blueprint('property_analyzer', __name__)

@property_analyzer.route('/analyzeProperty', methods=['GET'])
def analyze_property():
    property_data = request.args.to_dict()
    return jsonify({"message":"property analyzed successfully"}), 200