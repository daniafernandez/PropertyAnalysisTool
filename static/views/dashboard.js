import { range_slider } from '/static/components/inputs.js'

export var dashboard = {

    components: {
        "range_slider": range_slider,
    },

    props: {
        analysisParams: {type: Object},
        analysisDetails: {type: Object},
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

        };
    },

    watch: {
      'analysisParams.rental_income'(newValue) {
        this.rentalIncomeChart.data.datasets[0].data = [newValue];
        this.rentalIncomeChart.update();
      },

      'analysisParams.capex_percent'(newValue) {
        this.expensesChart.data.datasets[1].data = [newValue/100 * this.analysisDetails['rental_income']];
        this.expensesChart.update();
      },

      'analysisParams.vacancy_rate'(newValue) {
        this.expensesChart.data.datasets[0].data = [newValue/100 * this.analysisDetails['rental_income']];
        this.expensesChart.update();
      }
    },

    mounted() {
        this.setupRentalIncomeChart();
        this.setupExpensesChart();
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
            else if (variable == 'vacancyRate') {
                this.analysisParams['vacancy_rate'] = newValue
            }
            else if (variable == 'capexPercent') {
                this.analysisParams['capex_percent'] = newValue
            }
            this.$emit("update-calc", {
                newAnalysisParams: this.analysisParams
            })
        },

        setupExpensesChart() {
            const expenseCategories = [
                { label: 'Vacancy Reserves', value: this.analysisDetails.vacancy_reserve, color: '#C43240' },
                { label: 'CapEx', value: this.analysisDetails.capex, color: '#73B7B8' },
                { label: 'Insurance', value: this.analysisDetails.insurance, color: '#445E93' },
                { label: 'Utilities', value: this.analysisDetails.utilities, color: '#fad02c' },
                { label: 'HOA', value: this.analysisDetails.HOA, color: '#F68C70' },
                { label: 'Lawn/Snow Care', value: this.analysisDetails.lawn_snow_care, color: '#2B6A4D' },
                { label: 'Mortgage', value: this.analysisDetails.monthly_mortgage_payment, color: '#b32478' }
            ];

            const ctx = this.$refs.expensesChart.getContext('2d');
            this.expensesChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: [''], // Assuming one address, can add more for multiple bars
                    datasets: expenseCategories.map(category => ({
                        label: category.label,
                        data: [category.value], // Single data point per category
                        backgroundColor: category.color, // Use random or predefined colors
                    }))
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                          display: false,
                          position: 'top',
                        },
                        tooltip: {
                            callbacks: {
                                label: context => {
                                    const value = context.raw;
                                    return `${context.dataset.label}: $${value.toLocaleString()}`;
                                }
                            }
                        }
                    },
                    scales: {
                        x: {
                            stacked: true,
                        },
                        y: {
                            stacked: true,
                            min: 0,
                            max: 3000, // Set fixed maximum value for Y-axis
                            grid: {
                               display: false, // Hides the grid lines on the Y axis
                            },
                            ticks: {
                                callback: value => `$${value.toLocaleString()}` // Format Y-axis labels as currency
                            }
                        }
                    }
                }
            });
        },

        setupRentalIncomeChart() {
          const ctx = this.$refs.rentalIncomeChart.getContext('2d');

          this.rentalIncomeChart = new Chart(ctx, {
            type: 'bar',
            data: {
              labels: [''], // X-axis labels
              datasets: [
                {
                  label: 'Rental Income', // Label for the legend
                  data: [this.analysisParams['rental_income']], // Chart data
                  backgroundColor: '#437b17', // Bar color
                  borderColor: '#437b17', // Bar border
                  borderWidth: 1,
                },
              ],
            },
            options: {
              responsive: true,
              plugins: {
                legend: {
                  display: false,
                  position: 'top',
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                  min: 0,
                  max: 3000, // Set fixed maximum value for Y-axis
                  grid: {
                    display: false, // Hides the grid lines on the Y axis
                  },
                  ticks: {
                    callback: function(value) {
                      return `$${value.toLocaleString()}`; // Add dollar sign to Y-axis labels
                    },
                  },
                },
                x: {
                  title: {
                    display: false,
                    text: 'Income Source', // Optional X-axis title
                  },
                },
              },
            },
          });
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
                    <h3>Income</h3>
                    <br />
                    <canvas ref="rentalIncomeChart" style="max-width: 350px; height: 400px;"></canvas>
                    <br />
                    <h6>Rental Income: <strong>{{ '$' + this.analysisDetails['rental_income'].toLocaleString() + '/mo' }}</strong></h6>
                    <range_slider :modelValue="this.analysisDetails['rental_income']"
                        @update:modelValue="value => updateParams(value, 'rentalIncome')"
                        min='500'
                        max='3000'></range_slider>
                </div>
                <div class="col">
                    <div class="center-content">
                        <h3>Expenses</h3>
                        <br />
                        <canvas ref="expensesChart" style="max-width: 350px; height: 400px;"></canvas>
                        <!-- <h5>Mortgage Payment</h5>
                        <h4><strong>{{ '$' + this.analysisDetails['monthly_mortgage_payment'].toLocaleString() }}</strong></h4>
                        <br />
                        <h6>CapEx</h6>
                        <h5><strong>{{ '$' + this.analysisDetails['capex'].toLocaleString() }}</strong></h5>
                        <br />
                        <h6>Vacancy Reserve</h6>
                        <h5><strong>{{ '$' + this.analysisDetails['vacancy_reserve'].toLocaleString() }}</strong></h5>-->
                    </div>
                    <br />
                    <h6>CapEx Percent: <strong>{{ this.analysisDetails['capex_percent'] }}</strong>%</h6>
                    <range_slider :modelValue="this.analysisDetails['capex_percent']"
                        @update:modelValue="value => updateParams(value, 'capexPercent')"
                        min='5'
                        max='10'></range_slider>
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
                        <h5>Mortgage Payment</h5>
                        <h4><strong>{{ '$' + this.analysisDetails['monthly_mortgage_payment'].toLocaleString() }}</strong></h4>
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
            </div>
        </div>
    `

}