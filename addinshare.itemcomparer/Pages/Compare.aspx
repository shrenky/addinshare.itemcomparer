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
    <link rel="stylesheet" href="https://static2.sharepointonline.com/files/fabric/office-ui-fabric-js/1.2.0/css/fabric.min.css" />
    <link rel="stylesheet" href="https://static2.sharepointonline.com/files/fabric/office-ui-fabric-js/1.2.0/css/fabric.components.min.css" />


    <!-- Add your JavaScript to the following file -->
    <script type="text/javascript" src="https://static2.sharepointonline.com/files/fabric/office-ui-fabric-js/1.2.0/js/fabric.min.js"></script>
    <script type="text/javascript" src="../Scripts/Util.js"></script>
    <script type="text/javascript" src="../Scripts/diff.js"></script>
    <script type="text/javascript" src="../Scripts/App.js"></script>
</asp:Content>

<asp:Content ContentPlaceHolderID="PlaceHolderPageTitleInTitleArea" runat="server">
    Item Comparer
</asp:Content>

<%-- The markup and script in the following Content element will be placed in the <body> of the page --%>
<asp:Content ContentPlaceHolderID="PlaceHolderMain" runat="server">
    <div class="navbar">
      <div class="dropdown">
        <button id="viewDDLBtn" class="dropbtn" onclick="return false;"><i class="fa fa-caret-down"></i></button>
        <div id="viewDDL" class="dropdown-content">
        </div>
      </div> 
    </div>
    <div id="main" class="ms-Grid">
        <div class="ms-Grid-row">
            <div id="filterPanel" class="ms-Grid-col ms-sm4 ms-md4 ms-lg4" style="border-right-style:solid; border-right-width:1px">
                <table id="filterTable" class="ms-Table ms-Table--selectable">
                  <thead>
                    <tr>
                      <th>Fields Filter</th>
                    </tr>
                  </thead>
                  <tbody id="filterBody">

                  </tbody>
                </table>
            </div>
            <div class="ms-Grid-col ms-sm2 ms-md2 ms-lg2"></div>
            <div class="ms-Grid-col ms-sm6 ms-md6 ms-lg6">
                <table id="compareTable" class="ms-Table">
                  <thead>
                    <tr>
                      <th>Field</th>
                      <th>Item1</th>
                      <th>Item2</th>
                    </tr>
                  </thead>
                  <tbody id="compareBody">

                  </tbody>
                </table>
            </div>
        </div>
    </div>
    
    
    <script type="text/javascript">
      var TableElements = document.querySelectorAll(".ms-Table");for (var i = 0; i < TableElements.length; i++) {new fabric['Table'](TableElements[i]);}
      var CheckBoxElements = document.querySelectorAll(".ms-CheckBox");for (var i = 0; i < CheckBoxElements.length; i++) {new fabric['CheckBox'](CheckBoxElements[i]);}
    </script>
</asp:Content>
