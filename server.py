from flask import Flask, request, send_file, render_template, send_from_directory
from PIL import Image
import io
import os

app = Flask(__name__)

# ✅ 정적 파일 제공 (script.js, styles.css)
@app.route('/static/<path:filename>')
def static_files(filename):
    return send_from_directory("static", filename)

# ✅ 기본 페이지 (index.html 제공)
@app.route("/")
def home():
    return render_template("index.html")

@app.route("/convert", methods=["POST"])
def convert():
    if "file" not in request.files:
        return "파일이 없습니다.", 400

    file = request.files["file"]

    try:
        image = Image.open(file)
        webp_image = io.BytesIO()
        image.save(webp_image, "WEBP")
        webp_image.seek(0)
        return send_file(webp_image, mimetype="image/webp", as_attachment=True, download_name="converted.webp")
    except Exception as e:
        print(f"변환 실패: {str(e)}")
        return f"변환 실패: {str(e)}", 500

# ✅ Render가 포트를 감지할 수 있도록 설정
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))  # Render에서 환경 변수 PORT 사용
    app.run(host="0.0.0.0", port=port, debug=True)  # 0.0.0.0으로 설정해서 외부 접근 가능하게 함
