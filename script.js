document.addEventListener("DOMContentLoaded", function () {
    let options = ["", "0", "1", "2", "3", "4", "5", "/"]; // First option is empty

    // Function to create a dropdown
    function createDropdown() {
        let dropdown = document.createElement("select");
        dropdown.classList.add("score-dropdown"); // Add class for reference

        options.forEach(value => {
            let option = document.createElement("option");
            option.value = value === "/" || value === "" ? 0 : value; // "/" and empty treated as 0
            option.textContent = value === "" ? "Select" : value; // Display "Select" for empty option
            dropdown.appendChild(option);
        });

        dropdown.addEventListener("change", updateTotal); // Update total on change
        return dropdown;
    }

    // Attach dropdowns to each row
    let rows = document.querySelectorAll(".dropdown-cell");
    rows.forEach(cell => {
        cell.appendChild(createDropdown());
    });

    // Function to calculate and update total
    function updateTotal() {
        let total = 0;
        document.querySelectorAll(".score-dropdown").forEach(dropdown => {
            total += parseInt(dropdown.value);
        });

        document.getElementById("total-score").textContent = total; // Update total cell
    }
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
    document.querySelectorAll('select').forEach(select => {
        select.selectedIndex = select.querySelector('option[selected]') ? 
                               Array.from(select.options).indexOf(select.querySelector('option[selected]')) : 
                               0;
    });
    document.getElementById('total-score').textContent = '0';
    document.getElementById('grand-total').textContent = '0:00';
}

function generateAndSendPDF() {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF();

    // Get data from the form
    const instructorName = document.getElementById("instructor-name").value;
    const date = document.getElementById("date").value;
    const participantName = document.getElementById("participant-name").value;

    // Add instructor name, date, and participant name to the PDF
    pdf.text(`Instructor: ${instructorName}`, 10, 20);
    pdf.text(`Date: ${date}`, 10, 30);
    pdf.text(`Participant: ${participantName}`, 10, 40);

    // Loop through table rows to get criteria and scores
    const rows = document.querySelectorAll("table tbody tr");
    let y = 50;
    rows.forEach(row => {
        const cells = row.querySelectorAll("td");
        let line = `${cells[1].innerText}: `; // Criteria (text)
        const scoreInput = cells[2].querySelector('input');
        if (scoreInput) {
            line += `Score: ${scoreInput.value}`;
        }
        pdf.text(line, 10, y);
        y += 10;
    });

    // Calculate total score
    const scores = document.querySelectorAll(".score");
    let totalScore = 0;
    scores.forEach(score => {
        totalScore += parseInt(score.value) || 0; // Avoid NaN if no value is entered
    });
    document.getElementById("total-score").innerText = totalScore;

    pdf.text(`Total Score: ${totalScore}/100`, 10, y);
    
    // Get email input value
    const email = document.getElementById("email").value;

    // Simulate sending email (this is just a placeholder, no actual email is sent)
    if (!email) {
        alert("Please enter an email address.");
        return;
    }

    alert(`PDF generated successfully! (Simulated email sent to: ${email})`);

    // Save the PDF file
    pdf.save("Lesson_Evaluation.pdf");
}

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
  

