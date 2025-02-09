// Dynamically generate 18 lesson grid items with updated links
document.addEventListener("DOMContentLoaded", function () {
    const lessonGrid = document.getElementById("lessonGrid");
    for (let i = 1; i <= 18; i++) {
      const gridItem = document.createElement("div");
      gridItem.classList.add("grid-item");
      gridItem.innerHTML = `
        <a href="Lesson${i.toString().padStart(2, '0')}.html" class="lesson-link">Lesson ${i}</a>
        <a href="Lesson${i.toString().padStart(2, '0')}Evaluation.html" class="evaluation-link">Evaluation ${i}</a>
      `;
      lessonGrid.appendChild(gridItem);
    }
  });

// Add dropdown 
document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".dropdown-cell").forEach(cell => {
        let select = document.createElement("select");
        let options = ["Select", "0", "1", "2", "3", "4", "5", "/"];
        
        options.forEach(optionText => {
            let option = document.createElement("option");
            option.value = optionText;
            option.textContent = optionText;
            select.appendChild(option);
        });
        
        cell.appendChild(select);
    });
});

document.addEventListener("DOMContentLoaded", function() {
    // Get all the dropdown select elements inside cells with the class "dropdown-cell"
    const dropdowns = document.querySelectorAll('.dropdown-cell select');
  
    // Function to calculate and update the totals and percentage
    function calculateTotal() {
      let totalScore = 0;
      let selectedCount = 0;
  
      dropdowns.forEach(dropdown => {
        const value = dropdown.value;
        
        // Only consider if the dropdown value is not the default "Select"
        if (value !== "Select") {
          selectedCount++;
  
          // Add numeric values to totalScore. For non-numeric (e.g., "/"), treat as 0.
          if (!isNaN(value) && value !== "") {
            totalScore += parseInt(value, 10);
          }
        }
      });
  
      // Calculate the maximum possible score (out-off)
      let maxScore = selectedCount * 5;
      
      // Update the total score and out-off values in the DOM
      document.getElementById("total-score").textContent = totalScore;
      document.getElementById("out-off").textContent = maxScore;
  
      // Calculate the percentage. Guard against division by zero.
      let percentage = maxScore > 0 ? (totalScore / maxScore * 100) : 0;
      // Format the percentage to two decimal places and append a percent sign
      percentage = percentage.toFixed(2) + "%";
      // Update the DOM element with the calculated percentage
      document.getElementById("percentage").textContent = percentage;
    }
  
    // Attach an event listener to each dropdown so the totals are recalculated on change
    dropdowns.forEach(dropdown => {
      dropdown.addEventListener("change", calculateTotal);
    });
});

document.addEventListener("DOMContentLoaded", function () {
  // Function to calculate the difference in time (in minutes)
  function timeToMinutes(timeStr) {
      let [hours, minutes] = timeStr.split(":").map(Number);
      return hours * 60 + minutes;
  }

  // Function to convert minutes back into HH:MM format
  function minutesToHHMM(minutes) {
      let hh = Math.floor(minutes / 60);
      let mm = minutes % 60;
      return `${hh}:${mm.toString().padStart(2, "0")}`;
  }

  // Function to calculate the time difference for each row
  function calculateTimeDifference() {
      let grandTotalMinutes = 0;

      // Loop through each row (except the header and grand total row)
      document.querySelectorAll("tr").forEach((row, index) => {
          if (index === 0 || index === document.querySelectorAll("tr").length - 1) return; // Skip header and grand total row

          let startTimes = row.querySelectorAll(".start-time");
          let finishTimes = row.querySelectorAll(".finish-time");
          let totalCell = row.querySelector(".total-duration");
          let totalMinutes = 0;

          // Loop through each pair of start and finish times in the row
          startTimes.forEach((startInput, i) => {
              let startTime = startInput.value;
              let finishTime = finishTimes[i].value;

              console.log(`Start Time: ${startTime}, Finish Time: ${finishTime}`);  // Debug log

              // Only calculate if both start and finish times are filled
              if (startTime && finishTime) {
                  let start = timeToMinutes(startTime);
                  let finish = timeToMinutes(finishTime);

                  // Calculate time difference and handle overflow (past midnight)
                  let diff = finish - start;
                  if (diff < 0) diff += 24 * 60; // Add 24 hours if finish is earlier than start

                  totalMinutes += diff;
              }
          });

          console.log(`Total Minutes for Row: ${totalMinutes}`); // Debug log

          // Ensure totalCell is valid before setting the text content
          if (totalCell) {
              totalCell.textContent = minutesToHHMM(totalMinutes);
          }

          grandTotalMinutes += totalMinutes;
      });

      console.log(`Grand Total Minutes: ${grandTotalMinutes}`);  // Debug log

      // Update the grand total cell
      let grandTotalCell = document.getElementById("grand-total");
      if (grandTotalCell) {
          grandTotalCell.textContent = minutesToHHMM(grandTotalMinutes);
      }
  }

  // Get all the start and finish time inputs
  let startInputs = document.querySelectorAll(".start-time");
  let finishInputs = document.querySelectorAll(".finish-time");

  // Attach event listeners to all the input fields
  startInputs.forEach(input => input.addEventListener("input", calculateTimeDifference));
  finishInputs.forEach(input => input.addEventListener("input", calculateTimeDifference));
});

function resetFields() {
  document.querySelectorAll('input').forEach(input => {
      input.value = '';
  });
  document.querySelectorAll('Textarea').forEach(input => {
      input.value = '';
  });
  document.querySelectorAll('select').forEach(select => {
      select.selectedIndex = select.querySelector('option[selected]') ? 
                             Array.from(select.options).indexOf(select.querySelector('option[selected]')) : 
                             0;
  });
  document.getElementById('total-score').textContent = '0';
  document.getElementById('grand-total').textContent = '0:00';
}
