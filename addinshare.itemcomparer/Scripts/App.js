'use strict';

ExecuteOrDelayUntilScriptLoaded(initializePage, "sp.js");

function initializePage()
{
    var context = SP.ClientContext.get_current();
    var user = context.get_web().get_currentUser();

    // This code runs when the DOM is ready and creates a context object which is needed to use the SharePoint object model
    $(document).ready(function () {
        getUserName();
        getSeletedItems();
    });

    // This function prepares, loads, and then executes a SharePoint query to get the current users information
    function getUserName() {
        context.load(user);
        context.executeQueryAsync(onGetUserNameSuccess, onGetUserNameFail);
    }

    // This function is executed if the above call is successful
    // It replaces the contents of the 'message' element with the user name
    function onGetUserNameSuccess() {
        $('#message').text('Hello ' + user.get_title());
    }

    // This function is executed if the above call fails
    function onGetUserNameFail(sender, args) {
        alert('Failed to get user name. Error:' + args.get_message());
    }

    var userSelectedItems;
    var allFields;
    function getSeletedItems()
     {
        var clientContext = SP.ClientContext.get_current();
        var hostWebURL = decodeURIComponent(addinshare_getQueryStringParameter("SPHostUrl"));
        var listId = decodeURIComponent(addinshare_getQueryStringParameter("SPListId"));
        var selectedItemsIds = decodeURIComponent(addinshare_getQueryStringParameter("SPListItemId"));
        var firstId = selectedItemsIds.split(",")[0];
        var secondId = selectedItemsIds.split(",")[1];
        var hostWebContext = new SP.AppContextSite(clientContext, hostWebURL);
        var workingList = hostWebContext.get_web().get_lists().getById(listId);

        var camlQuery = new SP.CamlQuery();
        
        camlQuery.set_viewXml(
            '<View><Query><Where><Or><Eq>' +
            '<FieldRef Name=\'ID\'/><Value Type=\'Number\'>' + firstId +'</Value>' +
            '</Eq><Eq><FieldRef Name=\'ID\'/><Value Type=\'Number\'>' + secondId + '</Value>' +
            '</Eq></Or></Where></Query><RowLimit>2</RowLimit></View>');
        userSelectedItems = workingList.getItems(camlQuery);
        clientContext.load(userSelectedItems);
        allFields = workingList.get_fields();
        clientContext.load(allFields);
        clientContext.executeQueryAsync(showItems, onGetItemsFail);
    }

    function showItems()
    {
        var listItemEnumerator = userSelectedItems.getEnumerator();
        var panelDiv = $("#comparePanel");
        while (listItemEnumerator.moveNext()) {
            var oListItem = listItemEnumerator.get_current();
            var values = oListItem.get_fieldValues();
            console.log(values);
            $.each(values, function (k, v) {
                console.log(k + " , " + v);
            });

            var fieldEnumerator = allFields.getEnumerator();
            while (fieldEnumerator.moveNext())
            {
                var f = fieldEnumerator.get_current();
                var internalName = f.get_internalName();
                var v = values[internalName];
                console.log(f.get_title() + " , " + values[internalName]);
                if ($('#' + internalName).length == 0) {
                    var rowDiv = $('<div />', {
                        "class": 'ms-Grid-row',
                        id: internalName
                    });
                    var colDiv1 = $('<div/>', { "class": 'ms-Grid-col ms-sm4 ms-md4 ms-lg4', text: internalName });
                    var colDiv2 = $('<div/>', { "class": 'ms-Grid-col ms-sm4 ms-md4 ms-lg4', text: v });
                    colDiv1.appendTo(rowDiv);
                    colDiv2.appendTo(rowDiv);
                    rowDiv.appendTo(panelDiv);
                }
                else
                {
                    var row = $('#' + internalName);
                    var colDiv2 = $('<div/>', { "class": 'ms-Grid-col ms-sm4 ms-md4 ms-lg4', text: v });
                    colDiv2.appendTo(row);

                }
                
            }
            
        }
    }

    function onGetItemsFail() {
        alert("Falied to get items");
    }
}
