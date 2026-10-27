document.addEventListener("DOMContentLoaded", () => {
    
    // UI Elements
    const viewDashboard = document.getElementById("view-dashboard");
    const viewResult = document.getElementById("view-result");
    
    const dropArea = document.getElementById("drop-area");
    const fileInput = document.getElementById("file-input");
    const uploadIdle = document.getElementById("upload-idle");
    const uploadLoading = document.getElementById("upload-loading");
    
    const btnBack = document.getElementById("btn-back");
    const navHome = document.getElementById("nav-home");

    // Result Elements
    const resImage = document.getElementById("res-image");
    const resPrediction = document.getElementById("res-prediction");
    const resConfidenceText = document.getElementById("res-confidence-text");
    const resConfidenceBar = document.getElementById("res-confidence-bar");
    const resFilename = document.getElementById("res-filename");

    // Configure Navigation
    const goHome = () => {
        viewResult.classList.add("hidden");
        viewDashboard.classList.remove("hidden");
        resetUploadState();
    };

    btnBack.addEventListener("click", goHome);
    navHome.addEventListener("click", (e) => { e.preventDefault(); goHome(); });

    // Drag and Drop handlers
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    ['dragenter', 'dragover'].forEach(eventName => {
        dropArea.addEventListener(eventName, () => {
            dropArea.classList.add("bg-primary-container/20");
        }, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, () => {
            dropArea.classList.remove("bg-primary-container/20");
        }, false);
    });

    dropArea.addEventListener('drop', (e) => {
        const dt = e.dataTransfer;
        const files = dt.files;
        if (files.length > 0) submitImage(files[0]);
    });

    dropArea.addEventListener("click", () => {
        if (!uploadLoading.classList.contains("hidden")) return;
        fileInput.click();
    });

    fileInput.addEventListener("change", function () {
        if (this.files && this.files.length > 0) {
            submitImage(this.files[0]);
        }
    });

    function resetUploadState() {
        uploadLoading.classList.add("hidden");
        uploadIdle.classList.remove("hidden");
        fileInput.value = "";
    }

    // Core Logical Submission
    async function submitImage(file) {
        // Validation
        if (!file.type.startsWith('image/')) {
            alert("Please upload a valid image file.");
            return;
        }

        // 1. Preview Local Image
        const reader = new FileReader();
        reader.onload = (e) => resImage.src = e.target.result;
        reader.readAsDataURL(file);

        // 2. UI Loading State
        uploadIdle.classList.add("hidden");
        uploadLoading.classList.remove("hidden");

        // 3. Construct API Payload
        const formData = new FormData();
        formData.append("file", file);

        try {
            // 4. Send to Python FastAPI Backend 
            // (Assumes app.py is running on port 8001)
            const response = await fetch("http://localhost:8001/predict", {
                method: "POST",
                body: formData
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.detail || "Server failed to process image.");
            }

            const data = await response.json();
            console.log("[API RESPONSE]", data);
            
            // 5. Update UI with JSON payload
            let formattedPred = data.prediction.replace(/___/g, " - ").replace(/_/g, " ");
            resPrediction.textContent = formattedPred;
            
            // Inject new Description schema
            const descElement = document.querySelector("#view-result .bg-primary-container\\/30 p");
            if (descElement) {
                descElement.textContent = data.description || "Analysis Complete. Please consult local agronomist.";
            }

            // Inject Custom Solution Steps dynamically into the Action Plan UL
            if (data.solution) {
                const ulElement = document.querySelector("#view-result ul");
                if (ulElement) {
                    ulElement.innerHTML = ""; // Clear existing static bullets
                    const solutionSteps = data.solution.split('.').map(s => s.trim()).filter(s => s.length > 0);
                    solutionSteps.forEach(step => {
                        const li = document.createElement("li");
                        li.className = "flex gap-3 mb-4";
                        li.innerHTML = `
                            <span class="material-symbols-outlined text-primary-container">check_circle</span>
                            <span class="text-sm">${step}.</span>
                        `;
                        ulElement.appendChild(li);
                    });
                }
            }
            
            // Set confidence metrics
            const confPercentage = (data.confidence * 100).toFixed(1);
            resConfidenceText.textContent = `${confPercentage}%`;
            resConfidenceBar.style.width = `${confPercentage}%`;
            
            resFilename.textContent = `Diagnostic File: ${file.name}`;

            // 6. Transition Views
            viewDashboard.classList.add("hidden");
            viewResult.classList.remove("hidden");

            // Reset dashboard state for next time
            resetUploadState();

        } catch (error) {
            console.error("[API ERROR]", error);
            alert(`Backend Connection Error:\n\n${error.message}\n\nPlease ensure 'python backend/app.py' is running!`);
            resetUploadState();
        }
    }
});
