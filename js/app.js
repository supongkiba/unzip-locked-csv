//Function to unlock and read the file
var readFile = () => {
    var fileInput = document.getElementById("uploadfile")
    var password = document.getElementById("password").value
    var fileRead = new FileReader();
    if (password && fileInput.value) {
        fileRead.onload = function (event) {
            try {
                var zip = new Minizip(new Uint8Array(event.target.result));
                var dataRes = "<h3>Here is the extracted Data</h3>"
                zip.list({ encoding: "buffer" }).forEach(function (file) {
                    /* Extract the data of the sheet */
                    let data = zip.extract(file.filepath, { password: password });
                    let arr = new Array();
                    /* Conver Buffer to String*/
                    data.map(buff => {
                        arr.push(String.fromCharCode(buff))
                    })
                    let data_str = arr.join("");
                    /* Call XLSX */
                    let workbook = XLSX.read(data_str, { type: "binary", cellDates:true, cellNF: false, cellText:false });
                    /* Get the worksheet name */
                    let first_sheet_name = workbook.SheetNames[0]; //0:  first worksheet by default
                    /* Get worksheet */
                    let worksheet = workbook.Sheets[first_sheet_name];

                    /* Array for objects for each file */
                    let JSONOBJ = JSON.stringify(XLSX.utils.sheet_to_json(worksheet, {dateNF:"YYYY-MM-DD"}), null, 2);
                    $('#data').append(`<div>${JSONOBJ}</div><br>`)
                });
            } catch (error) {
                alert("Password thik nai nakee.. think harder")
                console.log(error)
            }
        }
        fileRead.readAsArrayBuffer(fileInput.files[0]);
    } else {
        alert("Naaaaaaa! Password + File lage")
    }
};

var clearFields = () => {
    $('#uploadfile, #password').val('')
    $('#data').empty()
}