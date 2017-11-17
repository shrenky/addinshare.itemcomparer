'use strict';

ExecuteOrDelayUntilScriptLoaded(initializePage, "sp.js");

function initializePage()
{
    var context = SP.ClientContext.get_current();
    var listContentTypes;
    var userSelectedItems;
    var allFields;
    var contentTypeNameOfCurrentItem;
    var views;
    var workingWeb;
    var workingList;
    var defaultView;

    // This code runs when the DOM is ready and creates a context object which is needed to use the SharePoint object model
    $(document).ready(function () {
        loadData();
    });

    function loadData()
     {
        var clientContext = SP.ClientContext.get_current();
        var hostWebURL = decodeURIComponent(addinshare_getQueryStringParameter("SPHostUrl"));
        var listId = decodeURIComponent(addinshare_getQueryStringParameter("SPListId"));
        var selectedItemsIds = decodeURIComponent(addinshare_getQueryStringParameter("SPListItemId"));
        if (selectedItemsIds.split(",").length != 2)
        {
            alert('Please select two items to compare.');
            $('#errorDiv').text('Please select two items to compare.');
            $('#errorDiv').show();
            $('#navBarDiv').hide();
            $('#main').hide();
            return;
        }
        $('#errorDiv').hide();
        var firstId = selectedItemsIds.split(",")[0];
        var secondId = selectedItemsIds.split(",")[1];
        var hostWebContext = new SP.AppContextSite(clientContext, hostWebURL);
        workingWeb = hostWebContext.get_web();
        workingList = hostWebContext.get_web().get_lists().getById(listId);

        var camlQuery = new SP.CamlQuery();
        
        camlQuery.set_viewXml(
            '<View><Query><Where><In>' +
            '<FieldRef Name=\'ID\'/><Values><Value Type=\'Counter\'>' + firstId +'</Value>' +
            '<Value Type=\'Counter\'>' + secondId + '</Value>' +
            '</Values></In></Where></Query><RowLimit>2</RowLimit></View>');
        userSelectedItems = workingList.getItems(camlQuery);
        clientContext.load(userSelectedItems);
        allFields = workingList.get_fields();
        listContentTypes = workingList.get_contentTypes();
        views = workingList.get_views();
        clientContext.load(workingWeb);
        clientContext.load(listContentTypes);
        clientContext.load(allFields);
        clientContext.load(views);
        clientContext.executeQueryAsync(populateData, onGetItemsFail);
    }

    function populateData()
    {
        bindViews();
        bindCompareBody();
        bindFilterBody();
        buildBreadcrumb();
    }

    function buildBreadcrumb()
    {
        var clientContext = SP.ClientContext.get_current();
        clientContext.load(workingList, 'DefaultViewUrl', 'Title', 'ParentWebUrl');
        clientContext.executeQueryAsync(onBuildBreadCrumb, onBuildBreadCrumbFailed);
    }

    function onBuildBreadCrumb() {
        var webTitle = workingWeb.get_title();
        var webUrl = workingWeb.get_url();
        var listTitle = workingList.get_title();
        var listUrl = workingList.get_defaultViewUrl();
        Breadcrumb.addItem(webTitle, webUrl);
        Breadcrumb.addItem(listTitle, listUrl);
        Breadcrumb.addItem("Item Comparer", "");
        $('#okbutton').click(function () {
            window.location.href = listUrl;
            return false;
        });
    }

    function onBuildBreadCrumbFailed() {
        alert('Failed to load list default view url');
    }

    var currentViewFields;

    function bindViews()
    {
        var viewsEnumerator = views.getEnumerator();
        
        var viewsDDL = $('#viewDDL');
        while (viewsEnumerator.moveNext()) {
            var oview = viewsEnumerator.get_current();
            if (oview.get_defaultView())
            {
                $('#viewDDLBtn').text(oview.get_title());
                defaultView = oview;
            }
            var li = $('<a/>', { text: oview.get_title(), id: oview.get_id()}).click(function () {
                var viewId = $(this).attr('id');
                var currentView = views.getById(viewId);
                $('#viewDDLBtn').text($(this).text());
                currentViewFields = currentView.get_viewFields();
                context.load(currentViewFields);
                context.executeQueryAsync(refreshData, onGetFieldsFail);
            });
            li.appendTo(viewsDDL);
        }
    }

    function refreshData()
    {
        var fieldsArray = addinshare_collectionToArray(currentViewFields);
        $('#compareBody > tr').each(function () {
            var internalName = $(this).attr('id');
            if (fieldsArray.indexOf(internalName) > -1) {
                $(this).show();
            }
            else {
                $(this).hide();
            }
        });

        $('.filtercheckboxdiv').each(function () {
            var divId = $(this).attr('id');
            var internalName = divId.substring(4);
            $(this).children(":first").prop('checked', true);
            $(this)[0].checked = true;
            if (fieldsArray.indexOf(internalName) > -1) {
                $(this).show();
            }
            else {
                $(this).hide();
            }
        });

    }

    function onGetFieldsFail()
    {
        alert('failed to get view fields');
    }

    function bindCompareBody()
    {
        var listItemEnumerator = userSelectedItems.getEnumerator();
        var compareBody = $("#compareBody");
        while (listItemEnumerator.moveNext()) {
            var oListItem = listItemEnumerator.get_current();
            var values = oListItem.get_fieldValues();

            contentTypeNameOfCurrentItem = getContentTypeOfCurrentItem(oListItem);

            var fieldEnumerator = allFields.getEnumerator();
            var chbList = $('#filterBody');
            while (fieldEnumerator.moveNext()) {
                var f = fieldEnumerator.get_current();
                if (f.get_hidden() || (f.get_readOnlyField() && !isBuiltinField(f))) { continue; }
                var internalName = f.get_internalName();
                var dispName = f.get_title();
                var v = getValueOfCurrentField(f, values);
                if ($('#' + internalName).length === 0) {
                    var rowTr = $('<tr />', {id: internalName });
                    var col1 = $('<td/>', { text: dispName });
                    var col2 = $('<td/>', { text: v });
                    col1.appendTo(rowTr);
                    col2.appendTo(rowTr);
                    rowTr.appendTo(compareBody);
                }
                else {
                    var row = $('#' + internalName);
                    var item1Text = row.children(':last').text();
                    var diff = JsDiff.diffChars(item1Text, v, false);
                    var item2Text = [];

                    var fragment = document.createDocumentFragment();
                    for (var i = 0; i < diff.length; i++) {

                        if (diff[i].added && diff[i + 1] && diff[i + 1].removed) {
                            var swap = diff[i];
                            diff[i] = diff[i + 1];
                            diff[i + 1] = swap;
                        }

                        var node;
                        if (diff[i].removed) {
                            node = document.createElement('del');
                            node.appendChild(document.createTextNode(diff[i].value));
                        } else if (diff[i].added) {
                            node = document.createElement('ins');
                            node.appendChild(document.createTextNode(diff[i].value));
                        } else {
                            node = document.createTextNode(diff[i].value);
                        }
                        fragment.appendChild(node);
                    }

                    //result.textContent = '';
                    //result.appendChild(fragment);

                    col2 = $('<td/>').html(fragment);
                    col2.appendTo(row);

                }

            }

        }

        currentViewFields = defaultView.get_viewFields();
        context.load(currentViewFields);
        context.executeQueryAsync(refreshData, onGetFieldsFail);
    }

    function bindFilterBody()
    {
        var chbListBody = $('#filterPanel');
        var fieldEnumerator = allFields.getEnumerator();
        while (fieldEnumerator.moveNext()) {
            var f = fieldEnumerator.get_current();
            if (f.get_hidden() || (f.get_readOnlyField() && !isBuiltinField(f))) { continue; }
            var internalName = f.get_internalName();
            var dispName = f.get_title();
            var chbDiv = createCheckBoxDiv(internalName, dispName);
            chbDiv.appendTo(chbListBody);
        }
    }
    ///<div class="ms-CheckBox">
    ///<input tabindex="-1" type="checkbox" class="ms-CheckBox-input">
    ///    <label role="checkbox" class="ms-CheckBox-field" tabindex="0" aria-checked="false" name="checkboxa">
    ///        <span class="ms-Label">Checkbox</span>
    ///    </label>
    ///    </div>
    /// old function for selected table
    function createCheckBox(internalName, dispName) {

        var rowTr = $('<tr/>', { id: 'filter_' + internalName, class: 'is-selected' }).click(function () {
            //refresh compareBody
            console.log($(this).attr('class'));
        });

        var col1 = $('<td/>', {
            class: 'ms-Table-rowCheck', text: dispName, 'style': 'padding-left:20px'
        })
        col1.appendTo(rowTr);
        return rowTr;
    }

    function createCheckBoxDiv(internalName, dispName) {

        var checkbox = $('<input/>', { id: 'filter_' + internalName, type:'checkbox', 'checked':'checked' }).click(function () {
            var isSelected = $(this).is(':checked');
            if (isSelected) {
                $('#' + internalName).show();
            }
            else
            {
                $('#' + internalName).hide();
            }
        });

        var chbLabel = $('<lable/>', {text:dispName});

        var chbDiv = $('<div />', { id: 'div_' + internalName, 'class':'filtercheckboxdiv' });
        checkbox.appendTo(chbDiv);
        chbLabel.appendTo(chbDiv);
        return chbDiv;
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
                if (field.get_richText())
                {
                    text = values[internalName];
                }
                else
                {
                    text = values[internalName];
                }
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

        return text.toString();
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
        alert("Error - Falied to get items");
    }
}
