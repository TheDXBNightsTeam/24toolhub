// BMI Calculator Tool Logic
;(() => {
  'use strict';
  
  document.addEventListener("DOMContentLoaded", () => {
    const height = document.getElementById("height");
    const heightUnit = document.getElementById("heightUnit");
    const weight = document.getElementById("weight");
    const weightUnit = document.getElementById("weightUnit");
    const age = document.getElementById("age");
    const gender = document.getElementById("gender");
    const bmiResults = document.getElementById("bmiResults");
    const bmiValue = document.getElementById("bmiValue");
    const bmiCategory = document.getElementById("bmiCategory");
    const idealWeight = document.getElementById("idealWeight");
    const weightToLose = document.getElementById("weightToLose");

    function calculateBMI() {
      const heightValue = parseFloat(height.value);
      const weightValue = parseFloat(weight.value);
      const heightUnitValue = heightUnit.value;
      const weightUnitValue = weightUnit.value;

      if (!heightValue || !weightValue) {
        bmiResults.style.display = "none";
        return;
      }

      // Convert to metric units
      let heightInMeters = heightUnitValue === "cm" ? heightValue / 100 : heightValue * 0.3048;
      let weightInKg = weightUnitValue === "kg" ? weightValue : weightValue * 0.453592;

      // Calculate BMI
      const bmi = weightInKg / (heightInMeters * heightInMeters);

      // Determine category
      let category = "";
      let categoryColor = "";
      if (bmi < 18.5) {
        category = "Underweight";
        categoryColor = "var(--warning, #f59e0b)";
      } else if (bmi < 25) {
        category = "Normal weight";
        categoryColor = "var(--success, #10b981)";
      } else if (bmi < 30) {
        category = "Overweight";
        categoryColor = "var(--warning, #f59e0b)";
      } else {
        category = "Obesity";
        categoryColor = "var(--error, #ef4444)";
      }

      // Calculate ideal weight range (BMI 18.5-24.9)
      const minIdealWeight = 18.5 * (heightInMeters * heightInMeters);
      const maxIdealWeight = 24.9 * (heightInMeters * heightInMeters);
      
      // Convert back to user's preferred unit
      let minIdeal, maxIdeal, idealRange;
      if (weightUnitValue === "kg") {
        minIdeal = minIdealWeight;
        maxIdeal = maxIdealWeight;
        idealRange = `${minIdeal.toFixed(1)} - ${maxIdeal.toFixed(1)} kg`;
      } else {
        minIdeal = minIdealWeight * 2.20462;
        maxIdeal = maxIdealWeight * 2.20462;
        idealRange = `${minIdeal.toFixed(1)} - ${maxIdeal.toFixed(1)} lbs`;
      }

      // Calculate weight to adjust
      let weightAdjustment = "";
      if (bmi < 18.5) {
        const weightToGain = minIdealWeight - weightInKg;
        if (weightUnitValue === "kg") {
          weightAdjustment = `+${weightToGain.toFixed(1)} kg`;
        } else {
          weightAdjustment = `+${(weightToGain * 2.20462).toFixed(1)} lbs`;
        }
      } else if (bmi > 24.9) {
        const weightToLoseValue = weightInKg - maxIdealWeight;
        if (weightUnitValue === "kg") {
          weightAdjustment = `-${weightToLoseValue.toFixed(1)} kg`;
        } else {
          weightAdjustment = `-${(weightToLoseValue * 2.20462).toFixed(1)} lbs`;
        }
      } else {
        weightAdjustment = "Maintain";
      }

      // Update display
      bmiValue.textContent = bmi.toFixed(1);
      bmiCategory.textContent = category;
      bmiCategory.style.color = categoryColor;
      idealWeight.textContent = idealRange;
      weightToLose.textContent = weightAdjustment;

      bmiResults.style.display = "block";
    }

    // Auto-calculate on input change
    if (height) {
      const debouncedCalculate = window.Utils ? window.Utils.debounce(calculateBMI, 300) : calculateBMI;
      height.addEventListener("input", debouncedCalculate);
    }

    if (weight) {
      const debouncedCalculate = window.Utils ? window.Utils.debounce(calculateBMI, 300) : calculateBMI;
      weight.addEventListener("input", debouncedCalculate);
    }

    if (heightUnit) {
      heightUnit.addEventListener("change", calculateBMI);
    }

    if (weightUnit) {
      weightUnit.addEventListener("change", calculateBMI);
    }

    if (age) {
      const debouncedCalculate = window.Utils ? window.Utils.debounce(calculateBMI, 300) : calculateBMI;
      age.addEventListener("input", debouncedCalculate);
    }

    if (gender) {
      gender.addEventListener("change", calculateBMI);
    }

    // Global functions for buttons
    window.calculateBMI = calculateBMI;

    window.clearBMI = () => {
      height.value = "";
      weight.value = "";
      age.value = "";
      gender.value = "";
      bmiResults.style.display = "none";
    };

    window.copyResults = () => {
      const results = {
        bmiValue: bmiValue.textContent,
        bmiCategory: bmiCategory.textContent,
        idealWeight: idealWeight.textContent,
        weightToLose: weightToLose.textContent
      };

      const resultText = `BMI Calculation Results:
BMI Value: ${results.bmiValue}
Category: ${results.bmiCategory}
Ideal Weight Range: ${results.idealWeight}
Weight to Adjust: ${results.weightToLose}`;

      if (window.Utils && window.Utils.copyToClipboard) {
        window.Utils.copyToClipboard(resultText);
      } else {
        navigator.clipboard.writeText(resultText).then(() => {
          if (window.Utils && window.Utils.showNotification) {
            window.Utils.showNotification('BMI calculation results copied to clipboard!', 'success');
          } else {
            alert('BMI calculation results copied to clipboard!');
          }
        });
      }
    };

    // Initial calculation
    calculateBMI();
  });
})();