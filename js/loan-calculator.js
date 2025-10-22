// Loan Calculator Tool Logic
;(() => {
  'use strict';
  
  document.addEventListener("DOMContentLoaded", () => {
    const loanAmount = document.getElementById("loanAmount");
    const interestRate = document.getElementById("interestRate");
    const loanTerm = document.getElementById("loanTerm");
    const termUnit = document.getElementById("termUnit");
    const paymentFrequency = document.getElementById("paymentFrequency");
    const loanResults = document.getElementById("loanResults");
    const monthlyPayment = document.getElementById("monthlyPayment");
    const totalPayments = document.getElementById("totalPayments");
    const totalInterest = document.getElementById("totalInterest");
    const payoffDate = document.getElementById("payoffDate");
    const numberOfPayments = document.getElementById("numberOfPayments");
    const monthlyRate = document.getElementById("monthlyRate");
    const principalAmount = document.getElementById("principalAmount");
    const interestRatio = document.getElementById("interestRatio");

    function calculateLoan() {
      const principal = parseFloat(loanAmount.value);
      const annualRate = parseFloat(interestRate.value);
      const term = parseFloat(loanTerm.value);
      const unit = termUnit.value;
      const frequency = paymentFrequency.value;

      if (!principal || !annualRate || !term) {
        loanResults.style.display = "none";
        return;
      }

      // Convert term to months
      let termInMonths = unit === "years" ? term * 12 : term;

      // Calculate payments per year based on frequency
      const paymentsPerYear = {
        'weekly': 52,
        'biweekly': 26,
        'monthly': 12,
        'quarterly': 4,
        'annually': 1
      };

      const paymentsPerYearValue = paymentsPerYear[frequency];
      const totalPaymentsCount = Math.ceil(termInMonths * (paymentsPerYearValue / 12));
      const monthlyInterestRate = annualRate / 100 / 12;
      const paymentFrequencyRate = annualRate / 100 / paymentsPerYearValue;

      // Calculate payment amount
      let paymentAmount;
      if (paymentFrequencyRate === 0) {
        paymentAmount = principal / totalPaymentsCount;
      } else {
        paymentAmount = principal * (paymentFrequencyRate * Math.pow(1 + paymentFrequencyRate, totalPaymentsCount)) / 
                       (Math.pow(1 + paymentFrequencyRate, totalPaymentsCount) - 1);
      }

      // Calculate totals
      const totalPaymentAmount = paymentAmount * totalPaymentsCount;
      const totalInterestAmount = totalPaymentAmount - principal;
      const interestToPrincipalRatio = (totalInterestAmount / totalPaymentAmount) * 100;

      // Calculate payoff date
      const startDate = new Date();
      const payoffDateValue = new Date(startDate);
      payoffDateValue.setMonth(payoffDateValue.getMonth() + termInMonths);

      // Update display
      monthlyPayment.textContent = `$${paymentAmount.toFixed(2)}`;
      totalPayments.textContent = `$${totalPaymentAmount.toFixed(2)}`;
      totalInterest.textContent = `$${totalInterestAmount.toFixed(2)}`;
      payoffDate.textContent = payoffDateValue.toLocaleDateString();
      numberOfPayments.textContent = totalPaymentsCount;
      monthlyRate.textContent = `${monthlyInterestRate.toFixed(4)}%`;
      principalAmount.textContent = `$${principal.toFixed(2)}`;
      interestRatio.textContent = `${interestToPrincipalRatio.toFixed(1)}%`;

      loanResults.style.display = "block";
    }

    // Auto-calculate on input change
    if (loanAmount) {
      const debouncedCalculate = window.Utils ? window.Utils.debounce(calculateLoan, 300) : calculateLoan;
      loanAmount.addEventListener("input", debouncedCalculate);
    }

    if (interestRate) {
      const debouncedCalculate = window.Utils ? window.Utils.debounce(calculateLoan, 300) : calculateLoan;
      interestRate.addEventListener("input", debouncedCalculate);
    }

    if (loanTerm) {
      const debouncedCalculate = window.Utils ? window.Utils.debounce(calculateLoan, 300) : calculateLoan;
      loanTerm.addEventListener("input", debouncedCalculate);
    }

    if (termUnit) {
      termUnit.addEventListener("change", calculateLoan);
    }

    if (paymentFrequency) {
      paymentFrequency.addEventListener("change", calculateLoan);
    }

    // Global functions for buttons
    window.calculateLoan = calculateLoan;

    window.clearLoan = () => {
      loanAmount.value = "";
      interestRate.value = "";
      loanTerm.value = "";
      loanResults.style.display = "none";
    };

    window.copyResults = () => {
      const results = {
        monthlyPayment: monthlyPayment.textContent,
        totalPayments: totalPayments.textContent,
        totalInterest: totalInterest.textContent,
        payoffDate: payoffDate.textContent,
        numberOfPayments: numberOfPayments.textContent,
        monthlyRate: monthlyRate.textContent,
        principalAmount: principalAmount.textContent,
        interestRatio: interestRatio.textContent
      };

      const resultText = `Loan Calculation Results:
Monthly Payment: ${results.monthlyPayment}
Total Payments: ${results.totalPayments}
Total Interest: ${results.totalInterest}
Payoff Date: ${results.payoffDate}
Number of Payments: ${results.numberOfPayments}
Monthly Interest Rate: ${results.monthlyRate}
Principal Amount: ${results.principalAmount}
Interest to Principal Ratio: ${results.interestRatio}`;

      if (window.Utils && window.Utils.copyToClipboard) {
        window.Utils.copyToClipboard(resultText);
        } else {
        navigator.clipboard.writeText(resultText).then(() => {
          if (window.Utils && window.Utils.showNotification) {
            window.Utils.showNotification('Loan calculation results copied to clipboard!', 'success');
          } else {
            alert('Loan calculation results copied to clipboard!');
          }
        });
      }
    };

    // Initial calculation
    calculateLoan();
    
    // Initialize FAQ
    initializeFAQ();
  });
})();

// Initialize FAQ functionality
function initializeFAQ() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const faqItem = question.parentElement;
            const answer = faqItem.querySelector('.faq-answer');
            
            // Toggle active class
            faqItem.classList.toggle('active');
            
            // Toggle answer visibility
            if (faqItem.classList.contains('active')) {
                answer.style.maxHeight = answer.scrollHeight + 'px';
            } else {
                answer.style.maxHeight = '0';
            }
        });
    });
}