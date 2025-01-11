import { dashboard } from './dashboard.js';

export var home = {

    components: {
        'dashboard': dashboard,
    },

    watch: {
        analysisParams(dict) {
            if (Object.keys(dict).length > 2) {
                this.disabled = null;
            }
            else {
                this.disabled = true;
            }
        },
    },

    data() {
        return {
            analysisParams: {
                rental_income: 2000,
                percent_down: 25,
                rehab_budget: 10000,
                interest_rate: 6,
                vacancy_rate: 5,
                capex_percent: 7,
            },
            subjectPropertyData: {},
            analysisDetails: {},
            disabled: true,
        };
    },

    methods: {

        handleFileUpload(event) {
            axios({
                method: "post",
                url: "/uploadFile",
                data: event.target.files,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                responseType: "json",
            }).then(response => {
                this.subjectPropertyData = response.data;
                this.analysisParams['purchase_price'] = this.subjectPropertyData['List Price'];
                this.analysisParams = {
                    ...this.analysisParams,
                    ...response.data
                };
            }).catch(error => {
                console.log(error);
            })

        },

        analyzeProperty() {

            let params = {'analysisVariables': this.analysisVariables, 'subjectPropertyData': this.subjectPropertyData};
            console.log(params)

            axios({
                method: "get",
                url: "/analyzeProperty",
                params: this.analysisParams,
                responseType: "json",
            }).then(response => {
                this.analysisDetails = response.data;
            }).catch(error => {
                console.log(error);
            })

        },

        updateCalc(data) {
            this.analysisParams = data.newAnalysisParams;
            this.analyzeProperty();

        }

    },
    template: `
        <div>
            <br />
            <br />
            <div v-if="Object.keys(analysisDetails).length <= 0" class="container" style="background-color: #cfd4c5; padding: 30px; border-radius: 20px;">
              <div class="row">
                <div class="col" style="padding: 30px; text-align: center;">
                    <h1>Rental Property Calculator</h1>
                </div>
              </div>
              <br />
              <div class="row">
                <div class="col" style="margin-top: 10px;">
                    <h5>Please upload your property info csv.</h5>
                </div>
                <div class="col" style="color:#00246B;">
                    <h3>Subject Property Information</h3>
                </div>
              </div>
              <div class="row">
                <div class="col">
                    <input type="file" accept=".csv" multiple="false" @change="handleFileUpload" />
                </div>
                <div class="col">
                    <!-- <div v-for="(value, key) in subjectPropertyData" :key="key">
                        <p><strong>{{ key }}</strong>: {{ value }}</p>
                    </div> -->

                </div>
              </div>
              <div class="row">
                <div class="col">
                </div>
                <div class="col">
                    <button type="button" :disabled="this.disabled" @click="analyzeProperty" class="btn btn-primary">Analyze Property</button>
                </div>
              </div>
            </div>
            <dashboard v-if="Object.keys(analysisDetails).length > 0"
                :analysisParams="analysisParams"
                :analysisDetails="analysisDetails"
                @update-calc="updateCalc"></dashboard>
        </div>
    `
}