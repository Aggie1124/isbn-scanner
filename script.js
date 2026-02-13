const GAS_URL = "https://script.google.com/macros/s/AKfycbw54xJK3zSW91nW3x3HZQVUU572hfS1zfnVz_8e9S2GYa1EU8O3C9z_teC5MuxhViCl/exec";

let lastCode = null;

// 初始化 Quagga
Quagga.init({
    inputStream: {
        name: "Live",
        type: "LiveStream",
        target: document.querySelector('#scanner'),
        constraints: {
            facingMode: "environment"
        },
    },
    decoder: {
        readers: ["ean_reader"]
    }
}, function(err) {
    if(err){
        console.error(err);
        alert("相機初始化失敗");
        return;
    }
    console.log("Quagga 初始化完成");
    Quagga.start();
});

// 條碼掃描事件
Quagga.onDetected(function(result){
    let code = result.codeResult.code;
    if(code !== lastCode){
        lastCode = code;
        document.getElementById("result").textContent = code;

        // 上傳到試算表
        fetch(`${GAS_URL}?isbn=${code}`)
        .then(res => res.text())
        .then(data => {
            document.getElementById("status").textContent = "上傳成功";
            console.log("上傳結果:", data);
        })
        .catch(err => {
            document.getElementById("status").textContent = "上傳失敗";
            console.error("上傳錯誤:", err);
        });
    }
});

