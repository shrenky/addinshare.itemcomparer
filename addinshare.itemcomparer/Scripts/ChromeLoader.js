var hostweburl;

//load the SharePoint resources
$(document).ready(function () {
    //Get the URI decoded URL.
    hostweburl =
        decodeURIComponent(
        addinshare_getQueryStringParameter("SPHostUrl")
    );

    // The SharePoint js files URL are in the form:
    // web_url/_layouts/15/resource
    var scriptbase = hostweburl + "/_layouts/15/";

    // Load the js file and continue to the 
    //   success handler
    $.getScript(scriptbase + "SP.UI.Controls.js", renderChrome)
});

// Callback for the onCssLoaded event defined
//  in the options object of the chrome control
function chromeLoaded() {
    // When the page has loaded the required
    //  resources for the chrome control,
    //  display the page body.
    $("body").show();
}

//Function to prepare the options and render the control
function renderChrome() {
    // The Help, Account and Contact pages receive the 
    //   same query string parameters as the main page
    var options = {
        "appIconUrl": "../Images/siteicon.png",
        "appTitle": window.pageTitle,
        "appHelpPageUrl": "http://www.addinshare.com/index.php?route=information/information&information_id=4",
        // The onCssLoaded event allows you to 
        //  specify a callback to execute when the
        //  chrome resources have been loaded.
        "onCssLoaded": "chromeLoaded()",
        "settingsLinks": [
            {
                "linkUrl": "ContactUs.aspx?"
                    + document.URL.split("?")[1],
                "displayName": "Contact us"
            }
        ]
    };

    var nav = new SP.UI.Controls.Navigation(
                            "chrome_ctrl_placeholder",
                            options
                        );
    nav.setVisible(true);

    $("#chromeControl_topheader_helplink").css("background-image", "url(../images/spintl.png)");
    if (window.location.href.toLowerCase().indexOf("Default.aspx") > 0) {
        $("#chromeControl_bottomheader_apptitle").append("<div style=\"line-height:25px;height:25px;color:#999;font: 12px 'Segoe UI', Arial;margin-left: 3px;\">Powered by AddinShare</div>");
    }
}

// Function to retrieve a query string value.
// For production purposes you may want to use
//  a library to handle the query string.
