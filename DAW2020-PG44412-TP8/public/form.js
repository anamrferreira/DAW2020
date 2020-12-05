function addForm(){

    var newForm = $(`
        <div class="w3-border-top w3-border-bottom">
            <div class="w3-row w3-margin">
                <div class="w3-col s3">
                    <label><b>Description:</b></label>
                </div>
                <div class="w3-col s9 w3-border">
                    <input style="height:40px" class="w3-input w3-border w3-light-grey" type="text" name="desc">
                </div>
            </div>
            <div class="w3-row w3-margin">
                <div class="w3-col s3">
                    <label><b>Select file:</b></label>
                </div>
                <div class="w3-col s9 w3-border">
                    <input class="w3-input w3-border w3-light-grey" type="file" name="myFiles">
                </div>
            </div>
        </div>
        `)

    $("#newForm").append(newForm)
}