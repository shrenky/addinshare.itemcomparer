function addinshare_getQueryStringParameter(paramToRetrieve) {
    var params =
        document.URL.split("?")[1].split("&");
    var strParams = "";
    for (var i = 0; i < params.length; i = i + 1) {
        var singleParam = params[i].split("=");
        if (singleParam[0] === paramToRetrieve)
            return singleParam[1];
    }
}

function addinshare_collectionToArray(collection)
{
    var items = [];
    var e = collection.getEnumerator();
    while (e.moveNext()) {
        var item = e.get_current();
        items.push(item);
    }
    return items;
}   