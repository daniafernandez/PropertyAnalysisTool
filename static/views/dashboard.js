import { range_slider } from '/static/components/inputs.js'

export var dashboard = {

    components: {
        "range_slider": range_slider,
    },

    props: {
        analysisParams: {type: Object},
        analysisDetails: {type: Object}
    },

    computed: {
        minPurchasePrice() {
            return +this.analysisDetails['purchase_price'] * 0.7
        },

        maxPurchasePrice() {
            return +this.analysisDetails['purchase_price'] * 1.1
        }
    },

    data() {
        return {
            rentalIncome: this.analysisDetails['rental_income'],
            purchasePrice: this.analysisDetails['purchase_price']

        };
      },

    methods: {
        updateParams(newValue, variable) {
            if (variable == 'rentalIncome') {
                this.analysisParams['rental_income'] = newValue
            }
            else if (variable == 'percentDown') {
                this.analysisParams['percent_down'] = newValue
            }
            else if (variable == 'interestRate') {
                this.analysisParams['interest_rate'] = newValue
            }
            else if (variable == 'vacancyRate') [
                this.analysisParams['vacancy_rate'] = newValue
            ]
            this.$emit("update-calc", {
                newAnalysisParams: this.analysisParams
            })
        }
    },

    template: `
        <div>
            <br />
            <br />
            <div class="container" style="background-color: #cfd4c5; padding: 30px; border-radius: 20px;">
              <div class="row">
                <div class="col" style="padding: 30px; text-align: center;">
                    <h1>{{ analysisDetails["address_title"] }}</h1>
                </div>
              </div>
              <div class="row">
                <div class="col">
                    <h5>Monthly Cashflow</h5>
                    <h3>{{ '$' + analysisDetails["monthly_cashflow"].toLocaleString() + '/mo' }}</h3>
                </div>
                <div class="col">
                    <h5>ROI</h5>
                    <h3>{{ analysisDetails["ROI"] }}</h3>
                </div>
                <div class="col">
                    <h5>CoC</h5>
                    <h3>{{ analysisDetails["CoC"] }}</h3>
                </div>
              </div>
              <br />
              <div class="row">
                <div class="col">
                    <h6>Rental Income: <strong>{{ '$' + this.analysisDetails['rental_income'].toLocaleString() + '/mo' }}</strong></h6>
                    <range_slider :modelValue="this.analysisDetails['rental_income']"
                        @update:modelValue="value => updateParams(value, 'rentalIncome')"
                        min='500'
                        max='8000'></range_slider>
                </div>
                <div class="col">
                    <div class="center-content">
                        <h3>Expenses</h3>
                        <br />
                        <h5>Mortgage Payment</h5>
                        <h4><strong>{{ '$' + this.analysisDetails['monthly_mortgage_payment'].toLocaleString() }}</strong></h4>
                        <br />
                        <h6>Vacancy Reserve</h6>
                        <h5><strong>{{ '$' + this.analysisDetails['vacancy_reserve'].toLocaleString() }}</strong></h5>
                    </div>
                    <br />
                    <h6>Vacancy Rate: <strong>{{ this.analysisDetails['vacancy_rate'] }}</strong>%</h6>
                    <range_slider :modelValue="this.analysisDetails['vacancy_rate']"
                        @update:modelValue="value => updateParams(value, 'vacancyRate')"
                        min='0'
                        max='15'></range_slider>
                    <br />
                </div>
                <div class="col">
                    <div class="center-content">
                        <img src="static/images/loan.png" style="width: 200px;"/>
                        <h3>Loan Details</h3>
                        <br />
                        <h6>Loan Amount</h6>
                        <h5><strong>{{ '$' + this.analysisDetails['loan_amount'].toLocaleString() }}</strong></h5>
                        <br />
                        <h6>Down Payment Amount</h6>
                        <h5><strong>{{ '$' + this.analysisDetails['down_payment_amount'].toLocaleString() }}</strong></h5>
                        <br />
                        <h6>Total Cash Needed</h6>
                        <h5><strong>{{ '$' + this.analysisDetails['cash_investment'].toLocaleString() }}</strong></h5>
                    </div>
                    <h6>Percent Down: <strong>{{ this.analysisDetails['percent_down'] }}</strong>%</h6>
                    <range_slider :modelValue="this.analysisDetails['percent_down']"
                        @update:modelValue="value => updateParams(value, 'percentDown')"
                        min='0'
                        max='100'></range_slider>
                    <br />
                    <h6>Interest Rate: <strong>{{ this.analysisDetails['interest_rate'] }}</strong>%</h6>
                    <range_slider :modelValue="this.analysisDetails['interest_rate']"
                        @update:modelValue="value => updateParams(value, 'interestRate')"
                        min='0'
                        max='10'></range_slider>
                </div>
              </div>
              <div class="row">
                <div class="col">
                    <h2>PARAMS</h2>
                    <p>{{ this.analysisParams }}</p>
                </div>
                <div class="col">
                    <h2>DETAILS</h2>
                    <p>{{ this.analysisDetails }}</p>
                </div>
              </div>
              <div class="row">
                <div class="col">
                    <p>hello</p>
                    <p>{{ this.purchasePrice }}</p>
                </div>
              </div>
            </div>
        </div>
    `

}