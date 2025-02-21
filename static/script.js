document.addEventListener("DOMContentLoaded", function () {
    console.log("JavaScript 로드 완료!");

    const dropArea = document.getElementById("drop-area");
    const fileInput = document.getElementById("upload");
    const message = document.getElementById("message");
    let selectedFile = null;

    // ✅ 파일 선택 버튼을 클릭해서 업로드할 수도 있음
    fileInput.addEventListener("change", function () {
        selectedFile = fileInput.files[0];
        console.log("파일 선택됨:", selectedFile.name);
    });

    // ✅ 드래그 앤 드롭 기능 추가
    dropArea.addEventListener("dragover", function (event) {
        event.preventDefault();
        dropArea.classList.add("dragover");
    });

    dropArea.addEventListener("dragleave", function () {
        dropArea.classList.remove("dragover");
    });

    dropArea.addEventListener("drop", function (event) {
        event.preventDefault();
        dropArea.classList.remove("dragover");

        if (event.dataTransfer.files.length > 0) {
            selectedFile = event.dataTransfer.files[0];
            fileInput.files = event.dataTransfer.files;  // 파일 선택 필드에 반영
            console.log("드래그 앤 드롭된 파일:", selectedFile.name);
        }
    });

    // ✅ 변환 버튼 클릭 시 변환 요청 보내기
    document.getElementById("convert").addEventListener("click", async function () {
        if (!selectedFile) {
            message.textContent = "PNG 파일을 업로드하세요.";
            message.style.color = "red";
            return;
        }

        let formData = new FormData();
        formData.append("file", selectedFile);

        message.textContent = "변환 중...";
        message.style.color = "#007bff";

        try {
            let response = await fetch("/convert", {
                method: "POST",
                body: formData
            });

            if (!response.ok) {
                throw new Error(`서버 오류: ${response.statusText}`);
            }

            let result = await response.blob();
            let url = URL.createObjectURL(result);
            let a = document.createElement("a");
            a.href = url;
            a.download = "converted.webp";
            a.textContent = "변환된 파일 다운로드";
            message.innerHTML = "";
            message.appendChild(a);

            console.log("변환 성공!");
        } catch (error) {
            message.textContent = "변환 실패! 다시 시도해 주세요.";
            message.style.color = "red";
            console.error("변환 중 오류 발생:", error);
        }
    });
});
