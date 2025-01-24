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

    mounted() {
        axios({
                method: "get",
                url: "/demoFiles",
                responseType: "json",
            }).then(response => {
                console.log(response.data)
                this.demoFiles = response.data;
            }).catch(error => {
                console.log(error);
            })
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
            demoFiles: {},
            demoFileNameDisplayed: 'No File chosen',
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

        },

        selectDemoFile(file) {
            console.log(file);
            axios({
                method: "get",
                url: "/readDemoFile",
                params: {file: file},
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
                this.demoFileNameDisplayed = this.subjectPropertyData['Address'];
            }).catch(error => {
                console.log(error);
            })
        }

    },
    template: `
        <div>
            <br />
            <br />
            <div v-if="Object.keys(analysisDetails).length <= 0" class="container" style="background-color: #bbd0ff; width: 100vh; height: 80vh; padding: 30px; border-radius: 15px;">
              <div class="row">
                <div class="col" style="background-color: #031436; color: white; padding: 30px; text-align: center; border-radius: 15px;">
                    <h1>Analyze Rental Property</h1>
                </div>
              </div>
              <br />
              <div class="row">
                <div class="col" style="margin-top: 10px;">
                    <h4>Upload a listing info CSV from Smart MLS</h4>
                    <h6>Make sure your CSV includes only <strong>one</strong> listing and has the following columns:</h6>
                    <p>Address, Prop Type, City, State, Zip Code, MLS#, List Price, Acres, Beds, Baths Full, Baths Half,
                    Garage/Park, Built, DOM, Property Tax, HOA Fee Amount, HOA Fee Frequency, Annual Sewer Usage Fee</p>
                </div>
              </div>
              <div class="row">
                <div class="col">
                    <input type="file" accept=".csv" multiple="false" @change="handleFileUpload" />
                </div>
              </div>
              <div class="row">
                <div class="col" style="margin-top: 30px;">
                    <h4>Don't have Smart MLS Access?</h4>
                    <h5>Demo the dashboard with one of the properties below</h5>
                </div>
              </div>
              <div class="row">
                <div class="col" style="margin-top: 20px;">
                    <div class="dropdown">
                      <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                        Choose property file
                      </button>
                      <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                        <li v-for="file in demoFiles" :key="file">
                            <a class="dropdown-item" @click="selectDemoFile(file)" href="#">{{file}}</a>
                        </li>
                      </ul>
                    </div>
                </div>
                <div class="col" style="margin-top: 35px; margin-left:-20px;">
                    <p>{{ this.demoFileNameDisplayed }}</p>
                </div>
                <div class="col" style="margin-top: 20px;">
                </div>
                <div class="col" style="margin-top: 20px;">
                </div>
                <div class="col" style="margin-top: 20px;">
                </div>
                <div class="col" style="margin-top: 20px;">
                </div>
              </div>
              <div class="row">
                <div class="col" style="margin-top: 30px;">
                    <button style="font-size: 20px;" type="button" :disabled="this.disabled" @click="analyzeProperty" class="btn btn-primary">Build Dashboard</button>
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