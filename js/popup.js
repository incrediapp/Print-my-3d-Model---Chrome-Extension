var accessToken = '';
var objs = [];

var startUploadingFilesToSpark = function () {
    if (!$("input:checked").val()) {
        toastr.error('Please select 1 of the files');
        return;
    }

    $("#3d-print-extension-login").hide();
    $(".target").hide();
    $("#content").html("Please wait while we redirect you to Autodesk's Marketplace Service Bureau page... This will take a few seconds, depending on the size of the model.");

    //Upload file and onSuccess call the service bureau api
    $.ajax({

        type: "POST",
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", "Bearer " + accessToken);
            request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

        },
        data: "filename=filename.obj&fileurl=" + encodeURIComponent($("input:checked").val()),
        url: "https://api-sandbox.spark.autodesk.com/api/v1/files/upload",
        success: function (result) {
            console.log(result);
            callServiceBureauApi(result);
        },
        failure: function (result) {
            console.log(result);
        }
    });
}

if (ADSKSpark.Client.isAccessTokenValid()) {
    accessToken = ADSKSpark.Client.getAccessToken();
} else {
    ADSKSpark.Client.completeLogin(false).then(function (token) {
        // Get the access_token
        if (token) {
            accessToken = token;
            startUploadingFilesToSpark();
        } else {
            console.error('Problem with fetching token');
        }
    })
};

chrome.runtime.sendMessage({'gimme': 'gimme!'}, function (response) {
    console.log('Received URLS');
    fileUrls = response.takeit;

    objs = fileUrls;

    for (i = 0; i < objs.length; i++) {
        var viewerDiv = $('<div id="viewer-placeholder-' + i + '"/>');
        var radioBtn = $('<input type="radio" id="radio-' + i + '" name="url" value="' + objs[i] + '">  ' + objs[i] + '</input>');
        radioBtn.appendTo('.target');
        viewerDiv.appendTo('.target');
        createNewViewer(viewerDiv, objs[i]);
    }

    //if ($("#radio-0")) {
    //    // Check the first option
    //    $("#radio-0").prop("checked", true);
    //}

    var fileUrls = [];

    // Initialize Spark client
    ADSKSpark.Client.initialize('XIRIrrHQohEfLVtPgwH75zotoGzGuwBU');

});

document.addEventListener('DOMContentLoaded', function() {
    var link = document.getElementById('3d-print-extension-login');
    // onClick's logic below:
    link.addEventListener('click', function() {
        login();
    });
});

/**
 * Open login window
 */
function login() {
    if (accessToken) {
        startUploadingFilesToSpark();
    } else {
        location.href = ADSKSpark.Client.getLoginRedirectUrl();
    }
}

var callServiceBureauApi = function (result) {
    fileIds = [];
    $.each(result.files, function(key, value) {
        fileIds.push(value.file_id);
    });

    $.ajax({

        type:"GET",
        beforeSend: function (request)
        {
            request.setRequestHeader("Authorization", "Bearer " + accessToken);
        },
        url: "https://api-sandbox.spark.autodesk.com/api/v1/assets/viewerUrl" +
        "?file_ids=" + fileIds.join(",") +
        "&asset_name=My Model" +
        "&description=Created by Print My 3d Model browser extension" +
        "&tags=3d",
        success: function(result) {
            console.log(result);
            location.href = result;
        },
        failure: function (result) {
            console.log(result);
        }
    });
};
