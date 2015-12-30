//.3ds, .stl, .igs, .model, .mxp, .obj, .wrl, .zip, .rar, .7z, .skp, .dae, .fbx, .matPart, .ply, .magics, .mgx, .x3d, .x3dv.", fields))
var accessToken = '';
var objs = [];
chrome.runtime.sendMessage({'gimme': 'gimme!'}, function (response) {
    console.log('Received URLS');
    fileUrls = response.takeit;

    objs = fileUrls;

    for (i = 0; i < objs.length; i++) {
        var radioBtn = $('<input type="radio" name="url" value="' + objs[i] + '"/>');
        radioBtn.appendTo('.target');
    }

    var fileUrls = [];

    // Initialize Spark client
    ADSKSpark.Client.initialize('XIRIrrHQohEfLVtPgwH75zotoGzGuwBU');

    //if (ADSKSpark.Client.isAccessTokenValid()) {
    //    console.debug('Access token is still valid!');
    //}

    var splitParts = window.location.toString().split('access_token=');
    if (splitParts && splitParts.length > 1) {
        accessToken = splitParts[1];
        $("#3d-print-extension-login").hide();
        $("#content").html("Please wait while we redirect you to Autodesk's Marketplace Service Bureau page... This will take a few seconds, depending on the size of the model.");

        //Upload file and onSuccess call the service bureau api

        chrome.storage.local.get('objs', function (result){
            objs = result.objs;
        });

        console.log('Uploading file. objs: ' + objs + (!objs || objs.length < 1) ? ' ************** NO OBJS!!!!!!!!' : '');
        $.ajax({

            type:"POST",
            beforeSend: function (request)
            {
                request.setRequestHeader("Authorization", "Bearer " + accessToken);
                request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

            },
            data: "filename=filename.obj&fileurl=" + encodeURIComponent(objs[0]),
            url: "https://api-sandbox.spark.autodesk.com/api/v1/files/upload",
            success: function(result) {
                console.log(result);
                callServiceBureauApi(result);
            },
            failure: function (result) {
                console.log(result);
            }
        });
    }

});

//chrome.storage.local.get('objs', function (result){
//});

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
    location.href = ADSKSpark.Client.getLoginRedirectUrl();
}

/**
 * Logout button function
 */
function logout() {
    ADSKSpark.Client.logout();
    location.href = location.protocol + '//' + location.host + location.pathname;
}


// Checks on load/reload if the Access_token exist at the local storage.
if (ADSKSpark.Client.isAccessTokenValid()) {
    $('#access-token-span').text(ADSKSpark.Client.getAccessToken());
    $('#login').hide();
    $('#logout').css('display', 'inline-block');
}else{
    /**
     * Complete the login flow after the redirect from Authentication.
     */
    ADSKSpark.Client.completeLogin(false).then(function (token) {
        // Get the access_token
        if (token) {
            location.href = location.protocol + '//' + location.host + location.pathname;
        } else {
            console.error('Problem with fetching token');
        }

    });
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
        "&asset_name=CreatedByPrintMy3dModelBrowserExtension" +
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
