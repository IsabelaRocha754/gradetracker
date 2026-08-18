// src/utils/datepicker.js

import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";

export function initDatePicker(inputElement, options = {}) {
    return flatpickr(inputElement, {
        dateFormat: "d/m/Y",
        allowInput: true,
        ...options,
    });
}