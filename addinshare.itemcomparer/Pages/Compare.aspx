<%@ Page language="C#" MasterPageFile="~masterurl/default.master" Inherits="Microsoft.SharePoint.WebPartPages.WebPartPage, Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register Tagprefix="Utilities" Namespace="Microsoft.SharePoint.Utilities" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register Tagprefix="WebPartPages" Namespace="Microsoft.SharePoint.WebPartPages" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register Tagprefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>

<asp:Content ContentPlaceHolderID="PlaceHolderAdditionalPageHead" runat="server">
    <script type="text/javascript" src="../Scripts/jquery-1.9.1.min.js"></script>
    <SharePoint:ScriptLink name="sp.js" runat="server" OnDemand="true" LoadAfterUI="true" Localizable="false" />
    <meta name="WebPartPageExpansion" content="full" />

    <!-- Add your CSS styles to the following file -->
    <link rel="Stylesheet" type="text/css" href="../Content/App.css" />
    <link rel="stylesheet" href="https://static2.sharepointonline.com/files/fabric/office-ui-fabric-core/9.0.0/css/fabric.min.css">
    <!-- Add your JavaScript to the following file -->
    <script type="text/javascript" src="../Scripts/Util.js"></script>
    <script type="text/javascript" src="../Scripts/App.js"></script>
    <script type="text/javascript" scr="../Scripts/ChromeLoader.js"></script>
</asp:Content>

<asp:Content ContentPlaceHolderID="PlaceHolderPageTitleInTitleArea" runat="server">
    Item Comparer
</asp:Content>

<%-- The markup and script in the following Content element will be placed in the <body> of the page --%>
<asp:Content ContentPlaceHolderID="PlaceHolderMain" runat="server">

    <div>
        <p id="message">
            <!-- The following content will be replaced with the user name when you run the app - see App.js -->
            Item Comparer
        </p>
    </div>
    <div id="comparePanel" class="ms-Grid">
      <div class="ms-Grid-row">
        <div id="nameCol" class="ms-Grid-col ms-sm4 ms-md4 ms-lg4">Column Name</div>
        <div id="item1Col" class="ms-Grid-col ms-sm4 ms-md4 ms-lg4">The First Item</div>
        <div id="item2Col" class="ms-Grid-col ms-sm4 ms-md4 ms-lg4">The Second Item</div>
      </div>
    </div>

</asp:Content>
