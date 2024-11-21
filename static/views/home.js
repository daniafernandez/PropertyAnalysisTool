export var home = {

    watch: {
        subject_property_data(dict) {
            if (Object.keys(dict).length) {
                this.disabled = null;
            }
            else {
                this.disabled = true;
            }
        },
    },

    data() {
        return {
            subject_property_data: {},
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
                this.subject_property_data = response.data;
            }).catch(error => {
                console.log(error);
            })

        },

        analyzeProperty() {
            axios({
                method: "get",
                url: "/analyzeProperty",
                params: this.subject_property_data,
                responseType: "json",
            }).then(response => {
                console.log(response.data);
            }).catch(error => {
                console.log(error);
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
                    <div v-for="(value, key) in subject_property_data" :key="key">
                        <p><strong>{{ key }}</strong>: {{ value }}</p>
                    </div>
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
            <br />
            <br />
        </div>
    `
}