//點擊新增按鈕之後，執行新增資料的function
$("#add-data-btn").click(addData);

function addData() {
    //取得input們上的值，整理成物件格式
    var data = {
        name: $("#things").val()
    };
    //儲存到資料庫到資料庫中的contact集合(collection)
    //新增成功之後(then)，跳出alert提示視窗
    //回傳最新新增的文件id
    dbb.collection("todolist").add(data).then(function (doc) {
        alert("新增成功,文件id:" + doc.id);
    });
}

//讀取資料
//指定路徑取得(get)資料
dbb.collection("todolist")
    .onSnapshot(function (docs) {
        docs.forEach(function (doc) {
            // $("#data-container").html("");
            //把文件轉換成可用的物件格式
            var data = doc.data();
            var id = doc.id;
            var template = `<tr data-id="${id}">
                                <td>${data.name}</td>
                                <td>
                                    <i class="fas fa-trash-alt delete-btn"></i>
                                </td>
                            </tr>`;
            //貼到表格上
            $("#to-do-list").append(template);
        });
    });

//刪除按鈕
//刪除按鈕，一開始沒有存在於html上，動態從js產生的按鈕
$("#to-do-list").on("click", ".delete-btn", function () {
    //將這顆垃圾桶所在的卡片刪除
    $(this).parents(".card").remove();
});


//點到容器之後 往內尋找一群子元素
$("#to-do-list").on("click", ".delete-btn", function () {
    //取得要刪除的資料的id
    var id = $(this).parents("tr").attr("data-id");
    console.log(id);

    //指定資料庫路徑與文件id，刪除資料
    dbb.collection("todolist").doc(id)
        .delete().then(function () {
            alert("已刪除資料!");
        });
});


//更新按鈕
$("#update-data-btn").click(function () {
            //取得即將要更新的文件id
            var id = $("#editing-doc-id").val();
            //將最新編輯好的資料整理成物件
            var updatedData = {
                name: $("#name").val(),
            };
            //指定資料庫與文件id 更新資料
            dbb.collection("contact").doc(id)
                .update(updatedData)
                    .then(function () {
                        //將input清空
                        $("input").val("");
                    });
                });