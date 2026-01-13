// submit.js
const API_URL = "https://script.google.com/macros/s/AKfycbwqRhA_q1CxWeplv8VOZu2r3sFcluQ39OiTH3HkuUxp6X-fEJieXuScEIava8LO1djJ/exec";

// 将表单的 Action 设置为我们的 API
const form = document.getElementById("surveyForm");
form.action = API_URL;

form.addEventListener("submit", (e) => {
    // 这里我们不阻止默认提交 (no e.preventDefault)，
    // 但是我们需要先处理一下数据 (Q3 和 Q10)，然后再让它自动提交到 iframe。
    
    // --- 1. 处理 Q3 (多选) ---
    // 谷歌表格默认只能读到一个 checkbox 的值。
    // 我们需要把选中的 A, B, C 手动拼成一个字符串，放在一个隐藏的输入框里。
    
    // 获取所有选中的 Q3
    const q3Checked = document.querySelectorAll('input[name="q3"]:checked');
    let q3String = "";
    q3Checked.forEach((cb, index) => {
        q3String += cb.value + (index < q3Checked.length - 1 ? ", " : "");
        // 关键：移除原始 checkbox 的 name 属性，防止它们分开提交
        cb.removeAttribute("name"); 
    });

    // 创建一个隐藏的 input 来存放拼接好的 Q3
    const hiddenQ3 = document.createElement("input");
    hiddenQ3.type = "hidden";
    hiddenQ3.name = "q3"; // 这个名字必须和 Apps Script 里读取的一样
    hiddenQ3.value = q3String;
    form.appendChild(hiddenQ3);

    // --- 2. 处理 Q10 (中英文合并) ---
    const q10En = document.getElementById("q10_en").value;
    const q10Cn = document.getElementById("q10_cn").value;
    const q10Final = q10En.trim() !== "" ? q10En : q10Cn;

    // 创建一个隐藏的 input 来存放最终的 Q10
    const hiddenQ10 = document.createElement("input");
    hiddenQ10.type = "hidden";
    hiddenQ10.name = "q10";
    hiddenQ10.value = q10Final;
    form.appendChild(hiddenQ10);

    // UI 变为“提交中...”
    const submitBtn = form.querySelector("button[type='submit']");
    submitBtn.innerText = "Submitting... / 提交中...";
    submitBtn.disabled = true;

    // 显示成功信息 (因为提交到 iframe 我们无法检测失败，只能默认成功)
    setTimeout(() => {
        document.getElementById("successMsg").style.display = "block";
        document.getElementById("successMsg").scrollIntoView({ behavior: 'smooth' });
        submitBtn.innerText = "Submitted";
    }, 1000);
});