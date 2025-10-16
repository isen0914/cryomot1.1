function switchTab(tabName) {
        const sections = document.querySelectorAll(".section");
        sections.forEach((section) => section.classList.remove("active"));

        const buttons = document.querySelectorAll(".nav-btn");
        buttons.forEach((btn) => btn.classList.remove("active"));

        document.getElementById(tabName).classList.add("active");
        event.target.classList.add("active");
      }

      function toggleStep(button) {
        const expanded = button.closest("div").nextElementSibling;
        if (expanded && expanded.classList.contains("step-content-expanded")) {
          expanded.classList.toggle("show");
          button.textContent = expanded.classList.contains("show") ? "▲" : "▼";
        }
      }

      function toggleHistory(button) {
        const expanded = button.closest("div").parentElement.nextElementSibling;
        if (expanded && expanded.classList.contains("history-expanded")) {
          expanded.classList.toggle("show");
          button.textContent = expanded.classList.contains("show") ? "▲" : "▼";
        }
      }

      function openFolderPicker() {
        document.getElementById("folderInput").click();
      }

      function handleFolderSelect(event) {
        const files = event.target.files;
        if (files.length > 0) {
          console.log("Folder selected with files:", files);
          alert(`Folder uploaded with ${files.length} files!`);
        }
      }

      function handleDragOver(event) {
        event.preventDefault();
        event.stopPropagation();
        event.currentTarget.classList.add("dragover");
      }

      function handleDragLeave(event) {
        event.preventDefault();
        event.stopPropagation();
        event.currentTarget.classList.remove("dragover");
      }

      function handleDrop(event) {
        event.preventDefault();
        event.stopPropagation();
        event.currentTarget.classList.remove("dragover");

        const items = event.dataTransfer.items;
        if (items) {
          for (let i = 0; i < items.length; i++) {
            if (items[i].kind === "file") {
              const entry = items[i].webkitGetAsEntry();
              if (entry.isDirectory) {
                console.log("Folder dropped:", entry.name);
                alert(`Folder "${entry.name}" dropped successfully!`);
              }
            }
          }
        }
      }