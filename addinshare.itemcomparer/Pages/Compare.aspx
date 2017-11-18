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
    <div class="ms-Breadcrumb" style="margin-top:8px;">
      <div class="ms-Breadcrumb-overflow">
        <div class="ms-Breadcrumb-overflowButton ms-Icon ms-Icon--More"></div>
        <div class="ms-Breadcrumb-overflowMenu">
          <ul class="ms-ContextualMenu is-open"></ul>
        </div>
      </div>
      <ul class="ms-Breadcrumb-list">
        
      </ul>
    </div>
</asp:Content>

<%-- The markup and script in the following Content element will be placed in the <body> of the page --%>
<asp:Content ContentPlaceHolderID="PlaceHolderMain" runat="server">
    <div id="errorDiv" class="error"></div>
    <div id="navBarDiv" class="navbar">
      <div class="dropdown">
        <button id="viewDDLBtn" class="dropbtn" onclick="return false;"><i class="fa fa-caret-down"></i></button><img src="../images/down16x16.png" alt=">" style="float:right; margin-top:17px"/>
        
        <div id="viewDDL" class="dropdown-content"></div>
      </div>
        <div class="deldiv">Deleted</div>
        <div class="insdiv">Added</div>
    </div>
    <div id="main" class="ms-Grid mainpanel">
        <div class="ms-Grid-row">
            <div id="filterPanel" class="ms-Grid-col ms-sm4 ms-md4 ms-lg4 filterpanel">
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
            <div class="ms-Grid-col ms-sm2 ms-md2 ms-lg2" style="width:5%"></div>
            <div class="ms-Grid-col ms-sm6 ms-md6 ms-lg6" style="width:75%">
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
                <div class="okbutton">
                    <button id="okbutton" class="ms-Button">
                      <span class="ms-Button-label">Back to list</span> 
                    </button>
                </div>
            </div>
        </div>
        
    </div>

    <div style="margin-bottom:30px"></div>
    
    <script type="text/javascript">
      var TableElements = document.querySelectorAll(".ms-Table");for (var i = 0; i < TableElements.length; i++) {new fabric['Table'](TableElements[i]);}
        var CheckBoxElements = document.querySelectorAll(".ms-CheckBox"); for (var i = 0; i < CheckBoxElements.length; i++) { new fabric['CheckBox'](CheckBoxElements[i]); }
        var ButtonElements = document.querySelectorAll(".ms-Button");
        for (var i = 0; i < ButtonElements.length; i++) {
            new fabric['Button'](ButtonElements[i], function () {
                // Insert Event Here
            });
        }
        var BreadcrumbHTML = document.querySelector('.ms-Breadcrumb');
        var Breadcrumb = new fabric['Breadcrumb'](BreadcrumbHTML);
    </script>
</asp:Content>
