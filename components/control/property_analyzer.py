from flask import Blueprint, request, jsonify
import pandas as pd
from io import BytesIO

property_analyzer = Blueprint('property_analyzer', __name__)

@property_analyzer.route('/analyzeProperty', methods=['GET'])
def analyze_property():
    analysis_params = request.args.to_dict()

    # inputs

    # income
    rental_income = int(analysis_params['rental_income'])

    # closing and mortgage
    list_price = int(analysis_params['List Price'])
    purchase_price = int(round(float(analysis_params['purchase_price']), 0))
    percent_down = float(analysis_params['percent_down'])    # starting default
    percent_down_decimal = percent_down / 100
    closing_costs = 12000   # starting default
    rehab_budget = int(analysis_params['rehab_budget'])
    interest_rate = analysis_params['interest_rate']    # starting default
    interest_rate_dec = int(interest_rate)/100
    term_yrs = 30   # starting default
    loan_amount = purchase_price * (1 - percent_down_decimal)

    # expenses
    tax_annual = int(analysis_params['Property Tax'])
    insurance = 130
    utilities = 150
    HOA = 0
    if analysis_params['HOA Fee Amount'] != 'N/A':
        HOA = int(analysis_params['HOA Fee Amount'])
    lawn_snow_care = 20
    vacancy_rate = float(analysis_params['vacancy_rate'])  # starting default
    vacancy_rate_dec = vacancy_rate/100
    capex_percent = float(analysis_params['capex_percent'])
    capex = capex_percent/100 * rental_income

    monthly_rate = interest_rate_dec/12
    total_payments = term_yrs * 12
    monthly_mortgage_payment = loan_amount * (monthly_rate * (1 + monthly_rate)**total_payments) / ((1 + monthly_rate)**total_payments - 1)

    # calculations
    address_title = analysis_params["Address"] + ', ' + analysis_params['City'] + ', ' + analysis_params['State'] + ', ' + analysis_params['Zip Code']
    vacancy_reserve = vacancy_rate_dec * rental_income
    tax_monthly = tax_annual/12
    down_payment_amount = percent_down_decimal * purchase_price

    total_monthly_expenses = tax_monthly + insurance + utilities + HOA + lawn_snow_care + vacancy_reserve + capex + monthly_mortgage_payment
    monthly_cashflow = float(rental_income) - total_monthly_expenses

    cash_investment = down_payment_amount + closing_costs + rehab_budget
    total_investment = purchase_price + closing_costs + rehab_budget
    annual_cashflow = monthly_cashflow * 12
    ROI = str(round(annual_cashflow * 100/total_investment, 2)) + '%'
    CoC = str(round(annual_cashflow * 100 / (cash_investment), 2)) + '%'

    analysis_details = {
        "address_title": address_title,
        "list_price": list_price,
        "purchase_price": purchase_price,
        "percent_down": percent_down,
        "closing_costs": closing_costs,
        "interest_rate": interest_rate,
        "tax_annual": tax_annual,
        "tax_monthly": tax_monthly,
        "insurance": insurance,
        "utilities": utilities,
        "HOA": HOA,
        "lawn_snow_care": lawn_snow_care,
        "vacancy_rate": vacancy_rate,
        "vacancy_reserve": vacancy_reserve,
        "capex_percent": capex_percent,
        "capex": round(capex, 2),
        "rehab_budget": rehab_budget,

        "rental_income": rental_income,
        "monthly_mortgage_payment": round(monthly_mortgage_payment, 2),
        "loan_amount": round(loan_amount, 2),
        "down_payment_amount": round(down_payment_amount, 2),
        "total_monthly_expenses": total_monthly_expenses,
        "monthly_cashflow": round(monthly_cashflow, 2),
        "total_investment": total_investment,
        "cash_investment": cash_investment,
        "annual_cashflow": annual_cashflow,
        "ROI": ROI,
        "CoC": CoC
    }

    return jsonify(analysis_details), 200
