<%-- The following 4 lines are ASP.NET directives needed when using SharePoint components --%>

<%@ Page Inherits="Microsoft.SharePoint.WebPartPages.WebPartPage, Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" MasterPageFile="~masterurl/default.master" Language="C#" %>

<%@ Register TagPrefix="Utilities" Namespace="Microsoft.SharePoint.Utilities" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register TagPrefix="WebPartPages" Namespace="Microsoft.SharePoint.WebPartPages" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register TagPrefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>

<%-- The markup and script in the following Content element will be placed in the <head> of the page --%>
<asp:Content ContentPlaceHolderID="PlaceHolderAdditionalPageHead" runat="server">
    <script type="text/javascript" src="../Scripts/jquery-1.9.1.min.js"></script>
    <SharePoint:ScriptLink name="sp.js" runat="server" OnDemand="true" LoadAfterUI="true" Localizable="false" />
    <meta name="WebPartPageExpansion" content="full" />

    <!-- Add your CSS styles to the following file -->
    <link rel="Stylesheet" type="text/css" href="../Content/App.css" />
    <link rel="stylesheet" href="https://static2.sharepointonline.com/files/fabric/office-ui-fabric-core/9.0.0/css/fabric.min.css"/>
    <!-- Add your JavaScript to the following file -->
</asp:Content>

<%-- The markup in the following Content element will be placed in the TitleArea of the page --%>
<asp:Content ContentPlaceHolderID="PlaceHolderPageTitleInTitleArea" runat="server">
    Item Comparer
</asp:Content>

<%-- The markup and script in the following Content element will be placed in the <body> of the page --%>
<asp:Content ContentPlaceHolderID="PlaceHolderMain" runat="server">
    <div>
        <p id="message"></p>
    </div>

    <div class="ms-font-l" style="margin-left:15px">
        <p>Thanks for installing the Item Comparer Add-in!</p>
        <p>The <b>Item Comparer</b> Add-in is a smart tool that will help you compare two items. </p>
        <p>It requires read permission on your site:</p>
        <p>
            <img src="../Images/Capture3.png" alt="" />
        </p>
        <p>Once added the Add-in will look like this:</p>
        <p>
            <img src="../Images/Capture2.png" alt="" />
        </p>
        <p>It shows differences between items (including read-only fields like Author etc.):</p>
        <p>
            <img src="../Images/Capture1.png" alt="" />
        </p>
        <p>It supports views, you can switch views:</p>
        <p>
            <img src="../Images/Capture4.png" alt="" />
        </p>
        <p>It supports fields filters:</p>
        <p>
            <img src="../Images/Capture5.png" alt="" />
        </p>
        
    </div>
</asp:Content>
