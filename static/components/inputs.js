export var range_slider = {

    props: {
        min: {default: 500},
        max: {default: 10000},
        units: {type: String, default: '$'},
        modelValue: {}
    },

    template: `
        <input type="range"
            :value="modelValue"
            @input="$emit('update:modelValue', $event.target.value)"
            class="form-range"
            id="rentalIncomeRange"
            :min="min"
            :max="max"
            step="1">

    `

}