'use strict';

ExecuteOrDelayUntilScriptLoaded(initializePage, "sp.js");

function initializePage()
{
    var context = SP.ClientContext.get_current();
    var user = context.get_web().get_currentUser();

    // This code runs when the DOM is ready and creates a context object which is needed to use the SharePoint object model
    $(document).ready(function () {
        //getUserName();
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

    var listContentTypes;
    var userSelectedItems;
    var allFields;
    var contentTypeNameOfCurrentItem;
    var views;
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
            '<View><Query><Where><In>' +
            '<FieldRef Name=\'ID\'/><Values><Value Type=\'COunter\'>' + firstId +'</Value>' +
            '<Value Type=\'Counter\'>' + secondId + '</Value>' +
            '</Values></In></Where></Query><RowLimit>2</RowLimit></View>');
        userSelectedItems = workingList.getItems(camlQuery);
        clientContext.load(userSelectedItems);
        allFields = workingList.get_fields();
        listContentTypes = workingList.get_contentTypes();
        views = workingList.get_views();
        clientContext.load(listContentTypes);
        clientContext.load(allFields);
        clientContext.load(views);
        clientContext.executeQueryAsync(showItems, onGetItemsFail);
    }

    function showItems()
    {
        var viewsEnumerator = views.getEnumerator();
        var viewsDDL = $('#viewDDL');
        while (viewsEnumerator.moveNext())
        {
            var oview = viewsEnumerator.get_current();
            var li = $('<a/>', {text:oview.get_title()});
            li.appendTo(viewsDDL);
        }

        var listItemEnumerator = userSelectedItems.getEnumerator();
        var compareBody = $("#compareBody");
        while (listItemEnumerator.moveNext()) {
            var oListItem = listItemEnumerator.get_current();
            var values = oListItem.get_fieldValues();

            contentTypeNameOfCurrentItem = getContentTypeOfCurrentItem(oListItem);

            var fieldEnumerator = allFields.getEnumerator();
            var chbList = $('#filterBody');
            while (fieldEnumerator.moveNext())
            {
                var f = fieldEnumerator.get_current();
                if (f.get_hidden() || (f.get_readOnlyField() && !isBuiltinField(f))) { continue; }
                var internalName = f.get_internalName();
                var dispName = f.get_title();
                var v = getValueOfCurrentField(f, values);
                if ($('#' + internalName).length === 0) {
                    var rowTr = $('<tr />', {
                        id: internalName
                    });
                    var col1 = $('<td/>', { text: dispName });
                    var col2 = $('<td/>', {  text: v });
                    col1.appendTo(rowTr);
                    col2.appendTo(rowTr);
                    rowTr.appendTo(compareBody);
                    var chbDiv = createCheckBox(internalName);
                    chbDiv.appendTo(chbList);
                }
                else
                {
                    var row = $('#' + internalName);
                    col2 = $('<div/>', { text: v });
                    col2.appendTo(row);

                }
                
            }
            
        }

    }
    ///<div class="ms-CheckBox">
    ///<input tabindex="-1" type="checkbox" class="ms-CheckBox-input">
    ///    <label role="checkbox" class="ms-CheckBox-field" tabindex="0" aria-checked="false" name="checkboxa">
    ///        <span class="ms-Label">Checkbox</span>
    ///    </label>
    ///    </div>
    function createCheckBox(txt)
    {

        var rowTr = $('<tr />');
        var col1 = $('<td/>', {
            class: 'ms-Table-rowCheck', id: 'filter_' + txt, text:'  ' + txt, 'style': 'padding-left:20px'
        });
        col1.appendTo(rowTr);
        return rowTr;
    }

    function isBuiltinField(field)
    {
        var isReadOnly = field.get_readOnlyField();
        var builtinFields = ["Author", "Editor", "_ModerationComments", "Modified", "Created", "_UIVersionString", "ModStat", "Created_x0020_Date", "Last_x0020_Modified", "FSObjType", "PermMask", "LinkFilename"]; //,"AppAuthor", "AppEditor"

        var isReadOnlyLookup = isReadOnly && (field.get_typeAsString() === "Lookup") && (field.get_internalName().indexOf("Lookup") ===0);
        return isReadOnlyLookup || (builtinFields.indexOf(field.get_internalName()) >-1)
    }

    ////refactor by Factory Pattern
    function getDisplayValue(field, values)
    {
        var fieldTypeString = field.get_typeAsString();
        var internalName = field.get_internalName();
        var text;
        switch (fieldTypeString) {
            case "ContentTypeId":
                text = values[internalName];
                break;
            case "Text":
                text = values[internalName];
                break;
            case "Note":
                text = values[internalName];
                break;
            case "Number":
                text = values[internalName];
                break;
            case "Boolean":
                text = values[internalName];
                break;
            case "User":
                if (values[internalName] && typeof (values[internalName].get_lookupValue) !== "undefined") {
                    text = values[internalName].get_lookupValue();
                }
                else {
                    text = values[internalName];
                }
                break;
            case "DateTime":
                text = values[internalName].toLocaleDateString();
                break;
            case "Choice":
                text = values[internalName];
                break;
            case "URL":
                if (values[internalName] && typeof (values[internalName].get_url) !== "undefined") {
                    text = values[internalName].get_url();
                }
                else {
                    text = values[internalName];
                }
                break;
            case "Currency":
                text = values[internalName];
                break;
            case "Lookup":
                if (values[internalName] && typeof (values[internalName].get_lookupValue) !== "undefined") 
                {
                    text = values[internalName].get_lookupValue();
                }
                else
                {
                    text = values[internalName];
                }
                break;
            case "LookupMulti":
                text = values[internalName];
                break;
            case "TaxonomyFieldType":
                text = values[internalName].Label;
                break;
            case "TaxonomyFieldTypeMulti":
                text = values[internalName].Label;
                break;
            case "Counter":
                text = values[internalName];
                break;
            case "Computed":
                text = values[internalName];
                break;
            case "Attachments":
                text = values[internalName];
                break;
            case "Integer":
                text = values[internalName];
                break;
            case "Guid":
                text = values[internalName];
                break;
            case "File":
                text = values[internalName];
                break;
            default:
                text = "NaN";
        }

        return text;
    }

    function getContentTypeOfCurrentItem(listItem) {
            var ctid = listItem.get_item("ContentTypeId").toString();
            var contentTypeName;
            var ct_enumerator = listContentTypes.getEnumerator();
            while (ct_enumerator.moveNext()) {
                    var ct = ct_enumerator.get_current();

                    if (ct.get_id().toString() === ctid) {
                            //we've got our content type, now let's get its name
                        contentTypeName = ct.get_name();
                    }
            }
            return contentTypeName;
    }
    
    function getValueOfCurrentField(f, values)
    {
        var internalName = f.get_internalName();
        if (internalName === "ContentType")
        {
            return contentTypeNameOfCurrentItem;
        }

        return getDisplayValue(f, values);
    }

    function onGetItemsFail() {
        alert("Falied to get items");
    }
}
